import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Medal, Trophy, Award, Star } from "lucide-react"
import { AnimatedTestimonials } from "@/components/animated-testimonials"
import { AnimatedBackground } from "@/components/animated-background"
import AgeSelector from "@/components/age-selector"
import CitySelector from "@/components/city-selector"
import { formatPrice } from "@/lib/utils"

export const metadata: Metadata = {
  title: "NIBOG - New India Baby Olympics Games",
  description: "India's biggest baby Olympic games, executing in 21 cities of India",
}

// Mock data - in a real app, this would come from an API
const olympicsEvents = [
  {
    id: "1",
    title: "Baby Crawling",
    description: "Let your little crawler compete in a fun and safe environment.",
    minAgeMonths: 5,
    maxAgeMonths: 13,
    date: "2025-10-26",
    time: "9:00 AM - 8:00 PM",
    venue: "Gachibowli Indoor Stadium",
    city: "Hyderabad",
    price: 1800,
    image: "https://images.unsplash.com/photo-1579758629938-03607ccdb340?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    spotsLeft: 5,
    totalSpots: 12,
  },
  {
    id: "2",
    title: "Baby Walker",
    description: "Fun-filled baby walker race in a safe environment.",
    minAgeMonths: 5,
    maxAgeMonths: 13,
    date: "2025-10-26",
    time: "9:00 AM - 8:00 PM",
    venue: "Gachibowli Indoor Stadium",
    city: "Hyderabad",
    price: 1800,
    image: "https://plus.unsplash.com/premium_photo-1679429323133-74204423424e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    spotsLeft: 8,
    totalSpots: 15,
  },
  {
    id: "3",
    title: "Running Race",
    description: "Exciting running race for toddlers in a fun and safe environment.",
    minAgeMonths: 13,
    maxAgeMonths: 84,
    date: "2025-10-26",
    time: "9:00 AM - 8:00 PM",
    venue: "Gachibowli Indoor Stadium",
    city: "Hyderabad",
    price: 1800,
    image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    spotsLeft: 3,
    totalSpots: 10,
  },
  {
    id: "4",
    title: "Hurdle Toddle",
    description: "Fun hurdle race for toddlers to develop coordination and balance.",
    minAgeMonths: 13,
    maxAgeMonths: 84,
    date: "2025-03-16",
    time: "9:00 AM - 8:00 PM",
    venue: "Indoor Stadium",
    city: "Chennai",
    price: 1800,
    image: "https://c.stocksy.com/a/I2Q600/z9/1532424.jpg",
    spotsLeft: 12,
    totalSpots: 20,
  },
  {
    id: "5",
    title: "Cycle Race",
    description: "Exciting cycle race for children to showcase their skills.",
    minAgeMonths: 13,
    maxAgeMonths: 84,
    date: "2025-08-15",
    time: "9:00 AM - 8:00 PM",
    venue: "Sports Complex",
    city: "Vizag",
    price: 1800,
    image: "https://img.freepik.com/free-photo/children-compete-bicycle-race_1093-133.jpg",
    spotsLeft: 6,
    totalSpots: 12,
  },
  {
    id: "6",
    title: "Ring Holding",
    description: "Fun ring holding game to develop hand-eye coordination.",
    minAgeMonths: 13,
    maxAgeMonths: 84,
    date: "2025-10-12",
    time: "9:00 AM - 8:00 PM",
    venue: "Indoor Stadium",
    city: "Bangalore",
    price: 1800,
    image: "https://www.shutterstock.com/image-photo/child-playing-ring-toss-game-260nw-1723433449.jpg",
    spotsLeft: 8,
    totalSpots: 15,
  },
]

