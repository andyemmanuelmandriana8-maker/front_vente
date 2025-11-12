import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"
import type { Produit } from "./columns"
import type { Category, ProduitFormData } from "@/types/produit"

interface ProduitFormProps {
  onSubmit?: (produit: ProduitFormData) => void
  initialData?: Produit
  onReset?: () => void
  categories?: Category[]
}

export function ProduitForm({ onSubmit, initialData, onReset, categories = [] }: ProduitFormProps) {
  const [formData, setFormData] = useState<ProduitFormData>({
    nom: initialData?.nom || "",
    prix_gros: initialData?.prixGros || 0,
    prix_detaillant: initialData?.prixDetail || 0,
    prix_consommateur: initialData?.prixConsommateur || 0,
    category_id: initialData?.category_id || 0,
  })


  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom,
        prix_gros: initialData.prixGros,
        prix_detaillant: initialData.prixDetail,
        prix_consommateur: initialData.prixConsommateur,
        category_id: initialData.category_id || 0,
      })
    }
  }, [initialData])

  useEffect(() => {
    return () => {
      // Reset form when component unmounts
      if (onReset) {
        onReset()
      }
    }
  }, [onReset])

  const handleChange = (field: keyof ProduitFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
      <div className="space-y-2 col-span-3">
        <Label htmlFor="nom">Nom du produit</Label>
        <Input
          id="nom"
          value={formData.nom}
          onChange={(e) => handleChange("nom", e.target.value)}
          placeholder="Entrez le nom du produit"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prix_gros">Prix de gros (Ar)</Label>
        <Input
          id="prix_gros"
          type="number"
          step="0.01"
          min="0"
          value={formData.prix_gros || ""}
          onChange={(e) => handleChange("prix_gros", parseFloat(e.target.value) || 0)}
          placeholder="0.00 Ar"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="prix_detaillant">Prix détaillant (Ar)</Label>
        <Input
          id="prix_detaillant"
          type="number"
          step="0.01"
          min="0"
          value={formData.prix_detaillant || ""}
          onChange={(e) => handleChange("prix_detaillant", parseFloat(e.target.value) || 0)}
          placeholder="0.00 Ar"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="prix_consommateur">Prix consommateur (Ar)</Label>
        <Input
          id="prix_consommateur"
          type="number"
          step="0.01"
          min="0"
          value={formData.prix_consommateur || ""}
          onChange={(e) => handleChange("prix_consommateur", parseFloat(e.target.value) || 0)}
          placeholder="0.00 Ar"
          required
        />
      </div>

      <div className="space-y-2 col-span-3">
        <Label htmlFor="category_id">Catégorie</Label>
        <div className="relative">
          <select
            id="category_id"
            value={formData.category_id || ""}
            onChange={(e) => handleChange("category_id", parseInt(e.target.value) || 0)}
            className={cn(
              "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9 appearance-none cursor-pointer",
              !formData.category_id && "text-muted-foreground"
            )}
            required
          >
            <option value="" disabled>
              Sélectionnez une catégorie
            </option>
            {categories.map((categorie) => (
              <option key={categorie.id} value={categorie.id}>
                {categorie.nom}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 opacity-50 pointer-events-none" />
        </div>
      </div>
    </form>
  )
}

