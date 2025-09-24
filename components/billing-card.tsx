"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Calendar, Euro, TrendingUp, AlertCircle } from "lucide-react"
import { useState } from "react"

interface BillingData {
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

interface BillingCardProps {
  data: BillingData
  className?: string
}

export function BillingCard({ data, className }: BillingCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isBalancePositive = data.currentBalance > 0
  const isBalanceLow = data.currentBalance < 10 && data.currentBalance > 0

  const daysUntilBill = Math.ceil(
    (new Date(data.nextBillDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <Card
      className={`transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 animate-fade-in ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
          <Euro className="h-4 w-4 mr-2 animate-bounce-subtle" />
          Estado de Cuenta
        </CardTitle>
        {isBalanceLow && <AlertCircle className="h-4 w-4 text-yellow-500 animate-pulse" />}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Saldo actual</p>
              <p
                className={`text-2xl font-bold transition-colors duration-300 ${
                  isBalancePositive ? "text-primary animate-glow-pulse" : "text-destructive"
                }`}
              >
                {data.currentBalance.toFixed(2)} {data.currency}
              </p>
              {isBalanceLow && (
                <p className="text-xs text-yellow-600 mt-1 animate-fade-in">Saldo bajo - considera recargar</p>
              )}
            </div>
            <Badge
              variant={isBalancePositive ? "default" : "destructive"}
              className={`transition-all duration-300 ${
                isBalancePositive ? "bg-primary text-primary-foreground animate-pulse-glow" : "animate-pulse"
              }`}
            >
              {isBalancePositive ? "Crédito" : "Pendiente"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Próxima factura
              </p>
              <p className="text-sm font-medium">{new Date(data.nextBillDate).toLocaleDateString("es-ES")}</p>
              <p className="text-xs text-muted-foreground">
                {daysUntilBill > 0 ? `En ${daysUntilBill} días` : "Vencida"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Cuota mensual
              </p>
              <p className="text-sm font-medium">
                {data.monthlyFee.toFixed(2)} {data.currency}
              </p>
              <p className="text-xs text-muted-foreground">Fijo mensual</p>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
              <CreditCard className="h-3 w-3" />
              Último pago
            </p>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">
                {data.lastPayment.amount.toFixed(2)} {data.currency}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(data.lastPayment.date).toLocaleDateString("es-ES")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{data.lastPayment.method}</p>
          </div>

          {/* Action buttons with hover effect */}
          <div
            className={`transition-all duration-300 ${isHovered ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"}`}
          >
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs hover:scale-105 transition-transform bg-transparent"
              >
                <CreditCard className="h-3 w-3 mr-1" />
                Recargar
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 text-xs hover:scale-105 transition-transform">
                Ver historial
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
