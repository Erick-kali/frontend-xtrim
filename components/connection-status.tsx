"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { WifiOff } from "lucide-react"

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-slide-up">
      <Badge variant="destructive" className="flex items-center space-x-2 px-3 py-2">
        <WifiOff className="h-4 w-4" />
        <span>Sin conexión</span>
      </Badge>
    </div>
  )
}
