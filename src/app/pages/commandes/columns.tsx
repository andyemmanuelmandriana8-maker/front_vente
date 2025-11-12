import type { Column } from "@/components/tools/DataTable"
import type { Produit } from "../produits/columns"
import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"

export interface LigneCommande {
  produitId: number
  produitNom: string
  quantite: number
  prixUnitaire: number
  total: number
}

export type StatutCommande = "Livrée" | "Récupérée"

export const STATUTS_COMMANDE: StatutCommande[] = ["Livrée", "Récupérée"]

export interface Commande {
  id: number
  numero: string
  date: string
  client: string
  lignes: LigneCommande[]
  total: number
  statut: StatutCommande
}

export const createColumns = (
  onEdit: (commande: Commande) => void,
  onDelete: (commande: Commande) => void,
  onViewDetails: (commande: Commande) => void,
  onEffectuerPaiement: (commande: Commande) => void,
  paiements: Array<{ commandeId: number; montant: number }>
): Column<Commande>[] => [
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
    key: "paiement",
    header: "Paiement",
    accessor: (row) => {
      const totalPaye = paiements
        .filter((p) => p.commandeId === row.id)
        .reduce((sum, p) => sum + p.montant, 0)
      const reste = row.total - totalPaye

      return (
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-semibold">{row.total.toFixed(2)} Ar</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payé:</span>
            <span className="font-semibold text-green-600">
              {totalPaye.toFixed(2)} Ar
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reste:</span>
            <span
              className={`font-semibold ${
                reste <= 0 ? "text-green-600" : "text-orange-600"
              }`}
            >
              {reste.toFixed(2)} Ar
            </span>
          </div>
        </div>
      )
    },
  },
  {
    key: "paiementAction",
    header: "",
    accessor: (row) => {
      const totalPaye = paiements
        .filter((p) => p.commandeId === row.id)
        .reduce((sum, p) => sum + p.montant, 0)
      const reste = row.total - totalPaye

      if (reste <= 0) {
        return (
          <span className="text-sm text-muted-foreground italic">
            Déjà tout payé
          </span>
        )
      }

      return (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onEffectuerPaiement(row)
          }}
        >
          Effectuer un paiement
        </Button>
      )
    },
  },
  {
    key: "statut",
    header: "Statut",
    accessor: (row) => {
      const statutColors: Record<StatutCommande, string> = {
        Livrée: "text-green-600",
        Récupérée: "text-blue-600",
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

