"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CreditCard, DollarSign, Package, RefreshCw } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Service, Country } from "@/lib/types"
import { Layout } from "@/components/layout"

export default function DashboardPage() {
  const [services, setServices] = useState<Service[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [balance, setBalance] = useState(10.0) // Mock balance

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use our own API endpoints
        const [servicesResponse, countriesResponse] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/countries"),
        ])

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
          : []

        const formattedCountries = Array.isArray(countriesData)
          ? countriesData.map((country) => ({
              id: country.id || country.country_id,
              name: country.name || country.country_text,
              iso: country.iso || country.country,
              flag: country.flag || "🏳️",
              available: country.available !== undefined ? country.available : true,
            }))
          : []

        setServices(formattedServices)
        setCountries(formattedCountries)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your account and services</p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <div className="mr-4">
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
          </div>
          <Link href="/payment">
            <Button className="gradient-button">
              <DollarSign className="mr-2 h-4 w-4" />
              Add Funds
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <motion.div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">+0.0% from last month</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={item}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{services.filter((s) => s.available).length}</div>
                  <p className="text-xs text-muted-foreground">{services.length} total services</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={item}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Countries</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{countries.filter((c) => c.available).length}</div>
                  <p className="text-xs text-muted-foreground">{countries.length} total countries</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={item}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">No recent transactions</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">No recent activity to display</div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Popular Services</CardTitle>
                <CardDescription>Most used services on our platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.slice(0, 5).map((service) => (
                    <div key={service.id} className="flex items-center">
                      <div className="w-9 h-9 rounded bg-muted flex items-center justify-center mr-3">
                        <span className="text-lg">{service.icon}</span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{service.name}</p>
                        <p className="text-sm text-muted-foreground">${service.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Services</CardTitle>
              <CardDescription>Browse and use our SMS verification services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{service.icon}</span>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      <p className="mt-2 font-medium">${service.price.toFixed(2)}</p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full gradient-button" disabled={!service.available}>
                        {service.available ? "Get Number" : "Unavailable"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View your recent transactions and SMS requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-muted-foreground">No transaction history to display</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input type="text" className="w-full p-2 rounded-md border" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input type="email" className="w-full p-2 rounded-md border" defaultValue="john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <input type="password" className="w-full p-2 rounded-md border" placeholder="••••••••" />
              </div>
              <Button className="gradient-button">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  )
}
