// Client-side error handler

// Initialize error tracking
export function initErrorTracking() {
  if (typeof window !== "undefined") {
    // Set up global error handler
    window.onerror = (message, source, lineno, colno, error) => {
      console.error("Global error caught:", { message, source, lineno, colno, error })

      // You could send this to a logging service
      // logErrorToService({ message, source, lineno, colno, error });

      return false // Let the default handler run as well
    }

    // Set up unhandled promise rejection handler
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason)

      // You could send this to a logging service
      // logErrorToService({ type: 'unhandledRejection', error: event.reason });
    })
  }
}

// Log error with context
export function logError(error: unknown, context?: Record<string, any>) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  console.error("Application error:", {
    message: errorMessage,
    stack: errorStack,
    context,
    timestamp: new Date().toISOString(),
  })

  // You could send this to a logging service
  // logErrorToService({ message: errorMessage, stack: errorStack, context });
}

// Safe JSON parse with fallback
export function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T
  } catch (error) {
    logError(error, { text: text.substring(0, 100) })
    return fallback
  }
}
