import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 inline-block rounded-full bg-pink-100 p-6">
          <Heart className="h-12 w-12 text-pink-600" />
        </div>
        <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
        <p className="text-xl text-slate-600 mb-2">Page Not Found</p>
        <p className="text-slate-600 mb-8">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
