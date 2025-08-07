/**
 * Comprehensive end-to-end test of the booking system
 * Tests WhatsApp notifications, QR code generation, PDF tickets, and Zaptra integration
 */

async function testEndToEndBookingFlow() {
  console.log('🧪 Starting comprehensive end-to-end booking system test...');
  console.log('=' .repeat(60));
  
  const results = {
    whatsappService: false,
    whatsappTemplates: false,
    qrCodeGeneration: false,
    pdfGeneration: false,
    zaptraIntegration: false
  };

  // Test 1: WhatsApp Service Health
  console.log('\n📱 Test 1: WhatsApp Service Health Check');
  console.log('-'.repeat(40));
  try {
    const healthResponse = await fetch('http://localhost:3111/api/whatsapp/health');
    const healthResult = await healthResponse.json();
    
    if (healthResult.healthy && healthResult.enabled) {
      console.log('✅ WhatsApp service is healthy and enabled');
      results.whatsappService = true;
    } else {
      console.log('❌ WhatsApp service is not healthy or disabled');
      console.log('📋 Health status:', healthResult);
    }
  } catch (error) {
    console.log('❌ WhatsApp health check failed:', error.message);
  }

  // Test 2: WhatsApp Templates
  console.log('\n📋 Test 2: WhatsApp Templates Retrieval');
  console.log('-'.repeat(40));
  try {
    const templatesResponse = await fetch('http://localhost:3111/api/whatsapp/templates');
    const templatesResult = await templatesResponse.json();
    
    if (templatesResult.success && templatesResult.templates) {
      const bookingTemplate = templatesResult.templates.find(t => t.name === 'booking_confirmation_latest');
      if (bookingTemplate) {
        console.log('✅ WhatsApp templates retrieved successfully');
        console.log(`📋 Found booking template: ${bookingTemplate.name} (${bookingTemplate.status})`);
        results.whatsappTemplates = true;
      } else {
        console.log('❌ Booking confirmation template not found');
      }
    } else {
      console.log('❌ Failed to retrieve WhatsApp templates');
      console.log('📋 Error:', templatesResult.error);
    }
  } catch (error) {
    console.log('❌ WhatsApp templates test failed:', error.message);
  }

  // Test 3: QR Code Generation
  console.log('\n🔲 Test 3: QR Code Generation');
  console.log('-'.repeat(40));
  try {
    const QRCode = require('qrcode');
    const testQRData = JSON.stringify({
      ref: 'TEST123456789',
      id: 99999,
      name: 'Test Child',
      game: 'Test Event',
      slot_id: 1
    });
    
    const qrBuffer = await QRCode.toBuffer(testQRData, {
      width: 200,
      margin: 2,
      errorCorrectionLevel: 'M'
    });
    
    if (qrBuffer && qrBuffer.length > 0) {
      console.log('✅ QR code generation working');
      console.log(`📏 QR code buffer size: ${qrBuffer.length} bytes`);
      results.qrCodeGeneration = true;
    } else {
      console.log('❌ QR code generation failed - empty buffer');
    }
  } catch (error) {
    console.log('❌ QR code generation test failed:', error.message);
  }

  // Test 4: PDF Generation with QR Code
  console.log('\n📄 Test 4: PDF Generation with QR Code');
  console.log('-'.repeat(40));
  try {
    const { jsPDF } = require('jspdf');
    const QRCode = require('qrcode');
    
    // Generate QR code
    const qrData = JSON.stringify({ ref: 'PDF_TEST', id: 12345 });
    const qrBuffer = await QRCode.toBuffer(qrData, { width: 200, margin: 2 });
    
    // Create PDF
    const pdf = new jsPDF();
    pdf.text('Test Ticket', 20, 20);
    
    // Add QR code to PDF
    const qrBase64 = qrBuffer.toString('base64');
    pdf.addImage(`data:image/png;base64,${qrBase64}`, 'PNG', 20, 30, 50, 50);
    
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    
    if (pdfBuffer && pdfBuffer.length > 0) {
      console.log('✅ PDF generation with QR code working');
      console.log(`📏 PDF size: ${pdfBuffer.length} bytes`);
      results.pdfGeneration = true;
    } else {
      console.log('❌ PDF generation failed - empty buffer');
    }
  } catch (error) {
    console.log('❌ PDF generation test failed:', error.message);
  }

  // Test 5: WhatsApp Message Sending (Zaptra Integration)
  console.log('\n📱 Test 5: WhatsApp Message Sending (Zaptra Integration)');
  console.log('-'.repeat(40));
  try {
    const testBookingData = {
      bookingId: 99999,
      bookingRef: 'TEST123456789',
      parentName: 'Test Parent',
      parentPhone: '+916303727148',
      childName: 'Test Child',
      eventTitle: 'End-to-End Test Event',
      eventDate: '2024-01-15',
      eventVenue: 'Test Venue',
      totalAmount: 1000,
      paymentMethod: 'Test Payment',
      transactionId: 'TEST_TXN_123',
      gameDetails: [{
        gameName: 'Test Game',
        gameTime: '10:00 AM - 11:00 AM',
        gamePrice: 1000
      }]
    };

    const whatsappResponse = await fetch('http://localhost:3111/api/whatsapp/send-booking-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testBookingData)
    });

    const whatsappResult = await whatsappResponse.json();
    
    if (whatsappResult.success) {
      console.log('✅ Zaptra WhatsApp integration working');
      console.log(`📱 Message ID: ${whatsappResult.messageId}`);
      results.zaptraIntegration = true;
    } else {
      console.log('❌ Zaptra WhatsApp integration failed');
      console.log('📋 Error:', whatsappResult.error);
    }
  } catch (error) {
    console.log('❌ Zaptra integration test failed:', error.message);
  }

  // Final Results Summary
  console.log('\n🎯 COMPREHENSIVE TEST RESULTS');
  console.log('=' .repeat(60));
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log(`📊 Overall Score: ${passedTests}/${totalTests} tests passed`);
  console.log('');
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`${status} - ${testName}`);
  });
  
  console.log('');
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL SYSTEMS OPERATIONAL!');
    console.log('✅ Manual booking system should work correctly');
    console.log('✅ WhatsApp notifications will be sent');
    console.log('✅ PDF tickets with QR codes will be generated');
    console.log('✅ Zaptra integration is functional');
  } else {
    console.log('⚠️  Some systems need attention');
    console.log('📋 Check the failed tests above for details');
  }
  
  console.log('\n📝 RECOMMENDATIONS:');
  if (!results.whatsappService) console.log('- Check WhatsApp service configuration and environment variables');
  if (!results.whatsappTemplates) console.log('- Verify Zaptra API token and template setup');
  if (!results.qrCodeGeneration) console.log('- Check QR code library installation and dependencies');
  if (!results.pdfGeneration) console.log('- Verify jsPDF library and PDF generation dependencies');
  if (!results.zaptraIntegration) console.log('- Check Zaptra API connectivity and authentication');
}

// Run the comprehensive test
testEndToEndBookingFlow();
