import { NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createDoseSchema = z.object({
  compoundId: z.string().min(1, "Compound is required"),
  dateTime: z.string().datetime(),
  doseMg: z.number().positive("Dose must be positive"),
  route: z.enum(["IM", "SUBQ", "ORAL", "TRANSDERMAL", "OTHER"]),
  site: z.enum(["GLUTE", "QUAD", "DELT", "VG", "LAT", "PECT", "AB", "OTHER"]).optional(),
  mood: z.number().min(1).max(10).optional(),
  energy: z.number().min(1).max(10).optional(),
  libido: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")
    const compoundId = searchParams.get("compoundId")

    const where: any = { userId }
    if (compoundId) {
      where.compoundId = compoundId
    }

    const [doses, total] = await Promise.all([
      prisma.doseLog.findMany({
        where,
        include: {
          compound: true,
        },
        orderBy: {
          dateTime: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.doseLog.count({ where }),
    ])

    return NextResponse.json({ doses, total })
  } catch (error) {
    console.error("Error fetching doses:", error)
    return NextResponse.json({ error: "Failed to fetch doses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createDoseSchema.parse(body)

    const dose = await prisma.doseLog.create({
      data: {
        ...validatedData,
        dateTime: new Date(validatedData.dateTime),
        userId,
      },
      include: {
        compound: true,
      },
    })

    return NextResponse.json(dose, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating dose:", error)
    return NextResponse.json({ error: "Failed to create dose" }, { status: 500 })
  }
}
