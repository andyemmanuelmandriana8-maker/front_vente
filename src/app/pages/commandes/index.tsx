import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/tools/DataTable"
import { ModalForm } from "@/components/tools/ModalForm"
import { ConfirmDialog } from "@/components/tools/ConfirmDialog"
import { CommandeForm } from "./CommandeForm"
import { CommandeDetails } from "./CommandeDetails"
import { PaiementForm } from "./PaiementForm"
import { createColumns, type Commande, STATUTS_COMMANDE, type StatutCommande } from "./columns"
import type { Paiement } from "./paiements"
import type { Produit } from "../produits/columns"
import type { Client } from "../clients/columns"
import type { Facture } from "../factures/columns"

export default function CommandesPage() {
  const [selectedRows, setSelectedRows] = useState<Commande[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [editingCommande, setEditingCommande] = useState<Commande | null>(null)
  const [commandeToDelete, setCommandeToDelete] = useState<Commande | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [commandeDetails, setCommandeDetails] = useState<Commande | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [commandePaiement, setCommandePaiement] = useState<Commande | null>(null)
  const [showPaiementDialog, setShowPaiementDialog] = useState(false)
  const [paiementFormKey, setPaiementFormKey] = useState(0)
  const [paiements, setPaiements] = useState<Paiement[]>([])
  
  // Récupérer les produits depuis le localStorage ou utiliser des données d'exemple
  // Pour l'instant, on utilise des données d'exemple
  const [produits] = useState<Produit[]>([
    {
      id: 1,
      nom: "Vin Rouge Bordeaux",
      prixGros: 8.50,
      prixDetail: 12.00,
      prixConsommateur: 15.99,
      categorie: "Vins normaux",
    },
    {
      id: 2,
      nom: "Champagne Brut",
      prixGros: 25.00,
      prixDetail: 35.00,
      prixConsommateur: 45.99,
      categorie: "Vins effervescents",
    },
    {
      id: 3,
      nom: "Vin Doux Muscat",
      prixGros: 6.00,
      prixDetail: 9.50,
      prixConsommateur: 12.99,
      categorie: "Vins doux et aromatisés",
    },
  ])

  // Données d'exemple pour les clients - à remplacer par les clients réels
  const [clients] = useState<Client[]>([
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

  const getClientNames = () => {
    return clients.map((c) => `${c.prenom} ${c.nom}`)
  }

  const [commandes, setCommandes] = useState<Commande[]>([
    // Données d'exemple - à remplacer par des données réelles
    {
      id: 1,
      numero: "CMD-001",
      date: new Date().toISOString(),
      client: "Jean Dupont",
      lignes: [
        {
          produitId: 1,
          produitNom: "Vin Rouge Bordeaux",
          quantite: 2,
          prixUnitaire: 15.99,
          total: 31.98,
        },
      ],
      total: 31.98,
      statut: "Livrée",
    },
    {
      id: 2,
      numero: "CMD-002",
      date: new Date().toISOString(),
      client: "Marie Martin",
      lignes: [
        {
          produitId: 2,
          produitNom: "Champagne Brut",
          quantite: 1,
          prixUnitaire: 45.99,
          total: 45.99,
        },
      ],
      total: 45.99,
      statut: "Récupérée",
    },
  ])

  const handleAddCommande = (commandeData: Omit<Commande, "id">) => {
    // Valider et corriger le statut si nécessaire
    const correctedStatut = STATUTS_COMMANDE.includes(commandeData.statut as StatutCommande)
      ? commandeData.statut
      : "Livrée"

    const correctedData = {
      ...commandeData,
      statut: correctedStatut,
    }

    if (editingCommande) {
      // Modification
      setCommandes(
        commandes.map((c) =>
          c.id === editingCommande.id
            ? { ...editingCommande, ...correctedData }
            : c
        )
      )
      setEditingCommande(null)
    } else {
      // Ajout
      const newCommande: Commande = {
        id:
          commandes.length > 0
            ? Math.max(...commandes.map((c) => c.id)) + 1
            : 1,
        ...correctedData,
      }
      setCommandes([...commandes, newCommande])
    }
    setIsModalOpen(false)
  }

  const handleEdit = (commande: Commande) => {
    setEditingCommande(commande)
    setIsModalOpen(true)
  }

  const handleDelete = (commande: Commande) => {
    setCommandeToDelete(commande)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (commandeToDelete) {
      setCommandes(commandes.filter((c) => c.id !== commandeToDelete.id))
      setCommandeToDelete(null)
      setShowDeleteDialog(false)
    }
  }

  const handleViewDetails = (commande: Commande) => {
    setCommandeDetails(commande)
    setShowDetailsDialog(true)
  }

  const handleEffectuerPaiement = (commande: Commande) => {
    setCommandePaiement(commande)
    setShowPaiementDialog(true)
  }

  const handleAddPaiement = (paiementData: Omit<Paiement, "id">) => {
    const newPaiement: Paiement = {
      id:
        paiements.length > 0
          ? Math.max(...paiements.map((p) => p.id)) + 1
          : 1,
      ...paiementData,
    }
    setPaiements([...paiements, newPaiement])
    
    // Créer automatiquement une facture pour ce paiement
    const commande = commandes.find((c) => c.id === paiementData.commandeId)
    if (commande) {
      // Récupérer les factures existantes depuis localStorage
      const facturesStorage = localStorage.getItem("factures")
      const facturesExistantes: Facture[] = facturesStorage 
        ? JSON.parse(facturesStorage) 
        : []
      
      // Générer le numéro de facture
      const getDernierNumeroFacture = () => {
        if (facturesExistantes.length === 0) return "FAC-000"
        const dernier = facturesExistantes[facturesExistantes.length - 1]
        const match = dernier.numero.match(/FAC-(\d+)/)
        if (match) {
          const num = parseInt(match[1]) + 1
          return `FAC-${num.toString().padStart(3, "0")}`
        }
        return "FAC-001"
      }
      
      // Convertir les lignes de commande en lignes de facture
      const lignesFacture = commande.lignes.map((ligne) => ({
        produitId: ligne.produitId,
        produitNom: ligne.produitNom,
        quantite: ligne.quantite,
        prixUnitaire: ligne.prixUnitaire,
        total: ligne.total,
      }))
      
      // Calculer le total de la facture à partir des lignes
      const totalFacture = lignesFacture.reduce((sum, ligne) => sum + ligne.total, 0)
      
      // Créer la facture
      const nouvelleFacture: Facture = {
        id: facturesExistantes.length > 0
          ? Math.max(...facturesExistantes.map((f) => f.id)) + 1
          : 1,
        numero: getDernierNumeroFacture(),
        date: new Date().toISOString(),
        client: commande.client,
        lignes: lignesFacture,
        total: totalFacture,
        statut: "Payée",
        paiementId: newPaiement.id,
        commandeId: commande.id,
      }
      
      // Sauvegarder dans localStorage
      const nouvellesFactures = [...facturesExistantes, nouvelleFacture]
      localStorage.setItem("factures", JSON.stringify(nouvellesFactures))
    }
    
    setShowPaiementDialog(false)
    setCommandePaiement(null)
  }

  const handlePaiementModalClose = (open: boolean) => {
    setShowPaiementDialog(open)
    if (!open) {
      setPaiementFormKey((prev) => prev + 1)
      setCommandePaiement(null)
    }
  }

  const getDernierNumero = () => {
    if (commandes.length === 0) return "CMD-000"
    const dernier = commandes[commandes.length - 1]
    return dernier.numero
  }

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setFormKey((prev) => prev + 1)
      setEditingCommande(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Commandes</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>
      <DataTable
        data={commandes}
        columns={createColumns(
          handleEdit,
          handleDelete,
          handleViewDetails,
          handleEffectuerPaiement,
          paiements
        )}
        emptyMessage="Aucune commande disponible"
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
      />
      {selectedRows.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {selectedRows.length} commande(s) sélectionnée(s)
        </div>
      )}

      <ModalForm
        open={isModalOpen}
        onOpenChange={handleModalClose}
        title={editingCommande ? "Modifier la commande" : "Ajouter une commande"}
        description={
          editingCommande
            ? "Modifiez les informations de la commande"
            : "Remplissez les informations pour ajouter une nouvelle commande"
        }
        onCancel={() => handleModalClose(false)}
        onConfirm={() => {
          const form = document.querySelector("form")
          if (form) {
            form.requestSubmit()
          }
        }}
        confirmText={editingCommande ? "Modifier" : "Ajouter"}
        cancelText="Annuler"
      >
        {isModalOpen && (
          <CommandeForm
            key={formKey}
            onSubmit={handleAddCommande}
            initialData={editingCommande || undefined}
            produits={produits}
            clients={clients.map((c) => ({
              nom: c.nom,
              prenom: c.prenom,
              typePrix: c.typePrix,
            }))}
            dernierNumero={getDernierNumero()}
          />
        )}
      </ModalForm>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer la commande ${commandeToDelete?.numero} ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
      />

      <CommandeDetails
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        commande={commandeDetails}
        paiements={paiements}
      />

      <ModalForm
        open={showPaiementDialog}
        onOpenChange={handlePaiementModalClose}
        title="Effectuer un paiement"
        description="Enregistrez un nouveau paiement pour cette commande"
        onCancel={() => handlePaiementModalClose(false)}
        onConfirm={() => {
          const form = document.querySelector("form")
          if (form) {
            form.requestSubmit()
          }
        }}
        confirmText="Enregistrer"
        cancelText="Annuler"
      >
        {showPaiementDialog && commandePaiement && (
          <PaiementForm
            key={paiementFormKey}
            commande={commandePaiement}
            paiementsExistants={paiements}
            onSubmit={handleAddPaiement}
          />
        )}
      </ModalForm>
    </div>
  )
}

