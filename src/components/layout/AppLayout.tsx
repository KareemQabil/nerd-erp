import { useAuth } from "@/hooks/useAuth";
import { Link, Outlet } from "react-router-dom";

export const AppLayout = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <span className="text-lg font-bold text-indigo-600">My App</span>
              {/* Nav Links */}
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link to="/manage" className="text-gray-600 hover:text-gray-900">
                Management
              </Link>
              <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.fullNameEn}</span>
              <button
                onClick={signOut}
                className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
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
