const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"
const CUSTOMER_ID = process.env.NEXT_PUBLIC_CUSTOMER_ID || "CUST001"

// Simular delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface CustomerData {
  customer: {
    id: string
    name: string
    email: string
    phone: string
    plan: string
    status: string
  }
  consumption: {
    data: {
      used: number
      total: number
      unit: string
      percentage: number
      resetDate: string
    }
    minutes: {
      used: number
      total: number
      unit: string
      percentage: number
      resetDate: string
    }
    sms: {
      used: number
      total: number
      unit: string
      percentage: number
      resetDate: string
    }
  }
  billing: {
    currentBalance: number
    currency: string
    nextBillDate: string
    monthlyFee: number
    lastPayment: {
      amount: number
      date: string
      method: string
    }
  }
  services: Array<{
    id: string
    name: string
    status: string
    description: string
  }>
}

// Fallback data for when backend is not available
const fallbackData: CustomerData = {
  customer: {
    id: "CUST001",
    name: "Juan Pérez García",
    email: "juan.perez@email.com",
    phone: "+34 612 345 678",
    plan: "Plan Premium",
    status: "active",
  },
  consumption: {
    data: {
      used: 8.5,
      total: 20.0,
      unit: "GB",
      percentage: 42.5,
      resetDate: "2025-02-15",
    },
    minutes: {
      used: 245,
      total: 500,
      unit: "min",
      percentage: 49.0,
      resetDate: "2025-02-15",
    },
    sms: {
      used: 28,
      total: 100,
      unit: "SMS",
      percentage: 28.0,
      resetDate: "2025-02-15",
    },
  },
  billing: {
    currentBalance: 45.5,
    currency: "EUR",
    nextBillDate: "2025-02-15",
    monthlyFee: 39.99,
    lastPayment: {
      amount: 39.99,
      date: "2025-01-15",
      method: "Tarjeta de Crédito",
    },
  },
  services: [
    {
      id: "1",
      name: "Datos Móviles",
      status: "active",
      description: "20GB de datos de alta velocidad",
    },
    {
      id: "2",
      name: "Llamadas Nacionales",
      status: "active",
      description: "500 minutos incluidos",
    },
    {
      id: "3",
      name: "SMS",
      status: "active",
      description: "100 SMS incluidos",
    },
    {
      id: "4",
      name: "Roaming Internacional",
      status: "inactive",
      description: "Servicio de roaming desactivado",
    },
  ],
}

