// This file contains API-related functions and mock data for the SMS reseller platform.

import type { Country, Service } from "./types"
import { getSmsApiKey, isDemoMode } from "./env"
import { cacheApiResponse, getCachedApiResponse } from "./redis"
import { defaultCountries } from "./default-data"

// Base URL for SMS-man API
const API_BASE_URL = "https://api.sms-man.com/control"

// Check if we're in demo mode (no API key)
export function isInDemoMode() {
  return isDemoMode() || !getSmsApiKey() || getSmsApiKey() === "demo_key"
}

// Fetch countries from API or return mock data
export async function fetchCountries() {
  // Check cache first
  const cachedData = await getCachedApiResponse("countries")
  if (cachedData) {
    return cachedData
  }

  // If in demo mode, return mock data
  if (isInDemoMode()) {
    // Cache the mock data
    await cacheApiResponse("countries", defaultCountries)
    return defaultCountries
  }

  try {
    const response = await fetch(`${API_BASE_URL}/countries?token=${getSmsApiKey()}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    // Cache the response
    await cacheApiResponse("countries", data)

    return data
  } catch (error) {
    console.error("Error fetching countries:", error)

    // Return mock data on error
    return defaultCountries
  }
}

// Fetch services from the SMS-man API
export async function fetchServicesFromApi(): Promise<Service[]> {
  // In a real application, this would fetch from the SMS-man API
  // and transform the data into the Service type.
  // For demo purposes, we'll just return mock data.
  return mockServices
}

// Get a number for a specific service and country
export async function getNumber(serviceId: number, countryId: number): Promise<{ request_id: string; number: string }> {
  // In a real application, this would call the SMS-man API to get a number.
  // For demo purposes, we'll just return mock data.
  return {
    request_id: `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    number: "+1" + Math.floor(Math.random() * 9000000000 + 1000000000).toString(),
  }
}

// Get SMS code for a specific request ID
export async function getSmsCode(requestId: string): Promise<{ sms_code: string }> {
  // In a real application, this would call the SMS-man API to get the SMS code.
  // For demo purposes, we'll just return mock data.
  return {
    sms_code: Math.floor(Math.random() * 900000 + 100000).toString(),
  }
}

// Mock data for countries with flags
export const mockCountries: Country[] = [
  { id: 1, name: "United States", iso: "US", flag: "🇺🇸", available: true },
  { id: 2, name: "United Kingdom", iso: "GB", flag: "🇬🇧", available: true },
  { id: 3, name: "Russia", iso: "RU", flag: "🇷🇺", available: true },
  { id: 4, name: "Ukraine", iso: "UA", flag: "🇺🇦", available: true },
  { id: 5, name: "Kazakhstan", iso: "KZ", flag: "🇰🇿", available: true },
  { id: 6, name: "China", iso: "CN", flag: "🇨🇳", available: true },
  { id: 7, name: "Philippines", iso: "PH", flag: "🇵🇭", available: true },
  { id: 8, name: "Myanmar", iso: "MM", flag: "🇲🇲", available: true },
  { id: 9, name: "Indonesia", iso: "ID", flag: "🇮🇩", available: true },
  { id: 10, name: "Malaysia", iso: "MY", flag: "🇲🇾", available: true },
  { id: 11, name: "Vietnam", iso: "VN", flag: "🇻🇳", available: true },
  { id: 12, name: "Kyrgyzstan", iso: "KG", flag: "🇰🇬", available: true },
  { id: 13, name: "Israel", iso: "IL", flag: "🇮🇱", available: true },
  { id: 14, name: "Hong Kong", iso: "HK", flag: "🇭🇰", available: true },
  { id: 15, name: "Poland", iso: "PL", flag: "🇵🇱", available: true },
  { id: 16, name: "Romania", iso: "RO", flag: "🇷🇴", available: true },
  { id: 17, name: "Estonia", iso: "EE", flag: "🇪🇪", available: true },
  { id: 18, name: "Finland", iso: "FI", flag: "🇫🇮", available: true },
  { id: 19, name: "Latvia", iso: "LV", flag: "🇱🇻", available: true },
  { id: 20, name: "Lithuania", iso: "LT", flag: "🇱🇹", available: true },
  { id: 21, name: "Serbia", iso: "RS", flag: "🇷🇸", available: true },
  { id: 22, name: "Slovenia", iso: "SI", flag: "🇸🇮", available: true },
  { id: 23, name: "Slovakia", iso: "SK", flag: "🇸🇰", available: true },
  { id: 24, name: "Germany", iso: "DE", flag: "🇩🇪", available: true },
  { id: 25, name: "Italy", iso: "IT", flag: "🇮🇹", available: true },
  { id: 26, name: "Spain", iso: "ES", flag: "🇪🇸", available: true },
  { id: 27, name: "France", iso: "FR", flag: "🇫🇷", available: true },
  { id: 28, name: "Netherlands", iso: "NL", flag: "🇳🇱", available: true },
  { id: 29, name: "Sweden", iso: "SE", flag: "🇸🇪", available: true },
  { id: 30, name: "Portugal", iso: "PT", flag: "🇵🇹", available: true },
  { id: 31, name: "Brazil", iso: "BR", flag: "🇧🇷", available: true },
  { id: 32, name: "Colombia", iso: "CO", flag: "🇨🇴", available: true },
  { id: 33, name: "Mexico", iso: "MX", flag: "🇲🇽", available: true },
  { id: 34, name: "Peru", iso: "PE", flag: "🇵🇪", available: true },
  { id: 35, name: "Argentina", iso: "AR", flag: "🇦🇷", available: true },
  { id: 36, name: "Canada", iso: "CA", flag: "🇨🇦", available: true },
  { id: 37, name: "Australia", iso: "AU", flag: "🇦🇺", available: true },
  { id: 38, name: "New Zealand", iso: "NZ", flag: "🇳🇿", available: true },
  { id: 39, name: "India", iso: "IN", flag: "🇮🇳", available: true },
  { id: 40, name: "Pakistan", iso: "PK", flag: "🇵🇰", available: true },
  { id: 41, name: "Bangladesh", iso: "BD", flag: "🇧🇩", available: true },
  { id: 42, name: "Japan", iso: "JP", flag: "🇯🇵", available: true },
  { id: 43, name: "South Korea", iso: "KR", flag: "🇰🇷", available: true },
  { id: 44, name: "Thailand", iso: "TH", flag: "🇹🇭", available: true },
  { id: 45, name: "Egypt", iso: "EG", flag: "🇪🇬", available: true },
  { id: 46, name: "Morocco", iso: "MA", flag: "🇲🇦", available: true },
  { id: 47, name: "Kenya", iso: "KE", flag: "🇰🇪", available: true },
  { id: 48, name: "Nigeria", iso: "NG", flag: "🇳🇬", available: true },
  { id: 49, name: "South Africa", iso: "ZA", flag: "🇿🇦", available: true },
  { id: 50, name: "Turkey", iso: "TR", flag: "🇹🇷", available: true },
]

// Mock data for services with icons
export const mockServices: Service[] = [
  { id: 1, name: "WhatsApp", icon: "📱", description: "Verify your WhatsApp account", price: 4.0, available: true },
  { id: 2, name: "Telegram", icon: "✈️", description: "Verify your Telegram account", price: 4.0, available: true },
  { id: 3, name: "Facebook", icon: "👤", description: "Verify your Facebook account", price: 4.5, available: true },
  { id: 4, name: "Google", icon: "🔍", description: "Verify your Google account", price: 4.0, available: true },
  { id: 5, name: "Twitter", icon: "🐦", description: "Verify your Twitter account", price: 4.5, available: true },
  { id: 6, name: "Instagram", icon: "📷", description: "Verify your Instagram account", price: 5.0, available: true },
  { id: 7, name: "TikTok", icon: "🎵", description: "Verify your TikTok account", price: 5.5, available: true },
  { id: 8, name: "Snapchat", icon: "👻", description: "Verify your Snapchat account", price: 4.5, available: true },
  { id: 9, name: "LinkedIn", icon: "💼", description: "Verify your LinkedIn account", price: 4.0, available: true },
  { id: 10, name: "Uber", icon: "🚗", description: "Verify your Uber account", price: 4.5, available: true },
  { id: 11, name: "Airbnb", icon: "🏠", description: "Verify your Airbnb account", price: 5.0, available: true },
  { id: 12, name: "Netflix", icon: "🎬", description: "Verify your Netflix account", price: 5.5, available: true },
  { id: 13, name: "Amazon", icon: "📦", description: "Verify your Amazon account", price: 4.0, available: true },
  { id: 14, name: "PayPal", icon: "💰", description: "Verify your PayPal account", price: 6.0, available: true },
  { id: 15, name: "eBay", icon: "🛒", description: "Verify your eBay account", price: 4.5, available: true },
  { id: 16, name: "Tinder", icon: "❤️", description: "Verify your Tinder account", price: 5.0, available: true },
  { id: 17, name: "Bumble", icon: "🐝", description: "Verify your Bumble account", price: 5.0, available: true },
  { id: 18, name: "Discord", icon: "💬", description: "Verify your Discord account", price: 4.0, available: true },
  { id: 19, name: "Spotify", icon: "🎵", description: "Verify your Spotify account", price: 4.5, available: true },
  { id: 20, name: "Apple", icon: "🍎", description: "Verify your Apple account", price: 6.0, available: true },
  { id: 21, name: "Microsoft", icon: "💻", description: "Verify your Microsoft account", price: 5.0, available: true },
  { id: 22, name: "Steam", icon: "🎮", description: "Verify your Steam account", price: 4.5, available: true },
  {
    id: 23,
    name: "Epic Games",
    icon: "🎯",
    description: "Verify your Epic Games account",
    price: 4.5,
    available: true,
  },
  { id: 24, name: "Coinbase", icon: "💲", description: "Verify your Coinbase account", price: 6.5, available: true },
  { id: 25, name: "Binance", icon: "📊", description: "Verify your Binance account", price: 6.5, available: true },
  { id: 26, name: "Kraken", icon: "🐙", description: "Verify your Kraken account", price: 6.0, available: true },
  { id: 27, name: "Venmo", icon: "💸", description: "Verify your Venmo account", price: 5.0, available: true },
  { id: 28, name: "Cash App", icon: "💵", description: "Verify your Cash App account", price: 5.0, available: true },
  { id: 29, name: "Zelle", icon: "📲", description: "Verify your Zelle account", price: 5.5, available: true },
  { id: 30, name: "Skype", icon: "☁️", description: "Verify your Skype account", price: 4.0, available: true },
]
