"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Calendar, Euro, TrendingUp, AlertCircle, Plus, History, ArrowUpRight, ArrowDownRight, Check } from "lucide-react"
import { useState } from "react"

// Configuración de API - misma que usas en tu archivo de API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"
const CUSTOMER_ID = process.env.NEXT_PUBLIC_CUSTOMER_ID || "CUST001"

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

interface HistoryItem {
  id: string
  type: 'payment' | 'charge' | 'recharge'
  amount: number
  date: string
  description: string
  method?: string
}

interface BillingCardProps {
  data: BillingData
  customerId?: string
  className?: string
  onBalanceUpdate?: (newBalance: number) => void
}

export function BillingCard({ data: initialData, customerId = CUSTOMER_ID, className, onBalanceUpdate }: BillingCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [data, setData] = useState(initialData)
  const [rechargeAmount, setRechargeAmount] = useState("")
  const [isRechargeOpen, setIsRechargeOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("Tarjeta de crédito")
  
  // Historial simulado
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "1",
      type: "recharge",
      amount: 50.00,
      date: "2024-09-20",
      description: "Recarga manual",
      method: "Tarjeta de crédito"
    },
    {
      id: "2",
      type: "charge",
      amount: -25.50,
      date: "2024-09-15",
      description: "Cuota mensual septiembre",
      method: "Débito automático"
    },
    {
      id: "3",
      type: "recharge",
      amount: 100.00,
      date: "2024-09-01",
      description: "Recarga automática",
      method: "Transferencia bancaria"
    },
    {
      id: "4",
      type: "charge",
      amount: -25.50,
      date: "2024-08-15",
      description: "Cuota mensual agosto",
      method: "Débito automático"
    },
    {
      id: "5",
      type: "payment",
      amount: 75.00,
      date: "2024-08-10",
      description: "Pago manual",
      method: "Tarjeta de débito"
    }
  ])

  const isBalancePositive = data.currentBalance > 0
  const isBalanceLow = data.currentBalance < 10 && data.currentBalance > 0

  const daysUntilBill = Math.ceil(
    (new Date(data.nextBillDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  const handleRecharge = async () => {
    const amount = parseFloat(rechargeAmount)
    if (isNaN(amount) || amount <= 0) {
      alert("Por favor ingresa un monto válido")
      return
    }

    setIsProcessing(true)
    
    try {
      console.log('🔄 Enviando recarga a:', `${API_BASE_URL}/customer/recharge`)
      console.log('📤 Datos:', {
        customer_id: customerId,
        amount: amount,
        method: paymentMethod
      })

      // Llamada real al backend usando la misma configuración que tu API
      const response = await fetch(`${API_BASE_URL}/customer/recharge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          amount: amount,
          method: paymentMethod
        })
      })

      console.log('📥 Respuesta del servidor:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Error response:', errorText)
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log('✅ Resultado exitoso:', result)
      
      // Actualizar balance con la respuesta del backend
      const newData = {
        ...data,
        currentBalance: result.new_balance,
        lastPayment: {
          amount: result.amount_added,
          date: result.timestamp.split('T')[0],
          method: result.payment_method
        }
      }
      
      setData(newData)

      // Notificar al componente padre si existe callback
      if (onBalanceUpdate) {
        onBalanceUpdate(result.new_balance)
      }

      // Agregar al historial
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        type: "recharge",
        amount: amount,
        date: result.timestamp.split('T')[0],
        description: "Recarga manual",
        method: result.payment_method
      }
      setHistory(prev => [newHistoryItem, ...prev])

      alert(`✅ Recarga exitosa! Nuevo saldo: ${result.new_balance.toFixed(2)} ${result.currency}`)

    } catch (error) {
      console.error('❌ Error completo:', error)
      alert(`Error al procesar la recarga: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsProcessing(false)
      setRechargeAmount("")
      setIsRechargeOpen(false)
    }
  }

  const loadPaymentHistory = async () => {
    try {
      console.log('🔄 Cargando historial desde:', `${API_BASE_URL}/customer/${customerId}/payment-history`)
      
      const response = await fetch(`${API_BASE_URL}/customer/${customerId}/payment-history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Historial cargado:', result)
        
        const formattedHistory = result.payments.map((payment: any) => ({
          id: payment.id,
          type: payment.type,
          amount: payment.amount,
          date: payment.date,
          description: payment.description,
          method: payment.method
        }))
        setHistory(formattedHistory)
      } else {
        console.warn('⚠️ No se pudo cargar el historial:', response.status)
      }
    } catch (error) {
      console.error('❌ Error loading payment history:', error)
    }
  }

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'recharge':
      case 'payment':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case 'charge':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const getHistoryTypeText = (type: string) => {
    switch (type) {
      case 'recharge': return 'Recarga'
      case 'payment': return 'Pago'
      case 'charge': return 'Cargo'
      default: return 'Transacción'
    }
  }

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
              {/* Modal de Recarga */}
              <Dialog open={isRechargeOpen} onOpenChange={setIsRechargeOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs hover:scale-105 transition-transform bg-transparent"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Recargar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-primary">
                      <Plus className="h-5 w-5" />
                      Recargar Saldo
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Saldo actual:</span>
                        <span className="font-bold text-primary">{data.currentBalance.toFixed(2)} {data.currency}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Cliente ID: {customerId}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recharge-amount">Monto a recargar</Label>
                      <div className="relative">
                        <Input
                          id="recharge-amount"
                          type="number"
                          placeholder="0.00"
                          value={rechargeAmount}
                          onChange={(e) => setRechargeAmount(e.target.value)}
                          className="pr-12"
                          disabled={isProcessing}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          {data.currency}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-method">Método de pago</Label>
                      <select
                        id="payment-method"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={isProcessing}
                        className="w-full p-2 border rounded-md bg-background"
                      >
                        <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                        <option value="Tarjeta de débito">Tarjeta de débito</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Transferencia bancaria">Transferencia bancaria</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[10, 25, 50].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => setRechargeAmount(amount.toString())}
                          disabled={isProcessing}
                          className="text-xs"
                        >
                          +{amount} {data.currency}
                        </Button>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setIsRechargeOpen(false)}
                        disabled={isProcessing}
                      >
                        Cancelar
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handleRecharge}
                        disabled={isProcessing || !rechargeAmount || parseFloat(rechargeAmount) <= 0}
                      >
                        {isProcessing ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                            Procesando...
                          </div>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Recargar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Modal de Historial */}
              <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 text-xs hover:scale-105 transition-transform"
                    onClick={loadPaymentHistory}
                  >
                    <History className="h-3 w-3 mr-1" />
                    Ver historial
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[600px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-primary">
                      <History className="h-5 w-5" />
                      Historial de Transacciones
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Saldo actual:</span>
                        <span className="font-bold text-primary text-lg">
                          {data.currentBalance.toFixed(2)} {data.currency}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {history.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {getHistoryIcon(item.type)}
                            <div>
                              <p className="font-medium text-sm">{item.description}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{getHistoryTypeText(item.type)}</span>
                                {item.method && (
                                  <>
                                    <span>•</span>
                                    <span>{item.method}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              item.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {item.amount > 0 ? '+' : ''}{item.amount.toFixed(2)} {data.currency}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.date).toLocaleDateString("es-ES")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setIsHistoryOpen(false)}
                      >
                        Cerrar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente de demostración
export default function BillingCardDemo() {
  const [currentBalance, setCurrentBalance] = useState(45.30)
  
  const sampleData = {
    currentBalance: currentBalance,
    currency: "EUR",
    nextBillDate: "2024-10-15",
    monthlyFee: 25.50,
    lastPayment: {
      amount: 50.00,
      date: "2024-09-20",
      method: "Tarjeta de crédito"
    }
  }

  const handleBalanceUpdate = (newBalance: number) => {
    setCurrentBalance(newBalance)
  }

  return (
    <div className="p-8 bg-background">
      <div className="max-w-md mx-auto">
        <BillingCard 
          data={sampleData} 
          customerId="CUST001"
          onBalanceUpdate={handleBalanceUpdate}
        />
      </div>
    </div>
  )
}