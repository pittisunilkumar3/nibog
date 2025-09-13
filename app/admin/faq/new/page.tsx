"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, HelpCircle, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  question: string
  answer: string
  category: string
  priority: number
  status: 'active' | 'inactive'
}

interface FormErrors {
  question?: string
  answer?: string
  priority?: string
}

export default function NewFAQPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<FormData>({
    question: '',
    answer: '',
    category: '',
    priority: 1,
    status: 'active'
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    'General',
    'Registration',
    'Games',
    'Rewards',
    'Locations',
    'Pricing',
    'Events',
    'Support'
  ]

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required'
    } else if (formData.question.trim().length < 10) {
      newErrors.question = 'Question must be at least 10 characters long'
    }

    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required'
    } else if (formData.answer.trim().length < 20) {
      newErrors.answer = 'Answer must be at least 20 characters long'
    }

    if (formData.priority < 1) {
      newErrors.priority = 'Priority must be at least 1'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | number) => {
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
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "FAQ Created Successfully! ✅",
        description: "The new FAQ has been added to your website.",
      })
      
      router.push('/admin/faq')
    } catch (error) {
      console.error('FAQ creation error:', error)
      toast({
        title: "Error Creating FAQ",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/faq">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to FAQs
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <HelpCircle className="h-8 w-8" />
              Create New FAQ
            </h1>
            <p className="text-muted-foreground">
              Add a new frequently asked question to your website
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>FAQ Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question */}
              <div className="space-y-2">
                <Label htmlFor="question">Question *</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => handleInputChange('question', e.target.value)}
                  placeholder="Enter the frequently asked question"
                  className={errors.question ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.question && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.question}
                  </p>
                )}
              </div>

              {/* Answer */}
              <div className="space-y-2">
                <Label htmlFor="answer">Answer *</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) => handleInputChange('answer', e.target.value)}
                  placeholder="Enter the detailed answer to the question"
                  rows={6}
                  className={`resize-none ${errors.answer ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.answer && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.answer}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority">Display Priority *</Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', parseInt(e.target.value) || 1)}
                  placeholder="Enter display priority (1 = highest)"
                  className={errors.priority ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.priority && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.priority}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Lower numbers appear first. Use 1 for highest priority.
                </p>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'inactive') => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Only active FAQs will be displayed on your website.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating FAQ...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create FAQ
                    </>
                  )}
                </Button>
                <Link href="/admin/faq">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
