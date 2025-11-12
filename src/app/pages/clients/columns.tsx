import type { Column } from "@/components/tools/DataTable"
import * as React from "react"

export type TypePrixClient = "Gros" | "Détaillant" | "Consommateur"

export interface Client {
  id: number
  nom: string
  prenom: string
  email?: string
  telephone: string
  adresse?: string
  typePrix: TypePrixClient
}

export const createColumns = (
  onEdit: (client: Client) => void,
  onDelete: (client: Client) => void
): Column<Client>[] => [
  {
    key: "nom",
    header: "Nom",
  },
  {
    key: "prenom",
    header: "Prénom",
  },
  {
    key: "telephone",
    header: "Téléphone",
  },
  {
    key: "email",
    header: "Email",
  },
  {
    key: "adresse",
    header: "Adresse",
    className: "max-w-[300px] truncate",
  },
  {
    key: "typePrix",
    header: "Type de prix",
    accessor: (row) => {
      const typeColors = {
        Gros: "text-blue-600",
        Détaillant: "text-green-600",
        Consommateur: "text-orange-600",
      }
      return (
        <span className={typeColors[row.typePrix] || ""}>
          {row.typePrix}
        </span>
      )
    },
  },
  {
    key: "actions",
    header: "Actions",
    accessor: (row) => (
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(row)
          }}
          className="text-primary hover:text-primary/80 transition-colors"
          aria-label="Modifier"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(row)
          }}
          className="text-destructive hover:text-destructive/80 transition-colors"
          aria-label="Effacer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    ),
  },
]

