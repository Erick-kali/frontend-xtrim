"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Phone, MessageSquare, TrendingUp, TrendingDown } from "lucide-react"
import { useState, useEffect } from "react"

interface ConsumptionItem {
  used: number
  total: number
  unit: string
  percentage: number
  resetDate: string
}

interface ConsumptionCardProps {
  title: string
  data: ConsumptionItem
  icon: "data" | "minutes" | "sms"
  className?: string
}

const iconMap = {
  data: Smartphone,
  minutes: Phone,
  sms: MessageSquare,
}

export function ConsumptionCard({ title, data, icon, className }: ConsumptionCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [previousPercentage, setPreviousPercentage] = useState(data.percentage)
  const [trend, setTrend] = useState<"up" | "down" | "stable">("stable")

  useEffect(() => {
    setIsVisible(true)

    if (data.percentage > previousPercentage) {
      setTrend("up")
    } else if (data.percentage < previousPercentage) {
      setTrend("down")
    } else {
      setTrend("stable")
    }

    setPreviousPercentage(data.percentage)
  }, [data.percentage, previousPercentage])

  const Icon = iconMap[icon]
  const isLowUsage = data.percentage < 25
  const isMediumUsage = data.percentage >= 25 && data.percentage < 75
  const isHighUsage = data.percentage >= 75

  const getProgressColor = () => {
    if (isHighUsage) return "bg-destructive"
    if (isMediumUsage) return "bg-yellow-500"
    return "bg-primary"
  }

  const getStatusBadge = () => {
    if (isHighUsage)
      return (
        <Badge variant="destructive" className="animate-pulse-glow">
          Alto uso
        </Badge>
      )
    if (isMediumUsage) return <Badge variant="secondary">Uso moderado</Badge>
    return (
      <Badge variant="default" className="bg-primary text-primary-foreground">
        Uso bajo
      </Badge>
    )
  }

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-3 w-3 text-destructive" />
    if (trend === "down") return <TrendingDown className="h-3 w-3 text-primary" />
    return null
  }

  return (
    <Card
      className={`transition-all duration-500 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 ${
        isVisible ? "animate-fade-in" : "opacity-0"
      } ${isHighUsage ? "animate-pulse-glow" : ""} ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          <Icon className="h-4 w-4 text-primary animate-bounce-subtle" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-foreground animate-scale-in">{data.used}</span>
            <span className="text-sm text-muted-foreground">
              / {data.total} {data.unit}
            </span>
          </div>

          <div className="relative">
            <Progress
              value={data.percentage}
              className="h-2 transition-all duration-1000"
              indicatorClassName={`${getProgressColor()} transition-all duration-1000`}
            />
            <div
              className="absolute top-0 left-0 h-2 bg-white/20 rounded-full transition-all duration-1000 animate-shimmer shimmer-bg"
              style={{ width: `${data.percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{data.percentage}% utilizado</span>
            {getStatusBadge()}
          </div>

          <div className="text-xs text-muted-foreground">
            Se renueva el {new Date(data.resetDate).toLocaleDateString("es-ES")}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
