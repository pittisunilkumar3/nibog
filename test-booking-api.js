/**
 * Test the booking confirmation API with the fixed WhatsApp service
 */

async function testBookingAPI() {
  console.log('🧪 Testing booking confirmation API...');
  
  // Sample booking data for testing
  const testBookingData = {
    bookingId: 12345,
    bookingRef: 'B0012345',
    parentName: 'Test Parent',
    parentPhone: '9346015886', // Your test number
    childName: 'Test Child',
    eventTitle: 'Birthday Party Celebration',
    eventDate: '2024-01-15',
    eventVenue: 'NIBOG Party Hall, Bangalore',
    totalAmount: 2500,
    paymentMethod: 'PhonePe',
    transactionId: 'TXN_TEST_001',
    gameDetails: [
      {
        gameName: 'Balloon Popping',
        gameTime: '10:00 AM',
        gamePrice: 500
      },
      {
        gameName: 'Musical Chairs',
        gameTime: '11:00 AM', 
        gamePrice: 300
      },
      {
        gameName: 'Treasure Hunt',
        gameTime: '12:00 PM',
        gamePrice: 700
      }
    ],
    addOns: [
      {
        name: 'Birthday Cake',
        quantity: 1,
        price: 800
      },
      {
        name: 'Party Decorations',
        quantity: 1,
        price: 200
      }
    ]
  };

  try {
    console.log('📱 Sending test booking confirmation...');
    console.log('📞 Target phone:', testBookingData.parentPhone);
    console.log('🎉 Event:', testBookingData.eventTitle);
    
    // Call the booking confirmation API endpoint
    const response = await fetch('http://localhost:3000/api/whatsapp/send-booking-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBookingData),
    });

    const result = await response.json();
    
    console.log('📡 API Response Status:', response.status);
    console.log('📡 API Response:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.success) {
      console.log('✅ Booking confirmation API - SUCCESS!');
      console.log('📨 Message ID:', result.messageId);
      console.log('📱 Check your WhatsApp for the booking confirmation message');
      console.log('🎯 This should work without parameter mismatch errors!');
    } else {
      console.error('❌ Booking confirmation API - FAILED');
      console.error('Error:', result.error);
      if (result.zaptraResponse) {
        console.error('Zaptra Response:', JSON.stringify(result.zaptraResponse, null, 2));
      }
    }
    
  } catch (error) {
    console.error('🚨 Test failed with error:', error.message);
  }
}

// Run the test
testBookingAPI();
