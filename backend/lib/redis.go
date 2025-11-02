package lib

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

var (
	// RedisClient is the global Redis client instance
	RedisClient *redis.Client
	ctx         = context.Background()
)

// RedisConfig holds Redis configuration
type RedisConfig struct {
	Host     string
	Port     string
	Password string
	DB       int
}

// InitRedis initializes the Redis client with the given configuration
func InitRedis(config RedisConfig) error {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:         fmt.Sprintf("%s:%s", config.Host, config.Port),
		Password:     config.Password,
		DB:           config.DB,
		DialTimeout:  5 * time.Second,
		ReadTimeout:  3 * time.Second,
		WriteTimeout: 3 * time.Second,
		PoolSize:     10,
		MinIdleConns: 5,
		MaxRetries:   3,
	})

	// Test connection
	_, err := RedisClient.Ping(ctx).Result()
	if err != nil {
		return fmt.Errorf("redis connection failed: %w", err)
	}

	log.Println("✅ Redis connected successfully")
	return nil
}

// InitRedisFromEnv initializes Redis using environment variables
func InitRedisFromEnv() error {
	config := RedisConfig{
		Host:     getEnv("REDIS_HOST", "localhost"),
		Port:     getEnv("REDIS_PORT", "6379"),
		Password: getEnv("REDIS_PASSWORD", ""),
		DB:       0, // Default DB
	}

	return InitRedis(config)
}

// CloseRedis closes the Redis connection
func CloseRedis() error {
	if RedisClient != nil {
		return RedisClient.Close()
	}
	return nil
}

// CacheKey generates a consistent cache key with the DKL prefix
func CacheKey(prefix string, parts ...string) string {
	key := "dkl:" + prefix
	for _, part := range parts {
		key += ":" + part
	}
	return key
}

// SetCache stores data in Redis with TTL
func SetCache(key string, data interface{}, ttl time.Duration) error {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("marshal error: %w", err)
	}

	return RedisClient.Set(ctx, key, jsonData, ttl).Err()
}

// GetCache retrieves data from Redis and unmarshals into dest
func GetCache(key string, dest interface{}) error {
	data, err := RedisClient.Get(ctx, key).Result()
	if err == redis.Nil {
		return fmt.Errorf("cache miss")
	}
	if err != nil {
		return fmt.Errorf("redis get error: %w", err)
	}

	return json.Unmarshal([]byte(data), dest)
}

// DeleteCache removes a cache entry
func DeleteCache(key string) error {
	return RedisClient.Del(ctx, key).Err()
}

// InvalidatePattern deletes all keys matching the pattern
func InvalidatePattern(pattern string) error {
	iter := RedisClient.Scan(ctx, 0, pattern, 0).Iterator()
	for iter.Next(ctx) {
		if err := RedisClient.Del(ctx, iter.Val()).Err(); err != nil {
			return fmt.Errorf("failed to delete key %s: %w", iter.Val(), err)
		}
	}
	return iter.Err()
}

// Exists checks if a key exists in Redis
func Exists(key string) (bool, error) {
	result, err := RedisClient.Exists(ctx, key).Result()
	if err != nil {
		return false, err
	}
	return result > 0, nil
}

// Increment increments a counter and returns the new value
func Increment(key string) (int64, error) {
	return RedisClient.Incr(ctx, key).Result()
}

// SetExpiry sets an expiry time on a key
func SetExpiry(key string, ttl time.Duration) error {
	return RedisClient.Expire(ctx, key, ttl).Err()
}

// GetTTL gets the time to live for a key
func GetTTL(key string) (time.Duration, error) {
	return RedisClient.TTL(ctx, key).Result()
}

// SetNX sets a value only if it doesn't exist (distributed lock)
func SetNX(key string, value interface{}, ttl time.Duration) (bool, error) {
	jsonData, err := json.Marshal(value)
	if err != nil {
		return false, fmt.Errorf("marshal error: %w", err)
	}

	return RedisClient.SetNX(ctx, key, jsonData, ttl).Result()
}

// GetMultiple retrieves multiple keys at once
func GetMultiple(keys []string) ([]string, error) {
	if len(keys) == 0 {
		return []string{}, nil
	}

	results, err := RedisClient.MGet(ctx, keys...).Result()
	if err != nil {
		return nil, err
	}

	values := make([]string, len(results))
	for i, result := range results {
		if result != nil {
			values[i] = result.(string)
		}
	}

	return values, nil
}

// FlushDB clears the current database (use with caution!)
func FlushDB() error {
	return RedisClient.FlushDB(ctx).Err()
}

// GetStats returns Redis server statistics
func GetStats() (map[string]string, error) {
	info, err := RedisClient.Info(ctx, "stats").Result()
	if err != nil {
		return nil, err
	}

	stats := make(map[string]string)
	stats["info"] = info

	// Get database size
	dbSize, err := RedisClient.DBSize(ctx).Result()
	if err == nil {
		stats["db_size"] = fmt.Sprintf("%d", dbSize)
	}

	return stats, nil
}

// Helper function to get environment variables with default
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// Ping checks if Redis is responsive
func Ping() error {
	_, err := RedisClient.Ping(ctx).Result()
	return err
}
