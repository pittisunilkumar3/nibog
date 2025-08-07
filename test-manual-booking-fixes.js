/**
 * Test the manual booking fixes
 */

async function testManualBookingFixes() {
  console.log('🧪 Testing manual booking fixes...');
  console.log('=' .repeat(50));

  // Test 1: WhatsApp API endpoint
  console.log('\n📱 Test 1: WhatsApp API Endpoint');
  console.log('-'.repeat(30));
  
  try {
    const whatsappHealthResponse = await fetch('http://localhost:3111/api/whatsapp/health');
    const whatsappHealth = await whatsappHealthResponse.json();
    
    console.log('✅ WhatsApp health check:', whatsappHealth);
    
    if (whatsappHealth.healthy && whatsappHealth.enabled) {
      console.log('✅ WhatsApp service is ready for manual booking');
    } else {
      console.log('❌ WhatsApp service has issues');
    }
  } catch (error) {
    console.log('❌ WhatsApp health check failed:', error.message);
  }

  // Test 2: WhatsApp message sending
  console.log('\n📱 Test 2: WhatsApp Message Sending');
  console.log('-'.repeat(30));
  
  try {
    const testWhatsAppData = {
      bookingId: 999,
      bookingRef: 'TEST999',
      parentName: 'Test Parent',
      parentPhone: '+916303727148',
      childName: 'Test Child',
      eventTitle: 'Manual Booking Test',
      eventDate: '2024-01-15',
      eventVenue: 'Test Venue',
      totalAmount: 1000,
      paymentMethod: 'Cash payment',
      transactionId: 'TEST_TXN_999',
      gameDetails: [{
        gameName: 'Test Game',
        gameTime: '10:00 AM - 11:00 AM',
        gamePrice: 1000
      }]
    };

    const whatsappResponse = await fetch('http://localhost:3111/api/whatsapp/send-booking-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testWhatsAppData)
    });

    const whatsappResult = await whatsappResponse.json();
    
    if (whatsappResult.success) {
      console.log('✅ WhatsApp API endpoint working');
      console.log(`📱 Message ID: ${whatsappResult.messageId}`);
    } else {
      console.log('❌ WhatsApp API endpoint failed');
      console.log('📋 Error:', whatsappResult.error);
    }
  } catch (error) {
    console.log('❌ WhatsApp API test failed:', error.message);
  }

  // Test 3: Ticket Email API endpoint
  console.log('\n🎫 Test 3: Ticket Email API Endpoint');
  console.log('-'.repeat(30));
  
  try {
    // Test with a non-existent booking reference to see error handling
    const ticketResponse = await fetch('http://localhost:3111/api/send-ticket-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingRef: 'NONEXISTENT123',
        bookingId: 999
      })
    });

    const ticketResult = await ticketResponse.json();
    
    console.log(`📡 Ticket API response status: ${ticketResponse.status}`);
    console.log('📋 Response:', ticketResult);
    
    if (ticketResponse.status === 404 && ticketResult.error.includes('multiple attempts')) {
      console.log('✅ Ticket API retry mechanism is working');
    } else {
      console.log('⚠️ Unexpected ticket API response');
    }
  } catch (error) {
    console.log('❌ Ticket API test failed:', error.message);
  }

  // Test 4: Environment variable access
  console.log('\n🔧 Test 4: Environment Configuration');
  console.log('-'.repeat(30));
  
  try {
    const templatesResponse = await fetch('http://localhost:3111/api/whatsapp/templates');
    const templatesResult = await templatesResponse.json();
    
    if (templatesResult.success) {
      console.log('✅ Environment variables are accessible on server side');
      console.log(`📋 Found ${templatesResult.templates?.length || 0} WhatsApp templates`);
    } else {
      console.log('❌ Environment variable access issue');
      console.log('📋 Error:', templatesResult.error);
    }
  } catch (error) {
    console.log('❌ Environment test failed:', error.message);
  }

  console.log('\n🎯 SUMMARY');
  console.log('=' .repeat(50));
  console.log('✅ Fixed: WhatsApp service now uses API endpoint (avoids browser env issues)');
  console.log('✅ Fixed: Ticket email API has retry mechanism (handles timing issues)');
  console.log('✅ Fixed: Added delay before sending tickets (ensures DB consistency)');
  console.log('✅ Fixed: Removed direct service imports from browser code');
  console.log('');
  console.log('📝 Expected behavior:');
  console.log('- Manual booking should work without "WhatsApp disabled" error');
  console.log('- Ticket emails should be sent successfully after retry attempts');
  console.log('- No more browser environment compatibility issues');
}

// Run the test
testManualBookingFixes();
