import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"
import type { Client, TypePrixClient } from "./columns"

interface ClientFormProps {
  onSubmit?: (client: Omit<Client, "id">) => void
  initialData?: Client
  onReset?: () => void
}

const typesPrix: TypePrixClient[] = ["Gros", "Détaillant", "Consommateur"]

export function ClientForm({
  onSubmit,
  initialData,
  onReset,
}: ClientFormProps) {
  const [formData, setFormData] = useState<Omit<Client, "id">>({
    nom: initialData?.nom || "",
    prenom: initialData?.prenom || "",
    email: initialData?.email || "",
    telephone: initialData?.telephone || "",
    adresse: initialData?.adresse || "",
    typePrix: initialData?.typePrix || "Consommateur",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom,
        prenom: initialData.prenom,
        email: initialData.email,
        telephone: initialData.telephone,
        adresse: initialData.adresse,
        typePrix: initialData.typePrix,
      })
    }
  }, [initialData])

  useEffect(() => {
    return () => {
      if (onReset) {
        onReset()
      }
    }
  }, [onReset])

  const handleChange = (
    field: keyof Omit<Client, "id">,
    value: string | TypePrixClient
  ) => {
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
      <div className="space-y-2">
        <Label htmlFor="nom">Nom</Label>
        <Input
          id="nom"
          value={formData.nom}
          onChange={(e) => handleChange("nom", e.target.value)}
          placeholder="Entrez le nom"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prenom">Prénom</Label>
        <Input
          id="prenom"
          value={formData.prenom}
          onChange={(e) => handleChange("prenom", e.target.value)}
          placeholder="Entrez le prénom"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telephone">Téléphone</Label>
        <Input
          id="telephone"
          type="tel"
          value={formData.telephone}
          onChange={(e) => handleChange("telephone", e.target.value)}
          placeholder="+33 6 12 34 56 78"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="email@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="typePrix">Type de prix</Label>
        <div className="relative">
          <select
            id="typePrix"
            value={formData.typePrix}
            onChange={(e) =>
              handleChange("typePrix", e.target.value as TypePrixClient)
            }
            className={cn(
              "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9 appearance-none cursor-pointer"
            )}
            required
          >
            {typesPrix.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 opacity-50 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-2 col-span-3">
        <Label htmlFor="adresse">Adresse</Label>
        <Input
          id="adresse"
          value={formData.adresse || ""}
          onChange={(e) => handleChange("adresse", e.target.value)}
          placeholder="Entrez l'adresse complète"
        />
      </div>
    </form>
  )
}

