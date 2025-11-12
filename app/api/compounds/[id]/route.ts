import { NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateCompoundSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(["TRT", "ANABOLIC", "ANCILLARY", "OTHER"]).optional(),
  notes: z.string().optional(),
  isArchived: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const compound = await prisma.compound.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!compound) {
      return NextResponse.json({ error: "Compound not found" }, { status: 404 })
    }

    return NextResponse.json(compound)
  } catch (error) {
    console.error("Error fetching compound:", error)
    return NextResponse.json({ error: "Failed to fetch compound" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateCompoundSchema.parse(body)

    const existingCompound = await prisma.compound.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!existingCompound) {
      return NextResponse.json({ error: "Compound not found" }, { status: 404 })
    }

    const compound = await prisma.compound.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(compound)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error updating compound:", error)
    return NextResponse.json({ error: "Failed to update compound" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existingCompound = await prisma.compound.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!existingCompound) {
      return NextResponse.json({ error: "Compound not found" }, { status: 404 })
    }

    await prisma.compound.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting compound:", error)
    return NextResponse.json({ error: "Failed to delete compound" }, { status: 500 })
  }
}
