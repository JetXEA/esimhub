"use client"

import { useState, useEffect } from "react"
import { getCapturedErrors, clearCapturedErrors } from "@/lib/error-tracker"

export default function ErrorDebugger() {
  const [errors, setErrors] = useState<any[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Update errors every second
    const interval = setInterval(() => {
      setErrors(getCapturedErrors())
    }, 1000)

    // Add keyboard shortcut (Ctrl+Shift+D) to toggle debugger
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setIsVisible((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      clearInterval(interval)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button onClick={() => setIsVisible(true)} className="bg-red-600 text-white px-3 py-1 rounded-md text-sm">
          Show Errors ({errors.length})
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 overflow-auto p-4">
      <div className="bg-white rounded-lg max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Error Debugger</h2>
          <div>
            <button onClick={() => clearCapturedErrors()} className="bg-gray-200 px-3 py-1 rounded-md text-sm mr-2">
              Clear
            </button>
            <button onClick={() => setIsVisible(false)} className="bg-gray-200 px-3 py-1 rounded-md text-sm">
              Close
            </button>
          </div>
        </div>

        {errors.length === 0 ? (
          <p className="text-gray-500">No errors captured yet.</p>
        ) : (
          <div className="space-y-4">
            {errors.map((error, index) => (
              <div key={index} className="border border-red-300 rounded-md p-3 bg-red-50">
                <div className="font-mono text-sm text-red-800 mb-2">{error.message}</div>
                <div className="text-xs text-gray-600">
                  <div>Location: {error.location}</div>
                  <div>Time: {new Date(error.timestamp).toLocaleTimeString()}</div>
                  {error.stack && (
                    <details>
                      <summary className="cursor-pointer text-blue-600">Stack Trace</summary>
                      <pre className="mt-2 text-xs overflow-auto bg-gray-100 p-2 rounded">{error.stack}</pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
