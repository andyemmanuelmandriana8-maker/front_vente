import type { Column } from "@/components/tools/DataTable"

export interface Produit {
  id: number
  nom: string
  description: string
  prix: number
  stock: number
  categorie: string
}

export const columns: Column<Produit>[] = [
  {
    key: "id",
    header: "ID",
  },
  {
    key: "nom",
    header: "Nom",
  },
  {
    key: "description",
    header: "Description",
    className: "max-w-[300px] truncate",
  },
  {
    key: "prix",
    header: "Prix",
    accessor: (row) => `${row.prix.toFixed(2)} €`,
  },
  {
    key: "stock",
    header: "Stock",
    accessor: (row) => (
      <span className={row.stock < 50 ? "text-destructive" : ""}>
        {row.stock}
      </span>
    ),
  },
  {
    key: "categorie",
    header: "Catégorie",
  },
]

