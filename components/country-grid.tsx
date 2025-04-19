"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown, ChevronUp } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Country } from "@/lib/types"
import { defaultCountries } from "@/lib/default-data"
import { Button } from "@/components/ui/button"

// Extended list of countries with ISO codes
const extendedCountries: Country[] = [
  ...defaultCountries,
  { id: 51, name: "Greece", iso: "GR", flag: "gr", available: true },
  { id: 52, name: "Czech Republic", iso: "CZ", flag: "cz", available: true },
  { id: 53, name: "Hungary", iso: "HU", flag: "hu", available: true },
  { id: 54, name: "Austria", iso: "AT", flag: "at", available: true },
  { id: 55, name: "Switzerland", iso: "CH", flag: "ch", available: true },
  { id: 56, name: "Belgium", iso: "BE", flag: "be", available: true },
  { id: 57, name: "Denmark", iso: "DK", flag: "dk", available: true },
  { id: 58, name: "Norway", iso: "NO", flag: "no", available: true },
  { id: 59, name: "Ireland", iso: "IE", flag: "ie", available: true },
  { id: 60, name: "Singapore", iso: "SG", flag: "sg", available: true },
  { id: 61, name: "Taiwan", iso: "TW", flag: "tw", available: true },
  { id: 62, name: "United Arab Emirates", iso: "AE", flag: "ae", available: true },
  { id: 63, name: "Saudi Arabia", iso: "SA", flag: "sa", available: true },
  { id: 64, name: "Qatar", iso: "QA", flag: "qa", available: true },
  { id: 65, name: "Kuwait", iso: "KW", flag: "kw", available: true },
  { id: 66, name: "Bahrain", iso: "BH", flag: "bh", available: true },
  { id: 67, name: "Oman", iso: "OM", flag: "om", available: true },
  { id: 68, name: "Jordan", iso: "JO", flag: "jo", available: true },
  { id: 69, name: "Lebanon", iso: "LB", flag: "lb", available: true },
  { id: 70, name: "Iraq", iso: "IQ", flag: "iq", available: true },
  { id: 71, name: "Iran", iso: "IR", flag: "ir", available: true },
  { id: 72, name: "Afghanistan", iso: "AF", flag: "af", available: true },
  { id: 73, name: "Nepal", iso: "NP", flag: "np", available: true },
  { id: 74, name: "Sri Lanka", iso: "LK", flag: "lk", available: true },
  { id: 75, name: "Maldives", iso: "MV", flag: "mv", available: true },
  { id: 76, name: "Bhutan", iso: "BT", flag: "bt", available: true },
  { id: 77, name: "Mongolia", iso: "MN", flag: "mn", available: true },
  { id: 78, name: "North Korea", iso: "KP", flag: "kp", available: false },
  { id: 79, name: "Cambodia", iso: "KH", flag: "kh", available: true },
  { id: 80, name: "Laos", iso: "LA", flag: "la", available: true },
  { id: 81, name: "Brunei", iso: "BN", flag: "bn", available: true },
  { id: 82, name: "Timor-Leste", iso: "TL", flag: "tl", available: true },
  { id: 83, name: "Papua New Guinea", iso: "PG", flag: "pg", available: true },
  { id: 84, name: "Fiji", iso: "FJ", flag: "fj", available: true },
  { id: 85, name: "Solomon Islands", iso: "SB", flag: "sb", available: true },
  { id: 86, name: "Vanuatu", iso: "VU", flag: "vu", available: true },
  { id: 87, name: "Samoa", iso: "WS", flag: "ws", available: true },
  { id: 88, name: "Tonga", iso: "TO", flag: "to", available: true },
  { id: 89, name: "Micronesia", iso: "FM", flag: "fm", available: true },
  { id: 90, name: "Marshall Islands", iso: "MH", flag: "mh", available: true },
  { id: 91, name: "Palau", iso: "PW", flag: "pw", available: true },
  { id: 92, name: "Nauru", iso: "NR", flag: "nr", available: true },
  { id: 93, name: "Kiribati", iso: "KI", flag: "ki", available: true },
  { id: 94, name: "Tuvalu", iso: "TV", flag: "tv", available: true },
  { id: 95, name: "Cook Islands", iso: "CK", flag: "ck", available: true },
  { id: 96, name: "Niue", iso: "NU", flag: "nu", available: true },
  { id: 97, name: "Tokelau", iso: "TK", flag: "tk", available: true },
  { id: 98, name: "American Samoa", iso: "AS", flag: "as", available: true },
  { id: 99, name: "Guam", iso: "GU", flag: "gu", available: true },
  { id: 100, name: "Northern Mariana Islands", iso: "MP", flag: "mp", available: true },
]

