"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugErrorPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    // Collect environment variables
    const env: Record<string, string> = {}
    if (typeof process !== "undefined" && process.env) {
      Object.keys(process.env).forEach((key) => {
        if (key.startsWith("NEXT_PUBLIC_")) {
          env[key] = process.env[key] || ""
        }
      })
    }
    setEnvVars(env)

    // Add log
    addLog("Debug page loaded")
  }, [])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toISOString()}] ${message}`])
  }

  const testSuccessProperty = () => {
    try {
      addLog("Testing success property access...")

      // Create an object without success property
      const obj: any = { data: "test" }

      // Try to access success property
      const success = obj.success

      addLog(`Success property value: ${success}`)

      // Try to use the success property in a condition
      if (success) {
        addLog("Success property is truthy")
      } else {
        addLog("Success property is falsy")
      }

      addLog("No error occurred when accessing success property")
    } catch (error) {
      addLog(`ERROR: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const testUndefinedAccess = () => {
    try {
      addLog("Testing undefined object access...")

      // Create an undefined variable
      let obj: any

      // Try to access a property on undefined
      const value = obj.success

      addLog(`This should not be logged: ${value}`)
    } catch (error) {
      addLog(`EXPECTED ERROR: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const testLocalStorage = () => {
    try {
      addLog("Testing localStorage...")

      // Try to use localStorage
      localStorage.setItem("test", "value")
      const value = localStorage.getItem("test")

      addLog(`localStorage test value: ${value}`)
    } catch (error) {
      addLog(`ERROR: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Error Debugging Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Button onClick={testSuccessProperty}>Test Success Property</Button>
              <Button onClick={testUndefinedAccess}>Test Undefined Access</Button>
              <Button onClick={testLocalStorage}>Test localStorage</Button>
            </div>

            <div>
              <h3 className="text-lg font-medium">Environment Variables:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm mt-2">
                {Object.keys(envVars).length > 0
                  ? JSON.stringify(envVars, null, 2)
                  : "No public environment variables found"}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium">Logs:</h3>
              <div className="bg-black text-green-400 p-2 rounded text-sm mt-2 h-64 overflow-y-auto font-mono">
                {logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
