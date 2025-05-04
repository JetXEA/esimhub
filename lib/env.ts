// Environment variable management with fallbacks

// Function to safely get environment variables with fallbacks
export function getEnv(key: string, fallback = ""): string {
  const value = process.env[key] || fallback
  return value
}

// Check if we're in demo mode (missing critical environment variables)
export function isDemoMode(): boolean {
  const requiredVars = ["SMS_MAN_API_KEY", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"]

  // Check if any required variables are missing
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      return true
    }
  }

  return false
}

// Get SMS API key with fallback
export function getSmsApiKey(): string {
  return getEnv("SMS_MAN_API_KEY", "demo_key")
}

// Get Redis URL with fallback
export function getRedisUrl(): string {
  return getEnv("UPSTASH_REDIS_REST_URL", "")
}

// Get Redis token with fallback
export function getRedisToken(): string {
  return getEnv("UPSTASH_REDIS_REST_TOKEN", "")
}

// Get Supabase URL with fallback
export function getSupabaseUrl(): string {
  return getEnv("NEXT_PUBLIC_SUPABASE_URL", "")
}

// Get Supabase anon key with fallback
export function getSupabaseAnonKey(): string {
  return getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
}

// Get Supabase service role key with fallback
export function getSupabaseServiceKey(): string {
  return getEnv("SUPABASE_SERVICE_ROLE_KEY", "")
}

// Get seed key with fallback
export function getSeedKey(): string {
  return getEnv("SEED_KEY", "demo_seed_key")
}

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!getSupabaseUrl() && !!getSupabaseAnonKey()
}

// Check if Redis is configured
export function isRedisConfigured(): boolean {
  const url = getRedisUrl()
  const token = getRedisToken()
  return !!url && !!token && url.startsWith("https://")
}
