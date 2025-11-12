import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/tools/DataTable"
import { ModalForm } from "@/components/tools/ModalForm"
import { ConfirmDialog } from "@/components/tools/ConfirmDialog"
import { ProduitForm } from "./ProduitForm"
import { createColumns, type Produit, mapProduitToLocal } from "./columns"
import { useProduits } from "@/hooks/useProduits"
import type { ProduitFormData } from "@/types/produit"

export default function ProduitsPage() {
  const [selectedRows, setSelectedRows] = useState<Produit[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [editingProduit, setEditingProduit] = useState<Produit | null>(null)
  const [produitToDelete, setProduitToDelete] = useState<Produit | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  const {
    produits: produitsData,
    categories,
    isLoading,
    error,
    createProduit,
    updateProduit,
    deleteProduit,
  } = useProduits()

  // Convertir les produits de l'API vers le format local
  const produits = produitsData.map(mapProduitToLocal)

  const handleAddProduit = async (produitData: ProduitFormData) => {
    try {
      if (editingProduit) {
        // Modification
        await updateProduit(editingProduit.id, produitData)
        setEditingProduit(null)
      } else {
        // Ajout
        await createProduit(produitData)
      }
      setIsModalOpen(false)
    } catch (err) {
      // L'erreur est gérée par le hook
      console.error("Erreur lors de l'opération:", err)
    }
  }

  const handleEdit = (produit: Produit) => {
    setEditingProduit(produit)
    setIsModalOpen(true)
  }

  const handleDelete = (produit: Produit) => {
    setProduitToDelete(produit)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (produitToDelete) {
      try {
        await deleteProduit(produitToDelete.id)
        setProduitToDelete(null)
        setShowDeleteDialog(false)
      } catch (err) {
        console.error("Erreur lors de la suppression:", err)
      }
    }
  }

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open)
    // Reset form key when modal closes to force remount
    if (!open) {
      setFormKey((prev) => prev + 1)
      setEditingProduit(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Produits</h1>
        <Button onClick={() => setIsModalOpen(true)} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>
      
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      
      {isLoading && produits.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Chargement des produits...
        </div>
      ) : (
        <DataTable
          data={produits}
          columns={createColumns(handleEdit, handleDelete)}
          emptyMessage="Aucun produit disponible"
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          getRowId={(row) => row.id}
        />
      )}
      {selectedRows.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {selectedRows.length} produit(s) sélectionné(s)
        </div>
      )}

      <ModalForm
        open={isModalOpen}
        onOpenChange={handleModalClose}
        title={editingProduit ? "Modifier le produit" : "Ajouter un produit"}
        description={
          editingProduit
            ? "Modifiez les informations du produit"
            : "Remplissez les informations pour ajouter un nouveau produit"
        }
        onCancel={() => handleModalClose(false)}
        onConfirm={() => {
          const form = document.querySelector("form")
          if (form) {
            form.requestSubmit()
          }
        }}
        confirmText={editingProduit ? "Modifier" : "Ajouter"}
        cancelText="Annuler"
      >
        {isModalOpen && (
          <ProduitForm
            key={formKey}
            onSubmit={handleAddProduit}
            initialData={editingProduit || undefined}
            categories={categories}
          />
        )}
      </ModalForm>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer le produit "${produitToDelete?.nom}" ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
      />
    </div>
  )
}

