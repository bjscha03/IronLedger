"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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

const compoundFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["TRT", "ANABOLIC", "ANCILLARY", "OTHER"]),
  notes: z.string().optional(),
})

type CompoundFormData = z.infer<typeof compoundFormSchema>

interface CompoundFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  compound?: any
  onSuccess?: () => void
}

export function CompoundForm({ open, onOpenChange, compound, onSuccess }: CompoundFormProps) {
  const queryClient = useQueryClient()
  const isEditing = !!compound
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CompoundFormData>({
    resolver: zodResolver(compoundFormSchema),
    defaultValues: compound || {
      category: "TRT",
    },
  })

  const selectedCategory = watch("category")

  // Create/Update compound mutation
  const saveMutation = useMutation({
    mutationFn: async (data: CompoundFormData) => {
      const url = isEditing ? `/api/compounds/${compound.id}` : "/api/compounds"
      const method = isEditing ? "PATCH" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || `Failed to ${isEditing ? "update" : "create"} compound`)
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compounds"] })
      toast.success(`Compound ${isEditing ? "updated" : "created"} successfully!`)
      reset()
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || `Failed to ${isEditing ? "update" : "create"} compound`)
    },
  })

  const onSubmit = (data: CompoundFormData) => {
    saveMutation.mutate(data)
  }

  // Reset form when dialog opens/closes or compound changes
  useEffect(() => {
    if (open) {
      reset(compound || { category: "TRT" })
    } else {
      reset({ category: "TRT" })
    }
  }, [open, compound, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl font-semibold">
            {isEditing ? "Edit Compound" : "Add Compound"}
          </DialogTitle>
          <DialogDescription className="text-foreground/70">
            {isEditing ? "Update compound details." : "Add a new compound to your library."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-foreground font-medium">Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Testosterone Cypionate"
                className="bg-background text-foreground"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-foreground font-medium">Category *</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setValue("category", value as any)}
              >
                <SelectTrigger id="category" className="bg-background text-foreground">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRT">TRT (Testosterone Replacement)</SelectItem>
                  <SelectItem value="ANABOLIC">Anabolic</SelectItem>
                  <SelectItem value="ANCILLARY">Ancillary (AI, SERM, etc.)</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive font-medium">{errors.category.message}</p>
              )}
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="notes" className="text-foreground font-medium">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional information about this compound..."
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
              disabled={saveMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : isEditing ? "Update Compound" : "Add Compound"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