export async function getCustomerData(): Promise<CustomerData> {
  try {
    console.log("[Flask] Attempting to fetch data from Flask backend...")

    // Fetch all data from Flask endpoints
    const [customerResponse, consumptionResponse, billingResponse, servicesResponse] = await Promise.allSettled([
      fetch(`${API_BASE_URL}/customers/${CUSTOMER_ID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(10000),
      }),
      fetch(`${API_BASE_URL}/consumptions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(10000),
      }),
      fetch(`${API_BASE_URL}/billings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(10000),
      }),
      fetch(`${API_BASE_URL}/services`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(10000),
      }),
    ])

    // Process customer data
    let customerData = fallbackData.customer
    if (customerResponse.status === 'fulfilled' && customerResponse.value.ok) {
      const customer = await customerResponse.value.json()
      customerData = {
        id: customer.id,
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone || '',
        plan: customer.plan || '',
        status: customer.status || 'active',
      }
      console.log("[Flask] Successfully fetched customer data")
    }

    // Process consumption data
    let consumptionData = fallbackData.consumption
    if (consumptionResponse.status === 'fulfilled' && consumptionResponse.value.ok) {
      const consumptions = await consumptionResponse.value.json()
      const customerConsumptions = consumptions.filter((c: any) => c.customer_id === CUSTOMER_ID)
      
      if (customerConsumptions.length > 0) {
        consumptionData = transformFlaskConsumption(customerConsumptions)
        console.log("[Flask] Successfully fetched consumption data")
      }
    }

    // Process billing data
    let billingData = fallbackData.billing
    if (billingResponse.status === 'fulfilled' && billingResponse.value.ok) {
      const billings = await billingResponse.value.json()
      const customerBilling = billings.find((b: any) => b.customer_id === CUSTOMER_ID)
      
      if (customerBilling) {
        // Fetch last payment
        let lastPayment = fallbackData.billing.lastPayment
        try {
          const paymentsResponse = await fetch(`${API_BASE_URL}/billing_payments`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            signal: AbortSignal.timeout(5000),
          })
          
          if (paymentsResponse.ok) {
            const payments = await paymentsResponse.json()
            const billingPayments = payments.filter((p: any) => p.billing_id === customerBilling.id)
            if (billingPayments.length > 0) {
              const lastPaymentData = billingPayments[billingPayments.length - 1]
              lastPayment = {
                amount: lastPaymentData.amount,
                date: lastPaymentData.payment_date,
                method: lastPaymentData.method || 'Tarjeta de Crédito',
              }
            }
          }
        } catch (error) {
          console.warn("[Flask] Could not fetch payments:", error)
        }

        billingData = {
          currentBalance: customerBilling.current_balance || 0,
          currency: customerBilling.currency || 'EUR',
          nextBillDate: customerBilling.next_bill_date || fallbackData.billing.nextBillDate,
          monthlyFee: customerBilling.monthly_fee || 0,
          lastPayment: lastPayment,
        }
        console.log("[Flask] Successfully fetched billing data")
      }
    }

    // Process services data
    let servicesData = fallbackData.services
    if (servicesResponse.status === 'fulfilled' && servicesResponse.value.ok) {
      const services = await servicesResponse.value.json()
      
      // Get customer services
      try {
        const customerServicesResponse = await fetch(`${API_BASE_URL}/customer_services`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          signal: AbortSignal.timeout(5000),
        })
        
        if (customerServicesResponse.ok) {
          const customerServices = await customerServicesResponse.json()
          const customerServiceIds = customerServices
            .filter((cs: any) => cs.customer_id === CUSTOMER_ID)
            .map((cs: any) => cs.service_id)
          
          servicesData = services.map((service: any) => ({
            id: service.id,
            name: service.name,
            status: customerServiceIds.includes(service.id) ? 'active' : 'inactive',
            description: service.description || `Servicio ${service.name}`,
          }))
          console.log("[Flask] Successfully fetched services data")
        }
      } catch (error) {
        console.warn("[Flask] Could not fetch customer services:", error)
        servicesData = services.map((service: any) => ({
          id: service.id,
          name: service.name,
          status: service.status || 'active',
          description: service.description || `Servicio ${service.name}`,
        }))
      }
    }

    const result: CustomerData = {
      customer: customerData,
      consumption: consumptionData,
      billing: billingData,
      services: servicesData,
    }

    console.log("[Flask] Successfully compiled all data from Flask backend")
    return result

  } catch (error) {
    console.warn("[Flask] Flask backend not available, using fallback data:", error)

    // Try Next.js API route as fallback
    try {
      const response = await fetch("/api/customer", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("[Flask] Using Next.js API fallback")
        return data as CustomerData
      }
    } catch (fallbackError) {
      console.warn("[Flask] Next.js API also failed:", fallbackError)
    }

    console.log("[Flask] Using static fallback data - no database connection available")
    await delay(800) // Simulate network delay

    // Return fallback data but indicate it's demo
    const fallbackWithError = {
      ...fallbackData,
      customer: {
        ...fallbackData.customer,
        name: "Usuario Demo (Sin BD)",
        email: "demo@telcox.com",
      },
    }

    return fallbackWithError
  }
}

export async function refreshConsumption(): Promise<CustomerData["consumption"]> {
  try {
    console.log("[Flask] Refreshing consumption data from Flask backend...")

    const response = await fetch(`${API_BASE_URL}/consumptions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`Backend error ${response.status}: ${response.statusText}`)
    }

    const consumptions = await response.json()
    const customerConsumptions = consumptions.filter((c: any) => c.customer_id === CUSTOMER_ID)
    
    if (customerConsumptions.length > 0) {
      console.log("[Flask] Successfully refreshed consumption data from Flask backend")
      return transformFlaskConsumption(customerConsumptions)
    } else {
      throw new Error("No consumption data found for customer")
    }
  } catch (error) {
    console.warn("[Flask] Flask backend refresh failed, using fallback:", error)

    // Try Next.js API route as fallback
    try {
      const response = await fetch("/api/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("[Flask] Using Next.js API refresh fallback")
        return data
      }
    } catch (fallbackError) {
      console.warn("[Flask] Next.js API refresh also failed:", fallbackError)
    }

    // Simulate updated consumption data
    console.log("[Flask] Using simulated refresh data")
    await delay(500)

    const baseData = fallbackData.consumption
    return {
      ...baseData,
      data: {
        ...baseData.data,
        used: Math.round((baseData.data.used + Math.random() * 0.5) * 10) / 10,
        percentage: Math.round(((baseData.data.used + Math.random() * 0.5) / baseData.data.total) * 100),
      },
      minutes: {
        ...baseData.minutes,
        used: baseData.minutes.used + Math.floor(Math.random() * 5),
        percentage: Math.round(
          ((baseData.minutes.used + Math.floor(Math.random() * 5)) / baseData.minutes.total) * 100,
        ),
      },
    }
  }
}

