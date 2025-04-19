"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Service, Country } from "@/lib/types"
import { Layout } from "@/components/layout"
import { defaultCountries, defaultServices } from "@/lib/default-data"
import Link from "next/link"

// Add the import for the GetNumberForm component
import { GetNumberForm } from "@/components/get-number-form"
import { ServiceGrid } from "@/components/service-grid"

export default function ServicesPage() {
  const searchParams = useSearchParams()
  const countryId = searchParams.get("country")
  const serviceId = searchParams.get("service")

  const [services, setServices] = useState<Service[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Use our own API endpoints
        const [servicesResponse, countriesResponse] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/countries"),
        ])

        if (!servicesResponse.ok || !countriesResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const servicesData = await servicesResponse.json()
        const countriesData = await countriesResponse.json()

        // Transform the API responses to match our types if needed
        const formattedServices = Array.isArray(servicesData)
          ? servicesData.map((service) => ({
              id: service.id || service.service_id,
              name: service.name || service.service_text || service.service,
              description: service.description || `SMS verification for ${service.service_text || service.service}`,
              icon: service.icon || "📱",
              price: service.price || 4.0,
              available: service.available !== undefined ? service.available : true,
            }))
          : defaultServices

        const formattedCountries = Array.isArray(countriesData)
          ? countriesData.map((country) => ({
              id: country.id || country.country_id,
              name: country.name || country.country_text,
              iso: country.iso || country.country,
              flag: country.flag || "🏳️",
              available: country.available !== undefined ? country.available : true,
            }))
          : defaultCountries

        setServices(formattedServices)
        setCountries(formattedCountries)

        // If countryId is provided, find the selected country
        if (countryId) {
          const country = formattedCountries.find((c) => c.id.toString() === countryId)
          if (country) {
            setSelectedCountry(country)
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
        // Use default data on error
        setServices(defaultServices)
        setCountries(defaultCountries)

        if (countryId) {
          const country = defaultCountries.find((c) => c.id.toString() === countryId)
          if (country) {
            setSelectedCountry(country)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [countryId])

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            {selectedCountry ? (
              <div className="flex items-center">
                <Link href="/countries">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight flex items-center">
                    <span className="mr-2 text-2xl">{selectedCountry.flag}</span>
                    Services in {selectedCountry.name}
                  </h1>
                  <p className="text-muted-foreground">
                    Browse SMS verification services available in {selectedCountry.name}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold tracking-tight">Services</h1>
                <p className="text-muted-foreground">Browse our SMS verification services</p>
              </>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}. Using default data.</AlertDescription>
          </Alert>
        )}

        {/* Add the GetNumberForm if both country and service are selected */}
        {countryId && serviceId && (
          <div className="mb-8">
            <GetNumberForm
              services={services}
              countries={countries}
              initialServiceId={serviceId}
              initialCountryId={countryId}
            />
          </div>
        )}

        {/* Show services for the selected country */}
        <ServiceGrid countryId={countryId || undefined} />
      </div>
    </Layout>
  )
}
