const AdminPage = () => (
  <div className="p-6 bg-card rounded-lg shadow border border-border">
    <h1 className="text-2xl font-bold text-destructive">Admin Panel</h1>
    <p className="mt-2 text-muted-foreground">
      Only System Administrators can see this page.
    </p>
  </div>
);

export default AdminPage;
