"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";

const BASE_URL = "https://user-authentication-api-jqfm.onrender.com/api/v2/users";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  interface Message {
    text: string;
    type: string;
  }

  interface LoginResponse {
    token: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setIsLoading(true);

    try {
      const response = await axios.post<LoginResponse>(`${BASE_URL}/login`, { email, password });
      localStorage.setItem("auth-token", response.data.token);
      setMessage({ text: "Login successful!", type: "success" });
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 200);
    } catch (error: any) {
      setMessage({ text: error.response?.data?.message || "An error occurred.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required disabled={isLoading} />
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required disabled={isLoading} />
          <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</Button>
        </form>
        {message.text && <Alert className={`mt-4 ${message.type === "error" ? "text-red-600" : "text-green-600"}`}><AlertDescription>{message.text}</AlertDescription></Alert>}
        <p className="mt-4 text-center">Don't have an account? <Link href="/register" className="text-primary">Register here</Link></p>
      </div>
    </div>
  );
}
