import React from 'react';
import { useTranslation } from 'react-i18next';

interface LoadingStateProps {
  loading?: boolean;
  error?: Error | null;
  empty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function LoadingState({
  loading,
  error,
  empty,
  emptyMessage,
  onRetry,
  children,
}: LoadingStateProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
        <p className="text-red-400 text-center" dir="auto">{error.message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-cyan-400 text-[#00373A] rounded-lg hover:bg-cyan-500 transition-colors"
          >
            {t('common.retry', 'إعادة المحاولة')}
          </button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-[#C2C7CE] text-center" dir="auto">
          {emptyMessage || t('common.noData', 'لا توجد بيانات')}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
