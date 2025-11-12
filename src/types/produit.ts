// Types pour les produits et catégories

export interface Category {
  id: number
  nom: string
  produits_count?: number
  created_at?: string
  updated_at?: string
}

export interface Produit {
  id: number
  nom: string
  prix_gros: number
  prix_detaillant: number
  prix_consommateur: number
  category_id: number
  category?: Category
  created_at?: string
  updated_at?: string
}

export interface ProduitFormData {
  nom: string
  prix_gros: number
  prix_detaillant: number
  prix_consommateur: number
  category_id: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

