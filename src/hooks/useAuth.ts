import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "@/services/authService"
import type { LoginCredentials, LoginResponse, AuthError } from "@/types/auth"

interface UseAuthReturn {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  isLoading: boolean
  error: AuthError | null
  isAuthenticated: boolean
  user: any | null
}

/**
 * Hook personnalisé pour gérer l'authentification
 */
export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const navigate = useNavigate()

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      await authService.login(credentials)
      // Rediriger vers le dashboard après une connexion réussie
      navigate("/pages/dashboard")
    } catch (err: any) {
      setError(err as AuthError)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      // Rediriger vers la page de login après déconnexion
      navigate("/auth/login")
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    login,
    logout,
    clearError,
    isLoading,
    error,
    isAuthenticated: authService.isAuthenticated(),
    user: authService.getCurrentUser(),
  }
}

