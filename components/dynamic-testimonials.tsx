'use client';

import { useState, useEffect } from 'react';
import { AnimatedTestimonials } from '@/components/animated-testimonials';

interface TestimonialData {
  testimonial_id: number;
  testimonial_name: string;
  city: string;
  event_id: number;
  rating: number;
  testimonial: string;
  submitted_at: string;
  status: string;
  image_id: number;
  image_url: string;
  image_priority: number;
  image_is_active: boolean;
  image_created_at: string;
  image_updated_at: string;
}

export function DynamicTestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🔥 DynamicTestimonialsSection: Component rendered');
  console.log('🔥 DynamicTestimonialsSection: Current state:', {
    testimonialsCount: testimonials.length,
    isLoading,
    error
  });

  // Fetch testimonials data
  const fetchTestimonials = async () => {
    try {
      console.log('🔥 DynamicTestimonialsSection: Starting fetch...');

      const response = await fetch('http://localhost:3111/api/testimonials/get-all', {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      console.log('🔥 DynamicTestimonialsSection: Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔥 DynamicTestimonialsSection: Raw API response:', data);
      console.log('🔥 DynamicTestimonialsSection: Number of testimonials received:', data.length);

      // Filter only published testimonials and sort by priority
      const publishedTestimonials = data
        .filter((testimonial: TestimonialData) => {
          const isValid = testimonial.status === 'Published' && testimonial.image_is_active;
          console.log(`🔥 DynamicTestimonialsSection: Testimonial ${testimonial.testimonial_id}: status=${testimonial.status}, active=${testimonial.image_is_active}, valid=${isValid}`);
          return isValid;
        })
        .sort((a: TestimonialData, b: TestimonialData) => a.image_priority - b.image_priority);

      console.log('🔥 DynamicTestimonialsSection: Filtered published testimonials:', publishedTestimonials.length);
      setTestimonials(publishedTestimonials);
      setIsLoading(false);
    } catch (error) {
      console.error('🔥 DynamicTestimonialsSection: Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load testimonials');
      setTestimonials([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔥 DynamicTestimonialsSection: useEffect FINALLY CALLED! - starting fetch');
    fetchTestimonials();
    

  }, []);

  // Transform testimonials to match AnimatedTestimonials format
  const transformedTestimonials = testimonials.map((testimonial) => {
    let imageUrl = testimonial.image_url;
    
    // Transform image URL to use local serving API
    if (imageUrl.startsWith('./')) {
      // Remove the './' prefix and use local serving API
      imageUrl = `/api/serve-image/${imageUrl.substring(2)}`;
    } else if (imageUrl.startsWith('/upload/')) {
      // If it starts with '/upload/', remove the leading slash and use local serving API
      imageUrl = `/api/serve-image${imageUrl}`;
    } else if (imageUrl.startsWith('upload/')) {
      // If it starts with 'upload/', use it directly with local serving API
      imageUrl = `/api/serve-image/${imageUrl}`;
    } else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
      // If it's a relative path without './', assume it's in upload directory
      imageUrl = `/api/serve-image/upload/testmonialimage/${imageUrl}`;
    }
    // If it's already an absolute URL (http/https), keep it as is

    console.log(`Testimonials: Transformed image URL from "${testimonial.image_url}" to "${imageUrl}"`);

    return {
      quote: testimonial.testimonial,
      name: testimonial.testimonial_name,
      location: testimonial.city,
      src: imageUrl,
      event: `Event ID: ${testimonial.event_id}` // You might want to fetch event names separately
    };
  });

  // Fallback testimonials if API fails or no data
  const fallbackTestimonials = [
    {
      quote: "The annual NIBOG game has been a huge hit with my kids. They love competing in different challenges and games, and it's been great for their confidence and self-esteem. I love that they're learning important life skills like perseverance and determination while they're having fun.",
      name: "Harikrishna",
      location: "Hyderabad",
      src: "/images/baby-crawling.jpg",
      event: "NIBOG Baby Olympics"
    },
    {
      quote: "New India Baby Olympic games has been a great experience for my kids. They love competing with other kids and showing off their skills, and it's been great for their hand-eye coordination and fine motor skills. I love that they're learning important life skills like teamwork and sportsmanship while they're having fun.",
      name: "Durga Prasad",
      location: "Bangalore",
      src: "/images/baby-walker.jpg",
      event: "NIBOG Baby Olympics"
    },
    {
      quote: "My kids love participating in games. It's been great for their problem-solving skills, as they get to tackle different challenges and puzzles. They've also developed their critical thinking skills and made new friends from different schools.",
      name: "Srujana",
      location: "Vizag",
      src: "/images/running-race.jpg",
      event: "NIBOG Baby Olympics"
    }
  ];

  const displayTestimonials = transformedTestimonials.length > 0
    ? transformedTestimonials
    : fallbackTestimonials;

  const showingFallback = transformedTestimonials.length === 0;

  console.log('Testimonials: Final display testimonials:', displayTestimonials);
  console.log('Testimonials: Showing fallback?', showingFallback);

  return (
    <section className="container">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Children's Parents Speak for Us</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground">
            Hear what parents have to say about NIBOG events
          </p>
          {(error || showingFallback) && (
            <p className="text-sm text-muted-foreground">
              {error
                ? "Showing sample testimonials (API temporarily unavailable)"
                : "Showing sample testimonials (No testimonials available in database)"
              }
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <AnimatedTestimonials
            testimonials={displayTestimonials}
            className="py-8"
          />
        )}
      </div>
    </section>
  );
}
