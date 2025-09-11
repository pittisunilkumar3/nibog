'use client';

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

// Dynamic Home Hero Slider
function HomeHeroSlider() {
  const [sliderImages, setSliderImages] = useState<string[]>([])
  const [lastFetch, setLastFetch] = useState<number>(0)

  const fetchSliderImages = async (forceRefresh = false) => {
    try {
      console.log("Frontend: Fetching slider images...", forceRefresh ? "(forced refresh)" : "")

      // Add timestamp and cache-busting parameters
      const timestamp = Date.now()
      const cacheBust = Math.random().toString(36).substring(7)
      const url = `/api/home-slider/get?t=${timestamp}&cb=${cacheBust}${forceRefresh ? '&refresh=true&force=true' : ''}`

      const response = await fetch(url, {
        method: "GET",
        cache: "no-store", // Disable caching
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
          "X-Cache-Bust": cacheBust
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Frontend: API response:", data)
      console.log("Frontend: Response headers:", {
        timestamp: response.headers.get('X-Timestamp'),
        count: response.headers.get('X-Count')
      })

      // Data is already processed by our API endpoint
      const imgs = Array.isArray(data)
        ? data.map((img: any) => {
            const rel = img.image_path.replace(/^public/, "")
            return rel.startsWith("/") ? rel : "/" + rel
          })
        : []

      console.log("Frontend: Final slider images:", imgs)
      setSliderImages(imgs)
      setLastFetch(timestamp)

    } catch (error) {
      console.error("Failed to fetch slider images:", error)
      setSliderImages([])
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchSliderImages()
  }, [])

  // Periodic refresh every 30 seconds to catch updates
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Frontend: Periodic refresh of slider images")
      fetchSliderImages()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Listen for focus events to refresh when user returns to tab
  useEffect(() => {
    const handleFocus = () => {
      const now = Date.now()
      // Only refresh if it's been more than 10 seconds since last fetch
      if (now - lastFetch > 10000) {
        console.log("Frontend: Refreshing slider images on focus")
        fetchSliderImages()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [lastFetch])

  // Listen for localStorage changes (notifications from admin panel)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'homeSliderUpdate' || e.key === 'homeSliderClearCache' || e.key === 'homeSliderDeleteComplete') {
        console.log("Frontend: Received cache update notification from admin panel:", e.key)
        
        // Force clear any cached image references
        if (e.key === 'homeSliderClearCache' || e.key === 'homeSliderDeleteComplete') {
          console.log("Frontend: Performing aggressive cache clear")
          setSliderImages([]) // Clear current images immediately
          
          // Clear any browser image cache by forcing reload with cache busting
          setTimeout(() => {
            fetchSliderImages(true) // Force refresh after clearing
          }, 100)
        } else {
          fetchSliderImages(true) // Force refresh
        }
        
        // Clear all related notifications
        localStorage.removeItem('homeSliderUpdate')
        localStorage.removeItem('homeSliderClearCache')
        localStorage.removeItem('homeSliderDeleteComplete')
        localStorage.removeItem('homeSlideCacheBust')
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Also check for updates on component mount
    const checkForUpdates = () => {
      const updateFlag = localStorage.getItem('homeSliderUpdate')
      const clearCacheFlag = localStorage.getItem('homeSliderClearCache')
      const deleteCompleteFlag = localStorage.getItem('homeSliderDeleteComplete')
      const cacheBustFlag = localStorage.getItem('homeSlideCacheBust')
      
      if (updateFlag || clearCacheFlag || deleteCompleteFlag || cacheBustFlag) {
        console.log("Frontend: Found pending notifications", {
          update: !!updateFlag,
          clearCache: !!clearCacheFlag,
          deleteComplete: !!deleteCompleteFlag,
          cacheBust: !!cacheBustFlag
        })
        
        // If cache clear or delete complete, clear images first
        if (clearCacheFlag || deleteCompleteFlag) {
          console.log("Frontend: Clearing cached images before refresh")
          setSliderImages([])
        }
        
        fetchSliderImages(true) // Force refresh
        
        // Clear all notifications
        localStorage.removeItem('homeSliderUpdate')
        localStorage.removeItem('homeSliderClearCache')
        localStorage.removeItem('homeSliderDeleteComplete')
        localStorage.removeItem('homeSlideCacheBust')
      }
    }

    checkForUpdates()

    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // If no images, show default background
  if (sliderImages.length === 0) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 opacity-40 dark:opacity-25">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,190,255,0.6),rgba(255,182,193,0.6))]"></div>
      </div>
    )
  }

  // For single image, don't duplicate
  const loopImages = sliderImages.length === 1
    ? sliderImages
    : [...sliderImages, sliderImages[0]]

  // Calculate dynamic width and animation class
  const totalImages = loopImages.length
  const containerWidth = totalImages * 100 // Each image is 100% of container width
  const imageWidth = 100 / totalImages // Each image takes equal portion

  // Determine animation class based on number of original images
  const getAnimationClass = (count: number) => {
    if (count === 1) return "animate-slide-slow-1"
    if (count === 2) return "animate-slide-slow-2"
    if (count === 3) return "animate-slide-slow-3"
    if (count === 4) return "animate-slide-slow-4"
    if (count === 5) return "animate-slide-slow-5"
    if (count === 6) return "animate-slide-slow-6"
    return "animate-slide-slow" // fallback for more than 6
  }

  const animationClass = getAnimationClass(sliderImages.length)

  return (
    <div
      className={`absolute inset-y-0 left-0 flex ${animationClass}`}
      style={{ width: `${containerWidth}%` }}
    >
      {loopImages.map((src, i) => (
        <div
          key={`heroimg-${i}`}
          className="flex-none h-full"
          style={{ width: `${imageWidth}%` }}
        >
          <img
            src={src}
            alt="Home Hero"
            className="w-full h-full object-cover opacity-40 dark:opacity-25"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  )
}
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import CitySelector from "@/components/city-selector"
import AgeSelector from "@/components/age-selector"
import { AnimatedTestimonials } from "@/components/animated-testimonials"
import { Star, Award, MapPin } from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"

export default function Home() {
  return (
    <AnimatedBackground variant="home">
      <div className="flex flex-col gap-12 pb-8">
      {/* Hero Section */}
      <section className="relative">
        {/* Semi-transparent overlay - adjusted for better balance */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/20 dark:from-black/50 dark:to-black/30 -z-10" />
        
        {/* Background image overlay */}
        <div className="absolute inset-0 overflow-hidden -z-20">
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            
            <HomeHeroSlider />
            
          </div>
        </div>
        <div className="container relative z-10 flex flex-col items-center justify-center gap-8 py-20 text-center md:py-28 lg:py-36">
          {/* Floating decorative elements */}
          <div className="absolute top-10 left-10 w-16 h-16 bg-sunshine-400 rounded-full opacity-20 animate-bounce-gentle"></div>
          <div className="absolute top-20 right-20 w-12 h-12 bg-coral-400 rounded-full opacity-30 animate-float-delayed"></div>
          <div className="absolute bottom-20 left-20 w-20 h-20 bg-mint-400 rounded-full opacity-25 animate-float-slow"></div>

          <Badge className="px-6 py-3 text-lg font-bold bg-gradient-to-r from-sunshine-400 to-rainbow-orange text-neutral-charcoal rounded-full shadow-lg animate-bounce-gentle border-2 border-sunshine-500">
            🏆 New India Baby Olympics Games 🏆
          </Badge>

          <div className="relative z-20 space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block text-neutral-charcoal dark:text-white font-extrabold">
                NIBOG
              </span>
              <span className="relative block mt-2">
                <span
                  className="relative z-10 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sunshine-500 via-coral-500 to-mint-500 bg-[length:200%_auto] animate-rainbow-shift"
                  style={{
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  From Crawling to Racing
                </span>
                <span className="absolute inset-0 z-0 text-transparent bg-clip-text bg-gradient-to-r from-sunshine-300 via-coral-300 to-mint-300 bg-[length:200%_auto] animate-rainbow-shift opacity-50 blur-sm">
                  From Crawling to Racing
                </span>
              </span>
            </h1>

            {/* Fun emoji decorations */}
            <div className="flex justify-center gap-4 text-4xl animate-bounce-gentle">
              <span className="animate-sparkle">🏃‍♀️</span>
              <span className="animate-sparkle" style={{animationDelay: '0.5s'}}>👶</span>
              <span className="animate-sparkle" style={{animationDelay: '1s'}}>🏆</span>
              <span className="animate-sparkle" style={{animationDelay: '1.5s'}}>🎉</span>
            </div>
          </div>

          <p className="max-w-[800px] text-lg md:text-xl text-neutral-charcoal/80 dark:text-white/80 leading-relaxed">
            India's biggest baby Olympic games, executing in <span className="font-bold text-sunshine-600">21 cities</span> across India.
            Join us for exciting baby games including <span className="font-semibold text-coral-600">crawling races</span>,
            <span className="font-semibold text-mint-600"> baby walker</span>,
            <span className="font-semibold text-lavender-600"> running races</span>, and more for children aged
            <span className="font-bold text-sunshine-600">5-84 months</span>.
          </p>

          <div className="w-full max-w-lg space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <Button
                size="lg"
                className="w-full py-6 sm:py-8 text-lg sm:text-xl font-bold bg-gradient-to-r from-sunshine-400 via-coral-400 to-mint-400 hover:from-sunshine-500 hover:via-coral-500 hover:to-mint-500 text-neutral-charcoal shadow-2xl transform transition-all hover:scale-105 sm:hover:scale-110 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-white/50 animate-medal-shine touch-manipulation"
                asChild
              >
                <Link href="/register-event">
                  🎯 Register Now for NIBOG 2025 🎯
                </Link>
              </Button>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-white/80 hover:bg-white border-2 border-sunshine-400 text-sunshine-700 hover:text-sunshine-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all touch-manipulation"
                  asChild
                >
                  <Link href="/events">
                    📅 Browse Events
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-white/80 hover:bg-white border-2 border-coral-400 text-coral-700 hover:text-coral-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all touch-manipulation"
                  asChild
                >
                  <Link href="/baby-olympics">
                    🎮 View Games
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="container">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Upcoming NIBOG Events</h2>
              <Button variant="link" asChild className="gap-1">
                <Link href="/events">
                  View All →
                </Link>
              </Button>
            </div>
            <p className="text-muted-foreground dark:text-gray-700">Join us for these exciting events featuring multiple baby games in cities across India</p>
          </div>
        </div>
      </section>

      {/* Age Categories Section */}
      <section className="relative py-20 bg-gradient-to-br from-lavender-100 via-mint-50 to-coral-50 dark:from-lavender-900/20 dark:via-mint-900/20 dark:to-coral-900/20 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-sunshine-300 rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-coral-300 rounded-full opacity-10 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-mint-300 rounded-full opacity-10 animate-bounce-gentle"></div>

        <div className="container relative z-10">
          <div className="flex flex-col gap-12 text-center">
            <div className="space-y-4">
              <Badge className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-sunshine-400 to-coral-400 text-neutral-charcoal rounded-full">
                🎯 Age Groups
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sunshine-600 via-coral-600 to-mint-600">
                  NIBOG Games by Age Group
                </span>
              </h2>
              <p className="mt-4 text-lg text-neutral-charcoal/70 dark:text-white/70 max-w-2xl mx-auto">
                Age-appropriate Olympic games designed for every stage of your little champion's development
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/events?minAge=5&maxAge=13" className="group">
                <Card className="card-baby-gradient overflow-hidden h-full">
                  <div className="relative h-48">
                    <Image
                      src="/images/baby-crawling.jpg"
                      alt="Crawling Babies (5-13 months)"
                      fill
                      className="object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sunshine-500/80 via-sunshine-300/40 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 rounded-full p-2 text-2xl animate-bounce-gentle">
                        🍼
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-1">Baby Crawling Race</h3>
                      <p className="text-white/90 font-semibold">5-13 months</p>
                      <p className="text-white/80 text-sm mt-2">Watch tiny champions crawl to victory!</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/events?minAge=5&maxAge=13" className="group">
                <Card className="card-baby-gradient overflow-hidden h-full">
                  <div className="relative h-48">
                    <Image
                      src="/images/baby-walker.jpg"
                      alt="Baby Walker (5-13 months)"
                      fill
                      className="object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-coral-500/80 via-coral-300/40 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 rounded-full p-2 text-2xl animate-bounce-gentle">
                        🚶‍♀️
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-1">Baby Walker Challenge</h3>
                      <p className="text-white/90 font-semibold">5-13 months</p>
                      <p className="text-white/80 text-sm mt-2">First steps to Olympic dreams!</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/events?minAge=13&maxAge=84" className="group">
                <Card className="card-baby-gradient overflow-hidden h-full">
                  <div className="relative h-48">
                    <Image
                      src="/images/running-race.jpg"
                      alt="Running Race (13-84 months)"
                      fill
                      className="object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-mint-500/80 via-mint-300/40 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 rounded-full p-2 text-2xl animate-bounce-gentle">
                        🏃‍♂️
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-1">Running Race</h3>
                      <p className="text-white/90 font-semibold">13-84 months</p>
                      <p className="text-white/80 text-sm mt-2">Speed demons in action!</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>

            <div className="mt-8">
              <Button
                size="lg"
                className="btn-baby-primary text-lg px-8 py-4"
                asChild
              >
                <Link href="/baby-olympics">
                  🎮 Explore All Games
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose NIBOG Section */}
      <section className="relative py-20 bg-gradient-to-r from-sunshine-50 via-coral-50 to-mint-50 dark:from-sunshine-900/10 dark:via-coral-900/10 dark:to-mint-900/10">
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-sunshine-300 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-coral-300 rounded-full opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-mint-300 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-20 right-1/4 w-18 h-18 bg-lavender-300 rounded-full opacity-20 animate-float-slow"></div>

        <div className="container relative z-10">
          <div className="flex flex-col gap-12 text-center">
            <div className="space-y-4">
              <Badge className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-coral-400 to-mint-400 text-neutral-charcoal rounded-full">
                💪 Benefits
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-coral-600 via-mint-600 to-sunshine-600">
                  WHY SPORTS ARE IMPORTANT TO CHILDREN
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-[800px] text-lg text-neutral-charcoal/70 dark:text-white/70">
                The Child Olympic Games are a wonderful opportunity to get kids excited about sport, national pride and counting medals
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="card-baby-gradient group hover:scale-105 transition-all duration-300">
                <CardContent className="flex flex-col items-center gap-6 pt-8 pb-8">
                  <div className="relative">
                    <div className="rounded-full bg-gradient-to-br from-sunshine-400 to-sunshine-600 p-6 shadow-lg group-hover:shadow-xl transition-all duration-300 animate-medal-shine">
                      <span className="text-4xl">💪</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-coral-400 rounded-full animate-sparkle"></div>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-charcoal dark:text-white">Physical Development</h3>
                  <p className="text-center text-neutral-charcoal/70 dark:text-white/70 leading-relaxed">
                    Physical activity stimulates growth and leads to improved physical and emotional health, building strong foundations for life.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-baby-gradient group hover:scale-105 transition-all duration-300">
                <CardContent className="flex flex-col items-center gap-6 pt-8 pb-8">
                  <div className="relative">
                    <div className="rounded-full bg-gradient-to-br from-coral-400 to-coral-600 p-6 shadow-lg group-hover:shadow-xl transition-all duration-300 animate-medal-shine">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-mint-400 rounded-full animate-sparkle" style={{animationDelay: '0.5s'}}></div>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-charcoal dark:text-white">Learning Resilience</h3>
                  <p className="text-center text-neutral-charcoal/70 dark:text-white/70 leading-relaxed">
                    Exposing kids to healthy challenges builds character, confidence, and the ability to overcome obstacles with grace.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-baby-gradient group hover:scale-105 transition-all duration-300">
                <CardContent className="flex flex-col items-center gap-6 pt-8 pb-8">
                  <div className="relative">
                    <div className="rounded-full bg-gradient-to-br from-mint-400 to-mint-600 p-6 shadow-lg group-hover:shadow-xl transition-all duration-300 animate-medal-shine">
                      <span className="text-4xl">🎨</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-sunshine-400 rounded-full animate-sparkle" style={{animationDelay: '1s'}}></div>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-charcoal dark:text-white">Creativity & Imagination</h3>
                  <p className="text-center text-neutral-charcoal/70 dark:text-white/70 leading-relaxed">
                    Sport allows children to use their creativity while developing imagination, dexterity, and physical, cognitive, and emotional strength.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <Button
                size="lg"
                className="btn-baby-secondary text-lg px-8 py-4"
                asChild
              >
                <Link href="/about">
                  🌟 Learn More About NIBOG
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Children's Parents Speak for Us</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground">
              Hear what parents have to say about NIBOG events
            </p>
          </div>
          <AnimatedTestimonials
            testimonials={[
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
              },
              {
                quote: "The organization of the event was flawless. From registration to the actual games, everything was well-planned. The staff was friendly and helpful, making it a stress-free experience for parents and an exciting day for the children.",
                name: "Rajesh Kumar",
                location: "Chennai",
                src: "/images/hurdle-toddle.jpg",
                event: "Chennai Little Champions"
              },
              {
                quote: "What I appreciate most about NIBOG is how they make every child feel like a winner. The focus is on participation and having fun, not just winning. My daughter came home with a medal and the biggest smile I've ever seen!",
                name: "Priya Sharma",
                location: "Mumbai",
                src: "/images/ball-throw.jpg",
                event: "Mumbai Mini Olympics"
              }
            ]}
            className="py-8"
          />
        </div>
      </section>

      {/* Cities Section */}
      <section className="bg-muted/50 py-12">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">NIBOG Events Across India</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">Find NIBOG events in 21 cities across India</p>
            </div>
            
            <div className="w-full">
              {(() => {
                const cities = [
                  "Hyderabad",
                  "Bangalore",
                  "Chennai",
                  "Vizag",
                  "Patna",
                  "Ranchi",
                  "Nagpur",
                  "Kochi",
                  "Mumbai",
                  "Indore",
                  "Lucknow",
                  "Chandigarh",
                  "Kolkata",
                  "Gurgaon",
                  "Delhi",
                  "Jaipur",
                  "Ahmedabad",
                  "Bhubaneswar",
                  "Pune",
                  "Raipur",
                  "Gandhi Nagar",
                ];
                
                const [showAllCities, setShowAllCities] = useState(false);
                const [visibleCount, setVisibleCount] = useState(6); // Start with 6 cities
                
                // Calculate number of cities to show based on screen size
                const calculateVisibleCount = () => {
                  if (typeof window === 'undefined') return 6;
                  if (window.innerWidth >= 1024) return 11; // Show 11 + 1 (Show More) = 12 (2 rows of 6)
                  if (window.innerWidth >= 768) return 7;   // Show 7 + 1 = 8 (2 rows of 4)
                  if (window.innerWidth >= 640) return 5;   // Show 5 + 1 = 6 (2 rows of 3)
                  return 3;                                 // Show 3 + 1 = 4 (2 rows of 2)
                };
                
                // Set initial visible count
                useEffect(() => {
                  setVisibleCount(calculateVisibleCount());
                }, []);
                
                // Handle window resize
                useEffect(() => {
                  const handleResize = () => {
                    if (!showAllCities) {
                      setVisibleCount(calculateVisibleCount());
                    }
                  };
                  
                  window.addEventListener('resize', handleResize);
                  return () => window.removeEventListener('resize', handleResize);
                }, [showAllCities]);
                
                // Toggle between showing all cities and initial count
                const toggleShowAll = () => {
                  setShowAllCities(!showAllCities);
                };
                
                // Determine which cities to show
                const displayCities = showAllCities ? cities : cities.slice(0, visibleCount);
                
                return (
                  <div className="relative">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                      {displayCities.map((city) => (
                        <Link key={city} href={`/events?city=${city.toLowerCase()}`}>
                          <Card className="group h-full flex flex-col justify-center transition-all hover:border-primary hover:shadow-sm dark:bg-slate-800/90 dark:hover:border-primary">
                            <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
                              <MapPin className="mb-2 h-6 w-6 text-muted-foreground group-hover:text-primary" />
                              <span className="text-lg font-medium group-hover:text-primary dark:text-white">{city}</span>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                      
                      {/* Show More/Less Button - always visible as the last item */}
                      <div 
                        onClick={toggleShowAll}
                        className="flex items-center justify-center cursor-pointer group"
                      >
                        <Card className="h-full w-full flex items-center justify-center transition-all hover:border-primary hover:shadow-sm dark:bg-slate-800/90 dark:hover:border-primary group-hover:bg-primary/5">
                          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                            <div className="w-8 h-8 mb-2 flex items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 dark:bg-primary/20 dark:group-hover:bg-primary/30">
                              {showAllCities ? (
                                <span className="text-primary font-bold text-lg">−</span>
                              ) : (
                                <span className="text-primary font-bold text-lg">+</span>
                              )}
                            </div>
                            <span className="font-medium text-primary">
                              {showAllCities ? 'Show Less' : 'Show More'}
                            </span>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>



      {/* Stats Section */}
      <section className="relative py-20 bg-gradient-to-br from-sunshine-400 via-coral-400 to-mint-400 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.3),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.3),transparent_50%)]"></div>
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">🏆 NIBOG by the Numbers 🏆</h2>
            <p className="text-white/90 text-lg">Celebrating achievements across India</p>
          </div>

          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-3">
            <div className="group">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-3xl">
                <CardContent className="pt-8 pb-8">
                  <div className="space-y-4">
                    <div className="text-6xl animate-bounce-gentle">👶</div>
                    <h3 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sunshine-600 to-coral-600">1500+</h3>
                    <p className="text-neutral-charcoal font-semibold text-lg">Happy Registrations</p>
                    <p className="text-neutral-charcoal/70 text-sm">Little champions ready to play!</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="group">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-3xl">
                <CardContent className="pt-8 pb-8">
                  <div className="space-y-4">
                    <div className="text-6xl animate-bounce-gentle" style={{animationDelay: '0.5s'}}>🎮</div>
                    <h3 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-coral-600 to-mint-600">16</h3>
                    <p className="text-neutral-charcoal font-semibold text-lg">Exciting Games</p>
                    <p className="text-neutral-charcoal/70 text-sm">From crawling to racing!</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="group">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-3xl">
                <CardContent className="pt-8 pb-8">
                  <div className="space-y-4">
                    <div className="text-6xl animate-bounce-gentle" style={{animationDelay: '1s'}}>🏙️</div>
                    <h3 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-mint-600 to-sunshine-600">21</h3>
                    <p className="text-neutral-charcoal font-semibold text-lg">Cities Across India</p>
                    <p className="text-neutral-charcoal/70 text-sm">Bringing joy nationwide!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white font-semibold">
              <span className="animate-sparkle">⭐</span>
              <span>Join thousands of happy families!</span>
              <span className="animate-sparkle" style={{animationDelay: '1s'}}>⭐</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <div className="relative rounded-3xl bg-gradient-to-br from-lavender-200 via-sunshine-100 to-coral-200 dark:from-lavender-800 dark:via-sunshine-800 dark:to-coral-800 p-12 text-center md:p-16 overflow-hidden shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-12 h-12 bg-sunshine-400 rounded-full opacity-30 animate-bounce-gentle"></div>
          <div className="absolute top-8 right-8 w-16 h-16 bg-coral-400 rounded-full opacity-30 animate-float"></div>
          <div className="absolute bottom-4 left-8 w-10 h-10 bg-mint-400 rounded-full opacity-30 animate-float-delayed"></div>
          <div className="absolute bottom-8 right-4 w-14 h-14 bg-lavender-400 rounded-full opacity-30 animate-bounce-gentle"></div>

          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <Badge className="px-6 py-3 text-lg font-bold bg-gradient-to-r from-sunshine-500 to-coral-500 text-white rounded-full shadow-lg">
                🚀 NIBOG 2025
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sunshine-600 via-coral-600 to-mint-600">
                  Ready to Join the Fun?
                </span>
              </h2>
              <p className="mx-auto max-w-[700px] text-lg text-neutral-charcoal/80 dark:text-white/80 leading-relaxed">
                <span className="font-bold text-sunshine-700">Vizag</span>, <span className="font-bold text-coral-700">Hyderabad</span>, <span className="font-bold text-mint-700">Bangalore</span>, <span className="font-bold text-lavender-700">Mumbai</span> and <span className="font-bold text-sunshine-700">Delhi</span> registrations are now open!
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="btn-baby-primary text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 shadow-2xl hover:shadow-3xl touch-manipulation"
                asChild
              >
                <Link href="/register-event">
                  🎯 Register Now - Limited Spots!
                </Link>
              </Button>
              <Button
                size="lg"
                className="btn-baby-secondary text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 shadow-2xl hover:shadow-3xl touch-manipulation"
                asChild
              >
                <Link href="/events">
                  📅 Browse All Events
                </Link>
              </Button>
            </div>

            <div className="flex justify-center items-center gap-4 text-sm text-neutral-charcoal/70 dark:text-white/70">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-sunshine-400 rounded-full animate-pulse"></span>
                <span>Early Bird Pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-coral-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></span>
                <span>Certificate for All</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-mint-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></span>
                <span>Professional Photos</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </AnimatedBackground>
  )
}
