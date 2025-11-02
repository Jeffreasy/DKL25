package middleware

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/jeffreasy/dkl25/backend/lib"
)

// CacheConfig holds cache configuration
type CacheConfig struct {
	TTL    time.Duration
	Prefix string
}

// CacheMiddleware provides HTTP response caching for GET requests
func CacheMiddleware(config CacheConfig) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Only cache GET requests
			if r.Method != http.MethodGet {
				next.ServeHTTP(w, r)
				return
			}

			// Generate cache key from path and query
			cacheKey := lib.CacheKey(config.Prefix, r.URL.Path, r.URL.RawQuery)

			// Try to get from cache
			var cachedData map[string]interface{}
			err := lib.GetCache(cacheKey, &cachedData)
			if err == nil {
				// Cache hit - return cached response
				w.Header().Set("Content-Type", "application/json")
				w.Header().Set("X-Cache", "HIT")
				w.Header().Set("X-Cache-Key", cacheKey)
				w.WriteHeader(http.StatusOK)
				json.NewEncoder(w).Encode(cachedData)
				return
			}

			// Cache miss - create response recorder
			rec := &ResponseRecorder{
				ResponseWriter: w,
				statusCode:     http.StatusOK,
				body:           &bytes.Buffer{},
			}

			// Call next handler
			next.ServeHTTP(rec, r)

			// Only cache successful responses
			if rec.statusCode == http.StatusOK && rec.body.Len() > 0 {
				var responseData map[string]interface{}
				if err := json.Unmarshal(rec.body.Bytes(), &responseData); err == nil {
					// Cache the response
					if err := lib.SetCache(cacheKey, responseData, config.TTL); err == nil {
						w.Header().Set("X-Cache", "MISS")
						w.Header().Set("X-Cache-Key", cacheKey)
					}
				}
			}

			// Write the response
			w.Header().Set("X-Cache", "MISS")
			w.WriteHeader(rec.statusCode)
			w.Write(rec.body.Bytes())
		})
	}
}

// ResponseRecorder records HTTP response for caching
type ResponseRecorder struct {
	http.ResponseWriter
	statusCode int
	body       *bytes.Buffer
}

// Write captures the response body
func (r *ResponseRecorder) Write(b []byte) (int, error) {
	r.body.Write(b)
	return r.ResponseWriter.Write(b)
}

// WriteHeader captures the status code
func (r *ResponseRecorder) WriteHeader(statusCode int) {
	r.statusCode = statusCode
	r.ResponseWriter.WriteHeader(statusCode)
}

// SmartCacheMiddleware provides intelligent caching based on content type
func SmartCacheMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Only cache GET requests
			if r.Method != http.MethodGet {
				next.ServeHTTP(w, r)
				return
			}

			// Determine TTL based on path
			var ttl time.Duration
			var prefix string

			switch {
			case contains(r.URL.Path, "/partners"):
				ttl = 1 * time.Hour
				prefix = "partners"
			case contains(r.URL.Path, "/photos"):
				ttl = 30 * time.Minute
				prefix = "photos"
			case contains(r.URL.Path, "/albums"):
				ttl = 30 * time.Minute
				prefix = "albums"
			case contains(r.URL.Path, "/program-schedule"):
				ttl = 2 * time.Hour
				prefix = "program"
			case contains(r.URL.Path, "/social"):
				ttl = 15 * time.Minute
				prefix = "social"
			default:
				// No caching for unknown endpoints
				next.ServeHTTP(w, r)
				return
			}

			// Use cache middleware with determined settings
			cacheMiddleware := CacheMiddleware(CacheConfig{
				TTL:    ttl,
				Prefix: prefix,
			})

			cacheMiddleware(next).ServeHTTP(w, r)
		})
	}
}

// CacheInvalidationMiddleware adds cache invalidation for write operations
func CacheInvalidationMiddleware(patterns ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Call next handler first
			next.ServeHTTP(w, r)

			// Invalidate cache for POST, PUT, DELETE operations
			if r.Method == http.MethodPost || r.Method == http.MethodPut || r.Method == http.MethodDelete {
				for _, pattern := range patterns {
					cachePattern := lib.CacheKey(pattern, "*")
					if err := lib.InvalidatePattern(cachePattern); err != nil {
						// Log error but don't fail the request
						fmt.Printf("Cache invalidation error for pattern %s: %v\n", cachePattern, err)
					}
				}

				// Add header to indicate cache was invalidated
				w.Header().Set("X-Cache-Invalidated", "true")
			}
		})
	}
}

// ConditionalCacheMiddleware caches based on custom conditions
func ConditionalCacheMiddleware(shouldCache func(*http.Request) (bool, CacheConfig)) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Check if we should cache this request
			doCache, config := shouldCache(r)

			if !doCache || r.Method != http.MethodGet {
				next.ServeHTTP(w, r)
				return
			}

			// Use cache middleware
			cacheMiddleware := CacheMiddleware(config)
			cacheMiddleware(next).ServeHTTP(w, r)
		})
	}
}

// Helper function to check if string contains substring
func contains(s, substr string) bool {
	return len(s) >= len(substr) && s[:len(substr)] == substr ||
		len(s) > len(substr) && s[len(s)-len(substr):] == substr ||
		bytes.Contains([]byte(s), []byte(substr))
}

// CacheControl headers middleware
func CacheControlMiddleware(maxAge time.Duration) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Set Cache-Control header
			w.Header().Set("Cache-Control", fmt.Sprintf("public, max-age=%d", int(maxAge.Seconds())))
			next.ServeHTTP(w, r)
		})
	}
}

// NoCache middleware disables caching
func NoCacheMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
			w.Header().Set("Pragma", "no-cache")
			w.Header().Set("Expires", "0")
			next.ServeHTTP(w, r)
		})
	}
}

// WarmCache pre-populates cache with common requests
func WarmCache(baseURL string, endpoints []string, client *http.Client) error {
	for _, endpoint := range endpoints {
		resp, err := client.Get(baseURL + endpoint)
		if err != nil {
			return fmt.Errorf("failed to warm cache for %s: %w", endpoint, err)
		}
		defer resp.Body.Close()

		// Read and discard body to trigger caching
		io.Copy(io.Discard, resp.Body)
	}
	return nil
}
