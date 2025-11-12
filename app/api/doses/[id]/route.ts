import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateDoseSchema = z.object({
  compoundId: z.string().min(1).optional(),
  dateTime: z.string().datetime().optional(),
  doseMg: z.number().positive().optional(),
  route: z.enum(["IM", "SUBQ", "ORAL", "TRANSDERMAL", "OTHER"]).optional(),
  site: z.enum(["GLUTE", "QUAD", "DELT", "VG", "LAT", "PECT", "AB", "OTHER"]).optional(),
  mood: z.number().min(1).max(10).optional(),
  energy: z.number().min(1).max(10).optional(),
  libido: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dose = await prisma.doseLog.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        compound: true,
      },
    })

    if (!dose) {
      return NextResponse.json({ error: "Dose not found" }, { status: 404 })
    }

    return NextResponse.json(dose)
  } catch (error) {
    console.error("Error fetching dose:", error)
    return NextResponse.json({ error: "Failed to fetch dose" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateDoseSchema.parse(body)

    const existingDose = await prisma.doseLog.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingDose) {
      return NextResponse.json({ error: "Dose not found" }, { status: 404 })
    }

    const updateData: any = { ...validatedData }
    if (validatedData.dateTime) {
      updateData.dateTime = new Date(validatedData.dateTime)
    }

    const dose = await prisma.doseLog.update({
      where: { id: params.id },
      data: updateData,
      include: {
        compound: true,
      },
    })

    return NextResponse.json(dose)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error updating dose:", error)
    return NextResponse.json({ error: "Failed to update dose" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existingDose = await prisma.doseLog.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingDose) {
      return NextResponse.json({ error: "Dose not found" }, { status: 404 })
    }

    await prisma.doseLog.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting dose:", error)
    return NextResponse.json({ error: "Failed to delete dose" }, { status: 500 })
  }
}
