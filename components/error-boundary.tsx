"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, RefreshCw, Wifi, Server, Database } from "lucide-react"

interface ErrorBoundaryProps {
  error: string
  onRetry?: () => void
  className?: string
}

export function ErrorBoundary({ error, onRetry, className }: ErrorBoundaryProps) {
  const getErrorType = () => {
    if (error.includes("fetch") || error.includes("network") || error.includes("conexión")) {
      return {
        icon: Wifi,
        title: "Error de Conexión",
        description: "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
        color: "text-orange-500",
      }
    }
    if (error.includes("Backend") || error.includes("Django") || error.includes("500")) {
      return {
        icon: Server,
        title: "Error del Servidor",
        description: "El servidor backend no está disponible. Usando datos de demostración.",
        color: "text-red-500",
      }
    }
    if (error.includes("timeout") || error.includes("AbortError")) {
      return {
        icon: Database,
        title: "Tiempo de Espera Agotado",
        description: "La conexión tardó demasiado en responder. Inténtalo de nuevo.",
        color: "text-yellow-500",
      }
    }
    return {
      icon: AlertTriangle,
      title: "Error Desconocido",
      description: "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.",
      color: "text-destructive",
    }
  }

  const errorInfo = getErrorType()
  const Icon = errorInfo.icon

  return (
    <Card
      className={`border-destructive/50 animate-fade-in hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <Icon className={`h-5 w-5 mr-2 ${errorInfo.color}`} />
        <CardTitle className={errorInfo.color}>{errorInfo.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{errorInfo.description}</p>
          <Badge variant="outline" className="text-xs">
            {error}
          </Badge>
          <p className="text-xs text-muted-foreground">
            La aplicación continuará funcionando con datos de demostración.
          </p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="w-full bg-transparent hover:scale-105 transition-transform duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar Conexión
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
