import axios from "axios"

// Configuration de l'instance axios avec l'URL de base depuis les variables d'environnement
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Intercepteur pour ajouter le token d'authentification aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Si l'utilisateur n'est pas authentifié, rediriger vers la page de login
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("auth_user")
      window.location.href = "/auth/login"
    }
    return Promise.reject(error)
  }
)

export default api

