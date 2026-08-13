'use client';

import { cn } from '@/lib/utils';

interface LogoSlotProps {
  size?: 'favicon' | 'nav' | 'hero' | 'thumbnail';
  dark?: boolean;
  className?: string;
  showLabel?: boolean;
}

const sizes = {
  favicon: { width: 32, height: 32 },
  nav: { width: 180, height: 48 },
  hero: { width: 64, height: 101 },
  thumbnail: { width: 34, height: 34 },
};

export function LogoSlot({ 
  size = 'nav', 
  dark = false, 
  className,
  showLabel = false 
}: LogoSlotProps) {
  const dimensions = sizes[size];
  
  return (
    <div
      className={cn(
        'logo-slot',
        dark && 'logo-slot-dark',
        className
      )}
      style={{ 
        width: dimensions.width, 
        height: dimensions.height 
      }}
    >
      {/* LOGO SLOT: egret mark, not yet finalized */}
      {showLabel && <span>Logo</span>}
    </div>
  );
}
