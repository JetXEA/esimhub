"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Layout } from "@/components/layout"
import { GetNumberForm } from "@/components/get-number-form"
import type { Country, Service } from "@/lib/types"
import { defaultCountries, defaultServices } from "@/lib/default-data"

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = params.id as string
  const countryId = searchParams.get("country")

  const [service, setService] = useState<Service | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to find the service in default data first
        const defaultService = defaultServices.find((s) => s.id.toString() === serviceId)

        if (defaultService) {
          setService(defaultService)
        }

        // Set default countries
        setCountries(defaultCountries)

        // Set selected country if countryId is provided
        if (countryId) {
          const country = defaultCountries.find((c) => c.id.toString() === countryId)
          if (country) {
            setSelectedCountry(country)
          }
        }

        // Try to fetch from API
        try {
          const [servicesResponse, countriesResponse] = await Promise.all([
            fetch("/api/services"),
            fetch("/api/countries"),
          ])

          if (!servicesResponse.ok || !countriesResponse.ok) {
            throw new Error("Failed to fetch data")
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

          // Find the specific service
          const foundService = Array.isArray(servicesData)
            ? servicesData.find((s: any) => s.id.toString() === serviceId)
            : null

          if (foundService) {
            setService(foundService)
          }

          // Set countries
          const formattedCountries = Array.isArray(countriesData)
            ? countriesData.map((country: any) => ({
                id: country.id || country.country_id,
                name: country.name || country.country_text,
                iso: country.iso || country.country,
                flag: country.flag || country.iso?.toLowerCase(),
                available: country.available !== undefined ? country.available : true,
              }))
            : []

          if (formattedCountries.length > 0) {
            setCountries(formattedCountries)

            // Set selected country if countryId is provided
            if (countryId) {
              const country = formattedCountries.find((c) => c.id.toString() === countryId)
              if (country) {
                setSelectedCountry(country)
              }
            }
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
  }, [serviceId, countryId])

  const handleBack = () => {
    router.back()
  }

  // Function to get flag URL
  const getFlagUrl = (iso: string) => {
    return `https://flagcdn.com/w80/${iso.toLowerCase()}.png`
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

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </Layout>
    )
  }

  if (!service) {
    return (
      <Layout>
        <div className="flex flex-col space-y-4">
          <Button variant="ghost" onClick={handleBack} className="w-fit text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="text-center py-12 bg-purple-900/30 backdrop-blur-sm rounded-lg border border-purple-500/50">
            <p className="text-white">Service not found.</p>
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
          Back
        </Button>

        <div className="flex items-center space-x-4 bg-purple-900/30 backdrop-blur-sm p-4 rounded-lg border border-purple-500/50">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center shadow-sm p-3">
            <Image
              src={getServiceIcon(service.name) || "/placeholder.svg"}
              alt={`${service.name} icon`}
              width={40}
              height={40}
              className="object-contain invert"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{service.name}</h1>
            <p className="text-purple-200">{service.description}</p>
            <p className="font-medium mt-1 text-white">Price: ${service.price.toFixed(2)}</p>
          </div>
        </div>

        {error && (
          <Alert variant="warning" className="bg-purple-900/30 backdrop-blur-sm border-purple-500/50">
            <AlertTriangle className="h-4 w-4 text-yellow-300" />
            <AlertDescription className="text-white">{error}. Showing default data.</AlertDescription>
          </Alert>
        )}

        <div className="mb-8 bg-purple-900/30 backdrop-blur-sm p-4 rounded-lg border border-purple-500/50">
          <GetNumberForm
            services={[service]}
            countries={selectedCountry ? [selectedCountry] : countries.filter((c) => c.available)}
          />
        </div>

        {!selectedCountry && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Available Countries</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {countries
                .filter((c) => c.available)
                .map((country) => (
                  <motion.div
                    key={country.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedCountry(country)}
                  >
                    <div className="p-4 border border-purple-500/50 rounded-lg bg-purple-900/30 backdrop-blur-sm hover:bg-purple-900/40 hover:shadow-md transition-all flex flex-col items-center">
                      <div className="w-12 h-8 flex items-center justify-center mb-2 overflow-hidden rounded shadow-sm">
                        {country.iso && (
                          <Image
                            src={getFlagUrl(country.iso) || "/placeholder.svg"}
                            alt={`${country.name} flag`}
                            width={80}
                            height={60}
                            className="object-cover w-full h-full"
                          />
                        )}
                      </div>
                      <div className="font-medium text-center text-white">{country.name}</div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