export function CountryGrid() {
  const [countries, setCountries] = useState<Country[]>(extendedCountries) // Initialize with extended data
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(extendedCountries)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const getCountries = async () => {
      try {
        // Use our own API endpoint
        const response = await fetch("/api/countries")

        // Check if the response is ok before parsing JSON
        if (!response.ok) {
          console.error(`API responded with status: ${response.status}`)
          throw new Error(`API error: ${response.statusText}`)
        }

        let data
        try {
          const text = await response.text()
          // Check if the response is empty
          if (!text.trim()) {
            console.warn("Empty response from API")
            throw new Error("Empty response from API")
          }

          // Try to parse the JSON
          data = JSON.parse(text)
        } catch (jsonError) {
          console.error("Failed to parse JSON response:", jsonError)
          throw new Error("Invalid response format from API")
        }

        // Transform the data to match our Country type if needed
        const formattedCountries = Array.isArray(data)
          ? data.map((country: any) => ({
              id: country.id || 0,
              name: country.name || "Unknown Country",
              iso: country.iso || "??",
              flag: country.flag || country.iso?.toLowerCase(),
              available: country.available !== undefined ? country.available : true,
            }))
          : []

        if (formattedCountries.length > 0) {
          // Merge with extended countries to ensure we have at least 100
          const mergedCountries = [...formattedCountries]

          // Add any missing countries from extendedCountries
          if (mergedCountries.length < 100) {
            const existingIds = new Set(mergedCountries.map((c) => c.id))
            extendedCountries.forEach((country) => {
              if (!existingIds.has(country.id) && mergedCountries.length < 100) {
                mergedCountries.push(country)
              }
            })
          }

          setCountries(mergedCountries)
          setFilteredCountries(mergedCountries)
        }
      } catch (error) {
        // Only log errors to console, don't show to user
        console.error("Failed to fetch countries:", error)
        // Still use the extended countries data as fallback
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
      const filtered = countries.filter((country) => country.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredCountries(filtered)
    }
  }, [searchQuery, countries])

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

  // Function to get flag URL
  const getFlagUrl = (iso: string) => {
    return `https://flagcdn.com/w80/${iso.toLowerCase()}.png`
  }

  // Get visible countries based on showAll state
  const visibleCountries =
    searchQuery.trim() !== "" ? filteredCountries : showAll ? filteredCountries : filteredCountries.slice(0, 20)

  if (isLoading) {
    return (
      <div className="w-full mt-8 grid place-items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="w-full mt-8">
      <div className="relative max-w-sm mx-auto mb-8">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-purple-300" />
        <Input
          placeholder="Search countries..."
          className="pl-8 bg-purple-900/30 backdrop-blur-sm border-purple-500/50 text-white placeholder:text-purple-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {visibleCountries.map((country) => (
          <motion.div key={country.id} variants={item}>
            <Link href={`/countries/${country.id}`}>
              <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer bg-purple-900/30 backdrop-blur-sm hover:bg-purple-900/40 border-purple-500/50">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="w-16 h-12 flex items-center justify-center mb-3 overflow-hidden rounded shadow-sm">
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
                  <h3 className="font-medium text-center text-white">{country.name}</h3>
                  <Badge
                    variant={country.available ? "default" : "outline"}
                    className={
                      country.available
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 mt-2 text-white"
                        : "mt-2 text-purple-200 border-purple-400"
                    }
                  >
                    {country.available ? "Available" : "Unavailable"}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* See More / See Less button */}
      {filteredCountries.length > 20 && searchQuery.trim() === "" && (
        <div className="flex justify-center mt-6">
          <Button onClick={() => setShowAll(!showAll)} className="see-more-button flex items-center gap-2">
            {showAll ? (
              <>
                See Less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                See More Countries <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
