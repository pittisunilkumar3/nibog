import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Medal, Trophy, Award, Star } from "lucide-react"
import { AnimatedTestimonials } from "@/components/animated-testimonials"
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
    image: "/placeholder.svg?height=200&width=300&text=Baby+Crawling",
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
    image: "/placeholder.svg?height=200&width=300&text=Baby+Walker",
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
    image: "/placeholder.svg?height=200&width=300&text=Running+Race",
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
    image: "/placeholder.svg?height=200&width=300&text=Hurdle+Toddle",
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
    image: "/placeholder.svg?height=200&width=300&text=Cycle+Race",
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
    image: "/placeholder.svg?height=200&width=300&text=Ring+Holding",
    spotsLeft: 8,
    totalSpots: 15,
  },
]

export default function BabyOlympicsPage() {
  return (
    <div className="flex flex-col gap-12 pb-8">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-600/5" />
        <div className="container relative flex flex-col items-center justify-center gap-4 py-16 text-center md:py-24 lg:py-32">
          <Badge className="bg-yellow-500 px-3.5 py-1.5 text-sm font-medium">New India Baby Olympics Games</Badge>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            NIBOG - <span className="text-yellow-500">Game of Baby Thrones</span>
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Step into the World of Baby Games and watch while they Kick, Crawl, Conquer. India's biggest baby Olympic games in 21 cities.
          </p>
          <div className="w-full max-w-md space-y-4 rounded-lg bg-background/80 p-4 shadow-lg backdrop-blur">
            <Tabs defaultValue="city" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="city">Find by City</TabsTrigger>
                <TabsTrigger value="age">Find by Age</TabsTrigger>
              </TabsList>
              <TabsContent value="city" className="mt-4">
                <CitySelector />
              </TabsContent>
              <TabsContent value="age" className="mt-4">
                <AgeSelector />
              </TabsContent>
            </Tabs>
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600" size="lg" asChild>
              <Link href="/register-event">Register for NIBOG Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">What is NIBOG?</h2>
            <p className="text-muted-foreground">
              NIBOG (New India Baby Olympics Games) is India's biggest baby Olympic games platform, executing in 21 cities across India. Our games are designed to encourage physical development, confidence, and social interaction in a fun, competitive environment for babies and young children.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="rounded-full bg-yellow-500/10 p-1">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-medium">16 Different Games</h3>
                  <p className="text-sm text-muted-foreground">From crawling races to running races, we have games for all ages from 5-84 months</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="rounded-full bg-yellow-500/10 p-1">
                  <Medal className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-medium">21 Cities Across India</h3>
                  <p className="text-sm text-muted-foreground">NIBOG events are held in 21 cities across India, making it accessible to families nationwide</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="rounded-full bg-yellow-500/10 p-1">
                  <Award className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-medium">Medals & Certificates</h3>
                  <p className="text-sm text-muted-foreground">Every participant receives a medal and certificate, recognizing their achievement</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="rounded-full bg-yellow-500/10 p-1">
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-medium">Professional Photography</h3>
                  <p className="text-sm text-muted-foreground">Capture these precious moments with our professional photographers at every event</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-80 w-full overflow-hidden rounded-lg">
              <Image src="/placeholder.svg?height=320&width=480&text=NIBOG+Baby+Olympics" alt="NIBOG Baby Olympics" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="bg-muted/50 py-12">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Upcoming NIBOG Events</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">
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

      {/* FAQ Section */}
      <section className="container">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Everything you need to know about NIBOG events</p>
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
  );
}
