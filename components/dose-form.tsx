"use client"

import { useState } from "react"
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

interface DoseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DoseForm({ open, onOpenChange }: DoseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Log Dose</DialogTitle>
          <DialogDescription>
            Record your injection details. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Compound Selection */}
            <div className="grid gap-2">
              <Label htmlFor="compound">Compound *</Label>
              <Select required>
                <SelectTrigger id="compound">
                  <SelectValue placeholder="Select compound" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="test-c">Testosterone Cypionate</SelectItem>
                  <SelectItem value="test-e">Testosterone Enanthate</SelectItem>
                  <SelectItem value="test-p">Testosterone Propionate</SelectItem>
                  <SelectItem value="nandrolone">Nandrolone Decanoate</SelectItem>
                  <SelectItem value="hcg">HCG</SelectItem>
                  <SelectItem value="anastrozole">Anastrozole</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Don't see your compound? Add it in the Compounds page first.
              </p>
            </div>

            {/* Dose Amount */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.1"
                  placeholder="100"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  type="text"
                  defaultValue="mg"
                  placeholder="mg"
                />
              </div>
            </div>

            {/* Route */}
            <div className="grid gap-2">
              <Label htmlFor="route">Route *</Label>
              <Select required>
                <SelectTrigger id="route">
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IM">Intramuscular (IM)</SelectItem>
                  <SelectItem value="SUBQ">Subcutaneous (SubQ)</SelectItem>
                  <SelectItem value="ORAL">Oral</SelectItem>
                  <SelectItem value="TRANSDERMAL">Transdermal</SelectItem>
                  <SelectItem value="NASAL">Nasal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Injection Site */}
            <div className="grid gap-2">
              <Label htmlFor="site">Injection Site</Label>
              <Select>
                <SelectTrigger id="site">
                  <SelectValue placeholder="Select site (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GLUTE">Glute</SelectItem>
                  <SelectItem value="QUAD">Quad</SelectItem>
                  <SelectItem value="DELT">Deltoid</SelectItem>
                  <SelectItem value="VG">Ventrogluteal</SelectItem>
                  <SelectItem value="LAT">Lat</SelectItem>
                  <SelectItem value="PECT">Pectoral</SelectItem>
                  <SelectItem value="TRICEP">Tricep</SelectItem>
                  <SelectItem value="BICEP">Bicep</SelectItem>
                  <SelectItem value="CALF">Calf</SelectItem>
                  <SelectItem value="TRAP">Trap</SelectItem>
                  <SelectItem value="ABDOMEN">Abdomen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date/Time */}
            <div className="grid gap-2">
              <Label htmlFor="datetime">Date & Time *</Label>
              <Input
                id="datetime"
                type="datetime-local"
                defaultValue={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this dose..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Dose"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
