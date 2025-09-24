"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { checkBackendHealth } from "@/lib/api"
import { Server, Wifi, WifiOff } from "lucide-react"

export function BackendStatus() {
  const [status, setStatus] = useState<{
    django: boolean
    nextjs: boolean
    message: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const health = await checkBackendHealth()
        setStatus(health)
      } catch (error) {
        setStatus({
          django: false,
          nextjs: false,
          message: "Error de conectividad",
        })
      } finally {
        setLoading(false)
      }
    }

    checkStatus()

    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Badge variant="secondary" className="animate-pulse">
        <Server className="h-3 w-3 mr-1" />
        Verificando...
      </Badge>
    )
  }

  if (!status) return null

  const getStatusColor = () => {
    if (status.django) return "bg-green-500 text-white"
    if (status.nextjs) return "bg-yellow-500 text-white"
    return "bg-red-500 text-white"
  }

  const getIcon = () => {
    if (status.django || status.nextjs) {
      return <Wifi className="h-3 w-3 mr-1" />
    }
    return <WifiOff className="h-3 w-3 mr-1" />
  }

  return (
    <Badge className={`${getStatusColor()} animate-fade-in`}>
      {getIcon()}
      {status.message}
    </Badge>
  )
}
