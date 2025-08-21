"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Upload, RefreshCw, Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import {
  getSportsImportanceData,
  saveSportsImportanceData,
  uploadSportsImportanceImage,
  SportsImportanceData,
  SportsImportanceItem
} from "@/services/sportsImportanceService"

export default function SportsImportancePage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [data, setData] = useState<SportsImportanceData>({
    title: "WHY SPORTS ARE IMPORTANT TO CHILDREN",
    description: "The Child Olympic Games are a wonderful opportunity to get kids excited about sport, national pride and counting medals",
    items: []
  })
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [newItem, setNewItem] = useState<Partial<SportsImportanceItem>>({
    name: "",
    age: "",
    image: ""
  })
  const [isAddingNew, setIsAddingNew] = useState(false)

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const loadedData = await getSportsImportanceData()
      setData(loadedData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load sports importance data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await saveSportsImportanceData(data)

      toast({
        title: "Success",
        description: "Sports importance data saved successfully"
      })
    } catch (error: any) {
      console.error("Error saving data:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save data",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddItem = () => {
    if (!newItem.name || !newItem.age) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const item: SportsImportanceItem = {
      id: Date.now().toString(),
      name: newItem.name || "",
      age: newItem.age || "",
      image: newItem.image || "/images/placeholder.jpg"
    }

    setData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }))

    setNewItem({ name: "", age: "", image: "" })
    setIsAddingNew(false)
    
    toast({
      title: "Success",
      description: "Item added successfully"
    })
  }

  const handleDeleteItem = (id: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }))
    
    toast({
      title: "Success", 
      description: "Item deleted successfully"
    })
  }

  const handleEditItem = (id: string, field: keyof SportsImportanceItem, value: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const handleImageUpload = async (file: File, itemId?: string) => {
    try {
      const imageUrl = await uploadSportsImportanceImage(file)

      if (itemId) {
        handleEditItem(itemId, "image", imageUrl)
      } else {
        setNewItem(prev => ({ ...prev, image: imageUrl }))
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully"
      })
    } catch (error: any) {
      console.error("Error uploading image:", error)

      // Fallback to blob URL for development
      const imageUrl = URL.createObjectURL(file)
      if (itemId) {
        handleEditItem(itemId, "image", imageUrl)
      } else {
        setNewItem(prev => ({ ...prev, image: imageUrl }))
      }

      toast({
        title: "Warning",
        description: "Image uploaded locally (development mode)",
        variant: "default"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2">
        <Button variant="outline" size="icon" asChild className="touch-manipulation h-10 w-10 sm:h-9 sm:w-9">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sports Importance</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage content about why sports are important to children</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="touch-manipulation">
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Title and Description */}
        <Card>
          <CardHeader>
            <CardTitle>Page Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter page title"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter page description"
                rows={3}
                className="text-base resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Items List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sports Activities</CardTitle>
            <Button 
              onClick={() => setIsAddingNew(true)} 
              disabled={isAddingNew}
              className="touch-manipulation"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Item Form */}
            {isAddingNew && (
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={newItem.name || ""}
                        onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Activity name"
                        className="text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Age Range</Label>
                      <Input
                        value={newItem.age || ""}
                        onChange={(e) => setNewItem(prev => ({ ...prev, age: e.target.value }))}
                        placeholder="e.g., 5-13 months"
                        className="text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image</Label>
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file)
                          }}
                          className="text-base"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddItem} className="touch-manipulation">
                      <Save className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingNew(false)
                        setNewItem({ name: "", age: "", image: "" })
                      }}
                      className="touch-manipulation"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Existing Items */}
            {data.items.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No sports activities added yet. Click "Add Item" to create your first activity.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.items.map((item) => (
                  <Card key={item.id} className="relative">
                    <CardContent className="p-4">
                      {/* Image */}
                      <div className="aspect-video relative mb-3 bg-muted rounded-lg overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            <Upload className="h-8 w-8" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file, item.id)
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      
                      {/* Name */}
                      {editingItem === item.id ? (
                        <Input
                          value={item.name}
                          onChange={(e) => handleEditItem(item.id, "name", e.target.value)}
                          className="mb-2 text-base"
                          onBlur={() => setEditingItem(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") setEditingItem(null)
                          }}
                          autoFocus
                        />
                      ) : (
                        <h3 
                          className="font-semibold mb-2 cursor-pointer hover:text-primary"
                          onClick={() => setEditingItem(item.id)}
                        >
                          {item.name}
                        </h3>
                      )}
                      
                      {/* Age */}
                      <Input
                        value={item.age}
                        onChange={(e) => handleEditItem(item.id, "age", e.target.value)}
                        className="text-sm text-muted-foreground mb-3"
                        placeholder="Age range"
                      />
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                          className="flex-1 touch-manipulation"
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="touch-manipulation"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
