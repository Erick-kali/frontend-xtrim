"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings, Wifi, Phone, MessageSquare, Globe, Power, X } from "lucide-react"
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
  onServiceToggle?: (serviceId: string, newStatus: string) => void
}

const serviceIcons = {
  data: Wifi,
  calls: Phone,
  sms: MessageSquare,
  roaming: Globe,
}

export function ServicesCard({ services, className, onServiceToggle }: ServicesCardProps) {
  const [hoveredService, setHoveredService] = useState<string | null>(null)
  const [localServices, setLocalServices] = useState(services)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getServiceIcon = (serviceId: string) => {
    const Icon = serviceIcons[serviceId as keyof typeof serviceIcons] || Settings
    return <Icon className="h-4 w-4" />
  }

  const activeServices = localServices.filter((s) => s.status === "active").length
  const totalServices = localServices.length

  const handleToggleService = (serviceId: string) => {
    const updatedServices = localServices.map(service => {
      if (service.id === serviceId) {
        const newStatus = service.status === "active" ? "inactive" : "active"
        // Llama la función callback si está disponible
        onServiceToggle?.(serviceId, newStatus)
        return { ...service, status: newStatus }
      }
      return service
    })
    setLocalServices(updatedServices)
  }

  return (
    <>
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
            {localServices.map((service, index) => (
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

                  {/* Action button appears on hover */}
                  <div
                    className={`flex items-center transition-all duration-200 ${
                      hoveredService === service.id ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:scale-110 transition-transform"
                      onClick={() => handleToggleService(service.id)}
                      title={service.status === "active" ? "Desactivar servicio" : "Activar servicio"}
                    >
                      <Power className={`h-3 w-3 ${service.status === "active" ? "text-red-500" : "text-green-500"}`} />
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
                onClick={() => setIsModalOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Gestionar Servicios
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Gestión de Servicios */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-background border border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary" />
              Gestionar Servicios
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Administra tus servicios contratados. Puedes activar o desactivar servicios según tus necesidades.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {localServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-all duration-200"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="text-primary">
                    {getServiceIcon(service.id)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground">{service.name}</h4>
                    <p className="text-xs text-muted-foreground">{service.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={service.status === "active" ? "default" : "secondary"}
                    className={`${
                      service.status === "active" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-1 ${
                        service.status === "active" ? "bg-green-400" : "bg-gray-400"
                      }`}
                    />
                    {service.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                  
                  <Button
                    variant={service.status === "active" ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleToggleService(service.id)}
                    className="min-w-[80px] transition-all duration-200 hover:scale-105"
                  >
                    {service.status === "active" ? (
                      <>
                        <Power className="h-3 w-3 mr-1" />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <Power className="h-3 w-3 mr-1" />
                        Activar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">{activeServices}</span> de {totalServices} servicios activos
            </div>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="hover:scale-105 transition-transform duration-200"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}