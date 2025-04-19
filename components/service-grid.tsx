"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Service } from "@/lib/types"
import { defaultServices } from "@/lib/default-data"

export function ServiceGrid() {
  const [services, setServices] = useState<Service[]>(defaultServices) // Initialize with default data
  const [filteredServices, setFilteredServices] = useState<Service[]>(defaultServices)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getServices = async () => {
      try {
        // Use our own API endpoint
        const response = await fetch("/api/services")

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

        // Transform the data to match our Service type if needed
        const formattedServices = Array.isArray(data)
          ? data.map((service: any) => ({
              id: service.id || 0,
              name: service.name || "Unknown Service",
              description: service.description || "No description available",
              icon: service.icon || service.name?.toLowerCase(),
              price: service.price || 4.0,
              available: service.available !== undefined ? service.available : true,
            }))
          : []

        if (formattedServices.length > 0) {
          setServices(formattedServices)
          setFilteredServices(formattedServices)
        }
      } catch (error) {
        // Only log errors to console, don't show to user
        console.error("Failed to fetch services:", error)
        // Still use the default services data as fallback
      } finally {
        setIsLoading(false)
      }
    }

    getServices()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredServices(services)
    } else {
      const filtered = services.filter((service) => service.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredServices(filtered)
    }
  }, [searchQuery, services])

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

  // Function to get service icon and background color
  const getServiceIconInfo = (serviceName: string) => {
    const serviceIcons: Record<string, { url: string; bgColor: string; invert: boolean }> = {
      whatsapp: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/whatsapp.svg",
        bgColor: "#25D366",
        invert: false,
      },
      telegram: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/telegram.svg",
        bgColor: "#0088cc",
        invert: false,
      },
      facebook: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/facebook.svg",
        bgColor: "#1877F2",
        invert: false,
      },
      google: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/google.svg",
        bgColor: "#4285F4",
        invert: false,
      },
      twitter: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/twitter.svg",
        bgColor: "#1DA1F2",
        invert: false,
      },
      instagram: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/instagram.svg",
        bgColor:
          "linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80)",
        invert: false,
      },
      tiktok: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/tiktok.svg",
        bgColor: "#000000",
        invert: true,
      },
      snapchat: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/snapchat.svg",
        bgColor: "#FFFC00",
        invert: false,
      },
      linkedin: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/linkedin.svg",
        bgColor: "#0A66C2",
        invert: false,
      },
      uber: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/uber.svg",
        bgColor: "#000000",
        invert: true,
      },
      airbnb: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/airbnb.svg",
        bgColor: "#FF5A5F",
        invert: false,
      },
      netflix: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/netflix.svg",
        bgColor: "#E50914",
        invert: false,
      },
      amazon: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/amazon.svg",
        bgColor: "#FF9900",
        invert: false,
      },
      paypal: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/paypal.svg",
        bgColor: "#00457C",
        invert: false,
      },
      ebay: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/ebay.svg",
        bgColor: "#E53238",
        invert: false,
      },
      tinder: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/tinder.svg",
        bgColor: "#FE3C72",
        invert: false,
      },
      discord: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/discord.svg",
        bgColor: "#5865F2",
        invert: false,
      },
      spotify: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/spotify.svg",
        bgColor: "#1DB954",
        invert: false,
      },
      apple: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/apple.svg",
        bgColor: "#000000",
        invert: true,
      },
      microsoft: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/microsoft.svg",
        bgColor: "#5E5E5E",
        invert: false,
      },
      steam: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/steam.svg",
        bgColor: "#000000",
        invert: true,
      },
      coinbase: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/coinbase.svg",
        bgColor: "#0052FF",
        invert: false,
      },
      binance: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/binance.svg",
        bgColor: "#F0B90B",
        invert: false,
      },
      skype: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/skype.svg",
        bgColor: "#00AFF0",
        invert: false,
      },
      bumble: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/bumble.svg",
        bgColor: "#FFFC00",
        invert: false,
      },
      wechat: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/wechat.svg",
        bgColor: "#07C160",
        invert: false,
      },
      line: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/line.svg",
        bgColor: "#00C300",
        invert: false,
      },
      viber: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/viber.svg",
        bgColor: "#7360F2",
        invert: false,
      },
      kakaotalk: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/kakaotalk.svg",
        bgColor: "#FFCD00",
        invert: false,
      },
      signal: {
        url: "https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/signal.svg",
        bgColor: "#3A76F0",
        invert: false,
      },
    }

    const normalizedName = serviceName.toLowerCase().replace(/\s+/g, "")
    return (
      serviceIcons[normalizedName] || {
        url: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/icons/app.svg",
        bgColor: "#6366f1",
        invert: false,
      }
    )
  }

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
          placeholder="Search services..."
          className="pl-8 bg-purple-900/30 backdrop-blur-sm border-purple-500/50 text-white placeholder:text-purple-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredServices.map((service) => {
          const iconInfo = getServiceIconInfo(service.name)
          return (
            <motion.div key={service.id} variants={item}>
              <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer h-full bg-purple-900/30 backdrop-blur-sm hover:bg-purple-900/40 border-purple-500/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-2 shadow-sm p-2"
                        style={{
                          background: iconInfo.bgColor,
                          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                        }}
                      >
                        <Image
                          src={iconInfo.url || "/placeholder.svg"}
                          alt={`${service.name} icon`}
                          width={24}
                          height={24}
                          className={`object-contain ${iconInfo.invert ? "invert" : ""}`}
                        />
                      </div>
                      <h3 className="font-medium text-white">{service.name}</h3>
                    </div>
                    <Badge
                      variant={service.available ? "default" : "outline"}
                      className={
                        service.available
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                          : "text-purple-200 border-purple-400"
                      }
                    >
                      {service.available ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                  <p className="text-sm text-purple-200">{service.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-white">Price: ${service.price.toFixed(2)}</p>
                    <Link href={`/services/${service.id}`}>
                      <Button className="gradient-button">Select</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
