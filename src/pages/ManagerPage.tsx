import { useTranslation } from 'react-i18next';

const ManagerPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 bg-card rounded-lg shadow border border-border">
      <h1 className="text-2xl font-bold text-primary">
        {t('pages.management.title')}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {t('pages.management.description')}
      </p>
    </div>
  );
};

export default ManagerPage;
