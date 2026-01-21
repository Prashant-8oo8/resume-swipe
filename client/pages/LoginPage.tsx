import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { Heart, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = login(email, password);
      if (success) {
        // Redirect based on role will be handled by useEffect in pages
        navigate("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials hint
  const demoAccounts = [
    { email: "hr.manager@techcorp.com", password: "password123", role: "HR Manager" },
    { email: "john.doe@example.com", password: "password123", role: "Candidate" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 mb-3">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">TalentSwipe</h1>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-600 mb-6">Sign in to your account to continue</p>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-900">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-900">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-pink-600 hover:text-pink-700">
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-8 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm font-semibold text-blue-900 mb-3">Demo Accounts</p>
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <div key={account.email} className="text-xs text-blue-800">
                <p className="font-medium">{account.role}:</p>
                <p className="text-blue-700 break-all">
                  {account.email} / {account.password}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
