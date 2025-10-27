import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100">
    <h1 className="text-4xl font-bold text-gray-800">404 - Not Found</h1>
    <p className="mt-4 text-lg text-gray-700">
      The page you are looking for does not exist.
    </p>
    <Link
      to="/"
      className="px-4 py-2 mt-6 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
    >
      Go to Dashboard
    </Link>
  </div>
);

export default NotFoundPage;
