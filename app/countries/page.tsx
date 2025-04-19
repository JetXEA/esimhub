"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { motion } from "framer-motion"

import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Layout } from "@/components/layout"
import type { Country } from "@/lib/types"

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([])
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getCountries = async () => {
      try {
        const response = await fetch("/api/countries")
        const data = await response.json()

        const formattedCountries = Array.isArray(data)
          ? data.map((country: any) => ({
              id: country.id || 0,
              name: country.name || "Unknown Country",
              iso: country.iso || "??",
              flag: country.flag || "🏳️",
              available: country.available !== undefined ? country.available : true,
            }))
          : []

        setCountries(formattedCountries)
        setFilteredCountries(formattedCountries)
      } catch (error) {
        console.error("Failed to fetch countries:", error)
        setCountries([])
        setFilteredCountries([])
      } finally {
        setIsLoading(false)
      }
    }

    getCountries()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCountries(countries)
    } else {
      const filtered = countries.filter(
        (country) =>
          country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.iso.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredCountries(filtered)
    }
  }, [searchQuery, countries])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Countries</h1>
          <p className="text-muted-foreground">Browse all available countries for SMS verification</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search countries..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Country Statistics</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Countries:</span>
                      <span className="font-bold">{countries.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Available Countries:</span>
                      <span className="font-bold">{countries.filter((c) => c.available).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Unavailable Countries:</span>
                      <span className="font-bold">{countries.filter((c) => !c.available).length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Popular Countries</h2>
                  <div className="space-y-3">
                    {countries.slice(0, 5).map((country) => (
                      <div key={country.id} className="flex items-center">
                        <span className="text-2xl mr-2">{country.flag}</span>
                        <span>{country.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredCountries.map((country) => (
                <motion.div key={country.id} variants={item}>
                  <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 text-2xl">
                        {country.flag}
                      </div>
                      <h3 className="font-medium text-center">{country.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{country.iso}</p>
                      <Badge
                        variant={country.available ? "default" : "outline"}
                        className={country.available ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {country.available ? "Available" : "Unavailable"}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {filteredCountries.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No countries found matching your search criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
