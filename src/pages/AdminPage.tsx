import { useTranslation } from 'react-i18next';

const AdminPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 bg-card rounded-lg shadow border border-border">
      <h1 className="text-2xl font-bold text-destructive">
        {t('pages.admin.title')}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {t('pages.admin.description')}
      </p>
    </div>
  );
};

export default AdminPage;
