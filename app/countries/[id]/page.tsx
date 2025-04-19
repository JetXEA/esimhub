"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Layout } from "@/components/layout"
import { GetNumberForm } from "@/components/get-number-form"
import type { Country, Service } from "@/lib/types"
import { defaultCountries, defaultServices } from "@/lib/default-data"

export default function CountryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const countryId = params.id as string

  const [country, setCountry] = useState<Country | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to find the country in default data first
        const defaultCountry = defaultCountries.find((c) => c.id.toString() === countryId)

        if (defaultCountry) {
          setCountry(defaultCountry)
        }

        // Set default services
        setServices(defaultServices)

        // Try to fetch from API
        try {
          const [countriesResponse, servicesResponse] = await Promise.all([
            fetch("/api/countries"),
            fetch("/api/services"),
          ])

          if (!countriesResponse.ok || !servicesResponse.ok) {
            throw new Error("Failed to fetch data")
          }

          // Parse countries response
          let countriesData
          try {
            const countriesText = await countriesResponse.text()
            if (countriesText.trim()) {
              countriesData = JSON.parse(countriesText)
            } else {
              throw new Error("Empty countries response")
            }
          } catch (parseError) {
            console.error("Failed to parse countries response:", parseError)
            throw new Error("Invalid countries data format")
          }

          // Parse services response
          let servicesData
          try {
            const servicesText = await servicesResponse.text()
            if (servicesText.trim()) {
              servicesData = JSON.parse(servicesText)
            } else {
              throw new Error("Empty services response")
            }
          } catch (parseError) {
            console.error("Failed to parse services response:", parseError)
            throw new Error("Invalid services data format")
          }

          // Find the specific country
          const foundCountry = Array.isArray(countriesData)
            ? countriesData.find((c: any) => c.id.toString() === countryId)
            : null

          if (foundCountry) {
            setCountry(foundCountry)
          }

          // Set services
          const formattedServices = Array.isArray(servicesData)
            ? servicesData.map((service: any) => ({
                id: service.id || service.service_id,
                name: service.name || service.service_text || service.service,
                description: service.description || `SMS verification for ${service.service_text || service.service}`,
                icon: service.icon || service.name?.toLowerCase(),
                price: service.price || 4.0,
                available: service.available !== undefined ? service.available : true,
              }))
            : []

          if (formattedServices.length > 0) {
            setServices(formattedServices)
          }
        } catch (apiError) {
          console.error("API error:", apiError)
          setError(apiError instanceof Error ? apiError.message : "Failed to fetch data from API")
          // We already set default data above, so no need to do it again
        }
      } catch (error) {
        console.error("Error in fetchData:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [countryId])

  const handleBack = () => {
    router.back()
  }

  // Function to get flag URL
  const getFlagUrl = (iso: string) => {
    return `https://flagcdn.com/w160/${iso.toLowerCase()}.png`
  }

  // Function to get service icon
  const getServiceIcon = (serviceName: string) => {
    const serviceIcons: Record<string, string> = {
      whatsapp: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/whatsapp.svg",
      telegram: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/telegram.svg",
      facebook: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/facebook.svg",
      google: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/google.svg",
      twitter: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/twitter.svg",
      instagram: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/instagram.svg",
      tiktok: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/tiktok.svg",
      snapchat: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/snapchat.svg",
      linkedin: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/linkedin.svg",
      uber: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/uber.svg",
      airbnb: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/airbnb.svg",
      netflix: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/netflix.svg",
      amazon: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/amazon.svg",
      paypal: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/paypal.svg",
      ebay: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/ebay.svg",
      tinder: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/tinder.svg",
      discord: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/discord.svg",
      spotify: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/spotify.svg",
      apple: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/apple.svg",
      microsoft: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/microsoft.svg",
      steam: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/steam.svg",
      coinbase: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/coinbase.svg",
      binance: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/binance.svg",
      skype: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/skype.svg",
    }

    const normalizedName = serviceName.toLowerCase().replace(/\s+/g, "")
    return serviceIcons[normalizedName] || "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/icons/app.svg"
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </Layout>
    )
  }

  if (!country) {
    return (
      <Layout>
        <div className="flex flex-col space-y-4">
          <Button variant="ghost" onClick={handleBack} className="w-fit text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Countries
          </Button>

          <div className="text-center py-12 bg-purple-900/30 backdrop-blur-sm rounded-lg">
            <p className="text-white">Country not found.</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <Button variant="ghost" onClick={handleBack} className="w-fit text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Countries
        </Button>

        <div className="flex items-center space-x-4 bg-purple-900/30 backdrop-blur-sm p-4 rounded-lg border border-purple-500/50">
          <div className="w-20 h-14 flex items-center justify-center overflow-hidden rounded shadow-sm">
            {country.iso && (
              <Image
                src={getFlagUrl(country.iso) || "/placeholder.svg"}
                alt={`${country.name} flag`}
                width={160}
                height={120}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{country.name}</h1>
            <p className="text-purple-200">
              Browse services available in {country.name} ({country.iso})
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="warning" className="bg-purple-900/30 backdrop-blur-sm border-purple-500/50">
            <AlertTriangle className="h-4 w-4 text-yellow-300" />
            <AlertDescription className="text-white">{error}. Showing default services.</AlertDescription>
          </Alert>
        )}

        <div className="mb-8 bg-purple-900/30 backdrop-blur-sm p-4 rounded-lg border border-purple-500/50">
          <GetNumberForm services={services} countries={[country]} />
        </div>

        <h2 className="text-2xl font-bold text-white">Available Services</h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {services
            .filter((s) => s.available)
            .map((service) => (
              <motion.div key={service.id} variants={item}>
                <Card className="h-full flex flex-col bg-purple-900/30 backdrop-blur-sm hover:bg-purple-900/40 border-purple-500/50">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-2 shadow-sm p-2">
                          <Image
                            src={getServiceIcon(service.name) || "/placeholder.svg"}
                            alt={`${service.name} icon`}
                            width={24}
                            height={24}
                            className="object-contain invert"
                          />
                        </div>
                        <CardTitle className="text-white">{service.name}</CardTitle>
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                        Available
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-purple-200">{service.description}</p>
                    <div className="mt-4">
                      <p className="font-medium text-white">Price: ${service.price.toFixed(2)}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-red-500 hover:from-purple-700 hover:via-blue-700 hover:to-red-600"
                      onClick={() => {
                        router.push(`/services/${service.id}?country=${country.id}`)
                      }}
                    >
                      Get Number
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
        </motion.div>

        {services.filter((s) => s.available).length === 0 && (
          <div className="text-center py-10 bg-purple-900/30 backdrop-blur-sm rounded-lg border border-purple-500/50">
            <p className="text-white">No services available for this country.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
