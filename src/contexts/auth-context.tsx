"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios, { type AxiosError } from "axios"

const BASE_URL = "https://user-authentication-api-jqfm.onrender.com/api/v2/users"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      const token = localStorage.getItem("auth-token")

      if (token) {
        try {
          // You could validate the token with the server here
          // For now, we'll just check if it exists
          setIsAuthenticated(true)

          // Try to get user info from localStorage
          const userInfo = localStorage.getItem("user-info")
          if (userInfo) {
            setUser(JSON.parse(userInfo))
          }
        } catch (error) {
          console.error("Auth check error:", error)
          localStorage.removeItem("auth-token")
          localStorage.removeItem("user-info")
          setIsAuthenticated(false)
          setUser(null)
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, password })

      if (response.data && response.data.token) {
        localStorage.setItem("auth-token", response.data.token)

        if (response.data.user) {
          setUser(response.data.user)
          localStorage.setItem("user-info", JSON.stringify(response.data.user))
        }

        setIsAuthenticated(true)

        return { success: true, message: "Login successful" }
      } else {
        return { success: false, message: "Invalid response from server" }
      }
    } catch (error) {
      console.error("Login error:", error)
      const axiosError = error as AxiosError<{ message: string }>
      return {
        success: false,
        message: axiosError.response?.data?.message || "Login failed. Please check your credentials.",
      }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.post(`${BASE_URL}/register`, {
        name,
        email,
        password,
      })

      return { success: true, message: "Registration successful" }
    } catch (error) {
      console.error("Registration error:", error)
      const axiosError = error as AxiosError<{ message: string }>
      return {
        success: false,
        message: axiosError.response?.data?.message || "Registration failed. Please try again.",
      }
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem("auth-token")

      if (token) {
        await axios.post(
          `${BASE_URL}/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("auth-token")
      localStorage.removeItem("user-info")
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

