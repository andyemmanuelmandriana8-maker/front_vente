// Types pour l'authentification

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface LoginResponse {
  message: string
  user: User
  token: string
}

export interface AuthError {
  message: string
  errors?: {
    email?: string[]
    password?: string[]
  }
}

