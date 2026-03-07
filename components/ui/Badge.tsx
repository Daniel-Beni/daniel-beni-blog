import { cn } from '@/lib/utils';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  className?: string;
  key?: React.Key;
}

export function Badge({ children, variant = 'secondary', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-primary-100 text-primary-800': variant === 'primary',
          'bg-gray-100 text-gray-800': variant === 'secondary',
          'bg-green-100 text-green-800': variant === 'success',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
          'bg-red-100 text-red-800': variant === 'danger',
          'border border-gray-300 bg-transparent': variant === 'outline',
        },
        className
      )}
    >
      {children}
    </span>
  );
}