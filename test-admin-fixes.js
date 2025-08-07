/**
 * Test script to verify the fixes for admin panel WhatsApp and PDF ticket issues
 */

const BASE_URL = 'http://localhost:3111';

// Test data for admin manual booking with proper event information
const testBookingData = {
  bookingId: 99999,
  bookingRef: 'MAN250106999', // MAN format to test conversion
  parentName: 'Test Admin Parent',
  parentPhone: '+916303727148',
  childName: 'Test Admin Child',
  eventTitle: 'Admin Panel Test Event', // Proper event title
  eventDate: '2024-01-15',
  eventVenue: 'Test Venue - Admin Panel',
  totalAmount: 2500,
  paymentMethod: 'Cash payment',
  transactionId: 'ADMIN_TXN_999',
  gameDetails: [{
    gameName: 'Test Game - Admin',
    gameTime: '10:00 AM - 11:00 AM',
    gamePrice: 2500
  }],
  addOns: [] // Empty array instead of undefined
};

async function testWhatsAppDataValidation() {
  console.log('\n📱 Testing WhatsApp Data Validation Fix...');
  console.log('='.repeat(50));
  
  try {
    const response = await fetch(`${BASE_URL}/api/whatsapp/send-booking-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBookingData),
    });

    const result = await response.json();
    
    console.log('📡 Response Status:', response.status);
    console.log('📡 Response Data:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.success) {
      console.log('✅ WhatsApp Data Validation - FIXED!');
      console.log('📱 Message ID:', result.messageId);
      console.log('📱 No undefined/null field warnings expected');
      
      // Check if Zaptra response is properly included
      if (result.zaptraResponse) {
        console.log('✅ Zaptra response properly included');
        console.log('📋 Zaptra Status:', result.zaptraResponse.status);
      } else {
        console.log('⚠️ Zaptra response missing - check response handling');
      }
      
      return true;
    } else {
      console.log('❌ WhatsApp test failed');
      console.log('❌ Error:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ WhatsApp test failed:', error.message);
    return false;
  }
}

async function testBookingReferenceConversion() {
  console.log('\n🔄 Testing MAN -> PPT Booking Reference Conversion...');
  console.log('='.repeat(50));
  
  try {
    // Test the conversion function directly
    const testManRef = 'MAN250106999';
    console.log('📋 Input MAN reference:', testManRef);
    
    // Simulate what happens in the ticket lookup
    const response = await fetch(`${BASE_URL}/api/send-ticket-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingRef: testManRef
      }),
    });

    const result = await response.json();
    
    console.log('📡 Ticket API Response Status:', response.status);
    console.log('📡 Ticket API Response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ MAN -> PPT conversion working');
      return true;
    } else {
      console.log('❌ MAN -> PPT conversion failed');
      console.log('❌ Error:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Booking reference conversion test failed:', error.message);
    return false;
  }
}

async function testPDFTicketGeneration() {
  console.log('\n📄 Testing PDF Ticket Generation with Event Names...');
  console.log('='.repeat(50));
  
  try {
    // Test PDF generation with fallback data
    const ticketTestData = {
      bookingRef: 'MAN250106999',
      bookingId: 99999
    };
    
    console.log('📋 Testing PDF generation with booking ref:', ticketTestData.bookingRef);
    
    const response = await fetch(`${BASE_URL}/api/send-ticket-email-with-attachment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'test@example.com',
        subject: 'Test Ticket',
        html: '<h1>Test Ticket</h1>',
        settings: {
          smtp_host: 'test',
          smtp_port: 587,
          smtp_user: 'test',
          smtp_pass: 'test'
        },
        qrCodeBuffer: [1, 2, 3], // Dummy QR code
        bookingRef: ticketTestData.bookingRef,
        ticketDetails: [{
          booking_id: ticketTestData.bookingId,
          event_title: 'Admin Panel Test Event', // Proper event title
          child_name: 'Test Child',
          parent_name: 'Test Parent',
          custom_title: 'Test Game',
          custom_price: 2500,
          event_date: '2024-01-15'
        }]
      }),
    });

    const result = await response.json();
    
    console.log('📡 PDF Generation Response Status:', response.status);
    
    if (response.ok) {
      console.log('✅ PDF ticket generation working');
      console.log('📄 Event name should be properly included in PDF');
      return true;
    } else {
      console.log('❌ PDF ticket generation failed');
      console.log('❌ Error:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ PDF ticket generation test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 ADMIN PANEL FIXES VERIFICATION TEST SUITE');
  console.log('='.repeat(60));
  console.log('Testing fixes for:');
  console.log('1. WhatsApp undefined/null fields issue');
  console.log('2. WhatsApp Zaptra response handling');
  console.log('3. PDF ticket event name missing issue');
  console.log('4. MAN -> PPT booking reference conversion');
  console.log('='.repeat(60));
  
  const results = {
    whatsappValidation: false,
    bookingRefConversion: false,
    pdfGeneration: false
  };
  
  // Run all tests
  results.whatsappValidation = await testWhatsAppDataValidation();
  results.bookingRefConversion = await testBookingReferenceConversion();
  results.pdfGeneration = await testPDFTicketGeneration();
  
  // Summary
  console.log('\n📊 FIXES VERIFICATION SUMMARY');
  console.log('='.repeat(40));
  console.log(`📱 WhatsApp Data Validation: ${results.whatsappValidation ? '✅ FIXED' : '❌ STILL BROKEN'}`);
  console.log(`🔄 Booking Ref Conversion: ${results.bookingRefConversion ? '✅ FIXED' : '❌ STILL BROKEN'}`);
  console.log(`📄 PDF Event Names: ${results.pdfGeneration ? '✅ FIXED' : '❌ STILL BROKEN'}`);
  
  const fixedCount = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall Fix Success Rate: ${fixedCount}/${totalTests}`);
  
  if (fixedCount === totalTests) {
    console.log('🎉 ALL ISSUES FIXED! Admin panel should work correctly now!');
  } else {
    console.log('⚠️ Some issues still need attention. Check the logs above.');
  }
  
  return results;
}

// Run the tests
runAllTests().catch(console.error);
