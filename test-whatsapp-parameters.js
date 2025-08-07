/**
 * Test WhatsApp template parameters to debug the mismatch error
 */

async function testWhatsAppParameters() {
  console.log('🧪 Testing WhatsApp Template Parameters');
  console.log('=' .repeat(50));

  // Test data with all 8 required parameters
  const testBookingData = {
    bookingId: 12345,
    bookingRef: 'TEST123456789',
    parentName: 'Test Parent',
    parentPhone: '+916303727148',
    childName: 'Test Child',
    eventTitle: 'Birthday Party Celebration',
    eventDate: '2024-01-15',
    eventVenue: 'NIBOG Party Hall, Bangalore',
    totalAmount: 2500,
    paymentMethod: 'PhonePe',
    transactionId: 'TXN123456789',
    gameDetails: [{
      gameName: 'Musical Chairs',
      gameTime: '10:00 AM - 11:00 AM',
      gamePrice: 1500
    }]
  };

  console.log('📋 Test booking data:');
  console.log('1. Parent Name:', testBookingData.parentName);
  console.log('2. Event Title:', testBookingData.eventTitle);
  console.log('3. Event Date:', testBookingData.eventDate);
  console.log('4. Event Venue:', testBookingData.eventVenue);
  console.log('5. Child Name:', testBookingData.childName);
  console.log('6. Booking Ref:', testBookingData.bookingRef);
  console.log('7. Total Amount:', testBookingData.totalAmount);
  console.log('8. Payment Method:', testBookingData.paymentMethod);

  try {
    console.log('\n📱 Sending WhatsApp message via API...');
    
    const response = await fetch('http://localhost:3111/api/whatsapp/send-booking-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBookingData),
    });

    const result = await response.json();
    
    console.log('📡 API Response Status:', response.status);
    console.log('📡 API Response:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ WhatsApp message sent successfully!');
      console.log(`📱 Message ID: ${result.messageId}`);
    } else {
      console.log('❌ WhatsApp message failed');
      console.log('❌ Error:', result.error);
      
      if (result.zaptraResponse) {
        console.log('📋 Zaptra Response:', JSON.stringify(result.zaptraResponse, null, 2));
      }
      
      // Check if it's a parameter mismatch error
      if (result.error && result.error.includes('132000')) {
        console.log('\n🔍 PARAMETER MISMATCH ERROR DETECTED!');
        console.log('This error occurs when the number of parameters sent doesn\'t match the template.');
        console.log('Expected: 8 parameters for booking_confirmation_latest template');
        console.log('Let\'s check what we\'re actually sending...');
      }
    }

  } catch (error) {
    console.error('🚨 Test failed:', error.message);
  }

  // Test with direct Zaptra API call to see raw response
  console.log('\n🔧 Testing direct Zaptra API call...');
  
  try {
    const directTestData = {
      token: 'QqfIcXJtovwgUSGMtX1a3PY0XbXQCETeqFMlfjYi5c0aa036',
      phone: '+916303727148',
      template_name: 'booking_confirmation_latest',
      template_language: 'en_US',
      template_data: [
        'Test Parent',                    // {{1}} - customer_name
        'Birthday Party Celebration',     // {{2}} - event_title
        '2024-01-15',                    // {{3}} - event_date
        'NIBOG Party Hall, Bangalore',   // {{4}} - venue_name
        'Test Child',                    // {{5}} - child_name
        'TEST123456789',                 // {{6}} - booking_ref
        '₹2500',                         // {{7}} - total_amount
        'PhonePe'                        // {{8}} - payment_method
      ]
    };

    console.log('📋 Direct API payload:');
    console.log('Template:', directTestData.template_name);
    console.log('Language:', directTestData.template_language);
    console.log('Parameters count:', directTestData.template_data.length);
    console.log('Parameters:', directTestData.template_data);

    const directResponse = await fetch('https://zaptra.in/api/wpbox/sendTemplate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(directTestData),
    });

    const directResult = await directResponse.json();
    
    console.log('📡 Direct Zaptra Response Status:', directResponse.status);
    console.log('📡 Direct Zaptra Response:', JSON.stringify(directResult, null, 2));

    if (directResult.success || directResponse.ok) {
      console.log('✅ Direct Zaptra API call successful!');
    } else {
      console.log('❌ Direct Zaptra API call failed');
      
      if (directResult.error && directResult.error.includes('132000')) {
        console.log('\n🔍 CONFIRMED: Parameter mismatch error in direct API call');
        console.log('The template expects a different number of parameters than we\'re sending');
      }
    }

  } catch (error) {
    console.error('🚨 Direct API test failed:', error.message);
  }

  console.log('\n📝 DEBUGGING SUMMARY:');
  console.log('- Template: booking_confirmation_latest');
  console.log('- Expected parameters: 8 (based on template structure)');
  console.log('- Sent parameters: 8');
  console.log('- If error persists, the template structure might have changed');
  console.log('- Check Zaptra dashboard for template parameter requirements');
}

// Run the test
testWhatsAppParameters();
