import { Redis } from "@upstash/redis"

// Initialize Redis client using environment variables
let redis: Redis | null = null

// Create a mock Redis client for fallback
const createMockRedisClient = () => {
  console.warn("Using mock Redis client")
  return {
    hgetall: async () => null,
    hset: async () => null,
    keys: async () => [],
    lpush: async () => 0,
    lrange: async () => [],
    set: async () => null,
    get: async () => null,
    del: async () => 0,
  } as unknown as Redis
}

try {
  // Check for REST API URL format (Upstash Redis REST client requires https:// URLs)
  const restUrl = process.env.UPSTASH_REDIS_REST_URL || ""
  const restToken = process.env.UPSTASH_REDIS_REST_TOKEN || ""

  if (restUrl && restUrl.startsWith("https://") && restToken) {
    // Use Upstash Redis REST client
    redis = new Redis({
      url: restUrl,
      token: restToken,
    })
    console.log("Initialized Upstash Redis REST client")
  } else {
    // If we don't have valid REST API credentials, use mock client
    console.warn("No valid Upstash Redis REST credentials found")
    redis = createMockRedisClient()
  }
} catch (error) {
  console.error("Failed to initialize Redis client:", error)
  // Create a mock Redis client for fallback
  redis = createMockRedisClient()
}

export default redis

// Helper functions for common operations

// Users
export async function getUser(userId: string) {
  try {
    return await redis.hgetall(`user:${userId}`)
  } catch (error) {
    console.error("Redis error in getUser:", error)
    return null
  }
}

export async function createUser(userData: any) {
  try {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    await redis.hset(`user:${userId}`, {
      ...userData,
      id: userId,
      balance: userData.balance || 0,
      createdAt: new Date().toISOString(),
    })
    return { ...userData, id: userId }
  } catch (error) {
    console.error("Redis error in createUser:", error)
    throw error
  }
}

export async function updateUser(userId: string, userData: any) {
  try {
    await redis.hset(`user:${userId}`, userData)
    return { ...userData, id: userId }
  } catch (error) {
    console.error("Redis error in updateUser:", error)
    throw error
  }
}

export async function getUserByEmail(email: string) {
  try {
    // Get all user keys
    const userKeys = await redis.keys("user:*")

    // Check each user to find matching email
    for (const key of userKeys) {
      const user = await redis.hgetall(key)
      if (user && user.email === email) {
        return user
      }
    }

    return null
  } catch (error) {
    console.error("Redis error in getUserByEmail:", error)
    return null
  }
}

// Transactions
export async function createTransaction(transactionData: any) {
  try {
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    await redis.hset(`transaction:${transactionId}`, {
      ...transactionData,
      id: transactionId,
      createdAt: new Date().toISOString(),
    })

    // Add to user's transaction list
    await redis.lpush(`user:${transactionData.userId}:transactions`, transactionId)

    return { ...transactionData, id: transactionId }
  } catch (error) {
    console.error("Redis error in createTransaction:", error)
    throw error
  }
}

export async function getUserTransactions(userId: string) {
  try {
    const transactionIds = await redis.lrange(`user:${userId}:transactions`, 0, -1)

    const transactions = []
    for (const id of transactionIds) {
      const transaction = await redis.hgetall(`transaction:${id}`)
      if (transaction) {
        transactions.push(transaction)
      }
    }

    return transactions
  } catch (error) {
    console.error("Redis error in getUserTransactions:", error)
    return []
  }
}

// SMS Requests
export async function createSmsRequest(requestData: any) {
  try {
    const requestId = `sms_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    await redis.hset(`sms:${requestId}`, {
      ...requestData,
      id: requestId,
      status: requestData.status || "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    // Add to user's SMS request list
    await redis.lpush(`user:${requestData.userId}:sms`, requestId)

    return { ...requestData, id: requestId }
  } catch (error) {
    console.error("Redis error in createSmsRequest:", error)
    throw error
  }
}

export async function updateSmsRequest(requestId: string, requestData: any) {
  try {
    await redis.hset(`sms:${requestId}`, {
      ...requestData,
      updatedAt: new Date().toISOString(),
    })
    return { ...requestData, id: requestId }
  } catch (error) {
    console.error("Redis error in updateSmsRequest:", error)
    throw error
  }
}

export async function getSmsRequest(requestId: string) {
  try {
    return await redis.hgetall(`sms:${requestId}`)
  } catch (error) {
    console.error("Redis error in getSmsRequest:", error)
    return null
  }
}

export async function getUserSmsRequests(userId: string) {
  try {
    const requestIds = await redis.lrange(`user:${userId}:sms`, 0, -1)

    const requests = []
    for (const id of requestIds) {
      const request = await redis.hgetall(`sms:${id}`)
      if (request) {
        requests.push(request)
      }
    }

    return requests
  } catch (error) {
    console.error("Redis error in getUserSmsRequests:", error)
    return []
  }
}

// Cache API responses
export async function cacheApiResponse(key: string, data: any, expirationInSeconds = 3600) {
  try {
    if (data === null) {
      // If data is null, delete the cache entry
      await redis.del(`cache:${key}`)
      return
    }
    await redis.set(`cache:${key}`, JSON.stringify(data), { ex: expirationInSeconds })
  } catch (error) {
    console.error("Redis error in cacheApiResponse:", error)
  }
}

export async function getCachedApiResponse(key: string) {
  try {
    const data = await redis.get(`cache:${key}`)
    return data ? JSON.parse(data as string) : null
  } catch (error) {
    console.error("Redis error in getCachedApiResponse:", error)
    return null
  }
}

// Session management
export async function createSession(userId: string, expirationInSeconds = 86400) {
  try {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    await redis.set(`session:${sessionId}`, userId, { ex: expirationInSeconds })
    return sessionId
  } catch (error) {
    console.error("Redis error in createSession:", error)
    throw error
  }
}

export async function getSessionUser(sessionId: string) {
  try {
    const userId = await redis.get(`session:${sessionId}`)
    if (!userId) return null

    return getUser(userId as string)
  } catch (error) {
    console.error("Redis error in getSessionUser:", error)
    return null
  }
}

export async function deleteSession(sessionId: string) {
  try {
    await redis.del(`session:${sessionId}`)
  } catch (error) {
    console.error("Redis error in deleteSession:", error)
    throw error
  }
}
