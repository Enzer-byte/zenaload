"use client";

import { Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/admin/login", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }) 
      });
      
      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1236] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#1E3BCB] opacity-20 blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#4B3FD6] opacity-20 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl z-10 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-[#F4F6FB] rounded-xl border border-[#E0E5F1] flex items-center justify-center">
              <Lock className="text-[#0A1236]" size={24} />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#0A1236] tracking-tight">Admin Portal</h1>
            <p className="text-slate-500 mt-2 text-sm">Sign in to access the operations console.</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="password">
                Master Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#E0E5F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3BCB] focus:border-transparent transition-shadow text-slate-900"
                placeholder="Enter password..."
                required
              />
            </div>
            
            {error && (
              <p role="alert" className="text-sm font-medium text-red-500 mt-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E3BCB] hover:bg-[#18246B] text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Authenticate"}
            </button>
          </form>
        </div>
        
        <div className="px-8 py-5 bg-slate-50 border-t border-[#E0E5F1] text-center">
          <p className="text-xs text-slate-500">
            Secure connection established. <br />
            Unauthorized access is strictly prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
