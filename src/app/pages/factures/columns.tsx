import type { Column } from "@/components/tools/DataTable"
import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Pencil, Trash2, Printer, Download } from "lucide-react"

export interface LigneFacture {
  produitId: number
  produitNom: string
  quantite: number
  prixUnitaire: number
  total: number
}

export interface Facture {
  id: number
  numero: string
  date: string
  client: string
  lignes: LigneFacture[]
  total: number
  statut: "Payée" | "Impayée"
  paiementId?: number
  commandeId?: number
}

export const createColumns = (
  onEdit: (facture: Facture) => void,
  onDelete: (facture: Facture) => void,
  onViewDetails: (facture: Facture) => void,
  onPrint: (facture: Facture) => void,
  onDownloadPDF: (facture: Facture) => void
): Column<Facture>[] => [
  {
    key: "numero",
    header: "Numéro",
  },
  {
    key: "date",
    header: "Date",
    accessor: (row) => new Date(row.date).toLocaleDateString("fr-FR"),
  },
  {
    key: "client",
    header: "Client",
  },
  {
    key: "total",
    header: "Total",
    accessor: (row) => `${row.total.toFixed(2)} Ar`,
  },
  {
    key: "statut",
    header: "Statut",
    accessor: (row) => {
      const statutColors = {
        Payée: "text-green-600",
        Impayée: "text-red-600",
      }
      return (
        <span className={statutColors[row.statut] || ""}>{row.statut}</span>
      )
    },
  },
  {
    key: "actions",
    header: "Actions",
    accessor: (row) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails(row)
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            Voir les détails
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onPrint(row)
            }}
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onDownloadPDF(row)
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onEdit(row)
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onDelete(row)
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

