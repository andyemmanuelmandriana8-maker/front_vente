/**
 * Configuration des variables d'environnement
 * 
 * Pour utiliser ces variables, créez un fichier .env à la racine du projet
 * avec le contenu suivant :
 * 
 * VITE_API_URL=http://localhost:8000/api
 */

export const env = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
} as const

