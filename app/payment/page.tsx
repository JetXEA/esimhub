"use client"

import type React from "react"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function PaymentPage() {
  const [amount, setAmount] = useState<number>(10)
  const [selectedMethod, setSelectedMethod] = useState<string>("cryptomus")

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value) && value > 0) {
      setAmount(value)
    }
  }

  const handlePayment = () => {
    // This would be implemented with the actual payment APIs
    alert(`Processing payment of ${amount} with ${selectedMethod}`)
  }

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Add Funds</h1>
          <p className="text-purple-200">Choose a payment method to add funds to your account</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="bg-purple-900/30 backdrop-blur-sm border-purple-500/50">
              <CardHeader>
                <CardTitle className="text-white">Payment Methods</CardTitle>
                <CardDescription className="text-purple-200">Select your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="cryptomus" onValueChange={setSelectedMethod}>
                  <TabsList className="grid grid-cols-5 mb-6 bg-purple-900/50">
                    <TabsTrigger value="cryptomus" className="text-white data-[state=active]:bg-purple-700">
                      Cryptomus
                    </TabsTrigger>
                    <TabsTrigger value="binance" className="text-white data-[state=active]:bg-purple-700">
                      Binance Pay
                    </TabsTrigger>
                    <TabsTrigger value="paypal" className="text-white data-[state=active]:bg-purple-700">
                      PayPal
                    </TabsTrigger>
                    <TabsTrigger value="mpesa" className="text-white data-[state=active]:bg-purple-700">
                      M-Pesa
                    </TabsTrigger>
                    <TabsTrigger value="stripe" className="text-white data-[state=active]:bg-purple-700">
                      Stripe
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="cryptomus">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center p-6 bg-purple-900/50 rounded-lg">
                        <Image
                          src="https://cryptomus.com/img/logo/blue.svg"
                          alt="Cryptomus"
                          width={120}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <p className="text-white">
                        Pay with cryptocurrency using Cryptomus. We accept Bitcoin, Ethereum, and other major
                        cryptocurrencies.
                      </p>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Amount (USD)</label>
                        <Input
                          type="number"
                          min="4"
                          step="1"
                          value={amount}
                          onChange={handleAmountChange}
                          className="bg-purple-900/50 border-purple-500/50 text-white"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="binance">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center p-6 bg-purple-900/50 rounded-lg">
                        <div className="bg-white p-4 rounded-lg">
                          <Image
                            src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/binance.svg"
                            alt="Binance Pay"
                            width={120}
                            height={40}
                            className="object-contain"
                            style={{
                              filter:
                                "invert(76%) sepia(55%) saturate(552%) hue-rotate(359deg) brightness(103%) contrast(107%)",
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-white">
                        Pay directly with your Binance wallet. Fast, secure, and low fees for crypto payments.
                      </p>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Amount (USD)</label>
                        <Input
                          type="number"
                          min="4"
                          step="1"
                          value={amount}
                          onChange={handleAmountChange}
                          className="bg-purple-900/50 border-purple-500/50 text-white"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="paypal">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center p-6 bg-purple-900/50 rounded-lg">
                        <div className="bg-white p-4 rounded-lg">
                          <Image
                            src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/paypal.svg"
                            alt="PayPal"
                            width={120}
                            height={40}
                            className="object-contain"
                            style={{
                              filter:
                                "invert(23%) sepia(91%) saturate(1352%) hue-rotate(189deg) brightness(96%) contrast(101%)",
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-white">
                        Pay securely with PayPal. Fast and reliable payments accepted worldwide.
                      </p>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Amount (USD)</label>
                        <Input
                          type="number"
                          min="4"
                          step="1"
                          value={amount}
                          onChange={handleAmountChange}
                          className="bg-purple-900/50 border-purple-500/50 text-white"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="mpesa">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center p-6 bg-purple-900/50 rounded-lg">
                        <div className="bg-white p-4 rounded-lg">
                          <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1200px-M-PESA_LOGO-01.svg.png"
                            alt="M-Pesa"
                            width={120}
                            height={40}
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <p className="text-white">
                        Pay with M-Pesa mobile money. Quick and convenient for users in supported regions.
                      </p>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Amount (USD)</label>
                        <Input
                          type="number"
                          min="4"
                          step="1"
                          value={amount}
                          onChange={handleAmountChange}
                          className="bg-purple-900/50 border-purple-500/50 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Phone Number</label>
                        <Input
                          placeholder="Enter your M-Pesa phone number"
                          className="bg-purple-900/50 border-purple-500/50 text-white placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="stripe">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center p-6 bg-purple-900/50 rounded-lg">
                        <div className="bg-white p-4 rounded-lg">
                          <Image
                            src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/stripe.svg"
                            alt="Stripe"
                            width={120}
                            height={40}
                            className="object-contain"
                            style={{
                              filter:
                                "invert(23%) sepia(91%) saturate(1352%) hue-rotate(239deg) brightness(96%) contrast(101%)",
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-white">
                        Pay with credit or debit card via Stripe. Secure and widely accepted payment method.
                      </p>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Amount (USD)</label>
                        <Input
                          type="number"
                          min="4"
                          step="1"
                          value={amount}
                          onChange={handleAmountChange}
                          className="bg-purple-900/50 border-purple-500/50 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Card Information</label>
                        <Input
                          placeholder="Card number"
                          className="bg-purple-900/50 border-purple-500/50 text-white placeholder:text-gray-400 mb-2"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="MM/YY"
                            className="bg-purple-900/50 border-purple-500/50 text-white placeholder:text-gray-400"
                          />
                          <Input
                            placeholder="CVC"
                            className="bg-purple-900/50 border-purple-500/50 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button className="w-full gradient-button" onClick={handlePayment}>
                  Pay ${amount.toFixed(2)}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card className="bg-purple-900/30 backdrop-blur-sm border-purple-500/50">
              <CardHeader>
                <CardTitle className="text-white">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-white">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>${amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t border-purple-500/50 pt-4 flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-purple-900/30 backdrop-blur-sm border-purple-500/50">
              <CardHeader>
                <CardTitle className="text-white">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full p-2 mb-1">
                      <Image
                        src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/paypal.svg"
                        alt="PayPal"
                        width={32}
                        height={32}
                        className="object-contain"
                        style={{
                          filter:
                            "invert(23%) sepia(91%) saturate(1352%) hue-rotate(189deg) brightness(96%) contrast(101%)",
                        }}
                      />
                    </div>
                    <span className="text-xs text-white">PayPal</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full p-2 mb-1">
                      <Image
                        src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/stripe.svg"
                        alt="Stripe"
                        width={32}
                        height={32}
                        className="object-contain"
                        style={{
                          filter:
                            "invert(23%) sepia(91%) saturate(1352%) hue-rotate(239deg) brightness(96%) contrast(101%)",
                        }}
                      />
                    </div>
                    <span className="text-xs text-white">Stripe</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full p-2 mb-1">
                      <Image
                        src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/binance.svg"
                        alt="Binance Pay"
                        width={32}
                        height={32}
                        className="object-contain"
                        style={{
                          filter:
                            "invert(76%) sepia(55%) saturate(552%) hue-rotate(359deg) brightness(103%) contrast(107%)",
                        }}
                      />
                    </div>
                    <span className="text-xs text-white">Binance</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
