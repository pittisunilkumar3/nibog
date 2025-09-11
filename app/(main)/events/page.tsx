import { Suspense } from "react"
import type { Metadata } from "next"
import EventFilters from "@/components/event-filters"
import EventList from "@/components/event-list"
import EventsLoading from "./loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarRange, Grid3X3 } from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"

export const metadata: Metadata = {
  title: "Baby Games | NIBOG",
  description: "Browse and book NIBOG baby games events across 21 cities in India",
}

export default function EventsPage() {
  return (
    <AnimatedBackground variant="events">
      <div className="container py-12">
        <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-8">
          <div className="space-y-4">
            <Badge className="px-6 py-3 text-lg font-bold bg-gradient-to-r from-sunshine-400 to-coral-400 text-neutral-charcoal rounded-full shadow-lg animate-bounce-gentle">
              🎮 Discover Games
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sunshine-600 via-coral-600 to-mint-600">
                NIBOG Baby Games
              </span>
            </h1>
            <p className="text-lg text-neutral-charcoal/70 dark:text-white/70 max-w-2xl mx-auto leading-relaxed">
              Browse and register for exciting baby Olympic games across <span className="font-bold text-sunshine-600">21 cities</span> in India.
              Find the perfect event for your little champion!
            </p>
          </div>

          {/* Fun decorative elements */}
          <div className="flex justify-center gap-6 text-3xl">
            <span className="animate-bounce-gentle">🏃‍♀️</span>
            <span className="animate-bounce-gentle" style={{animationDelay: '0.5s'}}>👶</span>
            <span className="animate-bounce-gentle" style={{animationDelay: '1s'}}>🏆</span>
            <span className="animate-bounce-gentle" style={{animationDelay: '1.5s'}}>🎉</span>
          </div>
        </div>

        <EventFilters />

        <Tabs defaultValue="grid" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 bg-gradient-to-r from-lavender-100 to-mint-100 dark:from-lavender-900/20 dark:to-mint-900/20 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="text-base sm:text-lg font-semibold text-neutral-charcoal dark:text-white text-center sm:text-left">
              🎯 Showing <span className="font-bold text-sunshine-600">16</span> amazing baby games
            </div>
            <TabsList className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-white/50 w-full sm:w-auto">
              <TabsTrigger
                value="grid"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sunshine-400 data-[state=active]:to-coral-400 data-[state=active]:text-white font-semibold rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base flex-1 sm:flex-none touch-manipulation"
              >
                <Grid3X3 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">🎮 Grid View</span>
                <span className="xs:hidden">🎮 Grid</span>
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-coral-400 data-[state=active]:to-mint-400 data-[state=active]:text-white font-semibold rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base flex-1 sm:flex-none touch-manipulation"
              >
                <CalendarRange className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">📅 Calendar View</span>
                <span className="xs:hidden">📅 Calendar</span>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="grid" className="mt-6">
            <Suspense fallback={<EventsLoading />}>
              <EventList />
            </Suspense>
          </TabsContent>
          <TabsContent value="calendar" className="mt-8">
            <div className="flex h-[500px] items-center justify-center rounded-3xl bg-gradient-to-br from-lavender-100 via-sunshine-50 to-coral-100 dark:from-lavender-900/20 dark:via-sunshine-900/20 dark:to-coral-900/20 border-4 border-dashed border-sunshine-300 p-12 text-center shadow-lg">
              <div className="mx-auto flex max-w-[500px] flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                  <div className="bg-gradient-to-br from-sunshine-400 to-coral-400 rounded-full p-6 shadow-xl animate-bounce-gentle">
                    <CalendarRange className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-mint-400 rounded-full animate-sparkle"></div>
                </div>
                <h3 className="text-2xl font-bold text-neutral-charcoal dark:text-white">📅 Calendar View</h3>
                <p className="text-lg text-neutral-charcoal/70 dark:text-white/70 leading-relaxed">
                  View events organized by date in a beautiful calendar format.
                  <span className="font-bold text-sunshine-600"> Coming soon!</span>
                </p>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                  <span className="animate-sparkle">⭐</span>
                  <span className="font-semibold text-neutral-charcoal">Stay tuned for this exciting feature!</span>
                  <span className="animate-sparkle" style={{animationDelay: '1s'}}>⭐</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </AnimatedBackground>
  )
}
