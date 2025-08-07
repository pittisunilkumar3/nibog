"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { getFooterSettingWithFallback, type FooterSetting } from "@/services/footerSettingService"

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterSetting | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setIsLoading(true)
        const data = await getFooterSettingWithFallback()
        setFooterData(data)
      } catch (error) {
        console.error('❌ Failed to fetch footer data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFooterData()
  }, [])

  // Use footer data or fallback values
  const companyName = footerData?.company_name || "NIBOG"
  const companyDescription = footerData?.company_description || "India's biggest baby Olympic games platform, executing in 21 cities across India. NIBOG is focused exclusively on conducting baby games for children aged 5-84 months."
  const address = footerData?.address || "ΗΝΟ.33-30/4, PN018,SATGURU OFF COLONY\nSECUNDERABAD, MEDCHAL\nPIN:500056, TELANGANA, INDIA"
  const phone = footerData?.phone || "+91 9000125959"
  const email = footerData?.email || "newindababyolympics@gmail.com"
  const newsletterEnabled = footerData?.newsletter_enabled ?? true
  const copyrightText = footerData?.copyright_text || "© {year} NIBOG. All rights reserved. India's Biggest Baby Olympic Games Platform."
  const facebookUrl = footerData?.facebook_url || "https://facebook.com"
  const instagramUrl = footerData?.instagram_url || "https://instagram.com"
  const twitterUrl = footerData?.twitter_url || "https://twitter.com"
  const youtubeUrl = footerData?.youtube_url || "https://youtube.com"

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🏢 Footer Component State:', {
      isLoading,
      footerData,
      companyName,
      companyDescription: companyDescription.substring(0, 50) + '...'
    })
  }

  // Show loading state for debugging
  if (isLoading) {
    return (
      <footer className="border-t bg-background">
        <div className="container py-8 md:py-12">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading footer...</div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-2">
            <h3 className="text-lg font-semibold text-purple-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-300">
              {companyName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {companyDescription}
            </p>
            <div className="flex space-x-4">
              {facebookUrl && facebookUrl !== "https://facebook.com" && (
                <Link href={facebookUrl} className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
              )}
              {instagramUrl && instagramUrl !== "https://instagram.com" && (
                <Link href={instagramUrl} className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="sr-only">Instagram</span>
                </Link>
              )}
              {twitterUrl && twitterUrl !== "https://twitter.com" && (
                <Link href={twitterUrl} className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
              )}
              {youtubeUrl && youtubeUrl !== "https://youtube.com" && (
                <Link href={youtubeUrl} className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span className="sr-only">YouTube</span>
                </Link>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-foreground">
                  All Events
                </Link>
              </li>
              <li>
                <Link href="/baby-olympics" className="text-muted-foreground hover:text-foreground">
                  NIBOG Games
                </Link>
              </li>
              <li>
                <Link href="/baby-olympics" className="text-muted-foreground hover:text-foreground">
                  Baby Crawling
                </Link>
              </li>
              <li>
                <Link href="/baby-olympics" className="text-muted-foreground hover:text-foreground">
                  Running Race
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              {/* <li>
                <Link href="/refund" className="text-muted-foreground hover:text-foreground">
                  Refund Policy
                </Link>
              </li> */}
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground whitespace-pre-line">
                  {address}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-muted-foreground">{phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-muted-foreground">{email}</span>
              </li>
            </ul>
            {newsletterEnabled && (
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Subscribe to our newsletter</h4>
                <div className="flex gap-2">
                  <Input type="email" placeholder="Your email" className="h-9" />
                  <Button size="sm" className="h-9">
                    Subscribe
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>{copyrightText.replace('{year}', new Date().getFullYear().toString())}</p>
        </div>
      </div>
    </footer>
  )
}
