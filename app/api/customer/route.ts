import { NextResponse } from "next/server"
import customerData from "@/data/customer-data.json"

export async function GET() {
  try {
    console.log("[v0] Next.js API: Processing GET request for customer data")

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simulate occasional errors (3% chance - reduced from 5%)
    if (Math.random() < 0.03) {
      console.log("[v0] Next.js API: Simulating BSS connection error")
      return NextResponse.json(
        {
          error: "Error de conexión con el sistema BSS. Usando datos de demostración.",
        },
        { status: 503 },
      )
    }

    console.log("[v0] Next.js API: Successfully returning customer data")
    return NextResponse.json(customerData)
  } catch (error) {
    console.error("[v0] Next.js API: Internal server error:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor. Usando datos de respaldo.",
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    console.log("[v0] Next.js API: Processing POST request for consumption refresh")

    // Simulate consumption refresh
    await new Promise((resolve) => setTimeout(resolve, 300))

    const baseData = customerData.consumption
    const updatedData = {
      ...baseData,
      data: {
        ...baseData.data,
        used: Math.round((baseData.data.used + Math.random() * 0.3) * 10) / 10,
      },
      minutes: {
        ...baseData.minutes,
        used: baseData.minutes.used + Math.floor(Math.random() * 3),
      },
      sms: {
        ...baseData.sms,
        used: baseData.sms.used + Math.floor(Math.random() * 2),
      },
    }

    // Recalculate percentages
    updatedData.data.percentage = Math.round((updatedData.data.used / updatedData.data.total) * 100)
    updatedData.minutes.percentage = Math.round((updatedData.minutes.used / updatedData.minutes.total) * 100)
    updatedData.sms.percentage = Math.round((updatedData.sms.used / updatedData.sms.total) * 100)

    console.log("[v0] Next.js API: Successfully refreshed consumption data")
    return NextResponse.json(updatedData)
  } catch (error) {
    console.error("[v0] Next.js API: Error refreshing consumption:", error)
    return NextResponse.json(
      {
        error: "Error al actualizar datos de consumo. Inténtalo de nuevo.",
      },
      { status: 500 },
    )
  }
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
