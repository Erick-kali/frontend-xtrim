"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Info, X } from "lucide-react"

interface NotificationToastProps {
  message: string
  type: "success" | "error" | "info"
  duration?: number
  onClose?: () => void
}

export function NotificationToast({ message, type, duration = 4000, onClose }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onClose?.(), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "border-green-500/50 bg-green-50/10"
      case "error":
        return "border-red-500/50 bg-red-50/10"
      case "info":
        return "border-blue-500/50 bg-blue-50/10"
      default:
        return "border-muted bg-muted/10"
    }
  }

  const getProgressColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      case "info":
        return "bg-blue-500"
      default:
        return "bg-muted-foreground"
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed top-24 right-4 z-50 transition-all duration-300 ${
        isExiting ? "animate-slide-out-right opacity-0" : "animate-slide-in-right"
      }`}
    >
      <Card
        className={`${getBorderColor()} shadow-lg max-w-sm backdrop-blur-sm border-2 hover:scale-105 transition-transform duration-200`}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between space-x-3">
            <div className="flex items-start space-x-2 flex-1">
              <div className="mt-0.5">{getIcon()}</div>
              <div className="flex-1">
                <p className="text-sm font-medium leading-relaxed">{message}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsExiting(true)
                setTimeout(() => onClose?.(), 300)
              }}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-sm"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressColor()} rounded-full animate-progress-bar`}
              style={{
                animation: `progressBar ${duration}ms linear forwards`,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
