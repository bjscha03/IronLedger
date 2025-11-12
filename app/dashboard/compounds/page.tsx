"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CompoundForm } from "@/components/compound-form"
import { CompoundTable } from "@/components/compound-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CompoundsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCompound, setEditingCompound] = useState<any>(null)

  // Fetch compounds
  const { data, isLoading, error } = useQuery({
    queryKey: ["compounds"],
    queryFn: async () => {
      const res = await fetch("/api/compounds")
      if (!res.ok) throw new Error("Failed to fetch compounds")
      return res.json()
    },
  })

  const compounds = data?.compounds || []
  const activeCompounds = compounds.filter((c: any) => !c.isArchived)
  const archivedCompounds = compounds.filter((c: any) => c.isArchived)

  const handleEdit = (compound: any) => {
    setEditingCompound(compound)
  }

  const handleCloseEdit = () => {
    setEditingCompound(null)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Compounds</h1>
            <p className="text-muted-foreground">Manage your compound library</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Compound
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Compounds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{compounds.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCompounds.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Archived</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{archivedCompounds.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading compounds...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Failed to load compounds</p>
          </div>
        )}

        {/* Active Compounds Table */}
        {!isLoading && !error && activeCompounds.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Active Compounds</h2>
            <CompoundTable compounds={activeCompounds} onEdit={handleEdit} />
          </div>
        )}

        {/* Archived Compounds Table */}
        {!isLoading && !error && archivedCompounds.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Archived Compounds</h2>
            <CompoundTable compounds={archivedCompounds} onEdit={handleEdit} />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && compounds.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No compounds yet</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Compound
            </Button>
          </div>
        )}
      </div>

      {/* Add Compound Dialog */}
      <CompoundForm open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      {/* Edit Compound Dialog */}
      <CompoundForm
        open={!!editingCompound}
        onOpenChange={(open) => !open && handleCloseEdit()}
        compound={editingCompound}
      />
    </>
  )
}
