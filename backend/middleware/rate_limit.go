package middleware

import (
	"fmt"
	"net/http"
	"time"

	"github.com/jeffreasy/dkl25/backend/lib"
)

// RateLimitConfig holds rate limit configuration
type RateLimitConfig struct {
	Requests int                        // Number of allowed requests
	Window   time.Duration              // Time window
	KeyFunc  func(*http.Request) string // Function to generate rate limit key
}

// RateLimitMiddleware provides request rate limiting
func RateLimitMiddleware(config RateLimitConfig) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get rate limit key
			var key string
			if config.KeyFunc != nil {
				key = config.KeyFunc(r)
			} else {
				key = getClientIP(r)
			}

			// Create rate limit key in Redis
			rateLimitKey := lib.CacheKey("ratelimit", r.URL.Path, key)

			// Increment counter
			count, err := lib.Increment(rateLimitKey)
			if err != nil {
				// If Redis fails, allow request to continue
				http.Error(w, "Rate limit check failed", http.StatusInternalServerError)
				return
			}

			// Set expiry on first request
			if count == 1 {
				if err := lib.SetExpiry(rateLimitKey, config.Window); err != nil {
					// Log error but continue
					fmt.Printf("Failed to set rate limit expiry: %v\n", err)
				}
			}

			// Add rate limit headers
			w.Header().Set("X-RateLimit-Limit", fmt.Sprintf("%d", config.Requests))
			w.Header().Set("X-RateLimit-Remaining", fmt.Sprintf("%d", max(0, config.Requests-int(count))))
			w.Header().Set("X-RateLimit-Reset", fmt.Sprintf("%d", time.Now().Add(config.Window).Unix()))

			// Check if limit exceeded
			if count > int64(config.Requests) {
				w.Header().Set("Retry-After", fmt.Sprintf("%d", int(config.Window.Seconds())))
				http.Error(w, "Rate limit exceeded. Please try again later.", http.StatusTooManyRequests)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

// IPRateLimiter creates a rate limiter based on client IP
func IPRateLimiter(requests int, window time.Duration) func(http.Handler) http.Handler {
	return RateLimitMiddleware(RateLimitConfig{
		Requests: requests,
		Window:   window,
		KeyFunc:  getClientIP,
	})
}

// UserRateLimiter creates a rate limiter based on user ID (requires auth)
func UserRateLimiter(requests int, window time.Duration) func(http.Handler) http.Handler {
	return RateLimitMiddleware(RateLimitConfig{
		Requests: requests,
		Window:   window,
		KeyFunc: func(r *http.Request) string {
			// Try to get user ID from context (set by auth middleware)
			if userID := r.Context().Value("user_id"); userID != nil {
				return userID.(string)
			}
			// Fallback to IP
			return getClientIP(r)
		},
	})
}

// EndpointRateLimiter creates endpoint-specific rate limiters
func EndpointRateLimiter(endpointConfigs map[string]RateLimitConfig) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Check if we have a specific config for this endpoint
			if config, exists := endpointConfigs[r.URL.Path]; exists {
				middleware := RateLimitMiddleware(config)
				middleware(next).ServeHTTP(w, r)
				return
			}

			// No rate limiting for this endpoint
			next.ServeHTTP(w, r)
		})
	}
}

