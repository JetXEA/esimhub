import type { Country, Service } from "./types"

// This would be stored in environment variables in a real application
let API_KEY = process.env.SMS_MAN_API_KEY || ""

export const setApiKey = (key: string) => {
  API_KEY = key
}

// Fetch countries from the SMS-man API
export async function fetchCountriesFromApi() {
  try {
    const response = await fetch(`https://api.sms-man.com/control/countries?token=${API_KEY}`)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching countries from API:", error)
    throw error
  }
}

// Fetch services from the SMS-man API
export async function fetchServicesFromApi() {
  try {
    const response = await fetch(`https://api.sms-man.com/control/services?token=${API_KEY}`)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching services from API:", error)
    throw error
  }
}

// Get a number for a specific service and country
export async function getNumber(serviceId: number, countryId: number) {
  try {
    const response = await fetch(
      `https://api.sms-man.com/control/get-number?token=${API_KEY}&service=${serviceId}&country=${countryId}`,
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error getting number:", error)
    throw error
  }
}

// Get SMS code for a specific request ID
export async function getSmsCode(requestId: string) {
  try {
    const response = await fetch(`https://api.sms-man.com/control/get-sms?token=${API_KEY}&request_id=${requestId}`)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error getting SMS code:", error)
    throw error
  }
}

// Mock database functions for development
// In a real application, these would interact with your database

// Mock data
const mockCountries: Country[] = [
  { id: 1, name: "United States", iso: "US", available: true },
  { id: 2, name: "United Kingdom", iso: "UK", available: true },
  { id: 3, name: "Germany", iso: "DE", available: true },
  { id: 4, name: "France", iso: "FR", available: true },
  { id: 5, name: "Spain", iso: "ES", available: true },
  { id: 6, name: "Italy", iso: "IT", available: true },
  { id: 7, name: "Russia", iso: "RU", available: true },
  { id: 8, name: "China", iso: "CN", available: false },
  { id: 9, name: "India", iso: "IN", available: true },
  { id: 10, name: "Brazil", iso: "BR", available: true },
  { id: 11, name: "Canada", iso: "CA", available: true },
  { id: 12, name: "Australia", iso: "AU", available: true },
  { id: 13, name: "Japan", iso: "JP", available: false },
  { id: 14, name: "South Korea", iso: "KR", available: true },
  { id: 15, name: "Mexico", iso: "MX", available: true },
]

const mockServices: Service[] = [
  { id: 1, name: "WhatsApp", description: "Verify your WhatsApp account", price: 0.5, available: true },
  { id: 2, name: "Telegram", description: "Verify your Telegram account", price: 0.3, available: true },
  { id: 3, name: "Facebook", description: "Verify your Facebook account", price: 0.4, available: true },
  { id: 4, name: "Google", description: "Verify your Google account", price: 0.35, available: true },
  { id: 5, name: "Twitter", description: "Verify your Twitter account", price: 0.45, available: true },
  { id: 6, name: "Instagram", description: "Verify your Instagram account", price: 0.55, available: true },
  { id: 7, name: "TikTok", description: "Verify your TikTok account", price: 0.6, available: true },
  { id: 8, name: "Snapchat", description: "Verify your Snapchat account", price: 0.5, available: false },
  { id: 9, name: "LinkedIn", description: "Verify your LinkedIn account", price: 0.4, available: true },
  { id: 10, name: "Uber", description: "Verify your Uber account", price: 0.45, available: true },
  { id: 11, name: "Airbnb", description: "Verify your Airbnb account", price: 0.5, available: true },
  { id: 12, name: "Netflix", description: "Verify your Netflix account", price: 0.55, available: false },
]

// Fetch countries from the mock database
export async function fetchCountries(): Promise<Country[]> {
  // In a real application, this would fetch from your database
  return mockCountries
}

// Fetch services from the mock database
export async function fetchServices(): Promise<Service[]> {
  // In a real application, this would fetch from your database
  return mockServices
}

// Update country availability
export async function updateCountryAvailability(id: number, available: boolean): Promise<Country> {
  // In a real application, this would update your database
  const country = mockCountries.find((c) => c.id === id)
  if (!country) {
    throw new Error(`Country with ID ${id} not found`)
  }

  country.available = available
  return country
}

// Update service availability
export async function updateServiceAvailability(id: number, available: boolean): Promise<Service> {
  // In a real application, this would update your database
  const service = mockServices.find((s) => s.id === id)
  if (!service) {
    throw new Error(`Service with ID ${id} not found`)
  }

  service.available = available
  return service
}
