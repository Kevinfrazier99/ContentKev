'use client';

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Waterline } from './Waterline';

interface ScrollExpandHeroProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  kicker?: string;
  titleLine1?: string;
  titleLine2?: string;
  scrollToExpand?: string;
  children?: ReactNode;
}

const SSR_VIEWPORT = { w: 1440, h: 900 };

export function ScrollExpandHero({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  kicker = 'GEAR · OCEAN · ANIMALS · SAN DIEGO',
  titleLine1 = 'Creating content',
  titleLine2 = 'that gets tested.',
  scrollToExpand = 'Scroll to explore',
  children,
}: ScrollExpandHeroProps) {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [viewport, setViewport] = useState(SSR_VIEWPORT);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const seekFrame = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const measure = (): void => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setScrollProgress(1);
      setMediaFullyExpanded(true);
      setShowContent(true);
      return;
    }

    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY, prefersReducedMotion]);

  // Metadata can land before React attaches a prop handler (cached video), which would
  // leave the duration at zero and freeze the scrub on frame one. Read it directly too.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const readDuration = (): void => {
      const { duration } = video;
      if (Number.isFinite(duration) && duration > 0) {
        setVideoDuration(duration);
      }
    };

    readDuration();
    video.addEventListener('loadedmetadata', readDuration);
    video.addEventListener('durationchange', readDuration);
    video.addEventListener('canplay', readDuration);

    return () => {
      video.removeEventListener('loadedmetadata', readDuration);
      video.removeEventListener('durationchange', readDuration);
      video.removeEventListener('canplay', readDuration);
    };
  }, [mediaSrc, mediaType]);

  const isMobileState = viewport.w < 768;

  // On mobile, autoplay the video. On desktop, scrub with scroll.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isMobileState) {
      // Mobile: just autoplay and loop
      video.loop = true;
      video.play().catch(() => {});
      return;
    }

    // Desktop: scrub the video based on scroll progress
    if (!videoDuration) return;

    if (seekFrame.current !== null) {
      cancelAnimationFrame(seekFrame.current);
    }

    seekFrame.current = requestAnimationFrame(() => {
      // Stop a hair short of the duration so the final frame stays painted.
      const target = Math.min(scrollProgress * videoDuration, videoDuration - 0.05);
      if (video.readyState >= 1 && Math.abs(video.currentTime - target) > 0.01) {
        video.currentTime = target;
      }
    });

    return () => {
      if (seekFrame.current !== null) {
        cancelAnimationFrame(seekFrame.current);
      }
    };
  }, [scrollProgress, videoDuration, isMobileState]);

  // The frame is flush with the top of the page and runs the full viewport height,
  // unless a narrow viewport would make a 9:16 frame overflow horizontally.
  const mediaHeight = Math.min(viewport.h, viewport.w * (16 / 9));

  // Exactly 9:16 at rest, widening to a cinematic frame as the scroll completes.
  const startWidth = mediaHeight * (9 / 16);
  const endWidth = Math.min(viewport.w, mediaHeight * (16 / 9));

  const mediaWidth = startWidth + scrollProgress * (endWidth - startWidth);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  return (
    <div
      ref={sectionRef}
      className="transition-colors duration-700 ease-in-out overflow-x-hidden"
      style={{ backgroundColor: 'var(--salt)' }}
    >
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
          {/* Background image */}
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <Image
              src={bgImageSrc}
              alt="Background"
              width={1920}
              height={1080}
              className="w-screen h-screen object-cover"
              priority
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(10,41,56,0.3) 0%, rgba(10,41,56,0.6) 100%)' }}
            />
          </motion.div>

          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center w-full h-[100dvh] relative">
              {/* Expanding media frame */}
              <div
                className="relative z-0 transition-none"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  boxShadow: '0px 0px 50px rgba(10, 41, 56, 0.4)',
                }}
              >
                {mediaType === 'video' ? (
                  mediaSrc.includes('youtube.com') ? (
                    <div className="relative w-full h-full pointer-events-none">
                      <iframe
                        width="100%"
                        height="100%"
                        src={
                          mediaSrc.includes('embed')
                            ? mediaSrc +
                              (mediaSrc.includes('?') ? '&' : '?') +
                              'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                            : mediaSrc.replace('watch?v=', 'embed/') +
                              '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' +
                              mediaSrc.split('v=')[1]
                        }
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <motion.div
                        className="absolute inset-0"
                        style={{ background: 'rgba(10,41,56,0.3)' }}
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-full pointer-events-none">
                      <video
                        ref={videoRef}
                        src={mediaSrc}
                        poster={posterSrc}
                        muted
                        playsInline
                        autoPlay={isMobileState}
                        loop={isMobileState}
                        preload="auto"
                        className="w-full h-full object-cover"
                        controls={false}
                        disablePictureInPicture
                        style={{ backgroundColor: 'var(--deep)' }}
                      />
                      <motion.div
                        className="absolute inset-0"
                        style={{ background: 'rgba(10,41,56,0.3)' }}
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={mediaSrc}
                      alt="Hero media"
                      width={1280}
                      height={720}
                      className="w-full h-full object-cover"
                    />
                    <motion.div
                      className="absolute inset-0"
                      style={{ background: 'rgba(10,41,56,0.5)' }}
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}
              </div>

              {/* Top-left branding text that fades in at 2/3 scroll */}
              <motion.div
                className="absolute left-6 z-20 flex flex-col gap-1 pointer-events-none md:left-8"
                style={{ top: '18%' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: scrollProgress >= 0.66 ? (scrollProgress - 0.66) / 0.34 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3
                  className="font-bold uppercase leading-tight"
                  style={{ 
                    color: 'var(--deep)', 
                    letterSpacing: '-0.01em',
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)'
                  }}
                >
                  Kevin Frazier
                </h3>
                <h4
                  className="font-light uppercase leading-tight"
                  style={{ 
                    color: 'var(--deep)', 
                    fontWeight: 200, 
                    letterSpacing: '0.01em',
                    fontSize: 'clamp(2rem, 5vw, 4rem)'
                  }}
                >
                  Scroll Stopper
                </h4>
                <p
                  className="uppercase mt-1"
                  style={{ 
                    color: 'var(--deep)', 
                    fontWeight: 600, 
                    letterSpacing: '0.1em',
                    fontSize: 'clamp(0.875rem, 2vw, 1.25rem)'
                  }}
                >
                  UGC Marketing · San Diego
                </p>
              </motion.div>

              {/* Scroll indicator, kept outside the frame so it can't affect its ratio */}
              <motion.p
                className="absolute left-0 right-0 text-center text-sm font-medium z-10"
                style={{
                  top: `${mediaHeight - 48}px`,
                  color: 'var(--mist)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 - scrollProgress * 2 }}
                transition={{ duration: 0.2 }}
              >
                {scrollToExpand}
              </motion.p>

              {/* Hero text overlay, centred on the media frame */}
              <div
                className="absolute left-0 right-0 flex flex-col items-center justify-center text-center gap-2 z-10 px-4 pointer-events-none"
                style={{
                  top: `${mediaHeight / 2}px`,
                  transform: 'translateY(-50%)',
                }}
              >
                {/* Kicker - only show if not empty */}
                {kicker && (
                  <motion.p
                    className="label mb-4"
                    style={{
                      color: 'var(--shallows)',
                      transform: `translateX(-${textTranslateX * 0.5}vw)`,
                    }}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 - scrollProgress * 1.5 }}
                  >
                    {kicker}
                  </motion.p>
                )}

                {/* Title line 1 - light weight */}
                <motion.h1
                  className="display text-4xl md:text-6xl lg:text-7xl xl:text-8xl transition-none"
                  style={{
                    color: 'var(--salt)',
                    transform: `translateX(-${textTranslateX}vw)`,
                  }}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 - scrollProgress * 1.2 }}
                >
                  {titleLine1}
                </motion.h1>

                {/* Title line 2 - heavy weight */}
                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase transition-none"
                  style={{
                    color: 'var(--salt)',
                    transform: `translateX(${textTranslateX}vw)`,
                    letterSpacing: '-0.01em',
                    lineHeight: 0.95,
                  }}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 - scrollProgress * 1.2 }}
                >
                  {titleLine2}
                </motion.h1>
              </div>
            </div>

            {/* Content that appears after expansion */}
            <motion.section
              className="flex flex-col w-full"
              style={{ paddingLeft: 'var(--pad)', paddingRight: 'var(--pad)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Waterline transition */}
              <div className="py-8">
                <Waterline />
              </div>
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
}