// Transform Flask consumption data to match our interface
function transformFlaskConsumption(consumptions: any[]): CustomerData["consumption"] {
  const dataConsumption = consumptions.find(c => c.type === 'data')
  const minutesConsumption = consumptions.find(c => c.type === 'minutes')
  const smsConsumption = consumptions.find(c => c.type === 'sms')

  return {
    data: dataConsumption ? {
      used: dataConsumption.used,
      total: dataConsumption.total,
      unit: dataConsumption.unit || "GB",
      percentage: dataConsumption.percentage || Math.round((dataConsumption.used / dataConsumption.total) * 100),
      resetDate: dataConsumption.reset_date || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    } : fallbackData.consumption.data,
    minutes: minutesConsumption ? {
      used: minutesConsumption.used,
      total: minutesConsumption.total,
      unit: minutesConsumption.unit || "min",
      percentage: minutesConsumption.percentage || Math.round((minutesConsumption.used / minutesConsumption.total) * 100),
      resetDate: minutesConsumption.reset_date || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    } : fallbackData.consumption.minutes,
    sms: smsConsumption ? {
      used: smsConsumption.used,
      total: smsConsumption.total,
      unit: smsConsumption.unit || "SMS",
      percentage: smsConsumption.percentage || Math.round((smsConsumption.used / smsConsumption.total) * 100),
      resetDate: smsConsumption.reset_date || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    } : fallbackData.consumption.sms,
  }
}

// Health check function to test backend connectivity
export async function checkBackendHealth(): Promise<{
  flask: boolean
  nextjs: boolean
  message: string
}> {
  const result = {
    flask: false,
    nextjs: false,
    message: "",
  }

  // Check Flask backend
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    })
    result.flask = response.ok
  } catch (error) {
    console.log("[Flask] Flask backend health check failed:", error)
  }

  // Check Next.js API
  try {
    const response = await fetch("/api/customer", {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    })
    result.nextjs = response.ok
  } catch (error) {
    console.log("[Flask] Next.js API health check failed:", error)
  }

  if (result.flask) {
    result.message = "Conectado al backend Flask"
  } else if (result.nextjs) {
    result.message = "Usando API local de Next.js"
  } else {
    result.message = "Usando datos de demostración"
  }

  return result
}