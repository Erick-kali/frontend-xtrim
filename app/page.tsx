"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ConsumptionCard } from "@/components/consumption-card"
import { BillingCard } from "@/components/billing-card"
import { ServicesCard } from "@/components/services-card"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { AnimatedCounter } from "@/components/animated-counter"
import { NotificationToast } from "@/components/notification-toast"
import { ConnectionStatus } from "@/components/connection-status"
import { BackendStatus } from "@/components/backend-status"
import { getCustomerData, refreshConsumption, type CustomerData } from "@/lib/api"
import { RefreshCw, User, Smartphone, Zap, Activity, Wifi, AlertTriangle } from "lucide-react"

// Configuración de API - misma que usas en tu archivo
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"
const CUSTOMER_ID = process.env.NEXT_PUBLIC_CUSTOMER_ID || "CUST001"

export default function Dashboard() {
  const [data, setData] = useState<CustomerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "error" | "info"
  } | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [noDataAlert, setNoDataAlert] = useState(false)

  // Función para obtener datos en tiempo real del backend
  const loadRealtimeData = async () => {
    try {
      console.log('[Dashboard] Cargando datos en tiempo real desde:', `${API_BASE_URL}/api/customer/${CUSTOMER_ID}/realtime`)
      
      const response = await fetch(`${API_BASE_URL}/api/customer/${CUSTOMER_ID}/realtime`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })

      if (response.ok) {
        const realtimeData = await response.json()
        console.log('[Dashboard] Datos en tiempo real obtenidos:', realtimeData)
        
        // Transformar los datos para que coincidan con la interfaz
        const transformedData: CustomerData = {
          customer: realtimeData.customer,
          consumption: {
            data: {
              used: realtimeData.consumption.data.used,
              total: realtimeData.consumption.data.total,
              unit: realtimeData.consumption.data.unit,
              percentage: realtimeData.consumption.data.percentage,
              resetDate: realtimeData.consumption.data.reset_date
            },
            minutes: {
              used: realtimeData.consumption.minutes.used,
              total: realtimeData.consumption.minutes.total,
              unit: realtimeData.consumption.minutes.unit,
              percentage: realtimeData.consumption.minutes.percentage,
              resetDate: realtimeData.consumption.minutes.reset_date
            },
            sms: {
              used: realtimeData.consumption.sms.used,
              total: realtimeData.consumption.sms.total,
              unit: realtimeData.consumption.sms.unit,
              percentage: realtimeData.consumption.sms.percentage,
              resetDate: realtimeData.consumption.sms.reset_date
            }
          },
          billing: {
            currentBalance: realtimeData.billing.current_balance,
            currency: realtimeData.billing.currency,
            nextBillDate: realtimeData.billing.next_bill_date,
            monthlyFee: realtimeData.billing.monthly_fee,
            lastPayment: realtimeData.billing.last_payment || {
              amount: 0,
              date: new Date().toISOString().split('T')[0],
              method: "N/A"
            }
          },
          services: realtimeData.services
        }
        
        return transformedData
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.warn('[Dashboard] Error obteniendo datos en tiempo real:', error)
      throw error
    }
  }

  const loadData = async () => {
    try {
      setError(null)
      setNoDataAlert(false)
      console.log("[Dashboard] Cargando datos del cliente...")
      
      // Intentar obtener datos en tiempo real primero
      let customerData: CustomerData
      try {
        customerData = await loadRealtimeData()
        console.log("[Dashboard] Usando datos en tiempo real del backend")
      } catch (realtimeError) {
        console.log("[Dashboard] Fallback a método original")
        customerData = await getCustomerData()
      }

      if (!customerData || !customerData.customer) {
        setNoDataAlert(true)
        setNotification({
          message: "No hay datos disponibles en la base de datos. Mostrando datos de demostración.",
          type: "info",
        })
      } else {
        setData(customerData)
        setLastUpdated(new Date())
        setNotification({
          message: "Datos cargados correctamente desde la base de datos",
          type: "success",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      console.error("[Dashboard] Error loading data:", errorMessage)
      setError(errorMessage)
      setNoDataAlert(true)
      setNotification({
        message: `Error: ${errorMessage}. Usando datos de demostración.`,
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    if (!data) return

    try {
      setRefreshing(true)
      console.log("[Dashboard] Actualizando datos...")
      
      // Intentar obtener datos actualizados en tiempo real
      let updatedData: CustomerData
      try {
        updatedData = await loadRealtimeData()
        console.log("[Dashboard] Datos actualizados desde tiempo real")
        
        // Actualizar todos los datos, no solo el consumo
        setData(updatedData)
        setLastUpdated(new Date())
        setNotification({
          message: "Todos los datos actualizados correctamente desde la base de datos",
          type: "success",
        })
      } catch (realtimeError) {
        console.log("[Dashboard] Fallback a actualización de consumo solamente")
        const updatedConsumption = await refreshConsumption()
        setData({
          ...data,
          consumption: updatedConsumption,
        })
        setLastUpdated(new Date())
        setNotification({
          message: "Datos de consumo actualizados correctamente",
          type: "success",
        })
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar datos"
      console.error("[Dashboard] Error refreshing data:", errorMessage)
      setError(errorMessage)
      setNotification({
        message: `Error al actualizar: ${errorMessage}`,
        type: "error",
      })
    } finally {
      setRefreshing(false)
    }
  }

  // Callback para actualizar el balance cuando se haga una recarga
  const handleBalanceUpdate = (newBalance: number) => {
    if (data) {
      setData({
        ...data,
        billing: {
          ...data.billing,
          currentBalance: newBalance
        }
      })
      setLastUpdated(new Date())
      setNotification({
        message: `Saldo actualizado: ${newBalance.toFixed(2)} ${data.billing.currency}`,
        type: "success",
      })
    }
  }

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setNotification({
        message: "Conexión restaurada",
        type: "success",
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      setNotification({
        message: "Sin conexión a internet",
        type: "error",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (data && !refreshing && isOnline) {
        handleRefresh()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [data, refreshing, isOnline])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <ErrorBoundary error={error} onRetry={loadData} />
        </div>
      </div>
    )
  }

  if (!data) {
    const demoData: CustomerData = {
      customer: {
        id: "DEMO001",
        name: "Usuario Demo",
        email: "demo@telcox.com",
        phone: "+34 600 000 000",
        plan: "Plan Demo",
        status: "active",
      },
      consumption: {
        data: { used: 0, total: 10, unit: "GB", percentage: 0, resetDate: "2025-02-15" },
        minutes: { used: 0, total: 100, unit: "min", percentage: 0, resetDate: "2025-02-15" },
        sms: { used: 0, total: 50, unit: "SMS", percentage: 0, resetDate: "2025-02-15" },
      },
      billing: {
        currentBalance: 0,
        currency: "EUR",
        nextBillDate: "2025-02-15",
        monthlyFee: 0,
        lastPayment: { amount: 0, date: "2025-01-15", method: "Demo" },
      },
      services: [{ id: "1", name: "Servicio Demo", status: "inactive", description: "Datos de demostración" }],
    }
    setData(demoData)
    setNoDataAlert(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Notifications */}
      {notification && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {noDataAlert && (
        <div className="fixed top-4 left-4 right-4 z-40 animate-fade-in">
          <Alert className="border-yellow-500/50 bg-yellow-50/10">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-sm">
              <strong>Modo Demostración:</strong> No se encontraron datos en la base de datos. La aplicación está
              funcionando con datos de ejemplo para mostrar la funcionalidad.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Connection Status */}
      <ConnectionStatus />

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-6 w-6 text-primary animate-pulse-glow" />
                <h1 className="text-xl font-bold text-balance">TelcoX</h1>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex animate-fade-in">
                <Activity className="h-3 w-3 mr-1" />
                Plataforma de Autogestión
              </Badge>
              <BackendStatus />
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Wifi className={`h-4 w-4 ${isOnline ? "text-green-500" : "text-red-500"}`} />
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {isOnline ? "En línea" : "Sin conexión"}
                </span>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">{data.customer.name}</p>
                <p className="text-xs text-muted-foreground">{data.customer.plan}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center animate-bounce-subtle">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-balance">¡Hola, {data.customer.name.split(" ")[0]}!</h2>
              <p className="text-muted-foreground">Aquí tienes el resumen de tu consumo y servicios</p>
              <p className="text-xs text-muted-foreground mt-1">
                Última actualización: {lastUpdated.toLocaleTimeString("es-ES")} - Datos en tiempo real desde BD
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing || !isOnline}
              variant="outline"
              size="sm"
              className="hover:scale-105 transition-transform duration-200 bg-transparent w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Actualizando..." : "Actualizar"}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="animate-slide-up">
              <ErrorBoundary error={error} onRetry={() => setError(null)} />
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 animate-fade-in stagger-1">
            <Card className="text-center hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-primary/20">
              <CardContent className="pt-3 pb-3 px-2">
                <div className="text-lg sm:text-xl font-bold text-primary">
                  <AnimatedCounter value={data.consumption.data.percentage} />%
                </div>
                <p className="text-xs text-muted-foreground leading-tight">Datos</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-primary/20">
              <CardContent className="pt-3 pb-3 px-2">
                <div className="text-lg sm:text-xl font-bold text-primary">
                  <AnimatedCounter value={data.consumption.minutes.used} />
                </div>
                <p className="text-xs text-muted-foreground leading-tight">Minutos</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-primary/20">
              <CardContent className="pt-3 pb-3 px-2">
                <div className="text-lg sm:text-xl font-bold text-primary">
                  <AnimatedCounter value={data.billing.currentBalance} decimals={2} />€
                </div>
                <p className="text-xs text-muted-foreground leading-tight">Saldo</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-primary/20">
              <CardContent className="pt-3 pb-3 px-2">
                <div className="text-lg sm:text-xl font-bold text-primary">
                  {data.services.filter((s) => s.status === "active").length}
                </div>
                <p className="text-xs text-muted-foreground leading-tight">Servicios</p>
              </CardContent>
            </Card>
          </div>

          {/* Consumption Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <ConsumptionCard title="Datos Móviles" data={data.consumption.data} icon="data" className="stagger-1" />
            <ConsumptionCard
              title="Minutos de Llamadas"
              data={data.consumption.minutes}
              icon="minutes"
              className="stagger-2"
            />
            <ConsumptionCard title="SMS Enviados" data={data.consumption.sms} icon="sms" className="stagger-3" />
          </div>

          {/* Billing and Services */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="animate-fade-in stagger-4">
              <BillingCard 
                data={data.billing} 
                customerId={CUSTOMER_ID}
                onBalanceUpdate={handleBalanceUpdate}
              />
            </div>
            <div className="animate-fade-in stagger-5">
              <ServicesCard services={data.services} />
            </div>
          </div>

          {/* Customer Info */}
          <Card className="animate-fade-in stagger-6">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium break-all">{data.customer.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Teléfono</p>
                  <p className="font-medium">{data.customer.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Estado</p>
                  <Badge variant="default" className="bg-primary text-primary-foreground animate-pulse-glow">
                    {data.customer.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground animate-fade-in">
            <p>© 2025 TelcoX. Plataforma de autogestión de servicios de telecomunicaciones.</p>
            <p className="mt-1">Desarrollado para optimizar tu experiencia como cliente - Datos en tiempo real.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}