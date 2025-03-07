import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Music, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-darkest text-white p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-app-accent flex items-center justify-center">
            <Music size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-app-accent">404</h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-6">
          Oops! This track couldn't be found
        </p>
        <p className="text-sm text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved to another URL
        </p>
        <Link to="/">
          <Button className="bg-app-accent hover:bg-app-accent/90 text-white font-medium rounded-full px-6 py-2 inline-flex items-center gap-2">
            <Home size={18} />
            <span>Return to Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
