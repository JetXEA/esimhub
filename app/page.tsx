import Link from "next/link"
import { ArrowRight, CreditCard } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { CountryGrid } from "@/components/country-grid"
import { ServiceGrid } from "@/components/service-grid"
import { Layout } from "@/components/layout"

export default function Home() {
  return (
    <Layout>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-brand-purple to-brand-red rounded-lg">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                Connecting You To Space
              </h1>
              <p className="mx-auto max-w-[700px] text-white md:text-xl">
                Access SMS verification services worldwide with our reliable platform.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/services">
                <Button className="bg-white text-brand-purple hover:bg-gray-100">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Available Countries</h2>
              <p className="max-w-[900px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose from a wide range of countries for your SMS verification needs.
              </p>
            </div>
          </div>
          <CountryGrid />
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-purple-900/30 backdrop-blur-sm">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Our Services</h2>
              <p className="max-w-[900px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore our range of SMS verification services for popular platforms.
              </p>
            </div>
          </div>
          <ServiceGrid />
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Payment Methods</h2>
              <p className="max-w-[900px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Multiple secure payment options to fund your account.
              </p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {/* PayPal */}
            <div className="flex flex-col items-center p-6 bg-purple-900/30 backdrop-blur-sm rounded-lg shadow-md border border-purple-500/50">
              <div className="w-16 h-16 flex items-center justify-center mb-4 bg-white rounded-full p-3">
                <Image
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/paypal.svg"
                  alt="PayPal"
                  width={40}
                  height={40}
                  className="object-contain"
                  style={{
                    filter: "invert(23%) sepia(91%) saturate(1352%) hue-rotate(189deg) brightness(96%) contrast(101%)",
                  }}
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">PayPal</h3>
              <p className="text-center text-purple-200 mb-4">Fast and secure payments worldwide</p>
              <Button className="gradient-button">Select</Button>
            </div>

            {/* Stripe */}
            <div className="flex flex-col items-center p-6 bg-purple-900/30 backdrop-blur-sm rounded-lg shadow-md border border-purple-500/50">
              <div className="w-16 h-16 flex items-center justify-center mb-4 bg-white rounded-full p-3">
                <Image
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/stripe.svg"
                  alt="Stripe"
                  width={40}
                  height={40}
                  className="object-contain"
                  style={{
                    filter: "invert(23%) sepia(91%) saturate(1352%) hue-rotate(239deg) brightness(96%) contrast(101%)",
                  }}
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Stripe</h3>
              <p className="text-center text-purple-200 mb-4">Credit card payments made easy</p>
              <Button className="gradient-button">Select</Button>
            </div>

            {/* Cryptomus with BTC symbol */}
            <div className="flex flex-col items-center p-6 bg-purple-900/30 backdrop-blur-sm rounded-lg shadow-md border border-purple-500/50">
              <div className="w-16 h-16 flex items-center justify-center mb-4 bg-white rounded-full p-3">
                <span className="text-3xl font-bold text-orange-500">₿</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Cryptomus</h3>
              <p className="text-center text-purple-200 mb-4">Pay with your favorite cryptocurrency</p>
              <Button className="gradient-button">Select</Button>
            </div>

            {/* Binance Pay */}
            <div className="flex flex-col items-center p-6 bg-purple-900/30 backdrop-blur-sm rounded-lg shadow-md border border-purple-500/50">
              <div className="w-16 h-16 flex items-center justify-center mb-4 bg-white rounded-full p-3">
                <Image
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/binance.svg"
                  alt="Binance Pay"
                  width={40}
                  height={40}
                  className="object-contain"
                  style={{
                    filter: "invert(76%) sepia(55%) saturate(552%) hue-rotate(359deg) brightness(103%) contrast(107%)",
                  }}
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Binance Pay</h3>
              <p className="text-center text-purple-200 mb-4">Pay with Binance crypto wallet</p>
              <Button className="gradient-button">Select</Button>
            </div>

            {/* M-Pesa */}
            <div className="flex flex-col items-center p-6 bg-purple-900/30 backdrop-blur-sm rounded-lg shadow-md border border-purple-500/50">
              <div className="w-16 h-16 flex items-center justify-center mb-4 bg-white rounded-full p-3">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1200px-M-PESA_LOGO-01.svg.png"
                  alt="M-Pesa"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">M-Pesa</h3>
              <p className="text-center text-purple-200 mb-4">Mobile money transfers made easy</p>
              <Button className="gradient-button">Select</Button>
            </div>

            {/* Checkout.com with credit card icon */}
            <div className="flex flex-col items-center p-6 bg-purple-900/30 backdrop-blur-sm rounded-lg shadow-md border border-purple-500/50">
              <div className="w-16 h-16 flex items-center justify-center mb-4 bg-white rounded-full p-3">
                <CreditCard className="h-10 w-10 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Checkout.com</h3>
              <p className="text-center text-purple-200 mb-4">Global payment solutions</p>
              <Button className="gradient-button">Select</Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
