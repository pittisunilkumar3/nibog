/**
 * Test PDF generation with QR codes directly
 */

const { jsPDF } = require('jspdf');
const QRCode = require('qrcode');
const fs = require('fs');

async function testPDFGeneration() {
  console.log('🧪 Testing PDF generation with QR codes...');
  
  try {
    // Step 1: Generate QR code buffer
    console.log('🔄 Step 1: Generating QR code buffer...');
    const qrData = JSON.stringify({
      ref: 'PPT123456789',
      id: 12345,
      name: 'Test Child',
      game: 'Birthday Party Celebration',
      slot_id: 201
    });
    
    const qrCodeBuffer = await QRCode.toBuffer(qrData, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    
    console.log('✅ QR code buffer generated:', qrCodeBuffer.length, 'bytes');
    
    // Step 2: Create PDF
    console.log('🔄 Step 2: Creating PDF with jsPDF...');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Add title
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    pdf.text('NIBOG Event Ticket', pageWidth / 2, 50, { align: 'center' });
    
    // Add booking details
    pdf.setFontSize(14);
    pdf.text('Booking Reference: PPT123456789', 50, 100);
    pdf.text('Child Name: Test Child', 50, 130);
    pdf.text('Event: Birthday Party Celebration', 50, 160);
    pdf.text('Date: 2024-01-15', 50, 190);
    
    // Step 3: Add QR code to PDF
    console.log('🔄 Step 3: Adding QR code to PDF...');
    try {
      const qrBase64 = qrCodeBuffer.toString('base64');
      const qrX = pageWidth - 200 - 50; // Right side
      const qrY = 100;
      const qrSize = 150;
      
      pdf.addImage(`data:image/png;base64,${qrBase64}`, 'PNG', qrX, qrY, qrSize, qrSize);
      console.log('✅ QR code added to PDF successfully');
      
    } catch (qrError) {
      console.error('❌ Failed to add QR code to PDF:', qrError);
      
      // Add fallback placeholder
      pdf.setFillColor(240, 240, 240);
      pdf.rect(qrX, qrY, qrSize, qrSize, 'F');
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(14);
      pdf.text('QR CODE', qrX + qrSize/2, qrY + qrSize/2, { align: 'center' });
      console.log('⚠️ Added QR code placeholder instead');
    }
    
    // Step 4: Save PDF
    console.log('🔄 Step 4: Saving PDF...');
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    fs.writeFileSync('test-ticket.pdf', pdfBuffer);
    
    console.log('✅ PDF generated successfully!');
    console.log(`📄 PDF size: ${pdfBuffer.length} bytes`);
    console.log('📁 Saved as: test-ticket.pdf');
    
    // Step 5: Test the conversion process used in the actual service
    console.log('🔄 Step 5: Testing array conversion (as used in service)...');
    const qrCodeArray = Array.from(qrCodeBuffer);
    console.log('✅ QR code converted to array:', qrCodeArray.length, 'elements');
    
    const reconstructedBuffer = Buffer.from(qrCodeArray);
    console.log('✅ Buffer reconstructed from array:', reconstructedBuffer.length, 'bytes');
    
    // Verify they're the same
    const buffersMatch = qrCodeBuffer.equals(reconstructedBuffer);
    console.log('🔍 Buffers match:', buffersMatch);
    
    if (buffersMatch) {
      console.log('🎉 QR code buffer conversion works correctly!');
    } else {
      console.log('❌ QR code buffer conversion has issues');
    }

  } catch (error) {
    console.error('🚨 PDF generation test failed:', error);
    console.error('📋 Error details:', error.message);
  }
}

// Run the test
testPDFGeneration();
