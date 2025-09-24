export interface ConsumptionItem {
  used: number
  total: number
  unit: string
  percentage: number
  resetDate: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  plan: string
  status: "active" | "inactive"
}

export interface Consumption {
  data: ConsumptionItem
  minutes: ConsumptionItem
  sms: ConsumptionItem
}

export interface LastPayment {
  amount: number
  date: string
  method: string
}

export interface Billing {
  currentBalance: number
  currency: string
  nextBillDate: string
  monthlyFee: number
  lastPayment: LastPayment
}

export interface Service {
  id: string
  name: string
  status: "active" | "inactive"
  description: string
}

export interface CustomerData {
  customer: Customer
  consumption: Consumption
  billing: Billing
  services: Service[]
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface NotificationState {
  message: string
  type: "success" | "error" | "info" | "warning"
  duration?: number
}

export type ConsumptionType = "data" | "minutes" | "sms"

export interface ConsumptionCardProps {
  title: string
  data: ConsumptionItem
  icon: ConsumptionType
  className?: string
}

export interface BillingCardProps {
  data: Billing
  className?: string
}

export interface ServicesCardProps {
  services: Service[]
  className?: string
}

export interface ErrorBoundaryProps {
  error: string
  onRetry?: () => void
  className?: string
}

export interface LoadingState {
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
}
