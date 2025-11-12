"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { formatDateTime } from "@/lib/utils"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface Dose {
  id: string
  dateTime: string
  doseMg: number
  route: string
  site?: string
  mood?: number
  energy?: number
  libido?: number
  notes?: string
  compound: {
    id: string
    name: string
    category: string
  }
}

interface DoseTableProps {
  doses: Dose[]
}

export function DoseTable({ doses }: DoseTableProps) {
  const queryClient = useQueryClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/doses/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to delete dose")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doses"] })
      toast.success("Dose deleted successfully")
      setDeletingId(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete dose")
      setDeletingId(null)
    },
  })

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this dose?")) {
      setDeletingId(id)
      deleteMutation.mutate(id)
    }
  }

  const getRouteLabel = (route: string) => {
    const labels: Record<string, string> = {
      IM: "IM",
      SUBQ: "SubQ",
      ORAL: "Oral",
      TRANSDERMAL: "Transdermal",
      OTHER: "Other",
    }
    return labels[route] || route
  }

  const getSiteLabel = (site?: string) => {
    if (!site) return "-"
    const labels: Record<string, string> = {
      GLUTE: "Glute",
      QUAD: "Quad",
      DELT: "Delt",
      VG: "VG",
      LAT: "Lat",
      PECT: "Pect",
      AB: "Ab",
      OTHER: "Other",
    }
    return labels[site] || site
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      TRT: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      ANABOLIC: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      ANCILLARY: "bg-green-500/10 text-green-500 border-green-500/20",
      OTHER: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    }
    return colors[category] || colors.OTHER
  }

  if (doses.length === 0) {
    return null
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Compound</TableHead>
            <TableHead>Dose</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Site</TableHead>
            <TableHead className="text-center">Mood</TableHead>
            <TableHead className="text-center">Energy</TableHead>
            <TableHead className="text-center">Libido</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doses.map((dose) => (
            <TableRow key={dose.id}>
              <TableCell className="font-medium">
                {formatDateTime(new Date(dose.dateTime))}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{dose.compound.name}</span>
                  <Badge
                    variant="outline"
                    className={`w-fit text-xs ${getCategoryColor(dose.compound.category)}`}
                  >
                    {dose.compound.category}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{dose.doseMg} mg</TableCell>
              <TableCell>
                <Badge variant="outline">{getRouteLabel(dose.route)}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getSiteLabel(dose.site)}
              </TableCell>
              <TableCell className="text-center">
                {dose.mood ? (
                  <span className="font-medium">{dose.mood}/10</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                {dose.energy ? (
                  <span className="font-medium">{dose.energy}/10</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                {dose.libido ? (
                  <span className="font-medium">{dose.libido}/10</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      disabled={deletingId === dose.id}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleDelete(dose.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
