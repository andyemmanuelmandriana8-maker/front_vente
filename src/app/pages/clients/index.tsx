import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/tools/DataTable"
import { ModalForm } from "@/components/tools/ModalForm"
import { ConfirmDialog } from "@/components/tools/ConfirmDialog"
import { ClientForm } from "./ClientForm"
import { createColumns, type Client } from "./columns"

export default function ClientsPage() {
  const [selectedRows, setSelectedRows] = useState<Client[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [clients, setClients] = useState<Client[]>([
    // Données d'exemple - à remplacer par des données réelles
    {
      id: 1,
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@example.com",
      telephone: "+33 6 12 34 56 78",
      adresse: "123 Rue de la Paix, 75001 Paris",
      typePrix: "Gros",
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Marie",
      email: "marie.martin@example.com",
      telephone: "+33 6 23 45 67 89",
      adresse: "456 Avenue des Champs, 75008 Paris",
      typePrix: "Détaillant",
    },
    {
      id: 3,
      nom: "Durand",
      prenom: "Pierre",
      email: "pierre.durand@example.com",
      telephone: "+33 6 34 56 78 90",
      adresse: "789 Boulevard Saint-Germain, 75006 Paris",
      typePrix: "Consommateur",
    },
  ])

  const handleAddClient = (clientData: Omit<Client, "id">) => {
    if (editingClient) {
      // Modification
      setClients(
        clients.map((c) =>
          c.id === editingClient.id ? { ...editingClient, ...clientData } : c
        )
      )
      setEditingClient(null)
    } else {
      // Ajout
      const newClient: Client = {
        id:
          clients.length > 0
            ? Math.max(...clients.map((c) => c.id)) + 1
            : 1,
        ...clientData,
      }
      setClients([...clients, newClient])
    }
    setIsModalOpen(false)
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setIsModalOpen(true)
  }

  const handleDelete = (client: Client) => {
    setClientToDelete(client)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (clientToDelete) {
      setClients(clients.filter((c) => c.id !== clientToDelete.id))
      setClientToDelete(null)
      setShowDeleteDialog(false)
    }
  }

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setFormKey((prev) => prev + 1)
      setEditingClient(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>
      <DataTable
        data={clients}
        columns={createColumns(handleEdit, handleDelete)}
        emptyMessage="Aucun client disponible"
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
      />
      {selectedRows.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {selectedRows.length} client(s) sélectionné(s)
        </div>
      )}

      <ModalForm
        open={isModalOpen}
        onOpenChange={handleModalClose}
        title={editingClient ? "Modifier le client" : "Ajouter un client"}
        description={
          editingClient
            ? "Modifiez les informations du client"
            : "Remplissez les informations pour ajouter un nouveau client"
        }
        onCancel={() => handleModalClose(false)}
        onConfirm={() => {
          const form = document.querySelector("form")
          if (form) {
            form.requestSubmit()
          }
        }}
        confirmText={editingClient ? "Modifier" : "Ajouter"}
        cancelText="Annuler"
      >
        {isModalOpen && (
          <ClientForm
            key={formKey}
            onSubmit={handleAddClient}
            initialData={editingClient || undefined}
          />
        )}
      </ModalForm>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer le client ${clientToDelete?.prenom} ${clientToDelete?.nom} ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
      />
    </div>
  )
}

