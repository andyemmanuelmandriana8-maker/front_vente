import api from "./api"
import type { Produit, ProduitFormData, ApiResponse } from "@/types/produit"

/**
 * Service pour gérer les produits
 */
export const produitService = {
  /**
   * Récupère tous les produits
   */
  async getAll(): Promise<Produit[]> {
    const response = await api.get<ApiResponse<Produit[]>>("/produits")
    return response.data.data
  },

  /**
   * Récupère un produit par son ID
   */
  async getById(id: number): Promise<Produit> {
    const response = await api.get<ApiResponse<Produit>>(`/produits/${id}`)
    return response.data.data
  },

  /**
   * Crée un nouveau produit
   */
  async create(data: ProduitFormData): Promise<Produit> {
    const response = await api.post<ApiResponse<Produit>>("/produits", data)
    return response.data.data
  },

  /**
   * Met à jour un produit
   */
  async update(id: number, data: ProduitFormData): Promise<Produit> {
    const response = await api.put<ApiResponse<Produit>>(`/produits/${id}`, data)
    return response.data.data
  },

  /**
   * Supprime un produit
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/produits/${id}`)
  },
}

