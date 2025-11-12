import { NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createCompoundSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["TRT", "ANABOLIC", "ANCILLARY", "OTHER"]),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeArchived = searchParams.get("includeArchived") === "true"

    const where: any = { userId }
    if (!includeArchived) {
      where.isArchived = false
    }

    const compounds = await prisma.compound.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json({ compounds })
  } catch (error) {
    console.error("Error fetching compounds:", error)
    return NextResponse.json({ error: "Failed to fetch compounds" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createCompoundSchema.parse(body)

    const compound = await prisma.compound.create({
      data: {
        ...validatedData,
        userId,
      },
    })

    return NextResponse.json(compound, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating compound:", error)
    return NextResponse.json({ error: "Failed to create compound" }, { status: 500 })
  }
}
