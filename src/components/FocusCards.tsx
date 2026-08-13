'use client';

import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface VideoCard {
  title: string;
  src: string;
  category: 'tech' | 'wellness' | 'animals';
  videoSrc?: string;
}

const isVideoFile = (path: string) => {
  return /\.(mp4|webm|mov|avi)$/i.test(path);
};

const Lightbox = ({ 
  card, 
  onClose 
}: { 
  card: VideoCard | null; 
  onClose: () => void;
}) => {
  const lightboxVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!card) return null;

  const videoSource = card.videoSrc || card.src;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        style={{ background: 'rgba(10, 41, 56, 0.95)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-4xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            style={{ fontSize: '2rem', lineHeight: 1 }}
          >
            ×
          </button>

          {/* Video */}
          <div className="relative w-full" style={{ aspectRatio: '9/16', maxHeight: '80vh' }}>
            <video
              ref={lightboxVideoRef}
              src={videoSource}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
              style={{ background: 'var(--deep)' }}
            />
          </div>

          {/* Title */}
          <div className="mt-4">
            <h3 
              className="subhead text-lg md:text-xl"
              style={{ color: 'var(--salt)' }}
            >
              {card.title}
            </h3>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    onCardClick,
  }: {
    card: VideoCard;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    onCardClick: (card: VideoCard) => void;
  }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    }, []);

    useEffect(() => {
      if (videoRef.current && !prefersReducedMotion) {
        if (hovered === index) {
          // Delay autoplay by 1 second
          const playTimeout = setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
          }, 1000);

          return () => clearTimeout(playTimeout);
        } else {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }
    }, [hovered, index, prefersReducedMotion]);

    const categoryColors = {
      tech: 'var(--shallows)',
      wellness: 'var(--persimmon)',
      animals: 'var(--marine)',
    };

    const isThumbnailVideo = isVideoFile(card.src);
    // Use videoSrc if provided, otherwise use src if it's a video
    const hoverVideoSrc = card.videoSrc || (isThumbnailVideo ? card.src : null);

    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => onCardClick(card)}
        className="relative overflow-hidden cursor-pointer"
        style={{
          aspectRatio: '9/16',
          background: 'var(--deep)',
        }}
      >
        {/* Media wrapper - only this blurs/scales on hover, text stays sharp */}
        <div
          className={cn(
            'absolute inset-0 transition-all duration-300 ease-out',
            hovered !== index && 'blur-sm scale-[0.98]'
          )}
        >
          {/* Thumbnail - image or video */}
          {isThumbnailVideo ? (
            <video
              src={card.src}
              muted
              playsInline
              autoPlay
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ backgroundColor: 'var(--deep)' }}
              onCanPlay={(e) => {
                // Pause immediately to show first frame as thumbnail
                const video = e.currentTarget;
                video.pause();
                video.currentTime = 0.1;
              }}
            />
          ) : (
            <Image
              src={card.src}
              alt={card.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover"
            />
          )}

          {/* Video on hover */}
          {hoverVideoSrc && (
            <video
              ref={videoRef}
              src={hoverVideoSrc}
              muted
              loop
              playsInline
              className={cn(
                'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
                hovered === index ? 'opacity-100' : 'opacity-0'
              )}
            />
          )}
        </div>

        {/* Category indicator */}
        <div 
          className="absolute top-3 left-3 z-10 label"
          style={{ 
            color: categoryColors[card.category],
            fontSize: '0.625rem'
          }}
        >
          {card.category.toUpperCase()}
        </div>

        {/* Gradient scrim and title */}
        <div
          className={cn(
            'absolute inset-0 z-10 flex items-end p-4 transition-opacity duration-300',
            hovered === index ? 'opacity-100' : 'opacity-70'
          )}
          style={{
            background: 'linear-gradient(to top, rgba(10,41,56,0.9) 0%, rgba(10,41,56,0.4) 40%, transparent 70%)',
          }}
        >
          <div 
            className="subhead text-sm md:text-base"
            style={{ color: 'var(--salt)' }}
          >
            {card.title}
          </div>
        </div>

        {/* Waterline accent */}
        <div 
          className="absolute bottom-0 left-0 right-0 z-10 h-[2px]"
          style={{ 
            background: `linear-gradient(to right, ${categoryColors[card.category]}, transparent)`,
            opacity: hovered === index ? 1 : 0.5,
            transition: 'opacity 0.3s ease'
          }}
        />
      </div>
    );
  }
);

Card.displayName = 'Card';

export function FocusCards({ cards }: { cards: VideoCard[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [lightboxCard, setLightboxCard] = useState<VideoCard | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full">
        {cards.map((card, index) => (
          <Card
            key={card.title + index}
            card={card}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
            onCardClick={setLightboxCard}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightboxCard && (
        <Lightbox 
          card={lightboxCard} 
          onClose={() => setLightboxCard(null)} 
        />
      )}
    </>
  );
}
