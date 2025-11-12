import { useState, useRef, useEffect } from "react"
import { Plus } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/tools/DataTable"
import { ModalForm } from "@/components/tools/ModalForm"
import { ConfirmDialog } from "@/components/tools/ConfirmDialog"
import { FactureForm } from "./FactureForm"
import { FactureDetails } from "./FactureDetails"
import { FacturePrint } from "./FacturePrint"
import { createColumns, type Facture } from "./columns"
import type { Produit } from "../produits/columns"
import type { Client } from "../clients/columns"

export default function FacturesPage() {
  const [selectedRows, setSelectedRows] = useState<Facture[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [editingFacture, setEditingFacture] = useState<Facture | null>(null)
  const [factureToDelete, setFactureToDelete] = useState<Facture | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [factureDetails, setFactureDetails] = useState<Facture | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [factureToPrint, setFactureToPrint] = useState<Facture | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

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

  // Charger les factures depuis localStorage au démarrage
  const loadFacturesFromStorage = (): Facture[] => {
    const facturesStorage = localStorage.getItem("factures")
    if (facturesStorage) {
      return JSON.parse(facturesStorage)
    }
    // Données d'exemple par défaut si localStorage est vide
    return [
      {
        id: 1,
        numero: "FAC-001",
        date: new Date().toISOString(),
        client: "Jean Dupont",
        lignes: [
          {
            produitId: 1,
            produitNom: "Vin Rouge Bordeaux",
            quantite: 2,
            prixUnitaire: 8.50,
            total: 17.00,
          },
        ],
        total: 17.00,
        statut: "Payée",
      },
      {
        id: 2,
        numero: "FAC-002",
        date: new Date().toISOString(),
        client: "Marie Martin",
        lignes: [
          {
            produitId: 2,
            produitNom: "Champagne Brut",
            quantite: 1,
            prixUnitaire: 35.00,
            total: 35.00,
          },
        ],
        total: 35.00,
        statut: "Impayée",
      },
    ]
  }

  const [factures, setFactures] = useState<Facture[]>(loadFacturesFromStorage())

  // Synchroniser avec localStorage quand les factures changent
  useEffect(() => {
    localStorage.setItem("factures", JSON.stringify(factures))
  }, [factures])

  // Écouter les changements dans localStorage (pour synchroniser entre onglets/pages)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "factures") {
        const nouvellesFactures = e.newValue ? JSON.parse(e.newValue) : []
        setFactures(nouvellesFactures)
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleAddFacture = (factureData: Omit<Facture, "id">) => {
    if (editingFacture) {
      // Modification
      const facturesModifiees = factures.map((f) =>
        f.id === editingFacture.id
          ? { ...editingFacture, ...factureData }
          : f
      )
      setFactures(facturesModifiees)
      localStorage.setItem("factures", JSON.stringify(facturesModifiees))
      setEditingFacture(null)
    } else {
      // Ajout
      const newFacture: Facture = {
        id:
          factures.length > 0
            ? Math.max(...factures.map((f) => f.id)) + 1
            : 1,
        ...factureData,
      }
      const nouvellesFactures = [...factures, newFacture]
      setFactures(nouvellesFactures)
      localStorage.setItem("factures", JSON.stringify(nouvellesFactures))
    }
    setIsModalOpen(false)
  }

  const handleEdit = (facture: Facture) => {
    setEditingFacture(facture)
    setIsModalOpen(true)
  }

  const handleDelete = (facture: Facture) => {
    setFactureToDelete(facture)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (factureToDelete) {
      const facturesRestantes = factures.filter((f) => f.id !== factureToDelete.id)
      setFactures(facturesRestantes)
      localStorage.setItem("factures", JSON.stringify(facturesRestantes))
      setFactureToDelete(null)
      setShowDeleteDialog(false)
    }
  }

  const handleViewDetails = (facture: Facture) => {
    setFactureDetails(facture)
    setShowDetailsDialog(true)
  }

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Facture-${factureToPrint?.numero || "N/A"}`,
  })

  const handlePrintClick = (facture: Facture) => {
    setFactureToPrint(facture)
    // Petit délai pour s'assurer que le composant est rendu
    setTimeout(() => {
      handlePrint()
    }, 100)
  }

  const handleDownloadPDF = async (facture: Facture) => {
    setFactureToPrint(facture)
    // Attendre que le composant soit rendu
    await new Promise((resolve) => setTimeout(resolve, 200))

    if (printRef.current) {
      try {
        // Convertir le composant en canvas
        const canvas = await html2canvas(printRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        })

        // Calculer les dimensions du PDF
        const imgWidth = 210 // Largeur A4 en mm
        const pageHeight = 297 // Hauteur A4 en mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Créer le PDF
        const pdf = new jsPDF("p", "mm", "a4")

        // Si le contenu dépasse une page, diviser en plusieurs pages
        if (imgHeight > pageHeight) {
          let heightLeft = imgHeight
          let position = 0

          // Première page
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            0,
            position,
            imgWidth,
            imgHeight
          )
          heightLeft -= pageHeight

          // Pages supplémentaires
          while (heightLeft > 0) {
            position = heightLeft - imgHeight
            pdf.addPage()
            pdf.addImage(
              canvas.toDataURL("image/png"),
              "PNG",
              0,
              position,
              imgWidth,
              imgHeight
            )
            heightLeft -= pageHeight
          }
        } else {
          // Contenu tient sur une seule page
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            0,
            0,
            imgWidth,
            imgHeight
          )
        }

        // Télécharger le PDF
        pdf.save(`Facture-${facture.numero}.pdf`)
      } catch (error) {
        console.error("Erreur lors de la génération du PDF:", error)
        alert("Une erreur est survenue lors de la génération du PDF")
      }
    }
  }

  const getDernierNumero = () => {
    if (factures.length === 0) return "FAC-000"
    const dernier = factures[factures.length - 1]
    return dernier.numero
  }

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setFormKey((prev) => prev + 1)
      setEditingFacture(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Factures</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>
      <DataTable
        data={factures}
        columns={createColumns(handleEdit, handleDelete, handleViewDetails, handlePrintClick, handleDownloadPDF)}
        emptyMessage="Aucune facture disponible"
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
      />
      {selectedRows.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {selectedRows.length} facture(s) sélectionnée(s)
        </div>
      )}

      <ModalForm
        open={isModalOpen}
        onOpenChange={handleModalClose}
        title={editingFacture ? "Modifier la facture" : "Ajouter une facture"}
        description={
          editingFacture
            ? "Modifiez les informations de la facture"
            : "Remplissez les informations pour ajouter une nouvelle facture"
        }
        onCancel={() => handleModalClose(false)}
        onConfirm={() => {
          const form = document.querySelector("form")
          if (form) {
            form.requestSubmit()
          }
        }}
        confirmText={editingFacture ? "Modifier" : "Ajouter"}
        cancelText="Annuler"
      >
        {isModalOpen && (
          <FactureForm
            key={formKey}
            onSubmit={handleAddFacture}
            initialData={editingFacture || undefined}
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
        description={`Êtes-vous sûr de vouloir supprimer la facture ${factureToDelete?.numero} ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
      />

      <FactureDetails
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        facture={factureDetails}
      />

      {/* Composant caché pour l'impression */}
      <div className="hidden">
        {factureToPrint && (
          <div ref={printRef}>
            <FacturePrint facture={factureToPrint} />
          </div>
        )}
      </div>
    </div>
  )
}

