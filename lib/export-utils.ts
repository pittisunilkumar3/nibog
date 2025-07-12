import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

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
    try {
      const { data, columns, filename, includeTimestamp = true } = options

      // Create CSV headers
      const headers = columns.map(col => col.label)

      // Create CSV rows
      const rows = data.map(row =>
        columns.map(col => {
          const value = ExportService.formatValue(row[col.key], col, row)
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
      const finalFilename = ExportService.generateFilename(filename, 'csv', includeTimestamp)

      ExportService.downloadBlob(blob, finalFilename)
    } catch (error) {
      console.error('CSV export failed:', error)
      throw new Error('Failed to export CSV file. Please try again.')
    }
  }

  static async exportToPDF<T>(options: ExportOptions<T>): Promise<void> {
    try {
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
      columns.map(col => ExportService.formatValue(row[col.key], col, row))
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
      const finalFilename = ExportService.generateFilename(filename, 'pdf', includeTimestamp)

      doc.save(finalFilename)
    } catch (error) {
      console.error('PDF export failed:', error)
      throw new Error('Failed to export PDF file. Please try again.')
    }
  }

  static async exportToExcel<T>(options: ExportOptions<T>): Promise<void> {
    try {
      const { data, columns, filename, title, subtitle, includeTimestamp = true, brandingInfo } = options

      // Create a new workbook
      const workbook = XLSX.utils.book_new()

      // Prepare worksheet data
      const headers = columns.map(col => col.label)
      const rows = data.map(row =>
        columns.map(col => {
          const value = ExportService.formatValue(row[col.key], col, row)
          // Try to convert numeric strings back to numbers for Excel
          const numValue = parseFloat(value)
          return !isNaN(numValue) && isFinite(numValue) && value.trim() !== '' ? numValue : value
        })
      )

      // Create worksheet data with headers
      const worksheetData = [headers, ...rows]

      // Add title and subtitle if provided
      if (title || subtitle || brandingInfo) {
        const titleRows: any[][] = []

        if (brandingInfo?.companyName) {
          titleRows.push([brandingInfo.companyName])
          titleRows.push([]) // Empty row
        }

        if (title) {
          titleRows.push([title])
        }

        if (subtitle) {
          titleRows.push([subtitle])
        }

        if (includeTimestamp) {
          titleRows.push([`Generated on: ${new Date().toLocaleString()}`])
        }

        if (titleRows.length > 0) {
          titleRows.push([]) // Empty row before data
          worksheetData.unshift(...titleRows)
        }
      }

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

      // Set column widths based on content
      const columnWidths = columns.map(col => ({
        wch: Math.max(col.width || 100, col.label.length * 1.2) / 8 // Convert pixels to character width
      }))
      worksheet['!cols'] = columnWidths

      // Add the worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

      // Create blob and download
      const finalFilename = ExportService.generateFilename(filename, 'xlsx', includeTimestamp)
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      ExportService.downloadBlob(blob, finalFilename)
    } catch (error) {
      console.error('Excel export failed:', error)
      throw new Error('Failed to export Excel file. Please try again.')
    }
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
      columns.map(col => ExportService.formatValue(row[col.key], col, row))
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
  { key: 'id' as const, label: 'Event ID', width: 80 },
  { key: 'title' as const, label: 'Event Title', width: 200 },
  { key: 'gameTemplate' as const, label: 'Games', width: 150 },
  { key: 'venue' as const, label: 'Venue', width: 150 },
  { key: 'city' as const, label: 'City', width: 100 },
  { key: 'date' as const, label: 'Date', width: 100, format: (value: any) => new Date(value).toLocaleDateString() },
  { key: 'status' as const, label: 'Status', width: 100 },
  { key: 'slots' as const, label: 'Total Slots', width: 80, format: (value: any) => Array.isArray(value) ? value.length.toString() : '0', align: 'right' as const },
]

export const createUserExportColumns = () => [
  { key: 'user_id' as const, label: 'User ID', width: 80 },
  { key: 'full_name' as const, label: 'Full Name', width: 150 },
  { key: 'email' as const, label: 'Email', width: 200 },
  { key: 'phone' as const, label: 'Phone', width: 120 },
  { key: 'city_name' as const, label: 'City', width: 100 },
  { key: 'state' as const, label: 'State', width: 100 },
  { key: 'is_active' as const, label: 'Active Status', width: 100, format: (value: any) => value ? 'Active' : 'Inactive' },
  { key: 'is_locked' as const, label: 'Locked Status', width: 100, format: (value: any) => value ? 'Locked' : 'Unlocked' },
  { key: 'email_verified' as const, label: 'Email Verified', width: 120, format: (value: any) => value ? 'Yes' : 'No' },
  { key: 'phone_verified' as const, label: 'Phone Verified', width: 120, format: (value: any) => value ? 'Yes' : 'No' },
  { key: 'created_at' as const, label: 'Registration Date', width: 120, format: (value: any) => new Date(value).toLocaleDateString() },
  { key: 'last_login_at' as const, label: 'Last Login', width: 120, format: (value: any) => value ? new Date(value).toLocaleDateString() : 'Never' },
]

export const createPaymentExportColumns = () => [
  { key: 'payment_id' as const, label: 'Payment ID', width: 80 },
  { key: 'transaction_id' as const, label: 'Transaction ID', width: 150 },
  { key: 'booking_id' as const, label: 'Booking ID', width: 80 },
  { key: 'user_name' as const, label: 'Customer Name', width: 150 },
  { key: 'user_email' as const, label: 'Customer Email', width: 200 },
  { key: 'user_phone' as const, label: 'Customer Phone', width: 120 },
  { key: 'amount' as const, label: 'Amount', width: 100, format: (value: any) => `₹${parseFloat(value.toString()).toFixed(2)}`, align: 'right' as const },
  { key: 'payment_method' as const, label: 'Payment Method', width: 120 },
  { key: 'payment_status' as const, label: 'Status', width: 100 },
  { key: 'payment_date' as const, label: 'Payment Date', width: 120, format: (value: any) => new Date(value).toLocaleDateString() },
  { key: 'event_title' as const, label: 'Event', width: 200 },
  { key: 'event_date' as const, label: 'Event Date', width: 100, format: (value: any) => new Date(value).toLocaleDateString() },
  { key: 'city_name' as const, label: 'City', width: 100 },
  { key: 'venue_name' as const, label: 'Venue', width: 150 },
  { key: 'child_name' as const, label: 'Child Name', width: 120 },
  { key: 'game_name' as const, label: 'Game', width: 120 },
  { key: 'refund_amount' as const, label: 'Refund Amount', width: 100, format: (value: any) => value ? `₹${parseFloat(value.toString()).toFixed(2)}` : '₹0.00', align: 'right' as const },
  { key: 'refund_reason' as const, label: 'Refund Reason', width: 200 },
  { key: 'admin_notes' as const, label: 'Admin Notes', width: 200 },
  { key: 'created_at' as const, label: 'Created At', width: 120, format: (value: any) => new Date(value).toLocaleDateString() },
]

export const createVenueExportColumns = () => [
  { key: 'venue_id' as const, label: 'Venue ID', width: 80 },
  { key: 'venue_name' as const, label: 'Venue Name', width: 200 },
  { key: 'address' as const, label: 'Address', width: 250 },
  { key: 'city_name' as const, label: 'City', width: 100 },
  { key: 'capacity' as const, label: 'Capacity', width: 80, align: 'right' as const },
  { key: 'is_active' as const, label: 'Status', width: 80, format: (value: any) => value ? 'Active' : 'Inactive' },
  { key: 'created_at' as const, label: 'Created At', width: 120, format: (value: any) => new Date(value).toLocaleDateString() },
]

export const createCityExportColumns = () => [
  { key: 'city_id' as const, label: 'City ID', width: 80 },
  { key: 'city_name' as const, label: 'City Name', width: 150 },
  { key: 'state' as const, label: 'State', width: 100 },
  { key: 'is_active' as const, label: 'Status', width: 80, format: (value: any) => value ? 'Active' : 'Inactive' },
  { key: 'total_venues' as const, label: 'Total Venues', width: 100, align: 'right' as const },
  { key: 'total_events' as const, label: 'Total Events', width: 100, align: 'right' as const },
  { key: 'created_at' as const, label: 'Created At', width: 120, format: (value: any) => new Date(value).toLocaleDateString() },
]

export const createGameExportColumns = () => [
  { key: 'game_id' as const, label: 'Game ID', width: 80 },
  { key: 'game_name' as const, label: 'Game Name', width: 200 },
  { key: 'description' as const, label: 'Description', width: 300 },
  { key: 'min_age' as const, label: 'Min Age', width: 80, align: 'right' as const },
  { key: 'max_age' as const, label: 'Max Age', width: 80, align: 'right' as const },
  { key: 'duration_minutes' as const, label: 'Duration (min)', width: 100, align: 'right' as const },
  { key: 'max_participants' as const, label: 'Max Participants', width: 120, align: 'right' as const },
  { key: 'price' as const, label: 'Price', width: 80, format: (value: any) => `₹${value}`, align: 'right' as const },
  { key: 'is_active' as const, label: 'Status', width: 80, format: (value: any) => value ? 'Active' : 'Inactive' },
  { key: 'created_at' as const, label: 'Created At', width: 120, format: (value: any) => new Date(value).toLocaleDateString() },
]

export const createAttendanceExportColumns = () => [
  { key: 'attendance_id' as const, label: 'Attendance ID', width: 100 },
  { key: 'booking_ref' as const, label: 'Booking Ref', width: 120 },
  { key: 'parent_name' as const, label: 'Parent Name', width: 150 },
  { key: 'child_name' as const, label: 'Child Name', width: 150 },
  { key: 'event_title' as const, label: 'Event', width: 200 },
  { key: 'game_name' as const, label: 'Game', width: 150 },
  { key: 'venue_name' as const, label: 'Venue', width: 150 },
  { key: 'city_name' as const, label: 'City', width: 100 },
  { key: 'event_date' as const, label: 'Event Date', width: 100, format: (value: any) => new Date(value).toLocaleDateString() },
  { key: 'check_in_time' as const, label: 'Check-in Time', width: 120, format: (value: any) => value ? new Date(value).toLocaleString() : 'Not checked in' },
  { key: 'attendance_status' as const, label: 'Status', width: 100 },
  { key: 'notes' as const, label: 'Notes', width: 200 },
]

export const createCompletedEventExportColumns = () => [
  { key: 'event_id' as const, label: 'Event ID', width: 80 },
  { key: 'title' as const, label: 'Event Title', width: 200 },
  { key: 'gameTemplate' as const, label: 'Games', width: 150 },
  { key: 'venue' as const, label: 'Venue', width: 150 },
  { key: 'city' as const, label: 'City', width: 100 },
  { key: 'date' as const, label: 'Event Date', width: 100, format: (value: any) => new Date(value).toLocaleDateString() },
  { key: 'registrations' as const, label: 'Registrations', width: 100, align: 'right' as const },
  { key: 'attendance' as const, label: 'Attendance', width: 100, align: 'right' as const },
  { key: 'attendanceRate' as const, label: 'Attendance Rate', width: 120, format: (value: any) => `${value}%`, align: 'right' as const },
  { key: 'revenue' as const, label: 'Revenue', width: 100, format: (value: any) => `₹${value}`, align: 'right' as const },
  { key: 'completedAt' as const, label: 'Completed At', width: 120, format: (value: any) => new Date(value).toLocaleDateString() },
]
