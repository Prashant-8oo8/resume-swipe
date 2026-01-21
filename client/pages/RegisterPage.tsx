import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { Heart, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [userType, setUserType] = useState<"candidate" | "hr">("candidate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { registerCandidate, registerHR } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const success =
        userType === "candidate"
          ? registerCandidate(email, password, name)
          : registerHR(email, password, name);

      if (success) {
        navigate("/");
      } else {
        setError("Email already in use");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h2>
          <p className="text-slate-600 mb-6">Choose your account type and get started</p>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Account Type Selection */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => setUserType("candidate")}
              className={`p-4 rounded-lg border-2 transition-all text-center font-semibold ${
                userType === "candidate"
                  ? "border-pink-500 bg-pink-50 text-pink-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <div className="text-sm">👤</div>
              <div className="text-sm mt-1">Candidate</div>
            </button>
            <button
              onClick={() => setUserType("hr")}
              className={`p-4 rounded-lg border-2 transition-all text-center font-semibold ${
                userType === "hr"
                  ? "border-pink-500 bg-pink-50 text-pink-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <div className="text-sm">💼</div>
              <div className="text-sm mt-1">HR Manager</div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-900">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-10"
              />
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-900">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-10"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-pink-600 hover:text-pink-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
