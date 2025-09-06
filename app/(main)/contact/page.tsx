import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, HelpCircle } from "lucide-react"
import type { Metadata } from "next"
import { AnimatedBackground } from "@/components/animated-background"

export const metadata: Metadata = {
  title: "Contact Us | NIBOG - New India Baby Olympic Games",
  description: "Get in touch with the NIBOG team for inquiries about events, registrations, partnerships, or any other questions.",
}

export default function ContactPage() {
  return (
    <AnimatedBackground variant="contact">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sunshine-100 via-coral-100 to-mint-100 dark:from-sunshine-900/20 dark:via-coral-900/20 dark:to-mint-900/20 py-20 md:py-28">
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-sunshine-300 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-coral-300 rounded-full opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-mint-300 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-10 right-10 w-18 h-18 bg-lavender-300 rounded-full opacity-20 animate-float-slow"></div>

        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <Badge className="px-8 py-4 text-xl font-bold bg-gradient-to-r from-sunshine-400 to-coral-400 text-neutral-charcoal rounded-full shadow-xl animate-bounce-gentle border-4 border-white/50">
              📞 Contact NIBOG
            </Badge>

            <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sunshine-500 via-coral-500 to-mint-500 bg-[length:200%_auto] animate-rainbow-shift">
                Contact Us
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-neutral-charcoal/80 dark:text-white/80 leading-relaxed max-w-3xl mx-auto">
              We'd love to hear from you! Reach out to the <span className="font-bold text-sunshine-600">NIBOG team</span> with any
              <span className="font-bold text-coral-600"> questions</span> or
              <span className="font-bold text-mint-600"> inquiries</span> 💬
            </p>

            {/* Fun emoji decorations */}
            <div className="flex justify-center gap-6 text-4xl">
              <span className="animate-bounce-gentle">📞</span>
              <span className="animate-bounce-gentle" style={{animationDelay: '0.5s'}}>💬</span>
              <span className="animate-bounce-gentle" style={{animationDelay: '1s'}}>📧</span>
              <span className="animate-bounce-gentle" style={{animationDelay: '1.5s'}}>🤝</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="relative py-20 bg-gradient-to-br from-lavender-100 via-mint-50 to-coral-50 dark:from-lavender-900/20 dark:via-mint-900/20 dark:to-coral-900/20 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-sunshine-300 rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-coral-300 rounded-full opacity-10 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-mint-300 rounded-full opacity-10 animate-bounce-gentle"></div>

        <div className="container relative z-10">
          <div className="grid gap-16 md:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-sunshine-400 to-coral-400 text-neutral-charcoal rounded-full w-fit">
                  💬 Get in Touch
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-sunshine-600 via-coral-600 to-mint-600">
                    Get in Touch
                  </span>
                </h2>
                <p className="text-lg text-neutral-charcoal/70 dark:text-white/70 leading-relaxed">
                  Have questions about our events, registration process, or anything else? Our team is here to help!
                </p>
              </div>

              <div className="space-y-6">
                <div className="card-baby-gradient p-6 rounded-3xl shadow-xl border-2 border-white/50 hover:scale-105 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-sunshine-400 to-sunshine-600 rounded-full p-4 shadow-lg animate-medal-shine">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-charcoal dark:text-white">📞 Phone</h3>
                      <p className="text-lg font-semibold text-sunshine-700 mt-2">+91-8977939614/15</p>
                      <p className="text-neutral-charcoal/70 dark:text-white/70 text-sm mt-1">Call us for immediate assistance</p>
                    </div>
                  </div>
                </div>

                <div className="card-baby-gradient p-6 rounded-3xl shadow-xl border-2 border-white/50 hover:scale-105 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-coral-400 to-coral-600 rounded-full p-4 shadow-lg animate-medal-shine">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-charcoal dark:text-white">📧 Email</h3>
                      <p className="text-lg font-semibold text-coral-700 mt-2">newindababyolympics@gmail.com</p>
                      <p className="text-neutral-charcoal/70 dark:text-white/70 text-sm mt-1">Send us your queries anytime</p>
                    </div>
                  </div>
                </div>

                <div className="card-baby-gradient p-6 rounded-3xl shadow-xl border-2 border-white/50 hover:scale-105 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-mint-400 to-mint-600 rounded-full p-4 shadow-lg animate-medal-shine">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-charcoal dark:text-white">🏢 Head Office</h3>
                      <p className="text-lg font-semibold text-mint-700 mt-2">
                        NIBOG, P.No:18, H.NO 33-30/4,<br />
                        Officers Colony, R.K Puram,<br />
                        Hyderabad - 500056
                      </p>
                      <p className="text-neutral-charcoal/70 dark:text-white/70 text-sm mt-1">Visit us at our headquarters</p>
                    </div>
                  </div>
                </div>

                <div className="card-baby-gradient p-6 rounded-3xl shadow-xl border-2 border-white/50 hover:scale-105 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-full p-4 shadow-lg animate-medal-shine">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-charcoal dark:text-white">🕒 Office Hours</h3>
                      <p className="text-lg font-semibold text-lavender-700 mt-2">
                        Monday - Sunday<br />
                        10:00 AM - 6:00 PM
                      </p>
                      <p className="text-neutral-charcoal/70 dark:text-white/70 text-sm mt-1">We're here to help every day!</p>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>

            <div className="relative">
              <div className="absolute -inset-6 bg-[radial-gradient(circle_at_70%_30%,rgba(180,180,255,0.2),transparent_70%),radial-gradient(circle_at_30%_70%,rgba(255,182,193,0.2),transparent_70%)] blur-xl rounded-2xl opacity-70 dark:opacity-30"></div>
              <Card className="bg-white dark:bg-slate-800/90 shadow-md relative z-10">
                <CardContent className="pt-6">
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input id="name" placeholder="Enter your full name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter your email address" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Enter your phone number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="What is your message about?" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide details about your inquiry"
                        rows={5}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800/50 -z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(147,197,253,0.15),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(216,180,254,0.15),transparent_60%)] blur-xl opacity-80 dark:opacity-20 -z-10"></div>
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              FAQs
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Find answers to common questions about NIBOG events and registration
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                question: "How do I register my child for a NIBOG event?",
                answer: "You can register your child through our website by visiting the Events page, selecting an event in your city, and following the registration process. You'll need to provide your child's details and make the registration payment online.",
              },
              {
                question: "What age groups can participate in NIBOG events?",
                answer: "NIBOG events are designed for children aged 5 months to 7 years. Different events have specific age categories, and children can only participate in events appropriate for their age group.",
              },
              {
                question: "How are winners determined in the competitions?",
                answer: "At NIBOG, every child is a winner! We focus on participation, growth, and enjoyment. All participants receive a medal and a certificate to celebrate their involvement and build confidence. Our events foster inclusivity and camaraderie, making the experience memorable and motivating for every child.",
              },
              {
                question: "What should my child wear to the event?",
                answer: "Children should wear comfortable clothing that allows for easy movement. Sports attire is recommended. For crawling events, knee pads are optional but recommended.",
              },
              {
                question: "Can parents accompany their children during the events?",
                answer: "Yes, parents can accompany very young children (especially in the baby crawling and baby walker categories). For older children, parents will be seated in the designated viewing area. A maximum of 4 family members are allowed with one child.",
              },
              {
                question: "What happens if my child doesn't want to participate on the day?",
                answer: "We understand that young children may sometimes feel uncomfortable in new environments. Our staff will try to make your child comfortable, but we never force participation. Unfortunately, registration fees are non-refundable in such cases.",
              },
            ].map((faq, i) => (
              <Card key={i} className="bg-white dark:bg-slate-800/90">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{faq.question}</h3>
                      <p className="mt-2 text-slate-600 dark:text-slate-300">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 dark:text-slate-300">
              Don't see your question here? Contact us directly and we'll be happy to help!
            </p>
          </div>
        </div>
      </section>

      

      {/* CTA */}
      <section className="bg-purple-600 py-16 text-white dark:bg-purple-900 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Ready to Join the NIBOG Family?
            </h2>
            <p className="mt-4 text-xl text-purple-100">
              Register your child for our upcoming events and be part of India's biggest baby Olympic games
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50" asChild>
                <Link href="/register-event">Register Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white hover:bg-white/10" asChild>
                <Link href="/register">Register Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </AnimatedBackground>
  )
}
