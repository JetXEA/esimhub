// Global error tracking system

// Store for captured errors
const capturedErrors: Array<{
  message: string
  location: string
  stack?: string
  timestamp: string
  additionalInfo?: any
}> = []

// Initialize error tracking
export function initGlobalErrorTracking() {
  if (typeof window !== "undefined") {
    // Override console.error to capture all errors
    const originalConsoleError = console.error
    console.error = (...args) => {
      // Call original console.error
      originalConsoleError.apply(console, args)

      // Capture error
      try {
        const errorMessage = args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" ")

        captureError({
          message: errorMessage,
          location: "console.error",
          timestamp: new Date().toISOString(),
        })
      } catch (e) {
        originalConsoleError("Error in error tracking:", e)
      }
    }

    // Global error handler
    window.onerror = (message, source, lineno, colno, error) => {
      captureError({
        message: String(message),
        location: `${source}:${lineno}:${colno}`,
        stack: error?.stack,
        timestamp: new Date().toISOString(),
      })
      return false // Let default handler run
    }

    // Unhandled promise rejection handler
    window.addEventListener("unhandledrejection", (event) => {
      captureError({
        message: event.reason?.message || "Unhandled Promise Rejection",
        location: "unhandledrejection",
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        additionalInfo: event.reason,
      })
    })

    // Add special handler for property access errors
    addPropertyAccessErrorDetection()
  }
}

// Special detection for property access errors
function addPropertyAccessErrorDetection() {
  if (typeof window !== "undefined") {
    // This function wraps critical code sections to detect property access errors
    window.__detectPropertyError = (callback, contextName) => {
      try {
        return callback()
      } catch (error) {
        if (error instanceof TypeError && error.message.includes("Cannot read properties of undefined")) {
          captureError({
            message: error.message,
            location: contextName || "property-access-error",
            stack: error.stack,
            timestamp: new Date().toISOString(),
          })

          // Log detailed information about the error
          console.error(`CRITICAL ERROR in ${contextName}:`, error)
          console.error("This is likely the source of your deployment issues")
        }
        throw error // Re-throw to preserve normal error flow
      }
    }
  }
}

// Capture error
export function captureError(error: {
  message: string
  location: string
  stack?: string
  timestamp: string
  additionalInfo?: any
}) {
  capturedErrors.push(error)

  // Limit size of error store
  if (capturedErrors.length > 50) {
    capturedErrors.shift()
  }

  // You could send this to a logging service
  // sendToLoggingService(error);
}

// Get all captured errors
export function getCapturedErrors() {
  return [...capturedErrors]
}

// Clear captured errors
export function clearCapturedErrors() {
  capturedErrors.length = 0
}

// Declare global
declare global {
  interface Window {
    __detectPropertyError: <T>(callback: () => T, contextName?: string) => T
    __getErrorLog: () => typeof capturedErrors
  }
}

// Add method to get error log
if (typeof window !== "undefined") {
  window.__getErrorLog = getCapturedErrors
}