export default function BabyOlympicsPage() {
  return (
    <AnimatedBackground variant="olympics">
      <div className="flex flex-col gap-12 pb-8">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/baby-olympics/hero-bg.jpg"
            alt="NIBOG background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-50 opacity-40" />
        </div>
        <div className="container relative flex flex-col items-center justify-center gap-8 py-20 text-center md:py-28 lg:py-36">
          {/* Floating decorative elements */}
          <div className="absolute top-10 left-10 w-16 h-16 bg-sunshine-400 rounded-full opacity-30 animate-bounce-gentle"></div>
          <div className="absolute top-20 right-20 w-12 h-12 bg-coral-400 rounded-full opacity-40 animate-float-delayed"></div>
          <div className="absolute bottom-20 left-20 w-20 h-20 bg-mint-400 rounded-full opacity-35 animate-float-slow"></div>

          <Badge className="px-8 py-4 text-xl font-bold bg-gradient-to-r from-sunshine-400 to-coral-400 text-neutral-charcoal rounded-full shadow-xl animate-bounce-gentle border-4 border-white/50">
            🏆 New India Baby Olympics Games 🏆
          </Badge>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block text-neutral-charcoal dark:text-white font-extrabold mb-4">
                NIBOG
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sunshine-500 via-coral-500 to-mint-500 bg-[length:200%_auto] animate-rainbow-shift">
                Game of Baby Thrones
              </span>
            </h1>

            {/* Fun emoji decorations */}
            <div className="flex justify-center gap-6 text-4xl">
              <span className="animate-bounce-gentle">👑</span>
              <span className="animate-bounce-gentle" style={{animationDelay: '0.5s'}}>👶</span>
              <span className="animate-bounce-gentle" style={{animationDelay: '1s'}}>🏆</span>
              <span className="animate-bounce-gentle" style={{animationDelay: '1.5s'}}>⚔️</span>
            </div>
          </div>

          <p className="max-w-[800px] text-lg md:text-xl text-neutral-charcoal/80 dark:text-white/80 leading-relaxed">
            Step into the World of Baby Games and watch while they <span className="font-bold text-sunshine-600">Kick</span>,
            <span className="font-bold text-coral-600"> Crawl</span>,
            <span className="font-bold text-mint-600"> Conquer</span>.
            India's biggest baby Olympic games in <span className="font-bold text-sunshine-600">21 cities</span>.
          </p>

          <div className="w-full max-w-lg space-y-6">
            <div className="flex flex-col gap-4">
              <Button
                size="lg"
                className="w-full py-8 text-xl font-bold bg-gradient-to-r from-sunshine-400 via-coral-400 to-mint-400 hover:from-sunshine-500 hover:via-coral-500 hover:to-mint-500 text-neutral-charcoal shadow-2xl transform transition-all hover:scale-110 rounded-3xl border-4 border-white/50 animate-medal-shine"
                asChild
              >
                <Link href="/register-event">
                  👑 Claim Your Baby's Throne - Register Now!
                </Link>
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 py-4 text-lg font-semibold bg-white/80 hover:bg-white border-2 border-sunshine-400 text-sunshine-700 hover:text-sunshine-800 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  asChild
                >
                  <Link href="/events">
                    📅 View Events
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 py-4 text-lg font-semibold bg-white/80 hover:bg-white border-2 border-coral-400 text-coral-700 hover:text-coral-800 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  asChild
                >
                  <Link href="/about">
                    📖 Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-20 bg-gradient-to-br from-lavender-100 via-mint-50 to-coral-50 dark:from-lavender-900/20 dark:via-mint-900/20 dark:to-coral-900/20 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-sunshine-300 rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-coral-300 rounded-full opacity-10 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-mint-300 rounded-full opacity-10 animate-bounce-gentle"></div>

        <div className="container relative z-10">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <Badge className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-sunshine-400 to-coral-400 text-neutral-charcoal rounded-full w-fit">
                🎯 About NIBOG
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sunshine-600 via-coral-600 to-mint-600">
                  What is NIBOG?
                </span>
              </h2>
              <p className="text-lg text-neutral-charcoal/70 dark:text-white/70 leading-relaxed">
                NIBOG (New India Baby Olympics Games) is India's biggest baby Olympic games platform, executing in 21 cities across India. Our games are designed to encourage physical development, confidence, and social interaction in a fun, competitive environment for babies and young children.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-sunshine-400 to-sunshine-600 rounded-full p-3 shadow-lg animate-medal-shine">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-charcoal dark:text-white">🎮 16 Different Games</h3>
                  <p className="text-neutral-charcoal/70 dark:text-white/70 leading-relaxed">From crawling races to running races, we have games for all ages from 5-84 months</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-coral-400 to-coral-600 rounded-full p-3 shadow-lg animate-medal-shine">
                  <Medal className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-charcoal dark:text-white">🏙️ 21 Cities Across India</h3>
                  <p className="text-neutral-charcoal/70 dark:text-white/70 leading-relaxed">NIBOG events are held in 21 cities across India, making it accessible to families nationwide</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-mint-400 to-mint-600 rounded-full p-3 shadow-lg animate-medal-shine">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-charcoal dark:text-white">🏆 Medals & Certificates</h3>
                  <p className="text-neutral-charcoal/70 dark:text-white/70 leading-relaxed">Every participant receives a medal and certificate, recognizing their achievement</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-full p-3 shadow-lg animate-medal-shine">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-charcoal dark:text-white">📸 Professional Photography</h3>
                  <p className="text-neutral-charcoal/70 dark:text-white/70 leading-relaxed">Capture these precious moments with our professional photographers at every event</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-96 w-full overflow-hidden rounded-3xl shadow-2xl border-4 border-white/50 group">
              <Image
                src="/images/baby-olympics/about-image.jpg"
                alt="NIBOG Baby Olympics"
                fill
                className="object-cover object-[10%_30%] transition-transform group-hover:scale-110 duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <p className="text-neutral-charcoal font-bold text-center">
                    🌟 Where Champions Are Born! 🌟
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* Events Section */}
      <section className="bg-muted/50 py-12">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl dark:text-white">Upcoming NIBOG Events</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground dark:text-white">
                Register for our upcoming baby Olympic games in cities across India
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {olympicsEvents.map((event) => (
                <Card key={event.id} className="group overflow-hidden transition-all hover:shadow-md">
                  <div className="relative h-48">
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                    <Badge className="absolute right-2 top-2 bg-yellow-500 hover:bg-yellow-600">Baby Olympics</Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold group-hover:text-yellow-500">{event.title}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{event.date}</span>
                        <Clock className="ml-2 h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {event.venue}, {event.city}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Age: {event.minAgeMonths}-{event.maxAgeMonths} months</Badge>
                        <span className="font-medium">{formatPrice(event.price)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="flex items-center justify-between border-t bg-muted/50 p-4">
                    <div className="text-xs text-muted-foreground">
                      <span className={event.spotsLeft <= 3 ? "text-red-500 font-medium" : ""}>
                        {event.spotsLeft} spots left
                      </span>
                      <div className="mt-1 h-1.5 w-16 rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${
                            event.spotsLeft <= 3 ? "bg-red-500" : "bg-yellow-500"
                          }`}
                          style={{ width: `${(event.spotsLeft / event.totalSpots) * 100}%` }}
                        />
                      </div>
                    </div>
                    <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600" asChild>
                      <Link href={`/register-event?city=${event.city}`}>Register Now</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-16 md:py-24 overflow-hidden my-8">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-yellow-950/20 -z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(251,191,36,0.1),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(245,158,11,0.1),transparent_60%)] blur-xl opacity-80 dark:opacity-30 -z-10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-12 left-8 text-4xl opacity-20 animate-pulse-slow">💬</div>
        <div className="absolute bottom-12 right-8 text-4xl opacity-20 animate-pulse-slow">❤️</div>
        <div className="absolute top-1/3 right-1/4 text-2xl opacity-20 animate-bounce-slow">⭐</div>
        <div className="absolute bottom-1/3 left-1/4 text-2xl opacity-20 animate-bounce-slow">✨</div>
        
        <div className="container">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl dark:text-white">Children's Parents Speak for Us</h2>
            <p className="mx-auto max-w-[700px] text-slate-700 dark:text-slate-500 font-medium">
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
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl dark:text-white">Frequently Asked Questions</h2>
              <p className="text-slate-700 dark:text-slate-500 font-medium">Everything you need to know about NIBOG events</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">What is the age limit for participation?</h3>
                <p className="mt-1 text-sm text-muted-foreground">NIBOG events are designed for children aged 5-84 months. Different games have specific age categories to ensure fair competition.</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">How do I register for NIBOG events?</h3>
                <p className="mt-1 text-sm text-muted-foreground">You can register for NIBOG events through our website. Simply select your city, choose the games you want your child to participate in, and complete the registration process.</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">What games are included in NIBOG?</h3>
                <p className="mt-1 text-sm text-muted-foreground">NIBOG includes 16 different games such as Baby Crawling, Baby Walker, Running Race, Hurdle Toddle, Cycle Race, Ring Holding, and more. Each game is designed for specific age groups.</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">What will my child receive for participating?</h3>
                <p className="mt-1 text-sm text-muted-foreground">Every participant receives a medal and certificate. Professional photographs of your child participating in the events will also be available.</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">In which cities are NIBOG events held?</h3>
                <p className="mt-1 text-sm text-muted-foreground">NIBOG events are held in 21 cities across India including Hyderabad, Bangalore, Chennai, Vizag, Mumbai, Delhi, Kolkata, Pune, and many more.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </AnimatedBackground>
  );
}
