import api from "./api"
import type { LoginCredentials, LoginResponse, AuthError } from "@/types/auth"

/**
 * Service d'authentification
 */
export const authService = {
  /**
   * Connecte un utilisateur
   * @param credentials - Les identifiants de connexion (email et password)
   * @returns Les données de l'utilisateur et le token
   * @throws {AuthError} Si les identifiants sont incorrects
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>("/login", credentials)
      
      // Stocker le token et les informations utilisateur dans le localStorage
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token)
        localStorage.setItem("auth_user", JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error: any) {
      // Gérer les erreurs de validation
      if (error.response?.data?.errors) {
        const authError: AuthError = {
          message: error.response.data.message || "Erreur de connexion",
          errors: error.response.data.errors,
        }
        throw authError
      }
      
      // Gérer les autres erreurs
      const authError: AuthError = {
        message: error.response?.data?.message || "Une erreur est survenue lors de la connexion",
      }
      throw authError
    }
  },

  /**
   * Déconnecte l'utilisateur
   */
  async logout(): Promise<void> {
    try {
      await api.post("/logout")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    } finally {
      // Supprimer le token et les informations utilisateur du localStorage
      localStorage.removeItem("auth_token")
      localStorage.removeItem("auth_user")
    }
  },

  /**
   * Récupère l'utilisateur actuellement connecté depuis le localStorage
   * @returns L'utilisateur ou null si non connecté
   */
  getCurrentUser(): any | null {
    const userStr = localStorage.getItem("auth_user")
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
    return null
  },

  /**
   * Vérifie si l'utilisateur est authentifié
   * @returns true si l'utilisateur est authentifié, false sinon
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token")
  },

  /**
   * Récupère le token d'authentification
   * @returns Le token ou null
   */
  getToken(): string | null {
    return localStorage.getItem("auth_token")
  },
}

