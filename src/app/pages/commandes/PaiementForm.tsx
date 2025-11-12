import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Commande } from "./columns"
import type { Paiement } from "./paiements"

interface PaiementFormProps {
  commande: Commande
  paiementsExistants: Paiement[]
  onSubmit?: (paiement: Omit<Paiement, "id">) => void
  onReset?: () => void
}

export function PaiementForm({
  commande,
  paiementsExistants,
  onSubmit,
  onReset,
}: PaiementFormProps) {
  const totalPaye = paiementsExistants
    .filter((p) => p.commandeId === commande.id)
    .reduce((sum, p) => sum + p.montant, 0)
  const reste = commande.total - totalPaye

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0]
  }

  const [formData, setFormData] = useState({
    date: getTodayDate(),
    montant: reste > 0 ? reste : 0,
  })

  useEffect(() => {
    // Toujours mettre à jour la date à aujourd'hui
    setFormData((prev) => ({
      ...prev,
      date: getTodayDate(),
    }))
  }, [])

  useEffect(() => {
    return () => {
      if (onReset) {
        onReset()
      }
    }
  }, [onReset])

  const handleChange = (field: "date" | "montant", value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.montant <= 0) {
      alert("Le montant doit être supérieur à 0")
      return
    }
    if (formData.montant > reste) {
      alert(`Le montant ne peut pas dépasser le reste à payer (${reste.toFixed(2)} Ar)`)
      return
    }
    // Toujours utiliser la date d'aujourd'hui
    onSubmit?.({
      commandeId: commande.id,
      date: getTodayDate(),
      montant: formData.montant,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="commande-numero">Commande</Label>
        <Input
          id="commande-numero"
          value={commande.numero}
          disabled
          className="bg-muted"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Le champ date est masqué - toujours définie automatiquement à aujourd'hui */}
        
        <div className="space-y-2 col-span-2">
          <Label htmlFor="montant">Montant (Ar)</Label>
          <Input
            id="montant"
            type="number"
            step="0.01"
            min="0"
            max={reste}
            value={formData.montant}
            onChange={(e) =>
              handleChange("montant", parseFloat(e.target.value) || 0)
            }
            placeholder="0.00 Ar"
            required
          />
        </div>
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Total de la commande</span>
          <span className="font-semibold">{commande.total.toFixed(2)} Ar</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Total payé</span>
          <span className="font-semibold text-green-600">
            {totalPaye.toFixed(2)} Ar
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Reste à payer</span>
          <span
            className={`font-semibold ${
              reste <= 0 ? "text-green-600" : "text-orange-600"
            }`}
          >
            {reste.toFixed(2)} Ar
          </span>
        </div>
      </div>
    </form>
  )
}

