"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Syringe, FlaskConical, Dumbbell, Apple } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Doses",
      value: "0",
      description: "Injections logged",
      icon: Syringe,
      color: "text-blue-600",
    },
    {
      title: "Lab Panels",
      value: "0",
      description: "Blood work results",
      icon: FlaskConical,
      color: "text-purple-600",
    },
    {
      title: "Workouts",
      value: "0",
      description: "Training sessions",
      icon: Dumbbell,
      color: "text-green-600",
    },
    {
      title: "Meals Logged",
      value: "0",
      description: "Nutrition entries",
      icon: Apple,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, Demo User!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your performance tracking
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest tracking entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <Activity className="h-8 w-8 mr-2" />
              <p>No recent activity</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • Log a dose
            </p>
            <p className="text-sm text-muted-foreground">
              • Add lab results
            </p>
            <p className="text-sm text-muted-foreground">
              • Record workout
            </p>
            <p className="text-sm text-muted-foreground">
              • Track nutrition
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
