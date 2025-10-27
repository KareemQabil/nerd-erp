import { Link } from "react-router-dom";

const UnauthorizedPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background">
    <h1 className="text-4xl font-bold text-destructive">Access Denied</h1>
    <p className="mt-4 text-lg text-muted-foreground">
      You do not have permission to view this page.
    </p>
    <Link
      to="/"
      className="px-4 py-2 mt-6 font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
    >
      Go to Dashboard
    </Link>
  </div>
);

export default UnauthorizedPage;
