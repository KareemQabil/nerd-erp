import { useAuth } from "@/hooks/useAuth";
import { Link, Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export const AppLayout = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card shadow-sm">
        <div className="container px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <span className="text-lg font-bold text-primary">My App</span>
              {/* Nav Links */}
              <Link 
                to="/" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/manage" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Management
              </Link>
              <Link 
                to="/admin" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-foreground">Welcome, {user?.fullNameEn}</span>
              <ThemeToggle />
              <button
                onClick={signOut}
                className="px-3 py-1 text-sm font-medium text-destructive-foreground bg-destructive rounded-md hover:bg-destructive/90 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container p-8 mx-auto max-w-7xl">
        <Outlet /> {/* Child routes will render here */}
      </main>
    </div>
  );
};
