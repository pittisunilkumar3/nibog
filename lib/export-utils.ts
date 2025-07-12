import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export interface ExportColumn<T> {
  key: keyof T
  label: string
  width?: number
  format?: (value: any, row: T) => string
  align?: 'left' | 'center' | 'right'
}

export interface ExportOptions<T> {
  filename: string
  title?: string
  subtitle?: string
  data: T[]
  columns: ExportColumn<T>[]
  format: 'csv' | 'pdf' | 'excel'
  includeTimestamp?: boolean
  brandingInfo?: {
    companyName: string
    logo?: string
    address?: string
    website?: string
  }
}

export class ExportService {
  private static formatValue<T>(value: any, column: ExportColumn<T>, row: T): string {
    if (column.format) {
      return column.format(value, row)
    }
    
    if (value === null || value === undefined) {
      return ''
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }
    
    if (value instanceof Date) {
      return value.toLocaleDateString()
    }
    
    return String(value)
  }

  static async exportToCSV<T>(options: ExportOptions<T>): Promise<void> {
    const { data, columns, filename, includeTimestamp = true } = options
    
    // Create CSV headers
    const headers = columns.map(col => col.label)
    
    // Create CSV rows
    const rows = data.map(row => 
      columns.map(col => {
        const value = this.formatValue(row[col.key], col, row)
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        return value.includes(',') || value.includes('"') || value.includes('\n')
          ? `"${value.replace(/"/g, '""')}"`
          : value
      })
    )
    
    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n')
    
    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    
    // Generate filename with timestamp if requested
    const finalFilename = includeTimestamp 
      ? `${filename}_${new Date().toISOString().split('T')[0]}.csv`
      : `${filename}.csv`
    
    this.downloadBlob(blob, finalFilename)
  }

  static async exportToPDF<T>(options: ExportOptions<T>): Promise<void> {
    const { 
      data, 
      columns, 
      filename, 
      title = 'Data Export',
      subtitle,
      includeTimestamp = true,
      brandingInfo
    } = options
    
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    let yPosition = 20
    
    // Add branding header
    if (brandingInfo) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(brandingInfo.companyName, 20, yPosition)
      yPosition += 10
      
      if (brandingInfo.address) {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(brandingInfo.address, 20, yPosition)
        yPosition += 8
      }
      
      if (brandingInfo.website) {
        doc.setFontSize(10)
        doc.text(brandingInfo.website, 20, yPosition)
        yPosition += 8
      }
      
      yPosition += 10
    }
    
    // Add title
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 20, yPosition)
    yPosition += 15
    
    // Add subtitle if provided
    if (subtitle) {
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(subtitle, 20, yPosition)
      yPosition += 10
    }
    
    // Add timestamp
    if (includeTimestamp) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPosition)
      yPosition += 15
    }
    
    // Prepare table data
    const tableHeaders = columns.map(col => col.label)
    const tableRows = data.map(row => 
      columns.map(col => this.formatValue(row[col.key], col, row))
    )
    
    // Add table
    doc.autoTable({
      head: [tableHeaders],
      body: tableRows,
      startY: yPosition,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185], // Blue header
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245], // Light gray for alternate rows
      },
      columnStyles: columns.reduce((acc, col, index) => {
        acc[index] = {
          cellWidth: col.width || 'auto',
          halign: col.align || 'left',
        }
        return acc
      }, {} as any),
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      didDrawPage: (data: any) => {
        // Add page numbers
        const pageNumber = doc.internal.getCurrentPageInfo().pageNumber
        const totalPages = doc.internal.pages.length - 1
        doc.setFontSize(8)
        doc.text(
          `Page ${pageNumber} of ${totalPages}`,
          pageWidth - 40,
          pageHeight - 10
        )
      },
    })
    
    // Generate filename with timestamp if requested
    const finalFilename = includeTimestamp 
      ? `${filename}_${new Date().toISOString().split('T')[0]}.pdf`
      : `${filename}.pdf`
    
    doc.save(finalFilename)
  }

  static async exportToExcel<T>(options: ExportOptions<T>): Promise<void> {
    // For Excel export, we'll use a library like xlsx
    // For now, we'll fall back to CSV with .xlsx extension
    // In a real implementation, you'd use libraries like xlsx or exceljs
    
    const { data, columns, filename, includeTimestamp = true } = options
    
    // Create worksheet data
    const headers = columns.map(col => col.label)
    const rows = data.map(row => 
      columns.map(col => this.formatValue(row[col.key], col, row))
    )
    
    // For now, create a CSV-like format
    // In production, use proper Excel library
    const csvContent = [headers, ...rows]
      .map(row => row.join('\t')) // Use tabs for better Excel compatibility
      .join('\n')
    
    const blob = new Blob([csvContent], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    const finalFilename = includeTimestamp 
      ? `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`
      : `${filename}.xlsx`
    
    this.downloadBlob(blob, finalFilename)
  }

  private static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }

  static getExportPreview<T>(data: T[], columns: ExportColumn<T>[], maxRows: number = 5): {
    headers: string[]
    rows: string[][]
    totalRows: number
  } {
    const headers = columns.map(col => col.label)
    const previewData = data.slice(0, maxRows)
    const rows = previewData.map(row => 
      columns.map(col => this.formatValue(row[col.key], col, row))
    )
    
    return {
      headers,
      rows,
      totalRows: data.length
    }
  }
}

