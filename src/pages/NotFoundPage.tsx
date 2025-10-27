import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background">
    <h1 className="text-4xl font-bold text-foreground">404 - Not Found</h1>
    <p className="mt-4 text-lg text-muted-foreground">
      The page you are looking for does not exist.
    </p>
    <Link
      to="/"
      className="px-4 py-2 mt-6 font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
    >
      Go to Dashboard
    </Link>
  </div>
);

export default NotFoundPage;
