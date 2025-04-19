export interface Country {
  id: number
  name: string
  iso: string
  flag?: string
  available: boolean
}

export interface Service {
  id: number
  name: string
  description: string
  icon?: string
  price: number
  available: boolean
}

export interface User {
  id: string
  name: string
  email: string
  balance: number
  createdAt: Date
}

export interface Transaction {
  id: string
  userId: string
  amount: number
  type: "CREDIT" | "DEBIT"
  description: string
  createdAt: Date
}

export interface SmsRequest {
  id: string
  userId: string
  serviceId: number
  countryId: number
  phoneNumber: string
  code: string | null
  status: "PENDING" | "COMPLETED" | "FAILED"
  createdAt: Date
  updatedAt: Date
}

export interface PaymentMethod {
  id: number
  name: string
  icon: string
  available: boolean
}
