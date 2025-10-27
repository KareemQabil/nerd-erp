import { Link } from "react-router-dom";

const UnauthorizedPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100">
    <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
    <p className="mt-4 text-lg text-gray-700">
      You do not have permission to view this page.
    </p>
    <Link
      to="/"
      className="px-4 py-2 mt-6 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
    >
      Go to Dashboard
    </Link>
  </div>
);

export default UnauthorizedPage;
