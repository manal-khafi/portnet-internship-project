import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-2 rounded-xl border-2 font-display text-sm',
  {
    variants: {
      variant: {
        success: 'bg-green-500/10 border-green-500/30 text-green-600',
        warning: 'bg-orange-500/10 border-orange-500/30 text-orange-600',
        danger: 'bg-red-500/10 border-red-500/30 text-red-600',
        info: 'bg-blue-500/10 border-blue-500/30 text-blue-600',
        default: 'bg-gray-100 border-gray-200 text-gray-700',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: ReactNode;
  pulse?: boolean;
}

export function Badge({
  className,
  variant,
  size,
  children,
  pulse = false,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {pulse && (
        <div
          className={cn(
            'w-2 h-2 rounded-full animate-pulse',
            variant === 'success' && 'bg-green-600',
            variant === 'warning' && 'bg-orange-600',
            variant === 'danger' && 'bg-red-600',
            variant === 'info' && 'bg-blue-600',
            variant === 'default' && 'bg-gray-600'
          )}
        />
      )}
      {children}
    </div>
  );
}
