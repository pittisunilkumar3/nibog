"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, HelpCircle, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
        toast({
          title: "Message Sent Successfully! ✅",
          description: result.message,
        })
      } else {
        throw new Error(result.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      toast({
        title: "Error Sending Message",
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatedBackground variant="contact">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sunshine-100 via-coral-100 to-mint-100 dark:from-sunshine-900/20 dark:via-coral-900/20 dark:to-mint-900/20 py-16 sm:py-20 md:py-28">
        {/* Floating decorative elements - hidden on mobile for better performance */}
        <div className="hidden sm:block absolute top-10 left-10 w-16 sm:w-20 h-16 sm:h-20 bg-sunshine-300 rounded-full opacity-20 animate-float"></div>
        <div className="hidden sm:block absolute top-20 right-20 w-12 sm:w-16 h-12 sm:h-16 bg-coral-300 rounded-full opacity-20 animate-float-delayed"></div>
        <div className="hidden sm:block absolute bottom-20 left-20 w-20 sm:w-24 h-20 sm:h-24 bg-mint-300 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="hidden sm:block absolute bottom-10 right-10 w-16 sm:w-18 h-16 sm:h-18 bg-lavender-300 rounded-full opacity-20 animate-float-slow"></div>

        <div className="container relative z-10 px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center space-y-6 sm:space-y-8">
            <Badge className="px-4 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl font-bold bg-gradient-to-r from-sunshine-400 to-coral-400 text-neutral-charcoal rounded-full shadow-xl animate-bounce-gentle border-2 sm:border-4 border-white/50">
              📞 Contact NIBOG
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sunshine-500 via-coral-500 to-mint-500 bg-[length:200%_auto] animate-rainbow-shift">
                Contact Us
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-charcoal/80 dark:text-white/80 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
              We'd love to hear from you! Reach out to the <span className="font-bold text-sunshine-600">NIBOG team</span> with any
              <span className="font-bold text-coral-600"> questions</span> or
              <span className="font-bold text-mint-600"> inquiries</span> 💬
            </p>

            {/* Fun emoji decorations */}
            <div className="flex justify-center gap-3 sm:gap-6 text-2xl sm:text-4xl">
              <span className="animate-bounce-gentle">📞</span>
              <span className="animate-bounce-gentle" style={{animationDelay: '0.5s'}}>💬</span>
              <span className="animate-bounce-gentle" style={{animationDelay: '1s'}}>📧</span>
              <span className="animate-bounce-gentle" style={{animationDelay: '1.5s'}}>🤝</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-br from-lavender-100 via-mint-50 to-coral-50 dark:from-lavender-900/20 dark:via-mint-900/20 dark:to-coral-900/20 overflow-hidden">
        {/* Decorative background elements - hidden on mobile */}
        <div className="hidden sm:block absolute top-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-sunshine-300 rounded-full opacity-10 animate-float"></div>
        <div className="hidden sm:block absolute bottom-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-coral-300 rounded-full opacity-10 animate-float-delayed"></div>
        <div className="hidden sm:block absolute top-1/2 left-1/4 w-20 sm:w-24 h-20 sm:h-24 bg-mint-300 rounded-full opacity-10 animate-bounce-gentle"></div>

        <div className="container relative z-10 px-4 sm:px-6">
          <div className="grid gap-8 sm:gap-12 md:gap-16 md:grid-cols-2">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <Badge className="px-3 sm:px-4 py-2 text-sm font-bold bg-gradient-to-r from-sunshine-400 to-coral-400 text-neutral-charcoal rounded-full w-fit">
                  💬 Get in Touch
                </Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-sunshine-600 via-coral-600 to-mint-600">
                    Get in Touch
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-neutral-charcoal/70 dark:text-white/70 leading-relaxed">
                  Have questions about our events, registration process, or anything else? Our team is here to help!
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="card-baby-gradient p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-white/50 hover:scale-105 transition-all duration-300 touch-manipulation">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-sunshine-400 to-sunshine-600 rounded-full p-3 sm:p-4 shadow-lg animate-medal-shine">
                      <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-neutral-charcoal dark:text-white">📞 Phone</h3>
                      <p className="text-base sm:text-lg font-semibold text-sunshine-700 mt-1 sm:mt-2 break-all">+91-8977939614/15</p>
                      <p className="text-neutral-charcoal/70 dark:text-white/70 text-xs sm:text-sm mt-1">Call us for immediate assistance</p>
                    </div>
                  </div>
                </div>

                <div className="card-baby-gradient p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-white/50 hover:scale-105 transition-all duration-300 touch-manipulation">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-coral-400 to-coral-600 rounded-full p-3 sm:p-4 shadow-lg animate-medal-shine">
                      <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-neutral-charcoal dark:text-white">📧 Email</h3>
                      <p className="text-base sm:text-lg font-semibold text-coral-700 mt-1 sm:mt-2 break-all">newindababyolympics@gmail.com</p>
                      <p className="text-neutral-charcoal/70 dark:text-white/70 text-xs sm:text-sm mt-1">Send us your queries anytime</p>
                    </div>
                  </div>
                </div>

                <div className="card-baby-gradient p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-white/50 hover:scale-105 transition-all duration-300 touch-manipulation">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-mint-400 to-mint-600 rounded-full p-3 sm:p-4 shadow-lg animate-medal-shine">
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-neutral-charcoal dark:text-white">🏢 Head Office</h3>
                      <p className="text-base sm:text-lg font-semibold text-mint-700 mt-1 sm:mt-2">
                        NIBOG, P.No:18, H.NO 33-30/4,<br />
                        Officers Colony, R.K Puram,<br />
                        Hyderabad - 500056
                      </p>
                      <p className="text-neutral-charcoal/70 dark:text-white/70 text-xs sm:text-sm mt-1">Visit us at our headquarters</p>
                    </div>
                  </div>
                </div>

                <div className="card-baby-gradient p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-white/50 hover:scale-105 transition-all duration-300 touch-manipulation">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-full p-3 sm:p-4 shadow-lg animate-medal-shine">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-neutral-charcoal dark:text-white">🕒 Office Hours</h3>
                      <p className="text-base sm:text-lg font-semibold text-lavender-700 mt-1 sm:mt-2">
                        Monday - Sunday<br />
                        10:00 AM - 6:00 PM
                      </p>
                      <p className="text-neutral-charcoal/70 dark:text-white/70 text-xs sm:text-sm mt-1">We're here to help every day!</p>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>

            <div className="relative">
              <div className="absolute -inset-3 sm:-inset-6 bg-[radial-gradient(circle_at_70%_30%,rgba(180,180,255,0.2),transparent_70%),radial-gradient(circle_at_30%_70%,rgba(255,182,193,0.2),transparent_70%)] blur-xl rounded-2xl opacity-70 dark:opacity-30"></div>
              <Card className="bg-white dark:bg-slate-800/90 shadow-md relative z-10">
                <CardContent className="p-4 sm:p-6">
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                      <h3 className="text-xl font-semibold text-green-700 mb-2">Message Sent Successfully!</h3>
                      <p className="text-gray-600 mb-4">Thank you for contacting us. We'll get back to you soon.</p>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                        className="h-10"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm sm:text-base">Your Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your full name"
                          required
                          className={`h-11 sm:h-10 text-base sm:text-sm touch-manipulation ${
                            errors.name ? 'border-red-500 focus:border-red-500' : ''
                          }`}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm sm:text-base">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email address"
                          required
                          className={`h-11 sm:h-10 text-base sm:text-sm touch-manipulation ${
                            errors.email ? 'border-red-500 focus:border-red-500' : ''
                          }`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                          className="h-11 sm:h-10 text-base sm:text-sm touch-manipulation"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm sm:text-base">Subject</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          placeholder="What is your message about?"
                          className="h-11 sm:h-10 text-base sm:text-sm touch-manipulation"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm sm:text-base">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Please provide details about your inquiry"
                          rows={4}
                          required
                          className={`text-base sm:text-sm touch-manipulation resize-none ${
                            errors.message ? 'border-red-500 focus:border-red-500' : ''
                          }`}
                        />
                        {errors.message && (
                          <p className="text-red-500 text-sm flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.message}
                          </p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 sm:h-10 text-base sm:text-sm font-semibold touch-manipulation"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-12 sm:py-16 md:py-24">
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800/50 -z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(147,197,253,0.15),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(216,180,254,0.15),transparent_60%)] blur-xl opacity-80 dark:opacity-20 -z-10"></div>
        <div className="container px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              FAQs
            </div>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Find answers to common questions about NIBOG events and registration
            </p>
          </div>

          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 md:grid-cols-2">
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
      <section className="bg-purple-600 py-12 sm:py-16 md:py-24 text-white dark:bg-purple-900">
        <div className="container px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
              Ready to Join the NIBOG Family?
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-purple-100">
              Register your child for our upcoming events and be part of India's biggest baby Olympic games
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col justify-center gap-3 sm:gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-purple-50 h-12 sm:h-10 text-base sm:text-sm font-semibold touch-manipulation"
                asChild
              >
                <Link href="/register-event">Register Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white hover:bg-white/10 border-white h-12 sm:h-10 text-base sm:text-sm font-semibold touch-manipulation"
                asChild
              >
                <Link href="/events">Browse Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </AnimatedBackground>
  )
}
