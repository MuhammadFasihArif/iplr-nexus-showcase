import { useLocation } from "react-router-dom";
import { useEffect } from "react";
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
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl font-academic font-bold text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-academic font-semibold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-lg font-body text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to exploring our academic resources.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            asChild
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-medium px-8 py-6 rounded-full"
          >
            <a href="/">Return to Homepage</a>
          </Button>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Button variant="outline" asChild className="font-body">
              <a href="#articles">Browse Articles</a>
            </Button>
            <Button variant="outline" asChild className="font-body">
              <a href="#research">View Research</a>
            </Button>
            <Button variant="outline" asChild className="font-body">
              <a href="#videos">Watch Videos</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
