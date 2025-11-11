"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/utils"
import { DoseForm } from "@/components/dose-form"

export default function DosesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Placeholder data - will be replaced with real API call
  const doses = []

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dose Logs</h1>
            <p className="text-muted-foreground">Track your injections and compounds</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
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
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Injections logged</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Compounds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
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
            {doses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Plus className="h-6 w-6 text-muted-foreground" />
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
              <div className="space-y-4">
                {/* Table will go here */}
                <p className="text-sm text-muted-foreground">Doses table coming soon...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dose Form Dialog */}
      <DoseForm open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </>
  )
}
