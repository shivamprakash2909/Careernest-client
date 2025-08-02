import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Briefcase, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminAuth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/admin/login", {
        email,
        password,
      });

      const { token, admin } = response.data;
      
      // Store admin token and data
      localStorage.setItem("admin-token", token);
      localStorage.setItem("admin-data", JSON.stringify(admin));
      localStorage.setItem("admin-auth", "true");

      if (onLogin) onLogin();
      navigate("/p/adminpage");
    } catch (error) {
      console.error("Admin login error:", error);
      setError(
        error.response?.data?.error || 
        "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Check if admin is already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem("admin-token");
    const adminAuth = localStorage.getItem("admin-auth");
    
    if (adminToken && adminAuth === "true") {
      if (onLogin) onLogin();
      navigate("/p/adminpage");
    }
  }, [navigate, onLogin]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@careernest.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700" 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
