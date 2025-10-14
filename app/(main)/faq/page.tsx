"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { getAllActiveFAQs, groupFAQsByCategory, FAQ } from "@/services/faqService"

// Fallback FAQ data (used when API is not available)
const FALLBACK_FAQS: FAQ[] = [
  // General
  {
    id: 1,
    question: "What is NIBOG?",
    answer: "NIBOG (New India Baby Olympic Games) is India's biggest baby Olympic games platform, focused exclusively on conducting baby games for children aged 5 months to 12 years. We organize competitive events in 21 cities across India, providing a platform for children to showcase their abilities, build confidence, and have fun.",
    category: "General",
    display_order: 1,
    is_active: true,
  },
  {
    id: 2,
    question: "What age groups can participate in NIBOG events?",
    answer: "NIBOG events are designed for children aged 5 months to 7 years. Different events have specific age categories, and children can only participate in events appropriate for their age group. The age of the child on the event date will be considered for determining eligibility.",
    category: "General",
    display_order: 2,
    is_active: true,
  },
  {
    id: 3,
    question: "Where are NIBOG events held?",
    answer: "NIBOG events are currently held in 21 cities across India, including Hyderabad, Bangalore, Mumbai, Delhi, Chennai, Kolkata, Pune, Ahmedabad, and more. Events are typically held in indoor stadiums, sports complexes, or large event venues to ensure comfort and safety for all participants.",
    category: "General",
    display_order: 3,
    is_active: true,
  },
  {
    id: 4,
    question: "How often are NIBOG events organized?",
    answer: "NIBOG organizes events throughout the year. Major events are typically held quarterly in each city, with special events during school holidays and festive seasons. Check our Events page for upcoming events in your city.",
    category: "General",
    display_order: 4,
    is_active: true,
  },
  {
    id: 5,
    question: "Who can I contact for more information?",
    answer: "You can contact our customer support team at newindiababyolympics@gmail.com or call us at +91-8977939614/15. Our office hours are Monday to Sunday, 10:00 AM to 6:00 PM. You can also visit our Contact page for more information.",
    category: "General",
    display_order: 5,
    is_active: true,
  },
  // Registration
  {
    id: 6,
    question: "How do I register my child for a NIBOG event?",
    answer: "You can register your child through our website by visiting the Events page, selecting an event in your city, and following the registration process. You'll need to provide your child's details and make the registration payment online. Registration is complete only after full payment.",
    category: "Registration",
    display_order: 1,
    is_active: true,
  },
  {
    id: 7,
    question: "What information do I need to provide during registration?",
    answer: "During registration, you'll need to provide:<ul class='list-disc pl-6 mt-2 space-y-1'><li>Parent/guardian contact information (name, email, phone)</li><li>Child's full name, date of birth, and gender</li><li>Events you wish to register for</li><li>Any special requirements or health information</li></ul>",
    category: "Registration",
    display_order: 2,
    is_active: true,
  },
  {
    id: 8,
    question: "What is the registration fee?",
    answer: "Registration fees vary depending on the event, age category, and city. Basic registration starts at ₹500 per event, with discounts available for multiple event registrations. The exact fee will be displayed during the registration process.",
    category: "Registration",
    display_order: 3,
    is_active: true,
  },
  {
    id: 9,
    question: "Can I register for multiple events?",
    answer: "Yes, you can register your child for multiple events as long as they meet the age requirements for each event and the event schedules don't conflict. We offer discounts for multiple event registrations.",
    category: "Registration",
    display_order: 4,
    is_active: true,
  },
  {
    id: 10,
    question: "What is your cancellation and refund policy?",
    answer: "Our refund policy depends on when you cancel:<ul class='list-disc pl-6 mt-2 space-y-1'><li>More than 30 days before: Full refund minus ₹200 processing fee</li><li>15-30 days before: 75% refund</li><li>7-14 days before: 50% refund</li><li>Less than 7 days before: No refund</li></ul><p class='mt-2'>Please see our <a href='/refund' class='text-primary hover:underline'>Refund Policy</a> for complete details.</p>",
    category: "Registration",
    display_order: 5,
    is_active: true,
  },
  // Events
  {
    id: 11,
    question: "What types of events does NIBOG offer?",
    answer: "NIBOG offers a variety of age-appropriate events, including:<ul class='list-disc pl-6 mt-2 space-y-1'><li>Baby Crawling (5-12 months)</li><li>Baby Walker (10-18 months)</li><li>Running Race (2-12 years, with age categories)</li><li>Hurdle Toddle (2-5 years)</li><li>Cycle Race (3-12 years, with age categories)</li><li>Ring Holding (2-6 years)</li><li>And many more specialized events</li></ul>",
    category: "Events",
    display_order: 1,
    is_active: true,
  },
  {
    id: 12,
    question: "How long do the events last?",
    answer: "Individual events typically last 1-5 minutes per participant, depending on the event type. The entire event day may last 4-6 hours, with different age categories scheduled at different times. You will receive a detailed schedule before the event with your child's reporting time.",
    category: "Events",
    display_order: 2,
    is_active: true,
  },
  {
    id: 13,
    question: "What should my child wear to the event?",
    answer: "Children should wear comfortable clothing that allows for easy movement. Sports attire is recommended. For crawling events, knee pads are optional but recommended. Shoes should be comfortable and appropriate for the event (e.g., sports shoes for running events).",
    category: "Events",
    display_order: 3,
    is_active: true,
  },
  {
    id: 14,
    question: "Can parents accompany their children during the events?",
    answer: "Yes, parents can accompany very young children (especially in the baby crawling and baby walker categories). For older children, parents will be seated in the designated viewing area. A maximum of 4 family members are allowed with one child.",
    category: "Events",
    display_order: 4,
    is_active: true,
  },
  {
    id: 15,
    question: "What happens if my child doesn't want to participate on the day?",
    answer: "We understand that young children may sometimes feel uncomfortable in new environments. Our staff will try to make your child comfortable, but we never force participation. Unfortunately, registration fees are non-refundable in such cases, as mentioned in our refund policy.",
    category: "Events",
    display_order: 5,
    is_active: true,
  },
  // Rules
  {
    id: 16,
    question: "What are the rules for the Baby Crawling event?",
    answer: "For Baby Crawling (5-12 months):<ul class='list-disc pl-6 mt-2 space-y-1'><li>Babies must crawl on all fours (hands and knees)</li><li>Parents can encourage from the finish line but cannot touch the baby</li><li>The track is 5 meters long with soft mats</li><li>Fastest time wins</li><li>Maximum time allowed is 3 minutes</li></ul>",
    category: "Rules",
    display_order: 1,
    is_active: true,
  },
  {
    id: 17,
    question: "What are the rules for the Running Race?",
    answer: "For Running Race (varies by age category):<ul class='list-disc pl-6 mt-2 space-y-1'><li>2-3 years: 20 meter race</li><li>4-5 years: 30 meter race</li><li>6-8 years: 50 meter race</li><li>9-12 years: 100 meter race</li><li>Participants must stay in their lanes</li><li>False starts result in a warning; second false start is disqualification</li><li>Fastest time wins</li></ul>",
    category: "Rules",
    display_order: 2,
    is_active: true,
  },
  {
    id: 18,
    question: "How are winners determined?",
    answer: "At NIBOG, every child is a winner! We focus on participation, growth, and enjoyment. All participants receive a medal and a certificate to celebrate their involvement and build confidence. Our events foster inclusivity and camaraderie, making the experience memorable and motivating for every child.",
    category: "Rules",
    display_order: 3,
    is_active: true,
  },
  {
    id: 19,
    question: "Are there any disqualification rules?",
    answer: "Yes, participants may be disqualified for:<ul class='list-disc pl-6 mt-2 space-y-1'><li>Not following the specific event rules</li><li>Parental interference beyond what's allowed</li><li>Unsportsmanlike conduct</li><li>Age misrepresentation</li><li>Multiple false starts (for racing events)</li></ul>",
    category: "Rules",
    display_order: 4,
    is_active: true,
  },
  {
    id: 20,
    question: "Can I appeal a judge's decision?",
    answer: "Appeals must be made in writing to the event director within 15 minutes of the event's conclusion. The appeal will be reviewed by a panel of judges, and their decision will be final. Please note that video evidence from parents is not considered for appeals.",
    category: "Rules",
    display_order: 5,
    is_active: true,
  },
  // Prizes & Certificates
  {
    id: 21,
    question: "What prizes do winners receive?",
    answer: "Prizes vary by event and age category, but typically include:<ul class='list-disc pl-6 mt-2 space-y-1'><li>1st Place: Gold medal, certificate, and trophy</li><li>2nd Place: Silver medal and certificate</li><li>3rd Place: Bronze medal and certificate</li><li>Special prizes from sponsors may also be awarded</li></ul>",
    category: "Prizes & Certificates",
    display_order: 1,
    is_active: true,
  },
  {
    id: 22,
    question: "Do all participants receive certificates?",
    answer: "Yes, all participants receive a participation certificate regardless of their performance. We believe in recognizing every child's effort and courage to participate.",
    category: "Prizes & Certificates",
    display_order: 2,
    is_active: true,
  },
  {
    id: 23,
    question: "When are prizes and certificates distributed?",
    answer: "Medals and trophies are typically awarded during a ceremony at the end of each event category. Participation certificates are distributed as participants exit the event area. If you need to leave early, please inform the registration desk to collect your child's certificate.",
    category: "Prizes & Certificates",
    display_order: 3,
    is_active: true,
  },
  {
    id: 24,
    question: "What if my child's name is misspelled on the certificate?",
    answer: "Please check your child's name carefully during registration. If there is a mistake on the certificate, please inform the registration desk on the event day, and we will arrange for a corrected certificate to be sent to you within 7-10 business days.",
    category: "Prizes & Certificates",
    display_order: 4,
    is_active: true,
  },
  {
    id: 25,
    question: "Are there any cash prizes?",
    answer: "For standard events, we do not offer cash prizes. However, for special championship events or national finals, there may be scholarships or cash prizes. Details for such events will be clearly mentioned in the event description.",
    category: "Prizes & Certificates",
    display_order: 5,
    is_active: true,
  },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true)
        console.log('📋 Attempting to fetch FAQs from API...')
        const data = await getAllActiveFAQs()
        
        if (data && data.length > 0) {
          console.log(`✅ Loaded ${data.length} FAQs from API`)
          setFaqs(data)
          setUsingFallback(false)
        } else {
          console.log('⚠️ API returned no FAQs, using fallback data')
          setFaqs(FALLBACK_FAQS)
          setUsingFallback(true)
        }
      } catch (err) {
        console.error('❌ Failed to fetch FAQs from API:', err)
        console.log('📋 Using fallback FAQ data')
        setFaqs(FALLBACK_FAQS)
        setUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }

    fetchFAQs()
  }, [])

  const faqsByCategory = groupFAQsByCategory(faqs)
  const categories = Object.keys(faqsByCategory)

  // Loading state
  if (loading) {
    return (
      <div className="container py-12 md:py-16 lg:py-24">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading FAQs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12 md:py-16 lg:py-24">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about NIBOG events
          </p>
        </div>

        {/* All FAQs in vertical layout */}
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category} className="space-y-4">
              <h2 className="text-2xl font-bold text-primary mt-8 first:mt-0">{category}</h2>
              
              {faqsByCategory[category].map((faq) => (
                <div key={faq.id} className="rounded-lg border p-4">
                  <h3 className="font-medium">{faq.question}</h3>
                  <div 
                    className="mt-1 text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-center">Still have questions?</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-medium">Contact Our Support Team</h3>
                  <p className="text-muted-foreground">
                    Our customer support team is available to answer any questions you may have about NIBOG events.
                  </p>
                  <Button className="w-full" asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-medium">Read Our Policies</h3>
                  <p className="text-muted-foreground">
                    For detailed information about our terms, privacy, and refund policies.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/terms">Terms & Conditions</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/refund">Refund Policy</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
