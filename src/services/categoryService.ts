import api from "./api"
import type { Category, ApiResponse } from "@/types/produit"

/**
 * Service pour gérer les catégories
 */
export const categoryService = {
  /**
   * Récupère toutes les catégories
   */
  async getAll(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>("/categories")
    return response.data.data
  },

  /**
   * Récupère une catégorie par son ID
   */
  async getById(id: number): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`)
    return response.data.data
  },

  /**
   * Crée une nouvelle catégorie
   */
  async create(data: { nom: string }): Promise<Category> {
    const response = await api.post<ApiResponse<Category>>("/categories", data)
    return response.data.data
  },

  /**
   * Met à jour une catégorie
   */
  async update(id: number, data: { nom: string }): Promise<Category> {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, data)
    return response.data.data
  },

  /**
   * Supprime une catégorie
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/categories/${id}`)
  },
}

