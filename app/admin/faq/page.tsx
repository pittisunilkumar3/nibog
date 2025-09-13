"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  ArrowUp,
  ArrowDown,
  HelpCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FAQ {
  id: number
  question: string
  answer: string
  category?: string
  priority: number
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export default function FAQListPage() {
  const { toast } = useToast()
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  // Mock data for now - replace with actual API calls
  useEffect(() => {
    const mockFaqs: FAQ[] = [
      {
        id: 1,
        question: "What is the age limit for participation?",
        answer: "NIBOG events are designed for children aged 5-84 months. Different games have specific age categories to ensure fair competition.",
        category: "General",
        priority: 1,
        status: 'active',
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z"
      },
      {
        id: 2,
        question: "How do I register for NIBOG events?",
        answer: "You can register for NIBOG events through our website. Simply select your city, choose the games you want your child to participate in, and complete the registration process.",
        category: "Registration",
        priority: 2,
        status: 'active',
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z"
      },
      {
        id: 3,
        question: "What games are included in NIBOG?",
        answer: "NIBOG includes 16 different games such as Baby Crawling, Baby Walker, Running Race, Hurdle Toddle, Cycle Race, Ring Holding, and more. Each game is designed for specific age groups.",
        category: "Games",
        priority: 3,
        status: 'active',
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z"
      },
      {
        id: 4,
        question: "What will my child receive for participating?",
        answer: "Every participant receives a medal and certificate. Professional photographs of your child participating in the events will also be available.",
        category: "Rewards",
        priority: 4,
        status: 'active',
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z"
      },
      {
        id: 5,
        question: "In which cities are NIBOG events held?",
        answer: "NIBOG events are held in 21 cities across India including Hyderabad, Bangalore, Chennai, Vizag, Mumbai, Delhi, Kolkata, Pune, and many more.",
        category: "Locations",
        priority: 5,
        status: 'active',
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z"
      }
    ]
    
    setTimeout(() => {
      setFaqs(mockFaqs)
      setLoading(false)
    }, 500)
  }, [])

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (faq.category && faq.category.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = filterStatus === 'all' || faq.status === filterStatus
    
    return matchesSearch && matchesStatus
  }).sort((a, b) => a.priority - b.priority)

  const handleToggleStatus = async (id: number) => {
    try {
      const faq = faqs.find(f => f.id === id)
      if (!faq) return

      const newStatus = faq.status === 'active' ? 'inactive' : 'active'
      
      // Update local state
      setFaqs(prev => prev.map(f => 
        f.id === id ? { ...f, status: newStatus, updatedAt: new Date().toISOString() } : f
      ))

      toast({
        title: "Status Updated",
        description: `FAQ ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update FAQ status.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this FAQ? This action cannot be undone.")) {
      return
    }

    try {
      // Remove from local state
      setFaqs(prev => prev.filter(f => f.id !== id))

      toast({
        title: "FAQ Deleted",
        description: "FAQ has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete FAQ.",
        variant: "destructive",
      })
    }
  }

  const handlePriorityChange = async (id: number, direction: 'up' | 'down') => {
    try {
      const currentFaq = faqs.find(f => f.id === id)
      if (!currentFaq) return

      const sortedFaqs = [...faqs].sort((a, b) => a.priority - b.priority)
      const currentIndex = sortedFaqs.findIndex(f => f.id === id)
      
      if (direction === 'up' && currentIndex > 0) {
        const targetFaq = sortedFaqs[currentIndex - 1]
        const tempPriority = currentFaq.priority
        
        setFaqs(prev => prev.map(f => {
          if (f.id === currentFaq.id) return { ...f, priority: targetFaq.priority }
          if (f.id === targetFaq.id) return { ...f, priority: tempPriority }
          return f
        }))
      } else if (direction === 'down' && currentIndex < sortedFaqs.length - 1) {
        const targetFaq = sortedFaqs[currentIndex + 1]
        const tempPriority = currentFaq.priority
        
        setFaqs(prev => prev.map(f => {
          if (f.id === currentFaq.id) return { ...f, priority: targetFaq.priority }
          if (f.id === targetFaq.id) return { ...f, priority: tempPriority }
          return f
        }))
      }

      toast({
        title: "Priority Updated",
        description: "FAQ priority has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update FAQ priority.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading FAQs...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <HelpCircle className="h-8 w-8" />
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground">
              Manage FAQ content for your website
            </p>
          </div>
          <Link href="/admin/faq/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New FAQ
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  All ({faqs.length})
                </Button>
                <Button
                  variant={filterStatus === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('active')}
                >
                  Active ({faqs.filter(f => f.status === 'active').length})
                </Button>
                <Button
                  variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('inactive')}
                >
                  Inactive ({faqs.filter(f => f.status === 'inactive').length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ List */}
        <div className="grid gap-4">
          {filteredFaqs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No FAQs Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== 'all' 
                    ? "No FAQs match your current filters." 
                    : "Get started by creating your first FAQ."}
                </p>
                <Link href="/admin/faq/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New FAQ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredFaqs.map((faq) => (
              <Card key={faq.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={faq.status === 'active' ? 'default' : 'secondary'}>
                          {faq.status}
                        </Badge>
                        {faq.category && (
                          <Badge variant="outline">{faq.category}</Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          Priority: {faq.priority}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePriorityChange(faq.id, 'up')}
                        title="Move up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePriorityChange(faq.id, 'down')}
                        title="Move down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(faq.id)}
                        title={faq.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {faq.status === 'active' ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Link href={`/admin/faq/${faq.id}/edit`}>
                        <Button variant="ghost" size="sm" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(faq.id)}
                        title="Delete"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground line-clamp-3">{faq.answer}</p>
                  <div className="flex justify-between items-center mt-3 text-sm text-muted-foreground">
                    <span>Created: {new Date(faq.createdAt).toLocaleDateString()}</span>
                    <span>Updated: {new Date(faq.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
