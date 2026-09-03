import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <span className="font-mono text-sm text-primary font-semibold">404</span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mt-4 mb-6">
          This page isn't <span className="text-primary">here</span>.
        </h1>
        <p className="text-lg text-foreground/70 font-medium mb-10">
          The link may be old or mistyped. The work, the process and the way to reach us are all on the
          home page.
        </p>
        <a href="/" className="btn-primary inline-flex">
          Back to home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
