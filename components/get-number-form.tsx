"use client"

import { useState, useEffect } from "react"
import type { Country, Service, PaymentMethod } from "@/lib/types"
import { defaultPaymentMethods } from "@/lib/default-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Check, Copy, RefreshCw } from "lucide-react"

interface GetNumberFormProps {
  services: Service[]
  countries: Country[]
  initialServiceId?: string
  initialCountryId?: string
}

export function GetNumberForm({ services, countries, initialServiceId, initialCountryId }: GetNumberFormProps) {
  const [selectedService, setSelectedService] = useState<string>(initialServiceId || "")
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountryId || "")
  const [isLoading, setIsLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [requestId, setRequestId] = useState<string | null>(null)
  const [smsCode, setSmsCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [checkingCode, setCheckingCode] = useState(false)
  const [step, setStep] = useState<"selection" | "number" | "payment" | "code">("selection")
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(defaultPaymentMethods)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
  const [copied, setCopied] = useState(false)

  const availableServices = services.filter((service) => service.available)
  const availableCountries = countries.filter((country) => country.available)

  // Set initial values if provided
  useEffect(() => {
    if (initialServiceId) {
      setSelectedService(initialServiceId)
    }
    if (initialCountryId) {
      setSelectedCountry(initialCountryId)
    }

    // If both are provided, we can assume the user wants to get a number
    if (initialServiceId && initialCountryId) {
      setStep("selection")
    }
  }, [initialServiceId, initialCountryId])

  const handleGetNumber = async () => {
    if (!selectedService || !selectedCountry) {
      setError("Please select both a service and a country")
      return
    }

    setIsLoading(true)
    setError(null)
    setPhoneNumber(null)
    setRequestId(null)
    setSmsCode(null)

    try {
      const response = await fetch("/api/sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: Number.parseInt(selectedService),
          countryId: Number.parseInt(selectedCountry),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get number")
      }

      if (data.error) {
        throw new Error(data.error)
      }

      setPhoneNumber(data.number || data.phone_number)
      setRequestId(data.request_id)
      setStep("number")
    } catch (error) {
      console.error("Error getting number:", error)
      setError(error instanceof Error ? error.message : "Failed to get number")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckCode = async () => {
    if (!requestId) {
      return
    }

    setCheckingCode(true)
    setSmsCode(null)
    setError(null)

    try {
      const response = await fetch(`/api/sms?requestId=${requestId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get SMS code")
      }

      if (data.error) {
        throw new Error(data.error)
      }

      setSmsCode(data.sms_code || data.code)
      if (!data.sms_code && !data.code) {
        setError("No SMS code received yet. Try again in a few moments.")
      }
    } catch (error) {
      console.error("Error checking SMS code:", error)
      setError(error instanceof Error ? error.message : "Failed to get SMS code")
    } finally {
      setCheckingCode(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleProceedToPayment = () => {
    setStep("payment")
  }

  const handleCompletePayment = () => {
    if (!selectedPaymentMethod) {
      setError("Please select a payment method")
      return
    }

    // In a real app, this would process the payment
    // For now, we'll just move to the next step
    setStep("code")
  }

  const renderStepContent = () => {
    switch (step) {
      case "selection":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service" className="text-white">
                  Select Service
                </Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger id="service" className="bg-purple-900/50 border-purple-500/50 text-white">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-900 text-white border-purple-500/50">
                    {availableServices.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name} - ${service.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-white">
                  Select Country
                </Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger id="country" className="bg-purple-900/50 border-purple-500/50 text-white">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-900 text-white border-purple-500/50">
                    {availableCountries.map((country) => (
                      <SelectItem key={country.id} value={country.id.toString()}>
                        {country.flag} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="bg-red-900/50 border-red-500/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-white">{error}</AlertDescription>
              </Alert>
            )}
            <Button
              onClick={handleGetNumber}
              disabled={isLoading || !selectedService || !selectedCountry}
              className="w-full gradient-button"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Getting Number...
                </>
              ) : (
                "Get Number"
              )}
            </Button>
          </div>
        )

      case "number":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-purple-900/50 rounded-lg border border-purple-500/50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-white">Phone Number</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-purple-800/50"
                  onClick={() => copyToClipboard(phoneNumber || "")}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xl font-mono text-white">{phoneNumber}</p>
              <p className="text-sm text-purple-200 mt-2">
                Use this number to receive the verification code. The number will be active for 20 minutes.
              </p>
            </div>

            <div className="p-4 bg-purple-900/50 rounded-lg border border-purple-500/50">
              <h3 className="text-lg font-medium text-white mb-2">SMS Code</h3>
              <div className="flex items-center gap-2">
                <Button onClick={handleCheckCode} disabled={checkingCode} className="gradient-button">
                  {checkingCode ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Check for SMS"
                  )}
                </Button>
                {smsCode && (
                  <div className="flex-1 p-2 bg-green-900/50 rounded-lg border border-green-500/50">
                    <p className="text-xl font-mono text-white">{smsCode}</p>
                  </div>
                )}
              </div>
              {error && (
                <Alert variant="warning" className="mt-2 bg-yellow-900/50 border-yellow-500/50">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-white">{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <Button onClick={handleProceedToPayment} className="w-full gradient-button">
              Proceed to Payment
            </Button>
          </div>
        )

      case "payment":
        return (
          <div className="space-y-4">
            <Tabs defaultValue="cryptomus">
              <TabsList className="bg-purple-900/50 text-white">
                <TabsTrigger value="cryptomus" className="data-[state=active]:bg-purple-700">
                  Cryptomus
                </TabsTrigger>
                <TabsTrigger value="paypal" className="data-[state=active]:bg-purple-700">
                  PayPal
                </TabsTrigger>
                <TabsTrigger value="mpesa" className="data-[state=active]:bg-purple-700">
                  M-Pesa
                </TabsTrigger>
                <TabsTrigger value="binance" className="data-[state=active]:bg-purple-700">
                  Binance Pay
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="cryptomus"
                className="p-4 bg-purple-900/50 rounded-lg border border-purple-500/50 mt-4"
              >
                <h3 className="text-lg font-medium text-white mb-2">Pay with Cryptocurrency</h3>
                <p className="text-purple-200 mb-4">
                  Send the exact amount to the address below. The payment will be processed automatically.
                </p>
                <div className="p-4 bg-purple-800/50 rounded-lg border border-purple-500/50 mb-4">
                  <p className="text-sm text-purple-200 mb-1">Amount to pay:</p>
                  <p className="text-xl font-mono text-white">0.0005 BTC</p>
                </div>
                <Button
                  onClick={() => {
                    setSelectedPaymentMethod("cryptomus")
                    handleCompletePayment()
                  }}
                  className="w-full gradient-button"
                >
                  Complete Payment
                </Button>
              </TabsContent>

              <TabsContent value="paypal" className="p-4 bg-purple-900/50 rounded-lg border border-purple-500/50 mt-4">
                <h3 className="text-lg font-medium text-white mb-2">Pay with PayPal</h3>
                <p className="text-purple-200 mb-4">You will be redirected to PayPal to complete your payment.</p>
                <Button
                  onClick={() => {
                    setSelectedPaymentMethod("paypal")
                    handleCompletePayment()
                  }}
                  className="w-full gradient-button"
                >
                  Pay with PayPal
                </Button>
              </TabsContent>

              <TabsContent value="mpesa" className="p-4 bg-purple-900/50 rounded-lg border border-purple-500/50 mt-4">
                <h3 className="text-lg font-medium text-white mb-2">Pay with M-Pesa</h3>
                <p className="text-purple-200 mb-4">Enter your M-Pesa phone number to receive a payment prompt.</p>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="phone" className="text-white">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder="e.g. 254712345678"
                    className="bg-purple-800/50 border-purple-500/50 text-white"
                  />
                </div>
                <Button
                  onClick={() => {
                    setSelectedPaymentMethod("mpesa")
                    handleCompletePayment()
                  }}
                  className="w-full gradient-button"
                >
                  Send Payment Request
                </Button>
              </TabsContent>

              <TabsContent value="binance" className="p-4 bg-purple-900/50 rounded-lg border border-purple-500/50 mt-4">
                <h3 className="text-lg font-medium text-white mb-2">Pay with Binance Pay</h3>
                <p className="text-purple-200 mb-4">Scan the QR code with your Binance app to complete the payment.</p>
                <div className="flex justify-center mb-4">
                  <div className="w-48 h-48 bg-white p-4 rounded-lg">
                    {/* Placeholder for QR code */}
                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-500">QR Code</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setSelectedPaymentMethod("binance")
                    handleCompletePayment()
                  }}
                  className="w-full gradient-button"
                >
                  I've Completed Payment
                </Button>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="bg-red-900/50 border-red-500/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-white">{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )

      case "code":
        return (
          <div className="space-y-4">
            <Alert className="bg-green-900/50 border-green-500/50">
              <Check className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-white">
                Payment successful! You can now check for your SMS code.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-purple-900/50 rounded-lg border border-purple-500/50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-white">Phone Number</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-purple-800/50"
                  onClick={() => copyToClipboard(phoneNumber || "")}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xl font-mono text-white">{phoneNumber}</p>
            </div>

            <div className="p-4 bg-purple-900/50 rounded-lg border border-purple-500/50">
              <h3 className="text-lg font-medium text-white mb-2">SMS Code</h3>
              <div className="flex items-center gap-2">
                <Button onClick={handleCheckCode} disabled={checkingCode} className="gradient-button">
                  {checkingCode ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Check for SMS"
                  )}
                </Button>
                {smsCode && (
                  <div className="flex-1 p-2 bg-green-900/50 rounded-lg border border-green-500/50">
                    <p className="text-xl font-mono text-white">{smsCode}</p>
                  </div>
                )}
              </div>
              {error && (
                <Alert variant="warning" className="mt-2 bg-yellow-900/50 border-yellow-500/50">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-white">{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <Button onClick={() => setStep("selection")} className="w-full gradient-button">
              Get Another Number
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="bg-purple-900/30 backdrop-blur-sm border-purple-500/50">
      <CardHeader>
        <CardTitle className="text-white">Get SMS Verification Number</CardTitle>
      </CardHeader>
      <CardContent>{renderStepContent()}</CardContent>
      <CardFooter className="text-sm text-purple-200">
        All numbers are provided for one-time use only. Prices may vary by country and service.
      </CardFooter>
    </Card>
  )
}
