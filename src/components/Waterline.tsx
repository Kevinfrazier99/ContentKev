'use client';

import { cn } from '@/lib/utils';

interface WaterlineProps {
  dark?: boolean;
  className?: string;
}

export function Waterline({ dark = false, className }: WaterlineProps) {
  return (
    <div className={cn('waterline', dark && 'waterline-dark', className)}>
      <i className="line-1" />
      <i className="line-2" />
    </div>
  );
}
