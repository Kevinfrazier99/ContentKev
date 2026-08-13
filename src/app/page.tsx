'use client';

import { useState } from 'react';
import { ScrollExpandHero } from '@/components/ScrollExpandHero';
import { FocusCards, VideoCard } from '@/components/FocusCards';
import { NicheCard } from '@/components/NicheCard';
import { ContactForm } from '@/components/ContactForm';
import { Waterline } from '@/components/Waterline';

const portfolioCards: VideoCard[] = [
  {
    title: 'Akaso EK7000 Showcase',
    src: '/videos/Akaso Vid 2.mp4',
    category: 'tech',
  },
  {
    title: 'Smalls Talking Head Funny Voice',
    src: '/videos/Cat POV Talking head + funny voiceover1.mp4',
    category: 'animals',
  },
];

type FilterType = 'all' | 'tech' | 'wellness' | 'animals';

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredCards = activeFilter === 'all' 
    ? portfolioCards 
    : portfolioCards.filter(card => card.category === activeFilter);

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Tech', value: 'tech' },
    { label: 'Fitness & Outdoors', value: 'wellness' },
    { label: 'Animals', value: 'animals' },
  ];

  return (
    <main>
      {/* Hero with scroll expansion */}
      <ScrollExpandHero
        mediaType="video"
        mediaSrc="/videos/herov1.mp4"
        bgImageSrc="/images/hero-bg.svg"
        kicker=""
        titleLine1="Are You Giving Viewers"
        titleLine2="the full story?"
        scrollToExpand="Scroll to explore"
      >
        {/* About Section */}
        <section id="about" className="py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Intro Video */}
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0 w-full overflow-hidden" style={{ background: 'var(--deep)' }}>
              <video
                src="/videos/Kevin F UGC Intro.mp4#t=13"
                className="w-full h-full object-cover"
                controls
                playsInline
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-gradient-to-t from-black/60 to-transparent">
                <span 
                  className="label absolute bottom-4 left-4"
                  style={{ color: 'var(--salt)' }}
                >
                  Intro Video
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-6">
              <p 
                className="label"
                style={{ color: 'var(--shallows)' }}
              >
                About
              </p>
              
              <h2 
                className="display text-3xl md:text-4xl lg:text-5xl"
                style={{ color: 'var(--deep)' }}
              >
                Kevin Frazier
              </h2>
              
              <div className="flex flex-col gap-4 body-text" style={{ color: 'var(--deep)' }}>
                <p>
                  San Diego, in a bungalow over the ocean. I focus on UGC for tech and app brands, with fitness, wellness, and pet content running alongside it. Perks include full podcast studio access, a couples-content partner, and two cats are already content pros. 
                  I'd love to work with you if your brand involves tech and gadgets, sports and wellness, anything with animals, or the anything ocean related.
                </p>
                <p>
                  My background in design and dev means every product review is coming from someone who's built brands and every tech demo is coming from someone who's shipped products. 
                  I make content about things I like for brands I believe in and it shows in the results.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Waterline className="my-8 md:my-12" />

        {/* Niches Section */}
        <section id="niches" className="py-12 md:py-20">
          <p 
            className="label mb-8"
            style={{ color: 'var(--shallows)' }}
          >
            Content Niches
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <NicheCard
              number="01"
              title="Tech & Gadgets"
              description="Cameras, apps, smart home, and gear that actually works in the field."
              temperature="teal"
              href="#portfolio"
            />
            <NicheCard
              number="02"
              title="Fitness & Outdoors"
              description="Surfing, paddleboarding, cold plunges, and everything that keeps you moving."
              temperature="warm"
              href="#portfolio"
            />
            <NicheCard
              number="03"
              title="Pets & Animals"
              description="Dogs at the beach, pet gear reviews, and the chaos of animal life."
              temperature="marine"
              href="#portfolio"
            />
          </div>
        </section>

        <Waterline className="my-8 md:my-12" />

        {/* Portfolio Grid */}
        <section id="portfolio" className="py-12 md:py-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <p 
                className="label mb-2"
                style={{ color: 'var(--shallows)' }}
              >
                Recent Work
              </p>
              <h2 
                className="display text-2xl md:text-3xl"
                style={{ color: 'var(--deep)' }}
              >
                Portfolio
              </h2>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-6 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`filter-tab ${activeFilter === filter.value ? 'active' : ''}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <FocusCards cards={filteredCards} />
        </section>
      </ScrollExpandHero>

      {/* Contact Section - Dark ground */}
      <section 
        id="contact" 
        className="py-20 md:py-32"
        style={{ 
          background: 'var(--deep)',
          paddingLeft: 'var(--pad)',
          paddingRight: 'var(--pad)'
        }}
      >
        <Waterline dark className="mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="flex flex-col gap-6">
            <p 
              className="label"
              style={{ color: 'var(--shallows)' }}
            >
              Work With Me
            </p>
            
            <h2 
              className="display text-3xl md:text-4xl lg:text-5xl"
              style={{ color: 'var(--salt)' }}
            >
              Let&apos;s create
            </h2>
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase"
              style={{ color: 'var(--salt)', letterSpacing: '-0.01em' }}
            >
              something real.
            </h2>

            <p 
              className="body-text mt-4"
              style={{ color: 'var(--mist)' }}
            >
              Looking for UGC that feels real because it is. Reach out with your project details 
              and I&apos;ll get back to you within 48 hours.
            </p>
          </div>

          <ContactForm />
        </div>

        {/* Footer */}
        <div className="mt-20 pt-12" style={{ borderTop: '1px solid var(--rule-dark)' }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Closing quote */}
            <p 
              className="pull-quote text-lg md:text-xl max-w-none"
              style={{ color: 'var(--mist)' }}
            >
              Thanks for stopping by!
            </p>
          </div>

          <p 
            className="mt-8 text-xs"
            style={{ color: 'rgba(203,218,220,0.5)' }}
          >
            © {new Date().getFullYear()} Kevin Frazier. San Diego, CA.
          </p>
        </div>
      </section>
    </main>
  );
}
