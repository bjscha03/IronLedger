"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const doseFormSchema = z.object({
  compoundId: z.string().min(1, "Compound is required"),
  dateTime: z.string().min(1, "Date and time is required"),
  doseMg: z.coerce.number().positive("Dose must be positive"),
  route: z.enum(["IM", "SUBQ", "ORAL", "TRANSDERMAL", "OTHER"]),
  site: z.enum(["GLUTE", "QUAD", "DELT", "VG", "LAT", "PECT", "AB", "OTHER"]).optional(),
  mood: z.coerce.number().min(1).max(10).optional().or(z.literal("")),
  energy: z.coerce.number().min(1).max(10).optional().or(z.literal("")),
  libido: z.coerce.number().min(1).max(10).optional().or(z.literal("")),
  notes: z.string().optional(),
})

type DoseFormData = z.infer<typeof doseFormSchema>

interface DoseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DoseForm({ open, onOpenChange, onSuccess }: DoseFormProps) {
  const queryClient = useQueryClient()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DoseFormData>({
    resolver: zodResolver(doseFormSchema),
    defaultValues: {
      dateTime: new Date().toISOString().slice(0, 16),
    },
  })

  const selectedCompound = watch("compoundId")
  const selectedRoute = watch("route")
  const selectedSite = watch("site")

  // Fetch compounds
  const { data: compoundsData, isLoading: isLoadingCompounds } = useQuery({
    queryKey: ["compounds"],
    queryFn: async () => {
      const res = await fetch("/api/compounds")
      if (!res.ok) throw new Error("Failed to fetch compounds")
      return res.json()
    },
  })

  // Create dose mutation
  const createDoseMutation = useMutation({
    mutationFn: async (data: DoseFormData) => {
      // Clean up empty optional fields
      const cleanData = {
        ...data,
        mood: data.mood === "" ? undefined : data.mood,
        energy: data.energy === "" ? undefined : data.energy,
        libido: data.libido === "" ? undefined : data.libido,
        site: data.site || undefined,
      }
      
      const res = await fetch("/api/doses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to create dose")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doses"] })
      toast.success("Dose logged successfully!")
      reset({
        dateTime: new Date().toISOString().slice(0, 16),
      })
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to log dose")
    },
  })

  const onSubmit = (data: DoseFormData) => {
    createDoseMutation.mutate(data)
  }

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset({
        dateTime: new Date().toISOString().slice(0, 16),
      })
    }
  }, [open, reset])

  const compounds = compoundsData?.compounds || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl font-semibold">Log Dose</DialogTitle>
          <DialogDescription className="text-foreground/70">
            Record your injection details. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Compound Selection */}
            <div className="grid gap-2">
              <Label htmlFor="compound" className="text-foreground font-medium">Compound *</Label>
              <Select
                value={selectedCompound}
                onValueChange={(value) => setValue("compoundId", value)}
              >
                <SelectTrigger id="compound" className="bg-background text-foreground">
                  <SelectValue placeholder={isLoadingCompounds ? "Loading..." : "Select compound"} />
                </SelectTrigger>
                <SelectContent>
                  {compounds.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No compounds found. Add one in the Compounds page first.
                    </div>
                  ) : (
                    compounds.map((compound: any) => (
                      <SelectItem key={compound.id} value={compound.id}>
                        {compound.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.compoundId && (
                <p className="text-xs text-destructive font-medium">{errors.compoundId.message}</p>
              )}
            </div>

            {/* Date/Time */}
            <div className="grid gap-2">
              <Label htmlFor="datetime" className="text-foreground font-medium">Date & Time *</Label>
              <Input
                id="datetime"
                type="datetime-local"
                className="bg-background text-foreground"
                {...register("dateTime")}
              />
              {errors.dateTime && (
                <p className="text-xs text-destructive font-medium">{errors.dateTime.message}</p>
              )}
            </div>

            {/* Dose Amount */}
            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-foreground font-medium">Dose (mg) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.1"
                placeholder="100"
                className="bg-background text-foreground"
                {...register("doseMg")}
              />
              {errors.doseMg && (
                <p className="text-xs text-destructive font-medium">{errors.doseMg.message}</p>
              )}
            </div>

            {/* Route */}
            <div className="grid gap-2">
              <Label htmlFor="route" className="text-foreground font-medium">Route *</Label>
              <Select
                value={selectedRoute}
                onValueChange={(value) => setValue("route", value as any)}
              >
                <SelectTrigger id="route" className="bg-background text-foreground">
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IM">Intramuscular (IM)</SelectItem>
                  <SelectItem value="SUBQ">Subcutaneous (SubQ)</SelectItem>
                  <SelectItem value="ORAL">Oral</SelectItem>
                  <SelectItem value="TRANSDERMAL">Transdermal</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.route && (
                <p className="text-xs text-destructive font-medium">{errors.route.message}</p>
              )}
            </div>

            {/* Injection Site - only show for IM/SUBQ */}
            {(selectedRoute === "IM" || selectedRoute === "SUBQ") && (
              <div className="grid gap-2">
                <Label htmlFor="site" className="text-foreground font-medium">Injection Site</Label>
                <Select
                  value={selectedSite}
                  onValueChange={(value) => setValue("site", value as any)}
                >
                  <SelectTrigger id="site" className="bg-background text-foreground">
                    <SelectValue placeholder="Select site (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GLUTE">Glute</SelectItem>
                    <SelectItem value="QUAD">Quad</SelectItem>
                    <SelectItem value="DELT">Deltoid</SelectItem>
                    <SelectItem value="VG">Ventrogluteal</SelectItem>
                    <SelectItem value="LAT">Lat</SelectItem>
                    <SelectItem value="PECT">Pectoral</SelectItem>
                    <SelectItem value="AB">Abdomen</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Mood, Energy, Libido */}
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="mood" className="text-foreground font-medium">Mood (1-10)</Label>
                <Input
                  id="mood"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="5"
                  className="bg-background text-foreground"
                  {...register("mood")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="energy" className="text-foreground font-medium">Energy (1-10)</Label>
                <Input
                  id="energy"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="5"
                  className="bg-background text-foreground"
                  {...register("energy")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="libido" className="text-foreground font-medium">Libido (1-10)</Label>
                <Input
                  id="libido"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="5"
                  className="bg-background text-foreground"
                  {...register("libido")}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="notes" className="text-foreground font-medium">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this dose..."
                rows={3}
                className="bg-background text-foreground"
                {...register("notes")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createDoseMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createDoseMutation.isPending}>
              {createDoseMutation.isPending ? "Saving..." : "Save Dose"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