// Utility functions for common export scenarios
export const createBookingExportColumns = () => [
  { key: 'booking_id' as const, label: 'Booking ID', width: 80 },
  { key: 'parent_name' as const, label: 'Parent Name', width: 120 },
  { key: 'parent_email' as const, label: 'Email', width: 150 },
  { key: 'child_full_name' as const, label: 'Child Name', width: 120 },
  { key: 'event_title' as const, label: 'Event', width: 150 },
  { key: 'city_name' as const, label: 'City', width: 100 },
  { key: 'venue_name' as const, label: 'Venue', width: 120 },
  { key: 'total_amount' as const, label: 'Amount', width: 80, format: (value: any) => `₹${value}`, align: 'right' as const },
  { key: 'booking_status' as const, label: 'Status', width: 80 },
  { key: 'booking_created_at' as const, label: 'Booking Date', width: 100, format: (value: any) => new Date(value).toLocaleDateString() },
]

export const createEventExportColumns = () => [
  { key: 'event_id' as const, label: 'Event ID', width: 80 },
  { key: 'event_title' as const, label: 'Event Title', width: 200 },
  { key: 'city_name' as const, label: 'City', width: 100 },
  { key: 'venue_name' as const, label: 'Venue', width: 150 },
  { key: 'event_date' as const, label: 'Date', width: 100, format: (value: any) => new Date(value).toLocaleDateString() },
  { key: 'event_start_time' as const, label: 'Start Time', width: 80 },
  { key: 'event_end_time' as const, label: 'End Time', width: 80 },
  { key: 'capacity' as const, label: 'Capacity', width: 80, align: 'right' as const },
  { key: 'price' as const, label: 'Price', width: 80, format: (value: any) => `₹${value}`, align: 'right' as const },
  { key: 'event_status' as const, label: 'Status', width: 80 },
]

export const createUserExportColumns = () => [
  { key: 'user_id' as const, label: 'User ID', width: 80 },
  { key: 'full_name' as const, label: 'Full Name', width: 150 },
  { key: 'email' as const, label: 'Email', width: 200 },
  { key: 'phone' as const, label: 'Phone', width: 120 },
  { key: 'city' as const, label: 'City', width: 100 },
  { key: 'registration_date' as const, label: 'Registration Date', width: 120, format: (value: any) => new Date(value).toLocaleDateString() },
  { key: 'status' as const, label: 'Status', width: 80 },
  { key: 'total_bookings' as const, label: 'Total Bookings', width: 100, align: 'right' as const },
]
