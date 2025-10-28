import type React from "react"
import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "My Dashboard | NIBOG",
  description: "Manage your profile, bookings, and preferences on NIBOG",
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">{children}</main>
      <Footer />
    </div>
  )
}

