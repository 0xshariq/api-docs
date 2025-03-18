import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import axios from "axios"

const BASE_URL = "https://user-authentication-api-jqfm.onrender.com/api/v2/users"

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")

    if (token) {
      try {
        // Make API request to logout
        await axios.post(
          `${BASE_URL}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          },
        )
      } catch (apiError) {
        console.error("API logout error:", apiError)
        // Continue with local logout even if API call fails
      }
    }

    // Always clear the cookie
    cookieStore.delete("auth-token")

    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)

    // Still delete the cookie even if there's an error
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");

    return NextResponse.json({ message: "Logged out successfully" })
  }
}

