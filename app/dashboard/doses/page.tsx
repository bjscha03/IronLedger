"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus, Filter, Download, Syringe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DoseForm } from "@/components/dose-form"
import { DoseTable } from "@/components/dose-table"

export default function DosesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Fetch doses
  const { data: dosesData, isLoading } = useQuery({
    queryKey: ["doses"],
    queryFn: async () => {
      const res = await fetch("/api/doses")
      if (!res.ok) throw new Error("Failed to fetch doses")
      return res.json()
    },
  })

  const doses = dosesData?.doses || []
  const total = dosesData?.total || 0

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const thisWeek = doses.filter((dose: any) => 
      new Date(dose.dateTime) >= oneWeekAgo
    ).length

    const uniqueCompounds = new Set(doses.map((dose: any) => dose.compoundId)).size

    return {
      total,
      thisWeek,
      activeCompounds: uniqueCompounds,
    }
  }, [doses, total])

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dose Logs</h1>
            <p className="text-muted-foreground">Track your injections and compounds</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Log Dose
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Doses</CardTitle>
              <Syringe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Syringe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisWeek}</div>
              <p className="text-xs text-muted-foreground">Injections logged</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Compounds</CardTitle>
              <Syringe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCompounds}</div>
              <p className="text-xs text-muted-foreground">In rotation</p>
            </CardContent>
          </Card>
        </div>

        {/* Doses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Doses</CardTitle>
            <CardDescription>Your injection history</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-sm text-muted-foreground">Loading doses...</div>
              </div>
            ) : doses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Syringe className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No doses logged yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start tracking your injections by logging your first dose
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Your First Dose
                </Button>
              </div>
            ) : (
              <DoseTable doses={doses} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dose Form Dialog */}
      <DoseForm open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </>
  )
}
