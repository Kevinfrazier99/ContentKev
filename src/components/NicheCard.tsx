'use client';

import { cn } from '@/lib/utils';
import { Waterline } from './Waterline';

interface NicheCardProps {
  number: string;
  title: string;
  description: string;
  temperature: 'teal' | 'warm' | 'marine';
  href: string;
}

export function NicheCard({ number, title, description, temperature, href }: NicheCardProps) {
  const gradients = {
    teal: 'radial-gradient(ellipse at top right, rgba(26,140,140,0.6) 0%, transparent 60%), linear-gradient(135deg, var(--deep) 0%, #050f14 100%)',
    warm: 'radial-gradient(ellipse at bottom right, rgba(228,99,60,0.5) 0%, transparent 60%), linear-gradient(135deg, var(--marine) 0%, var(--deep) 100%)',
    marine: 'radial-gradient(ellipse at top left, rgba(228,99,60,0.25) 0%, transparent 50%), linear-gradient(135deg, var(--marine) 0%, var(--deep) 100%)',
  };

  return (
    <a
      href={href}
      className={cn(
        'relative flex flex-col justify-between p-6 md:p-8 min-h-[320px] md:min-h-[400px]',
        'transition-transform duration-300 ease-out hover:scale-[1.02]',
        'group'
      )}
      style={{ background: gradients[temperature] }}
    >
      {/* Number */}
      <div 
        className="display text-6xl md:text-7xl lg:text-8xl"
        style={{ color: 'var(--salt)', opacity: 0.15 }}
      >
        {number}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 mt-auto">
        {/* Waterline */}
        <Waterline dark className="mb-2" />

        {/* Title */}
        <h3 
          className="subhead text-lg md:text-xl"
          style={{ color: 'var(--salt)' }}
        >
          {title}
        </h3>

        {/* Description */}
        <p 
          className="text-sm md:text-base leading-relaxed"
          style={{ color: 'var(--mist)', maxWidth: '28ch' }}
        >
          {description}
        </p>

        {/* Arrow indicator */}
        <div 
          className="flex items-center gap-2 mt-2 label text-xs transition-transform duration-300 group-hover:translate-x-2"
          style={{ color: temperature === 'teal' ? 'var(--shallows)' : temperature === 'warm' ? 'var(--persimmon)' : 'var(--mist)' }}
        >
          View work →
        </div>
      </div>
    </a>
  );
}
