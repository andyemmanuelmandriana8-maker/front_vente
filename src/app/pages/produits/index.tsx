import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/tools/DataTable"
import { ModalForm } from "@/components/tools/ModalForm"
import { columns, type Produit } from "./columns"

export default function ProduitsPage() {
  const [selectedRows, setSelectedRows] = useState<Produit[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Données d'exemple - à remplacer par des données réelles
  const produits: Produit[] = [
    {
      id: 1,
      nom: "Produit 1",
      description: "Description du produit 1",
      prix: 29.99,
      stock: 50,
      categorie: "Électronique",
    },
    {
      id: 2,
      nom: "Produit 2",
      description: "Description du produit 2",
      prix: 49.99,
      stock: 30,
      categorie: "Vêtements",
    },
    {
      id: 3,
      nom: "Produit 3",
      description: "Description du produit 3",
      prix: 19.99,
      stock: 100,
      categorie: "Alimentaire",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Produits</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>
      <DataTable
        data={produits}
        columns={columns}
        emptyMessage="Aucun produit disponible"
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
      />
      {selectedRows.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {selectedRows.length} produit(s) sélectionné(s)
        </div>
      )}

      <ModalForm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Ajouter un produit"
        description="Remplissez les informations pour ajouter un nouveau produit"
        onCancel={() => setIsModalOpen(false)}
        onConfirm={() => {
          // TODO: Implémenter la logique d'ajout
          console.log("Ajouter un produit")
          setIsModalOpen(false)
        }}
        confirmText="Ajouter"
        cancelText="Annuler"
      >
        <div className="space-y-4">
          {/* TODO: Ajouter les champs du formulaire ici */}
          <p className="text-sm text-muted-foreground">
            Formulaire à compléter
          </p>
        </div>
      </ModalForm>
    </div>
  )
}

