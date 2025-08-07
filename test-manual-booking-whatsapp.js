/**
 * Test WhatsApp integration for manual booking
 */

async function testManualBookingWhatsApp() {
  console.log('🧪 Testing WhatsApp integration for manual booking...');
  
  const testBookingData = {
    bookingId: 12345,
    bookingRef: 'B0012345',
    parentName: 'Test Parent',
    parentPhone: '+916303727148',
    childName: 'Test Child',
    eventTitle: 'Birthday Party Celebration',
    eventDate: '2024-01-15',
    eventVenue: 'NIBOG Party Hall, Bangalore',
    totalAmount: 2500,
    paymentMethod: 'PhonePe',
    transactionId: 'TXN123456789',
    gameDetails: [
      {
        gameName: 'Musical Chairs',
        gameTime: '10:00 AM - 11:00 AM',
        gamePrice: 1500
      },
      {
        gameName: 'Treasure Hunt',
        gameTime: '11:00 AM - 12:00 PM',
        gamePrice: 1000
      }
    ]
  };

  try {
    console.log('📱 Sending WhatsApp booking confirmation via API...');
    console.log('📋 Booking data:', JSON.stringify(testBookingData, null, 2));

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
      console.log('✅ WhatsApp booking confirmation sent successfully!');
      console.log(`📱 Message ID: ${result.messageId}`);
      console.log('📱 Check your WhatsApp for the booking confirmation message');
    } else {
      console.log('❌ Failed to send WhatsApp booking confirmation');
      console.log('❌ Error:', result.error);
    }

  } catch (error) {
    console.error('🚨 Test failed:', error.message);
  }
}

// Run the test
testManualBookingWhatsApp();
