import React from 'react';
import { useTheme } from '../core/theme/theme-provider';

interface ThemedTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  variant?: 'display' | 'headline' | 'title' | 'body' | 'label';
  size?: 'large' | 'medium' | 'small';
  className?: string;
}

export function ThemedText({ 
  children, 
  variant = 'body', 
  size = 'medium',
  className = '',
  ...props 
}: ThemedTextProps) {
  const { theme } = useTheme();

  const getTextColor = () => {
    if (theme === 'dark') return 'text-[#E2E2E6]';
    if (theme === 'luxury') return 'text-white';
    return 'text-[#0D3B52]';
  };

  return (
    <p 
      className={`${getTextColor()} ${className}`}
      dir="auto"
      {...props}
    >
      {children}
    </p>
  );
}
