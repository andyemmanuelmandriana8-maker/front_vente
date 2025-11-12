import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDownIcon, Plus, Trash2 } from "lucide-react"
import type { Commande, LigneCommande, StatutCommande } from "./columns"
import { STATUTS_COMMANDE } from "./columns"
import type { Produit } from "../produits/columns"

interface CommandeFormProps {
  onSubmit?: (commande: Omit<Commande, "id">) => void
  initialData?: Commande
  onReset?: () => void
  produits: Produit[]
  clients: Array<{ nom: string; prenom: string; typePrix: string }>
  dernierNumero?: string
}


export function CommandeForm({
  onSubmit,
  initialData,
  onReset,
  produits,
  clients,
  dernierNumero = "CMD-000",
}: CommandeFormProps) {
  const generateNumero = () => {
    if (dernierNumero) {
      const match = dernierNumero.match(/CMD-(\d+)/)
      if (match) {
        const num = parseInt(match[1]) + 1
        return `CMD-${num.toString().padStart(3, "0")}`
      }
    }
    return "CMD-001"
  }

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0]
  }

  const [formData, setFormData] = useState<Omit<Commande, "id">>({
    numero: initialData?.numero || generateNumero(),
    date: initialData?.date || getTodayDate(),
    client: initialData?.client || "",
    lignes: initialData?.lignes || [],
    total: initialData?.total || 0,
    statut: initialData?.statut || "Livrée",
  })

  useEffect(() => {
    // Toujours mettre à jour la date à aujourd'hui
    if (initialData) {
      setFormData({
        numero: initialData.numero,
        date: getTodayDate(), // Toujours mettre à jour à aujourd'hui
        client: initialData.client,
        lignes: initialData.lignes,
        total: initialData.total,
        statut: initialData.statut,
      })
    } else {
      // Réinitialiser à aujourd'hui si pas de données initiales
      setFormData((prev) => ({
        ...prev,
        date: getTodayDate(),
        numero: generateNumero(),
      }))
    }
  }, [initialData])

  // Mettre à jour la date à chaque rendu pour s'assurer qu'elle est toujours à aujourd'hui
  useEffect(() => {
    const interval = setInterval(() => {
      setFormData((prev) => ({
        ...prev,
        date: getTodayDate(),
      }))
    }, 60000) // Mettre à jour toutes les minutes

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    return () => {
      if (onReset) {
        onReset()
      }
    }
  }, [onReset])

  // Calculer le total automatiquement quand les lignes changent
  useEffect(() => {
    const total = formData.lignes.reduce(
      (sum, ligne) => sum + ligne.total,
      0
    )
    setFormData((prev) => ({ ...prev, total }))
  }, [formData.lignes])

  const handleChange = (
    field: keyof Omit<Commande, "id" | "lignes" | "total">,
    value: string | number
  ) => {
    // Ne pas permettre de modifier la date - toujours utiliser aujourd'hui
    if (field === "date") {
      return
    }
    // Validation spéciale pour le statut
    if (field === "statut") {
      if (!STATUTS_COMMANDE.includes(value as StatutCommande)) {
        // Si la valeur n'est pas valide, ne pas la changer
        return
      }
    }
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }
      
      // Si le client change, recalculer les prix de toutes les lignes
      if (field === "client") {
        const client = clients.find(
          (c) => `${c.prenom} ${c.nom}` === value
        )
        if (client && prev.lignes.length > 0) {
          const newLignes = prev.lignes.map((l) => {
            const produit = produits.find((p) => p.id === l.produitId)
            if (produit) {
              let prixUnitaire = 0
              if (client.typePrix === "Gros") {
                prixUnitaire = produit.prixGros || 0
              } else if (client.typePrix === "Détaillant") {
                prixUnitaire = produit.prixDetail || 0
              } else {
                prixUnitaire = produit.prixConsommateur || 0
              }
              return {
                ...l,
                prixUnitaire,
                total: l.quantite * prixUnitaire,
              }
            }
            return l
          })
          newData.lignes = newLignes
        }
      }
      
      return newData
    })
  }

  const handleAddLigne = () => {
    setFormData((prev) => ({
      ...prev,
      lignes: [
        ...prev.lignes,
        {
          produitId: 0,
          produitNom: "",
          quantite: 1,
          prixUnitaire: 0,
          total: 0,
        },
      ],
    }))
  }

  const handleRemoveLigne = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      lignes: prev.lignes.filter((_, i) => i !== index),
    }))
  }

  const handleLigneChange = (
    index: number,
    field: keyof LigneCommande,
    value: string | number
  ) => {
    setFormData((prev) => {
      const newLignes = [...prev.lignes]
      const ligne = { ...newLignes[index] }

      if (field === "produitId") {
        const produit = produits.find((p) => p.id === value)
        if (produit) {
          ligne.produitId = produit.id
          ligne.produitNom = produit.nom
          // Déterminer le prix selon le type de prix du client
          const clientNom = formData.client
          const client = clients.find(
            (c) => `${c.prenom} ${c.nom}` === clientNom
          )
          if (client) {
            if (client.typePrix === "Gros") {
              ligne.prixUnitaire = produit.prixGros || 0
            } else if (client.typePrix === "Détaillant") {
              ligne.prixUnitaire = produit.prixDetail || 0
            } else {
              ligne.prixUnitaire = produit.prixConsommateur || 0
            }
          } else {
            // Par défaut, utiliser le prix consommateur
            ligne.prixUnitaire = produit.prixConsommateur || 0
          }
          ligne.total = ligne.quantite * ligne.prixUnitaire
        }
      } else if (field === "quantite") {
        ligne.quantite = value as number
        ligne.total = ligne.quantite * ligne.prixUnitaire
      } else {
        ligne[field] = value as never
      }

      newLignes[index] = ligne
      return { ...prev, lignes: newLignes }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.lignes.length === 0) {
      alert("Veuillez ajouter au moins un produit")
      return
    }
    // Toujours utiliser la date d'aujourd'hui
    onSubmit?.({
      ...formData,
      date: getTodayDate(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2 col-span-3">
          <Label htmlFor="numero">Numéro de commande</Label>
          <Input
            id="numero"
            value={formData.numero}
            disabled
            className="bg-muted"
          />
        </div>

        {initialData && (
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={getTodayDate()}
              onChange={(e) => handleChange("date", e.target.value)}
              required
              readOnly
              className="bg-muted cursor-not-allowed"
            />
          </div>
        )}

        <div className={`space-y-2 ${initialData ? "col-span-2" : "col-span-3"}`}>
          <Label htmlFor="client">Client</Label>
          <div className="relative">
            <select
              id="client"
              value={formData.client}
              onChange={(e) => handleChange("client", e.target.value)}
              className={cn(
                "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9 appearance-none cursor-pointer",
                !formData.client && "text-muted-foreground"
              )}
              required
            >
              <option value="" disabled>
                Sélectionnez un client
              </option>
              {clients.map((client) => (
                <option key={`${client.prenom} ${client.nom}`} value={`${client.prenom} ${client.nom}`}>
                  {client.prenom} {client.nom}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 opacity-50 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2 col-span-3">
          <Label htmlFor="statut">Statut</Label>
          <div className="relative">
            <select
              id="statut"
              value={formData.statut}
              onChange={(e) => {
                const newValue = e.target.value as StatutCommande
                // Forcer les valeurs exactes depuis la constante
                if (STATUTS_COMMANDE.includes(newValue)) {
                  setFormData((prev) => ({
                    ...prev,
                    statut: newValue,
                  }))
                }
              }}
              className={cn(
                "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9 appearance-none cursor-pointer",
                !formData.statut && "text-muted-foreground"
              )}
              required
            >
              {STATUTS_COMMANDE.map((statut) => (
                <option key={statut} value={statut}>
                  {statut}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 opacity-50 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Produits</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddLigne}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>

        {formData.lignes.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4 border rounded-md">
            Aucun produit ajouté. Cliquez sur "Ajouter un produit" pour commencer.
          </div>
        ) : (
          <div className="space-y-3">
            {formData.lignes.map((ligne, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-2 p-3 border rounded-md"
              >
                <div className="space-y-2 col-span-6">
                  <Label htmlFor={`produit-${index}`}>Produit</Label>
                  <div className="relative">
                    <select
                      id={`produit-${index}`}
                      value={ligne.produitId}
                      onChange={(e) =>
                        handleLigneChange(
                          index,
                          "produitId",
                          parseInt(e.target.value)
                        )
                      }
                      className={cn(
                        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9 appearance-none cursor-pointer"
                      )}
                      required
                    >
                      <option value="0">Sélectionnez un produit</option>
                      {produits.map((produit) => (
                        <option key={produit.id} value={produit.id}>
                          {produit.nom}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 opacity-50 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2 col-span-3">
                  <Label htmlFor={`quantite-${index}`}>Quantité</Label>
                  <Input
                    id={`quantite-${index}`}
                    type="number"
                    min="1"
                    value={ligne.quantite}
                    onChange={(e) =>
                      handleLigneChange(
                        index,
                        "quantite",
                        parseInt(e.target.value) || 1
                      )
                    }
                    required
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor={`total-${index}`}>Total (Ar)</Label>
                  <Input
                    id={`total-${index}`}
                    type="number"
                    step="0.01"
                    value={ligne.total.toFixed(2)}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2 col-span-1 flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveLigne(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg font-semibold">Total de la commande</Label>
          <div className="text-lg font-bold">
            {formData.total.toFixed(2)} Ar
          </div>
        </div>
      </div>
    </form>
  )
}
