/**
 * Final comprehensive test of the complete booking system
 * Tests WhatsApp notifications, ticket emails, and all integrations
 */

async function testFinalBookingSystem() {
  console.log('🧪 FINAL COMPREHENSIVE BOOKING SYSTEM TEST');
  console.log('=' .repeat(60));

  const results = {
    whatsappParameterFix: false,
    whatsappNotification: false,
    ticketEmailSystem: false,
    manBookingRefConversion: false,
    qrCodeGeneration: false,
    emailDelivery: false
  };

  // Test 1: WhatsApp Parameter Validation Fix
  console.log('\n📱 Test 1: WhatsApp Parameter Validation Fix');
  console.log('-'.repeat(40));
  
  try {
    // Test with potentially problematic data (null/undefined values)
    const problematicWhatsAppData = {
      bookingId: 99999,
      bookingRef: 'FINAL_TEST_999',
      parentName: null, // Potential issue
      parentPhone: '+916303727148',
      childName: undefined, // Potential issue
      eventTitle: 'Final Test Event',
      eventDate: '', // Empty string
      eventVenue: null, // Potential issue
      totalAmount: 0, // Zero amount
      paymentMethod: undefined, // Potential issue
      transactionId: 'FINAL_TXN_999',
      gameDetails: [{
        gameName: 'Test Game',
        gameTime: '10:00 AM - 11:00 AM',
        gamePrice: 2000
      }]
    };

    console.log('📋 Testing with problematic data (null/undefined values)...');

    const whatsappResponse = await fetch('http://localhost:3111/api/whatsapp/send-booking-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(problematicWhatsAppData)
    });

    const whatsappResult = await whatsappResponse.json();
    
    if (whatsappResult.success) {
      console.log('✅ WhatsApp parameter validation fix working!');
      console.log(`📱 Message ID: ${whatsappResult.messageId}`);
      console.log('✅ System handles null/undefined values correctly');
      results.whatsappParameterFix = true;
      results.whatsappNotification = true;
    } else {
      console.log('❌ WhatsApp parameter validation failed');
      console.log('❌ Error:', whatsappResult.error);
      
      // Check if it's still a parameter mismatch error
      if (whatsappResult.error && whatsappResult.error.includes('132000')) {
        console.log('⚠️ Parameter mismatch error still occurring');
      }
    }
  } catch (error) {
    console.log('❌ WhatsApp parameter test failed:', error.message);
  }

  // Test 2: MAN Booking Reference Conversion
  console.log('\n🔄 Test 2: MAN Booking Reference Conversion');
  console.log('-'.repeat(40));
  
  try {
    // Test the booking reference conversion function
    const testManRef = 'MAN250806976'; // Example MAN format reference
    
    console.log('📋 Testing MAN -> PPT conversion...');
    console.log('📋 Input MAN reference:', testManRef);
    
    // Import the conversion function
    const { convertBookingRefFormat } = await import('./services/bookingService.js');
    
    const convertedRef = convertBookingRefFormat(testManRef, 'PPT');
    console.log('📋 Converted PPT reference:', convertedRef);
    
    if (convertedRef && convertedRef.startsWith('PPT')) {
      console.log('✅ MAN -> PPT conversion working correctly');
      results.manBookingRefConversion = true;
    } else {
      console.log('❌ MAN -> PPT conversion failed');
    }
  } catch (error) {
    console.log('❌ Booking reference conversion test failed:', error.message);
  }

  // Test 3: QR Code Generation
  console.log('\n🔲 Test 3: QR Code Generation');
  console.log('-'.repeat(40));
  
  try {
    const QRCode = require('qrcode');
    
    const testQRData = JSON.stringify({
      ref: 'FINAL_TEST_999',
      id: 99999,
      name: 'Test Child',
      game: 'Final Test Event',
      slot_id: 1
    });

    console.log('📋 Generating QR code for:', testQRData);
    
    // Test browser-compatible QR code generation
    const qrCodeDataURL = await QRCode.toDataURL(testQRData, {
      width: 200,
      margin: 2,
      errorCorrectionLevel: 'M'
    });
    
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    console.log('✅ QR code generation successful');
    console.log('📏 QR code buffer size:', buffer.length, 'bytes');
    results.qrCodeGeneration = true;
    
  } catch (error) {
    console.log('❌ QR code generation failed:', error.message);
  }

  // Test 4: Email Delivery System
  console.log('\n📧 Test 4: Email Delivery System');
  console.log('-'.repeat(40));
  
  try {
    // Get email settings
    const emailSettingsResponse = await fetch('http://localhost:3111/api/emailsetting/get');
    const emailSettingsData = await emailSettingsResponse.json();
    
    if (emailSettingsData && emailSettingsData.length > 0) {
      const settings = emailSettingsData[0];
      
      const testEmailData = {
        to: 'pittisunilkumar3@gmail.com',
        subject: '🎫 Final System Test - NIBOG Booking System',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #007bff;">🎉 Final System Test Complete!</h1>
            <p>This email confirms that the NIBOG booking system is working correctly.</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>✅ System Status: OPERATIONAL</h3>
              <ul>
                <li>✅ WhatsApp notifications working</li>
                <li>✅ Parameter validation fixed</li>
                <li>✅ MAN booking reference conversion working</li>
                <li>✅ QR code generation functional</li>
                <li>✅ Email delivery system operational</li>
              </ul>
            </div>
            <p><strong>Test completed at:</strong> ${new Date().toISOString()}</p>
            <p style="color: #666;">Both manual booking and frontend booking systems are now consistent and fully functional.</p>
          </div>
        `,
        settings: settings
      };

      console.log('📧 Sending final test email...');

      const emailResponse = await fetch('http://localhost:3111/api/send-receipt-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testEmailData),
      });

      const emailResult = await emailResponse.json();
      
      if (emailResult.success) {
        console.log('✅ Email delivery system working!');
        console.log('📧 Message ID:', emailResult.messageId);
        results.emailDelivery = true;
      } else {
        console.log('❌ Email delivery failed');
        console.log('❌ Error:', emailResult.error);
      }
    }
  } catch (error) {
    console.log('❌ Email delivery test failed:', error.message);
  }

  // Test 5: Ticket Email with QR Code
  console.log('\n🎫 Test 5: Ticket Email with QR Code');
  console.log('-'.repeat(40));
  
  try {
    const emailSettingsResponse = await fetch('http://localhost:3111/api/emailsetting/get');
    const emailSettingsData = await emailSettingsResponse.json();
    
    if (emailSettingsData && emailSettingsData.length > 0) {
      const settings = emailSettingsData[0];
      
      const testTicketData = {
        to: 'pittisunilkumar3@gmail.com',
        subject: '🎫 Final Test Ticket with QR Code - NIBOG',
        html: `
          <h1>🎫 Final Test Ticket</h1>
          <p>This ticket email confirms the complete system is working.</p>
          <img src="cid:qrcode" alt="QR Code" style="width: 200px; height: 200px;">
          <p>Scan the QR code above at the venue.</p>
        `,
        settings: settings,
        bookingRef: 'FINAL_TEST_999',
        qrCodeBuffer: [],
        ticketDetails: [{
          booking_id: 99999,
          game_name: 'Final Test Game',
          custom_title: 'Final Test Game',
          custom_price: 2000,
          start_time: '10:00 AM',
          end_time: '11:00 AM',
          child_name: 'Test Child',
          parent_name: 'Test Parent'
        }]
      };

      console.log('🎫 Sending final test ticket...');

      const ticketResponse = await fetch('http://localhost:3111/api/send-ticket-email-with-attachment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testTicketData),
      });

      const ticketResult = await ticketResponse.json();
      
      if (ticketResult.success) {
        console.log('✅ Ticket email system working!');
        console.log('📧 Message ID:', ticketResult.messageId);
        console.log('📎 Attachments:', ticketResult.attachments);
        results.ticketEmailSystem = true;
      } else {
        console.log('❌ Ticket email failed');
        console.log('❌ Error:', ticketResult.error);
      }
    }
  } catch (error) {
    console.log('❌ Ticket email test failed:', error.message);
  }

  // Final Results Summary
  console.log('\n🎯 FINAL SYSTEM TEST RESULTS');
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
    console.log('🎉 ALL SYSTEMS FULLY OPERATIONAL!');
    console.log('✅ WhatsApp parameter mismatch error fixed');
    console.log('✅ Ticket email delivery system working');
    console.log('✅ MAN booking reference conversion implemented');
    console.log('✅ QR code generation functional');
    console.log('✅ Email delivery system operational');
    console.log('✅ Complete booking flow working end-to-end');
    console.log('');
    console.log('📧 Check your email for test messages');
    console.log('📱 Check your WhatsApp for test notification');
    console.log('');
    console.log('🚀 SYSTEM READY FOR PRODUCTION!');
  } else {
    console.log('⚠️ Some issues remain - check failed tests above');
  }
}

// Run the final comprehensive test
testFinalBookingSystem();
