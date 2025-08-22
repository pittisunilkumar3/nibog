"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import CodeBlock from '@tiptap/extension-code-block'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import FontFamily from '@tiptap/extension-font-family'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  Table as TableIcon,
  Code,
  Image as ImageIcon,
  Highlighter,
  Indent,
  Outdent,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Minus,
  Eraser,
  Clipboard,
  ChevronDown,
  Baseline,
  Hash
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start typing...",
  className,
  disabled = false
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  const [showFontSizeDialog, setShowFontSizeDialog] = useState(false)
  const [customFontSize, setCustomFontSize] = useState('')

  const colors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB',
    '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6',
    '#8B5CF6', '#EC4899', '#F43F5E', '#10B981', '#06B6D4',
    '#FFFFFF', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF'
  ]

  const fontSizes = [
    { label: 'Tiny', value: '10px' },
    { label: 'Small', value: '12px' },
    { label: 'Normal', value: '14px' },
    { label: 'Medium', value: '16px' },
    { label: 'Large', value: '18px' },
    { label: 'Extra Large', value: '20px' },
    { label: 'Huge', value: '24px' },
    { label: 'Massive', value: '32px' },
    { label: 'Giant', value: '48px' }
  ]

  const fontFamilies = [
    { label: 'Default', value: 'default' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Helvetica', value: 'Helvetica, sans-serif' },
    { label: 'Times New Roman', value: 'Times New Roman, serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Courier New', value: 'Courier New, monospace' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Tahoma', value: 'Tahoma, sans-serif' }
  ]

  // Create extensions array with safe configuration
  const createExtensions = () => {
    const extensions = []

    // Always include StarterKit - this is essential
    if (StarterKit) {
      extensions.push(StarterKit)
    } else {
      console.warn('StarterKit not available - editor may not function properly')
      return [] // Return empty array if StarterKit is not available
    }

    // Add TextStyle if available - configured to handle fontSize
    if (TextStyle) {
      extensions.push(TextStyle.configure({
        HTMLAttributes: {
          class: 'text-style',
        },
      }))
    }

    // Add Color with safe configuration
    if (Color) {
      extensions.push(Color.configure({
        types: ['textStyle'],
      }))
    }

    // Add basic formatting extensions
    if (Underline) extensions.push(Underline)
    if (Strike) extensions.push(Strike)
    if (Superscript) extensions.push(Superscript)
    if (Subscript) extensions.push(Subscript)

    // Add TextAlign with safe configuration
    if (TextAlign) {
      extensions.push(TextAlign.configure({
        types: ['heading', 'paragraph'],
      }))
    }

    // Add Link with safe configuration
    if (Link) {
      extensions.push(Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }))
    }

    // Add Table extensions
    if (Table) {
      extensions.push(Table.configure({
        resizable: true,
      }))
    }
    if (TableRow) extensions.push(TableRow)
    if (TableHeader) extensions.push(TableHeader)
    if (TableCell) extensions.push(TableCell)

    // Add CodeBlock with safe configuration
    if (CodeBlock) {
      extensions.push(CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 rounded p-2 font-mono text-sm',
        },
      }))
    }

    // Add Highlight with safe configuration
    if (Highlight) {
      extensions.push(Highlight.configure({
        multicolor: true,
      }))
    }

    // Add Image with safe configuration
    if (Image) {
      extensions.push(Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }))
    }

    // Add FontFamily with safe configuration
    if (FontFamily) {
      extensions.push(FontFamily.configure({
        types: ['textStyle'],
      }))
    }

    // Add HorizontalRule with safe configuration
    if (HorizontalRule) {
      extensions.push(HorizontalRule.configure({
        HTMLAttributes: {
          class: 'my-4 border-t-2 border-gray-300',
        },
      }))
    }

    return extensions
  }

  const editor = useEditor({
    extensions: createExtensions(),
    content,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      try {
        onChange(editor.getHTML())
      } catch (error) {
        console.error('Rich Text Editor: Error updating content:', error)
      }
    },
    onError: ({ error }) => {
      console.error('Rich Text Editor: Editor error:', error)
    },
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  // Check if extensions are available
  const hasExtension = (extensionName: string) => {
    return editor?.extensionManager.extensions.some(ext => ext.name === extensionName) || false
  }

  // Get current font size from selection
  const getCurrentFontSize = () => {
    if (!editor) return null
    try {
      const textStyleMark = editor.getAttributes('textStyle')
      return textStyleMark.fontSize || null
    } catch (error) {
      return null
    }
  }

  // Safe helper functions that check for editor existence
  const addLink = () => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkDialog(false)
    }
  }

  const removeLink = () => {
    if (editor) {
      editor.chain().focus().unsetLink().run()
    }
  }

  const addTable = () => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    }
  }

  const addImage = () => {
    const url = prompt('Enter image URL:')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setFontSize = (size: string) => {
    if (editor) {
      if (size) {
        editor.chain().focus().setMark('textStyle', { fontSize: size }).run()
      } else {
        editor.chain().focus().unsetMark('textStyle').run()
      }
    }
  }

  const setFontFamily = (family: string) => {
    if (editor) {
      if (family && family !== 'default') {
        editor.chain().focus().setFontFamily(family).run()
      } else {
        editor.chain().focus().unsetFontFamily().run()
      }
    }
  }

  const clearFormatting = () => {
    if (editor) {
      editor.chain().focus().clearNodes().unsetAllMarks().run()
    }
  }

  const insertHorizontalRule = () => {
    if (editor) {
      editor.chain().focus().setHorizontalRule().run()
    }
  }

  const pasteAsPlainText = () => {
    if (editor) {
      editor.chain().focus().unsetAllMarks().run()
    }
  }

  if (!isMounted || !editor) {
    return (
      <div className={cn("border rounded-lg", className)}>
        <div className="border-b p-2 bg-muted/30 h-20"></div>
        <div className="min-h-[200px] p-4 flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Loading editor...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("border rounded-lg", className)}>
      {/* WordPress-Style Enhanced Toolbar */}
      <div className="border-b p-2 space-y-2 bg-muted/30">
        {/* First Row - Text Styles and Basic Formatting */}
        <div className="flex flex-wrap gap-1">
          {/* Headings and Paragraph */}
          <Select
            value={undefined}
            onValueChange={(value) => {
              if (value === 'p') {
                editor.chain().focus().setParagraph().run()
              } else {
                editor.chain().focus().toggleHeading({ level: parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6 }).run()
              }
            }}
            disabled={disabled}
          >
            <SelectTrigger className="w-24 h-8 text-xs touch-manipulation">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p">Paragraph</SelectItem>
              <SelectItem value="1">Heading 1</SelectItem>
              <SelectItem value="2">Heading 2</SelectItem>
              <SelectItem value="3">Heading 3</SelectItem>
              <SelectItem value="4">Heading 4</SelectItem>
              <SelectItem value="5">Heading 5</SelectItem>
              <SelectItem value="6">Heading 6</SelectItem>
            </SelectContent>
          </Select>

          {/* Font Family */}
          <Select
            value={undefined}
            onValueChange={setFontFamily}
            disabled={disabled}
          >
            <SelectTrigger className="w-28 h-8 text-xs touch-manipulation">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Font Size */}
          <Popover open={showFontSizeDialog} onOpenChange={setShowFontSizeDialog}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 text-xs touch-manipulation",
                  getCurrentFontSize() ? 'bg-muted' : ''
                )}
                disabled={disabled}
                title={`Font Size${getCurrentFontSize() ? ` (${getCurrentFontSize()})` : ''}`}
              >
                <Baseline className="h-4 w-4 mr-1" />
                {getCurrentFontSize() ? getCurrentFontSize() : 'Size'}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-medium">Font Size</Label>
                  <p className="text-xs text-muted-foreground mt-1">Select text first, then choose a size</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {fontSizes.map((size) => (
                    <Button
                      key={size.value}
                      variant={getCurrentFontSize() === size.value ? "default" : "ghost"}
                      size="sm"
                      className="text-xs justify-start touch-manipulation h-8"
                      onClick={() => {
                        setFontSize(size.value)
                        setShowFontSizeDialog(false)
                      }}
                    >
                      <span className="font-medium">{size.label}</span>
                      <span className="ml-auto text-muted-foreground">{size.value}</span>
                    </Button>
                  ))}
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Custom Size</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="16px"
                      value={customFontSize}
                      onChange={(e) => setCustomFontSize(e.target.value)}
                      className="text-xs h-8 flex-1"
                    />
                    <Button
                      size="sm"
                      className="h-8 text-xs px-3"
                      onClick={() => {
                        if (customFontSize) {
                          const sizeValue = customFontSize.includes('px') ? customFontSize : customFontSize + 'px'
                          setFontSize(sizeValue)
                          setCustomFontSize('')
                          setShowFontSizeDialog(false)
                        }
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-8"
                    onClick={() => {
                      setFontSize('')
                      setShowFontSizeDialog(false)
                    }}
                  >
                    Reset Size
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Quick Font Size Buttons */}
          <div className="flex gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setFontSize('12px')}
              className={cn(
                "h-8 w-8 p-0 text-xs touch-manipulation",
                getCurrentFontSize() === '12px' ? 'bg-muted' : ''
              )}
              disabled={disabled}
              title="Small (12px)"
            >
              S
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setFontSize('16px')}
              className={cn(
                "h-8 w-8 p-0 text-sm touch-manipulation",
                getCurrentFontSize() === '16px' ? 'bg-muted' : ''
              )}
              disabled={disabled}
              title="Medium (16px)"
            >
              M
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setFontSize('20px')}
              className={cn(
                "h-8 w-8 p-0 text-base touch-manipulation",
                getCurrentFontSize() === '20px' ? 'bg-muted' : ''
              )}
              disabled={disabled}
              title="Large (20px)"
            >
              L
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Basic Text Formatting */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "h-8 w-8 p-0 touch-manipulation",
              editor.isActive('bold') ? 'bg-muted' : ''
            )}
            disabled={disabled}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "h-8 w-8 p-0 touch-manipulation",
              editor.isActive('italic') ? 'bg-muted' : ''
            )}
            disabled={disabled}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(
              "h-8 w-8 p-0 touch-manipulation",
              editor.isActive('underline') ? 'bg-muted' : ''
            )}
            disabled={disabled}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(
              "h-8 w-8 p-0 touch-manipulation",
              editor.isActive('strike') ? 'bg-muted' : ''
            )}
            disabled={disabled}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>

          {/* Superscript - only show if extension is available */}
          {(Superscript || hasExtension('superscript')) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={cn(
                "h-8 w-8 p-0 touch-manipulation",
                editor.isActive('superscript') ? 'bg-muted' : ''
              )}
              disabled={disabled}
              title="Superscript"
            >
              <SuperscriptIcon className="h-4 w-4" />
            </Button>
          )}

          {/* Subscript - only show if extension is available */}
          {(Subscript || hasExtension('subscript')) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={cn(
                "h-8 w-8 p-0 touch-manipulation",
                editor.isActive('subscript') ? 'bg-muted' : ''
              )}
              disabled={disabled}
              title="Subscript"
            >
              <SubscriptIcon className="h-4 w-4" />
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn(
              "h-8 w-8 p-0 touch-manipulation",
              editor.isActive('code') ? 'bg-muted' : ''
            )}
            disabled={disabled}
            title="Inline Code"
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        {/* Second Row - Colors and Alignment */}
        <div className="flex flex-wrap gap-1">
          {/* Text Color */}
          <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs touch-manipulation"
                disabled={disabled}
                title="Text Color"
              >
                <Type className="h-4 w-4 mr-1" />
                Color
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Text Color</Label>
                <div className="grid grid-cols-5 gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform touch-manipulation"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run()
                        setShowColorPicker(false)
                      }}
                      title={color}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    editor.chain().focus().unsetColor().run()
                    setShowColorPicker(false)
                  }}
                >
                  Remove Color
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Highlight Color */}
          <Popover open={showHighlightPicker} onOpenChange={setShowHighlightPicker}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 text-xs touch-manipulation",
                  editor.isActive('highlight') ? 'bg-muted' : ''
                )}
                disabled={disabled}
                title="Highlight"
              >
                <Highlighter className="h-4 w-4 mr-1" />
                Highlight
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Background Color</Label>
                <div className="grid grid-cols-5 gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform touch-manipulation"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        editor.chain().focus().toggleHighlight({ color }).run()
                        setShowHighlightPicker(false)
                      }}
                      title={color}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    editor.chain().focus().unsetHighlight().run()
                    setShowHighlightPicker(false)
                  }}
                >
                  Remove Highlight
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Text Alignment */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={cn(
              "h-8 w-8 p-0 touch-manipulation",
              editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''
            )}
            disabled={disabled}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={cn(
              "h-8 w-8 p-0 touch-manipulation",
              editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''
            )}
            disabled={disabled}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={cn(
              "h-8 w-8 p-0 touch-manipulation",
              editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''
            )}
            disabled={disabled}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={cn(
              "h-8 w-8 p-0 touch-manipulation",
              editor.isActive({ textAlign: 'justify' }) ? 'bg-muted' : ''
            )}
            disabled={disabled}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Lists */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "h-8 w-8 p-0 touch-manipulation",
              editor.isActive('bulletList') ? 'bg-muted' : ''
            )}
            disabled={disabled}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "h-8 w-8 p-0 touch-manipulation",
              editor.isActive('orderedList') ? 'bg-muted' : ''
            )}
            disabled={disabled}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          {/* List Indentation */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
            className="h-8 w-8 p-0 touch-manipulation"
            disabled={disabled || !editor.can().sinkListItem('listItem')}
            title="Indent"
          >
            <Indent className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().liftListItem('listItem').run()}
            className="h-8 w-8 p-0 touch-manipulation"
            disabled={disabled || !editor.can().liftListItem('listItem')}
            title="Outdent"
          >
            <Outdent className="h-4 w-4" />
          </Button>
        </div>

        {/* Third Row - Content Structure and Tools */}
        <div className="flex flex-wrap gap-1">
          {/* Quote */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              "h-8 w-8 p-0 touch-manipulation",
              editor.isActive('blockquote') ? 'bg-muted' : ''
            )}
            disabled={disabled}
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </Button>

          {/* Code Block */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={cn(
              "h-8 w-8 p-0 touch-manipulation",
              editor.isActive('codeBlock') ? 'bg-muted' : ''
            )}
            disabled={disabled}
            title="Code Block"
          >
            <Hash className="h-4 w-4" />
          </Button>

          {/* Horizontal Rule */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertHorizontalRule}
            className="h-8 w-8 p-0 touch-manipulation"
            disabled={disabled}
            title="Horizontal Line"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Link */}
          <Popover open={showLinkDialog} onOpenChange={setShowLinkDialog}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 touch-manipulation",
                  editor.isActive('link') ? 'bg-muted' : ''
                )}
                disabled={disabled}
                title="Insert Link"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3">
              <div className="space-y-2">
                <Label htmlFor="link-url" className="text-sm font-medium">Link URL</Label>
                <Input
                  id="link-url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="touch-manipulation"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={addLink} className="touch-manipulation">
                    Add Link
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowLinkDialog(false)} className="touch-manipulation">
                    Cancel
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Remove Link */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeLink}
            className="h-8 w-8 p-0 touch-manipulation"
            disabled={disabled || !editor.isActive('link')}
            title="Remove Link"
          >
            <Unlink className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Table */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addTable}
            className="h-8 w-8 p-0 touch-manipulation"
            disabled={disabled}
            title="Insert Table"
          >
            <TableIcon className="h-4 w-4" />
          </Button>

          {/* Image */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImage}
            className="h-8 w-8 p-0 touch-manipulation"
            disabled={disabled}
            title="Insert Image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Clear Formatting */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFormatting}
            className="h-8 w-8 p-0 touch-manipulation"
            disabled={disabled}
            title="Clear Formatting"
          >
            <Eraser className="h-4 w-4" />
          </Button>

          {/* Paste as Plain Text */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={pasteAsPlainText}
            className="h-8 w-8 p-0 touch-manipulation"
            disabled={disabled}
            title="Paste as Text"
          >
            <Clipboard className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Undo/Redo */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            className="h-8 w-8 p-0 touch-manipulation"
            disabled={disabled || !editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            className="h-8 w-8 p-0 touch-manipulation"
            disabled={disabled || !editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[200px] p-4 relative">
        <EditorContent
          editor={editor}
          className={cn(
            "prose prose-sm max-w-none focus:outline-none",
            // Typography
            "prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
            "prose-h4:text-lg prose-h5:text-base prose-h6:text-sm",
            "prose-p:my-2 prose-p:leading-relaxed",
            // Lists
            "prose-ul:my-2 prose-ol:my-2 prose-li:my-1",
            "prose-ul:list-disc prose-ol:list-decimal",
            "prose-ul:pl-6 prose-ol:pl-6",
            // Blockquotes
            "prose-blockquote:my-4 prose-blockquote:border-l-4",
            "prose-blockquote:border-muted-foreground prose-blockquote:pl-4",
            "prose-blockquote:italic prose-blockquote:text-muted-foreground",
            "prose-blockquote:bg-muted/20 prose-blockquote:py-2",
            // Tables
            "prose-table:border-collapse prose-table:border prose-table:border-gray-300",
            "prose-table:w-full prose-table:my-4",
            "prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-3",
            "prose-th:text-left prose-th:font-semibold",
            "prose-td:border prose-td:border-gray-300 prose-td:p-3",
            // Code
            "prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
            "prose-code:text-sm prose-code:font-mono prose-code:text-gray-800",
            "prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded prose-pre:overflow-x-auto",
            "prose-pre:text-sm prose-pre:font-mono prose-pre:border",
            // Images
            "prose-img:rounded prose-img:shadow-sm prose-img:max-w-full prose-img:h-auto",
            "prose-img:my-4 prose-img:mx-auto",
            // Links
            "prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800",
            "prose-a:transition-colors prose-a:duration-200",
            // Horizontal rules
            "prose-hr:border-t-2 prose-hr:border-gray-300 prose-hr:my-6",
            // Text formatting
            "prose-strong:font-bold prose-em:italic",
            "prose-u:underline prose-s:line-through",
            // Superscript and subscript
            "[&_sup]:text-xs [&_sup]:align-super [&_sup]:leading-none",
            "[&_sub]:text-xs [&_sub]:align-sub [&_sub]:leading-none",
            // Text alignment
            "[&_.text-left]:text-left [&_.text-center]:text-center",
            "[&_.text-right]:text-right [&_.text-justify]:text-justify",
            // Custom font sizes and families
            "[&_[style*='font-size']]:leading-normal [&_[style*='font-size']]:inline",
            "[&_[style*='font-family']]:font-inherit",
            // Ensure font size styles are preserved
            "[&_span[style*='font-size']]:inline [&_span[style*='font-size']]:leading-normal",
            "[&_.text-style]:inline",
            // Highlights
            "[&_mark]:bg-yellow-200 [&_mark]:px-1 [&_mark]:rounded",
            disabled ? "opacity-50 cursor-not-allowed" : ""
          )}
        />
        {editor.isEmpty && (
          <p className="text-muted-foreground text-sm absolute top-4 left-4 pointer-events-none">
            {placeholder}
          </p>
        )}
      </div>
    </div>
  )
}