// SlidingWindowRateLimiter implements sliding window rate limiting
func SlidingWindowRateLimiter(requests int, window time.Duration) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			clientIP := getClientIP(r)
			key := lib.CacheKey("ratelimit", "sliding", r.URL.Path, clientIP)

			// Get current timestamp
			now := time.Now().UnixMilli()
			windowStart := now - window.Milliseconds()

			// Remove old entries (older than window)
			// This would require a sorted set in Redis for perfect implementation
			// For now, use simplified approach with counter + timestamp

			// Check current count
			countKey := key + ":count"
			timestampKey := key + ":ts"

			// Get last reset timestamp
			var lastReset int64
			if err := lib.GetCache(timestampKey, &lastReset); err != nil {
				lastReset = now
				lib.SetCache(timestampKey, now, window)
			}

			// If window has passed, reset counter
			if now-lastReset > window.Milliseconds() {
				lib.DeleteCache(countKey)
				lib.SetCache(timestampKey, now, window)
				lastReset = now
			}

			// Increment counter
			count, err := lib.Increment(countKey)
			if err != nil {
				http.Error(w, "Rate limit check failed", http.StatusInternalServerError)
				return
			}

			// Set expiry
			if count == 1 {
				lib.SetExpiry(countKey, window)
			}

			// Calculate remaining time in window
			remaining := window.Milliseconds() - (now - lastReset)

			// Add headers
			w.Header().Set("X-RateLimit-Limit", fmt.Sprintf("%d", requests))
			w.Header().Set("X-RateLimit-Remaining", fmt.Sprintf("%d", max(0, requests-int(count))))
			w.Header().Set("X-RateLimit-Reset", fmt.Sprintf("%d", time.Now().Add(time.Duration(remaining)*time.Millisecond).Unix()))

			// Check limit
			if count > int64(requests) {
				w.Header().Set("Retry-After", fmt.Sprintf("%d", remaining/1000))
				http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

// BurstRateLimiter allows bursts of requests with token bucket algorithm
func BurstRateLimiter(burstSize, refillRate int, refillInterval time.Duration) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			clientIP := getClientIP(r)
			tokensKey := lib.CacheKey("ratelimit", "burst", "tokens", clientIP)
			lastRefillKey := lib.CacheKey("ratelimit", "burst", "refill", clientIP)

			// Get current tokens
			var tokens int
			if err := lib.GetCache(tokensKey, &tokens); err != nil {
				// Initialize with burst size
				tokens = burstSize
				lib.SetCache(tokensKey, tokens, 24*time.Hour)
			}

			// Get last refill time
			var lastRefill int64
			if err := lib.GetCache(lastRefillKey, &lastRefill); err != nil {
				lastRefill = time.Now().Unix()
				lib.SetCache(lastRefillKey, lastRefill, 24*time.Hour)
			}

			// Calculate tokens to add based on time passed
			now := time.Now().Unix()
			timePassed := now - lastRefill
			intervalsCount := int(timePassed / int64(refillInterval.Seconds()))

			if intervalsCount > 0 {
				tokensToAdd := intervalsCount * refillRate
				tokens = min(burstSize, tokens+tokensToAdd)
				lastRefill = now
				lib.SetCache(tokensKey, tokens, 24*time.Hour)
				lib.SetCache(lastRefillKey, lastRefill, 24*time.Hour)
			}

			// Check if we have tokens
			if tokens <= 0 {
				w.Header().Set("X-RateLimit-Limit", fmt.Sprintf("%d", burstSize))
				w.Header().Set("X-RateLimit-Remaining", "0")
				w.Header().Set("Retry-After", fmt.Sprintf("%d", int(refillInterval.Seconds())))
				http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
				return
			}

			// Consume a token
			tokens--
			lib.SetCache(tokensKey, tokens, 24*time.Hour)

			// Add headers
			w.Header().Set("X-RateLimit-Limit", fmt.Sprintf("%d", burstSize))
			w.Header().Set("X-RateLimit-Remaining", fmt.Sprintf("%d", tokens))

			next.ServeHTTP(w, r)
		})
	}
}

// CostBasedRateLimiter allows different costs for different endpoints
func CostBasedRateLimiter(costFunc func(*http.Request) int, budget int, window time.Duration) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			clientIP := getClientIP(r)
			budgetKey := lib.CacheKey("ratelimit", "cost", clientIP)

			// Get current budget used
			var used int
			if err := lib.GetCache(budgetKey, &used); err != nil {
				used = 0
				lib.SetCache(budgetKey, used, window)
			}

			// Calculate cost for this request
			cost := costFunc(r)

			// Check if budget allows this request
			if used+cost > budget {
				w.Header().Set("X-RateLimit-Budget", fmt.Sprintf("%d", budget))
				w.Header().Set("X-RateLimit-Used", fmt.Sprintf("%d", used))
				w.Header().Set("X-RateLimit-Cost", fmt.Sprintf("%d", cost))
				http.Error(w, "Rate limit budget exceeded", http.StatusTooManyRequests)
				return
			}

			// Consume budget
			used += cost
			lib.SetCache(budgetKey, used, window)

			// Add headers
			w.Header().Set("X-RateLimit-Budget", fmt.Sprintf("%d", budget))
			w.Header().Set("X-RateLimit-Used", fmt.Sprintf("%d", used))
			w.Header().Set("X-RateLimit-Remaining", fmt.Sprintf("%d", budget-used))

			next.ServeHTTP(w, r)
		})
	}
}

// Helper: Get client IP from request
func getClientIP(r *http.Request) string {
	// Check X-Forwarded-For header (proxy/load balancer)
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		return xff
	}

	// Check X-Real-IP header
	if xri := r.Header.Get("X-Real-IP"); xri != "" {
		return xri
	}

	// Use RemoteAddr
	return r.RemoteAddr
}

// Helper functions
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
