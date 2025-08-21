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
  getGameImportanceData,
  saveGameImportanceData,
  uploadGameImportanceIcon,
  GameImportanceData,
  GameImportanceItem
} from "@/services/gameImportanceService"

export default function GameImportancePage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [data, setData] = useState<GameImportanceData>({
    title: "WHY GAMES ARE IMPORTANT FOR CHILDREN",
    description: "Educational games and play activities are fundamental for children's cognitive, social, and emotional development",
    items: []
  })
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [newItem, setNewItem] = useState<Partial<GameImportanceItem>>({
    name: "",
    description: "",
    icon: ""
  })
  const [isAddingNew, setIsAddingNew] = useState(false)

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const loadedData = await getGameImportanceData()
      setData(loadedData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load game importance data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await saveGameImportanceData(data)

      toast({
        title: "Success",
        description: "Game importance data saved successfully"
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
    if (!newItem.name || !newItem.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const item: GameImportanceItem = {
      id: Date.now().toString(),
      name: newItem.name || "",
      description: newItem.description || "",
      icon: newItem.icon || "/images/placeholder-icon.png"
    }

    setData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }))

    setNewItem({ name: "", description: "", icon: "" })
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

  const handleEditItem = (id: string, field: keyof GameImportanceItem, value: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const handleImageUpload = async (file: File, itemId?: string) => {
    try {
      const imageUrl = await uploadGameImportanceIcon(file)

      if (itemId) {
        handleEditItem(itemId, "icon", imageUrl)
      } else {
        setNewItem(prev => ({ ...prev, icon: imageUrl }))
      }

      toast({
        title: "Success",
        description: "Icon uploaded successfully"
      })
    } catch (error: any) {
      console.error("Error uploading icon:", error)

      // Fallback to blob URL for development
      const imageUrl = URL.createObjectURL(file)
      if (itemId) {
        handleEditItem(itemId, "icon", imageUrl)
      } else {
        setNewItem(prev => ({ ...prev, icon: imageUrl }))
      }

      toast({
        title: "Warning",
        description: "Icon uploaded locally (development mode)",
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Game Importance</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage content about why games are important for children's development</p>
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
            <CardTitle>Game Benefits</CardTitle>
            <Button 
              onClick={() => setIsAddingNew(true)} 
              disabled={isAddingNew}
              className="touch-manipulation"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Benefit
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Item Form */}
            {isAddingNew && (
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Benefit Name</Label>
                        <Input
                          value={newItem.name || ""}
                          onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Cognitive Development"
                          className="text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon</Label>
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
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newItem.description || ""}
                        onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Explain how games provide this benefit..."
                        rows={3}
                        className="text-base resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddItem} className="touch-manipulation">
                      <Save className="mr-2 h-4 w-4" />
                      Add Benefit
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingNew(false)
                        setNewItem({ name: "", description: "", icon: "" })
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
                  No game benefits added yet. Click "Add Benefit" to create your first benefit.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.items.map((item) => (
                  <Card key={item.id} className="relative">
                    <CardContent className="p-4">
                      {/* Icon */}
                      <div className="w-16 h-16 relative mb-3 bg-muted rounded-lg overflow-hidden mx-auto">
                        {item.icon ? (
                          <Image
                            src={item.icon}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            <Upload className="h-6 w-6" />
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
                          className="mb-2 text-base text-center font-semibold"
                          onBlur={() => setEditingItem(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") setEditingItem(null)
                          }}
                          autoFocus
                        />
                      ) : (
                        <h3 
                          className="font-semibold mb-2 cursor-pointer hover:text-primary text-center"
                          onClick={() => setEditingItem(item.id)}
                        >
                          {item.name}
                        </h3>
                      )}
                      
                      {/* Description */}
                      <Textarea
                        value={item.description}
                        onChange={(e) => handleEditItem(item.id, "description", e.target.value)}
                        className="text-sm text-muted-foreground mb-3 resize-none"
                        placeholder="Benefit description"
                        rows={3}
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
