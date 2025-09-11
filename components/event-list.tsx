"use client"

import Link from "next/link"
import Image from "next/image"
import { memo, useMemo, useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Heart } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEvents } from "@/lib/swr-hooks"

// Import EventListItem type for proper typing
import { EventListItem } from "@/types"

// Memoized EventCard component to prevent unnecessary re-renders
const EventCard = memo(({ event }: { event: EventListItem }) => {
  // Use static age range for all events (5-84 months)
  const minAgeMonths = 5;
  const maxAgeMonths = 84;

  // Check if event is in the past
  const isEventComplete = useMemo(() => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    return eventDate < today;
  }, [event.date]);

  // Get age-appropriate emoji and colors
  const getAgeTheme = (minAge: number, maxAge: number) => {
    if (maxAge <= 13) {
      return {
        emoji: "🍼",
        gradient: "from-sunshine-400 to-coral-400",
        bgGradient: "from-sunshine-50 to-coral-50",
        borderColor: "border-sunshine-300",
        textColor: "text-sunshine-700"
      }
    } else if (minAge >= 13 && maxAge <= 36) {
      return {
        emoji: "🚶‍♀️",
        gradient: "from-coral-400 to-mint-400",
        bgGradient: "from-coral-50 to-mint-50",
        borderColor: "border-coral-300",
        textColor: "text-coral-700"
      }
    } else {
      return {
        emoji: "🏃‍♂️",
        gradient: "from-mint-400 to-lavender-400",
        bgGradient: "from-mint-50 to-lavender-50",
        borderColor: "border-mint-300",
        textColor: "text-mint-700"
      }
    }
  }

  const theme = getAgeTheme(minAgeMonths, maxAgeMonths)

  return (
    <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 rounded-3xl bg-gradient-to-br ${theme.bgGradient} border-2 ${theme.borderColor} hover:border-sunshine-400`}>
      <div className="relative h-52">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover transition-transform group-hover:scale-110 duration-500 rounded-t-3xl"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlZWVlIi8+PC9zdmc+"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-t-3xl`} />

        {/* Floating decorative elements */}
        <div className="absolute top-3 left-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 text-2xl animate-bounce-gentle shadow-lg">
            {theme.emoji}
          </div>
        </div>

        <div className="absolute top-3 right-3 space-y-2">
          {/* Complete Event Status Indicator */}
          {isEventComplete && (
            <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white/50">
              ✅ Complete Event
            </Badge>
          )}

          {/* Olympics/Regular Badge */}
          <Badge className={`bg-gradient-to-r ${theme.gradient} text-white font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white/50`}>
            {event.isOlympics ? "🏆 Olympics" : "🎮 Regular"}
          </Badge>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <Badge className="bg-white/90 backdrop-blur-sm text-neutral-charcoal font-bold px-3 py-2 rounded-full shadow-lg">
            👶 {minAgeMonths}-{maxAgeMonths} months
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/30"
          aria-label="Save event"
        >
          <Heart className="h-5 w-5 text-white" />
        </Button>
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-4">
          <h3 className="text-xl font-bold leading-tight tracking-tight text-neutral-charcoal group-hover:text-sunshine-700 transition-colors">{event.title}</h3>
          <p className="text-sm text-neutral-charcoal/70 leading-relaxed">{event.description}</p>
        </div>
      </CardContent>

      <CardFooter className="border-t-2 border-white/50 bg-white/80 backdrop-blur-sm p-6 rounded-b-3xl">
        <div className="w-full space-y-4">
          {/* Complete Event Details */}
          <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-bold text-neutral-charcoal uppercase tracking-wide">Event Details</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-neutral-charcoal/70">
                <div className="bg-sunshine-100 rounded-full p-1 flex-shrink-0">
                  <Calendar className="h-3 w-3 text-sunshine-600" />
                </div>
                <div>
                  <span className="font-medium text-neutral-charcoal">Date:</span>
                  <span className="ml-1">
                    {(() => {
                      try {
                        return new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        });
                      } catch (error) {
                        return event.date; // Fallback to original date string
                      }
                    })()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-neutral-charcoal/70">
                <div className="bg-coral-100 rounded-full p-1 flex-shrink-0">
                  <Clock className="h-3 w-3 text-coral-600" />
                </div>
                <div>
                  <span className="font-medium text-neutral-charcoal">Time:</span>
                  <span className="ml-1">{event.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-neutral-charcoal/70">
                <div className="bg-mint-100 rounded-full p-1 flex-shrink-0">
                  <MapPin className="h-3 w-3 text-mint-600" />
                </div>
                <div>
                  <span className="font-medium text-neutral-charcoal">Venue:</span>
                  <span className="ml-1">{event.venue}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-neutral-charcoal/70">
                <div className="bg-lavender-100 rounded-full p-1 flex-shrink-0">
                  <MapPin className="h-3 w-3 text-lavender-600" />
                </div>
                <div>
                  <span className="font-medium text-neutral-charcoal">City:</span>
                  <span className="ml-1">{event.city}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-neutral-charcoal/70 sm:col-span-2">
                <div className="bg-sunshine-100 rounded-full p-1 flex-shrink-0">
                  <span className="text-xs font-bold text-sunshine-600">👶</span>
                </div>
                <div>
                  <span className="font-medium text-neutral-charcoal">Age Range:</span>
                  <span className="ml-1">{minAgeMonths}-{maxAgeMonths} months</span>
                  <span className="ml-1 text-xs text-neutral-charcoal/50">
                    ({Math.floor(minAgeMonths/12)}-{Math.floor(maxAgeMonths/12)} years)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <div className="pt-2">
            {isEventComplete ? (
              <Button
                disabled
                className="w-full bg-gray-400 text-white font-bold py-3 rounded-full border-2 border-white/50 cursor-not-allowed opacity-60"
              >
                📅 Event Completed
              </Button>
            ) : (
              <Button
                className={`w-full bg-gradient-to-r ${theme.gradient} hover:shadow-lg text-white font-bold py-3 rounded-full border-2 border-white/50 transform hover:scale-105 transition-all duration-300`}
                asChild
              >
                <Link href={`/register-event?city=${event.city}`}>
                  🎯 Register for Event
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
});

EventCard.displayName = 'EventCard';

export default function EventList() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Use SWR hook to fetch events data with caching
  const { events, isLoading, isError } = useEvents();
  
  // Filter and sort events based on URL params, with completed events at bottom
  const filteredEvents = useMemo(() => {
    const city = searchParams.get('city');
    const minAge = searchParams.get('minAge');
    const maxAge = searchParams.get('maxAge');
    const date = searchParams.get('date');

    const filtered = events.filter((event) => {
      // Use default age range if not provided
      // const eventMinAge = event.minAgeMonths || 5;
      // const eventMaxAge = event.maxAgeMonths || 84;
      
      const eventMinAge = 5;
      const eventMaxAge = 84;

      if (city && event.city.toLowerCase() !== city.toLowerCase()) return false;
      if (minAge && eventMinAge < parseInt(minAge)) return false;
      if (maxAge && eventMaxAge > parseInt(maxAge)) return false;
      if (date && event.date !== date) return false;
      return true;
    });

    // Sort events: upcoming events first, completed events at bottom
    return filtered.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const aIsComplete = aDate < today;
      const bIsComplete = bDate < today;
      
      // If one is complete and other is not, put complete at bottom
      if (aIsComplete && !bIsComplete) return 1;
      if (!aIsComplete && bIsComplete) return -1;
      
      // If both have same completion status, sort by date
      // For upcoming events: earliest first
      // For completed events: most recent first
      if (!aIsComplete && !bIsComplete) {
        return aDate.getTime() - bDate.getTime();
      } else {
        return bDate.getTime() - aDate.getTime();
      }
    });
  }, [searchParams, events]);

  // Get paginated events based on current page
  const visibleEvents = useMemo(() => {
    return filteredEvents.slice(0, page * ITEMS_PER_PAGE);
  }, [filteredEvents, page]);

  // Handler for load more button
  const handleLoadMore = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);
  
  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
  }, [searchParams]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-3xl h-52 mb-4"></div>
            <div className="space-y-2">
              <div className="bg-gray-200 rounded h-4 w-3/4"></div>
              <div className="bg-gray-200 rounded h-4 w-1/2"></div>
              <div className="bg-gray-200 rounded h-4 w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Show error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="text-6xl">😔</div>
        <h3 className="text-xl font-semibold text-neutral-charcoal">Unable to Load Events</h3>
        <p className="text-muted-foreground text-center max-w-md">
          We're having trouble connecting to our servers. Please check your internet connection and try again.
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    )
  }

  // Show no events state
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="text-6xl">🎮</div>
        <h3 className="text-xl font-semibold text-neutral-charcoal">No Events Available</h3>
        <p className="text-muted-foreground text-center max-w-md">
          There are currently no baby games events scheduled. Check back soon for exciting new events!
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {visibleEvents.length < filteredEvents.length && (
        <div className="mt-8 flex justify-center">
          <Button onClick={handleLoadMore} variant="outline">
            Load More Events
          </Button>
        </div>
      )}

      {filteredEvents.length === 0 && events.length > 0 && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="text-6xl">🔍</div>
          <h3 className="text-xl font-semibold text-neutral-charcoal">No Matching Events</h3>
          <p className="text-muted-foreground text-center max-w-md">
            No events found matching your search criteria. Try adjusting your filters or search terms.
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/events">Clear Filters</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
