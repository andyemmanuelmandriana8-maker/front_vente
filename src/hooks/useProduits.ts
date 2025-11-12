import { useState, useEffect, useCallback } from "react"
import { produitService } from "@/services/produitService"
import { categoryService } from "@/services/categoryService"
import type { Produit, ProduitFormData, Category } from "@/types/produit"

interface UseProduitsReturn {
  produits: Produit[]
  categories: Category[]
  isLoading: boolean
  error: string | null
  loadProduits: () => Promise<void>
  loadCategories: () => Promise<void>
  createProduit: (data: ProduitFormData) => Promise<void>
  updateProduit: (id: number, data: ProduitFormData) => Promise<void>
  deleteProduit: (id: number) => Promise<void>
}

/**
 * Hook personnalisé pour gérer les produits
 */
export function useProduits(): UseProduitsReturn {
  const [produits, setProduits] = useState<Produit[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProduits = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await produitService.getAll()
      setProduits(data)
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors du chargement des produits")
      console.error("Erreur lors du chargement des produits:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadCategories = useCallback(async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (err: any) {
      console.error("Erreur lors du chargement des catégories:", err)
    }
  }, [])

  const createProduit = useCallback(async (data: ProduitFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      await produitService.create(data)
      await loadProduits()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erreur lors de la création du produit"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [loadProduits])

  const updateProduit = useCallback(async (id: number, data: ProduitFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      await produitService.update(id, data)
      await loadProduits()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erreur lors de la mise à jour du produit"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [loadProduits])

  const deleteProduit = useCallback(async (id: number) => {
    setIsLoading(true)
    setError(null)
    try {
      await produitService.delete(id)
      await loadProduits()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erreur lors de la suppression du produit"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [loadProduits])

  useEffect(() => {
    loadProduits()
    loadCategories()
  }, [loadProduits, loadCategories])

  return {
    produits,
    categories,
    isLoading,
    error,
    loadProduits,
    loadCategories,
    createProduit,
    updateProduit,
    deleteProduit,
  }
}

