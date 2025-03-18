import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import axios from "axios"

const BASE_URL = "https://user-authentication-api-jqfm.onrender.com/api/v2/users"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.email || !body.password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const response = await axios.post(`${BASE_URL}/login`, body)

    if (!response.data || !response.data.token) {
      return NextResponse.json({ message: "Invalid response from authentication server" }, { status: 500 })
    }

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", response.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      message: "Login successful",
      user: response.data.user || null,
    })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || "Login failed" },
        { status: error.response?.status || 500 },
      )
    }
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}

