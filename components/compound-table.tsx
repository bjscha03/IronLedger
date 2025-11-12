"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { MoreHorizontal, Pencil, Trash2, Archive, ArchiveRestore } from "lucide-react"
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

interface CompoundTableProps {
  compounds: any[]
  onEdit: (compound: any) => void
}

export function CompoundTable({ compounds, onEdit }: CompoundTableProps) {
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [compoundToDelete, setCompoundToDelete] = useState<any>(null)

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/compounds/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to delete compound")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compounds"] })
      toast.success("Compound deleted successfully!")
      setDeleteDialogOpen(false)
      setCompoundToDelete(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete compound")
    },
  })

  // Archive/Unarchive mutation
  const archiveMutation = useMutation({
    mutationFn: async ({ id, isArchived }: { id: string; isArchived: boolean }) => {
      const res = await fetch(`/api/compounds/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: !isArchived }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to update compound")
      }
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["compounds"] })
      toast.success(`Compound ${variables.isArchived ? "unarchived" : "archived"} successfully!`)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update compound")
    },
  })

  const handleDelete = (compound: any) => {
    setCompoundToDelete(compound)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (compoundToDelete) {
      deleteMutation.mutate(compoundToDelete.id)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "TRT":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "ANABOLIC":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "ANCILLARY":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "TRT":
        return "TRT"
      case "ANABOLIC":
        return "Anabolic"
      case "ANCILLARY":
        return "Ancillary"
      default:
        return "Other"
    }
  }

  if (compounds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground mb-2">No compounds found</p>
        <p className="text-sm text-muted-foreground">Add your first compound to get started</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {compounds.map((compound) => (
              <TableRow key={compound.id}>
                <TableCell className="font-medium">{compound.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getCategoryColor(compound.category)}>
                    {getCategoryLabel(compound.category)}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-md truncate">
                  {compound.notes || <span className="text-muted-foreground">—</span>}
                </TableCell>
                <TableCell>
                  {compound.isArchived ? (
                    <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
                      Archived
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500">
                      Active
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(compound)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          archiveMutation.mutate({
                            id: compound.id,
                            isArchived: compound.isArchived,
                          })
                        }
                      >
                        {compound.isArchived ? (
                          <>
                            <ArchiveRestore className="mr-2 h-4 w-4" />
                            Unarchive
                          </>
                        ) : (
                          <>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(compound)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{compoundToDelete?.name}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
