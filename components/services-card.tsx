"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Wifi, Phone, MessageSquare, Globe, MoreVertical, Power } from "lucide-react"
import { useState } from "react"

interface Service {
  id: string
  name: string
  status: string
  description: string
}

interface ServicesCardProps {
  services: Service[]
  className?: string
}

const serviceIcons = {
  data: Wifi,
  calls: Phone,
  sms: MessageSquare,
  roaming: Globe,
}

export function ServicesCard({ services, className }: ServicesCardProps) {
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  const getServiceIcon = (serviceId: string) => {
    const Icon = serviceIcons[serviceId as keyof typeof serviceIcons] || Settings
    return <Icon className="h-4 w-4" />
  }

  const activeServices = services.filter((s) => s.status === "active").length
  const totalServices = services.length

  return (
    <Card
      className={`transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 animate-fade-in ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
          <Settings className="h-4 w-4 mr-2 animate-bounce-subtle" />
          Servicios Contratados
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          {activeServices}/{totalServices} activos
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`flex items-center justify-between p-3 rounded-lg bg-muted/50 transition-all duration-300 hover:bg-muted/80 hover:scale-102 animate-fade-in stagger-${index + 1}`}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`text-primary transition-transform duration-200 ${
                    hoveredService === service.id ? "scale-110" : ""
                  }`}
                >
                  {getServiceIcon(service.id)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{service.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={service.status === "active" ? "default" : "secondary"}
                  className={`transition-all duration-300 ${
                    service.status === "active" ? "bg-primary text-primary-foreground animate-pulse-glow" : ""
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-1 ${
                      service.status === "active" ? "bg-green-400" : "bg-gray-400"
                    }`}
                  />
                  {service.status === "active" ? "Activo" : "Inactivo"}
                </Badge>

                {/* Action buttons appear on hover */}
                <div
                  className={`flex items-center space-x-1 transition-all duration-200 ${
                    hoveredService === service.id ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:scale-110 transition-transform">
                    <Power className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:scale-110 transition-transform">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Add service button */}
          <div className="pt-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="w-full hover:scale-105 transition-transform duration-200 bg-transparent"
            >
              <Settings className="h-4 w-4 mr-2" />
              Gestionar Servicios
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
