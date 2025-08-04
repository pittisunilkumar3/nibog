/**
 * Test the WhatsApp service directly without the API server
 */

// Import the WhatsApp service function
import { sendBookingConfirmationWhatsApp } from './services/whatsappService.js';

async function testWhatsAppService() {
  console.log('🧪 Testing WhatsApp service directly...');

  // Sample booking data for testing
  const testBookingData = {
    bookingId: 12345,
    bookingRef: 'B0012345',
    parentName: 'Rajesh Kumar',
    parentPhone: '9346015886', // Your test number
    childName: 'Aarav Kumar',
    eventTitle: 'NIBOG Baby Olympics 2024',
    eventDate: '2024-12-15',
    eventVenue: 'NIBOG Sports Complex, Bangalore',
    totalAmount: 2500,
    paymentMethod: 'PhonePe',
    transactionId: 'TXN_PROD_' + Date.now(),
    gameDetails: [
      {
        gameName: 'Baby Crawling Race',
        gameTime: '10:00 AM - 10:30 AM',
        gamePrice: 500
      },
      {
        gameName: 'Toddler Ball Toss',
        gameTime: '11:00 AM - 11:30 AM',
        gamePrice: 300
      }
    ],
    addOns: [
      {
        name: 'Participation Certificate',
        quantity: 1,
        price: 200
      }
    ]
  };

  try {
    console.log('📱 Calling WhatsApp service...');
    console.log('📞 Target phone:', testBookingData.parentPhone);
    console.log('🎉 Event:', testBookingData.eventTitle);

    // Call the WhatsApp service directly
    const result = await sendBookingConfirmationWhatsApp(testBookingData);

    console.log('📡 Service Response:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ WhatsApp service - SUCCESS!');
      console.log('📨 Message ID:', result.messageId);
      console.log('📱 Check your WhatsApp for the booking confirmation message');
      console.log('🎯 Template: booking_confirmation_latest should work!');
    } else {
      console.error('❌ WhatsApp service - FAILED');
      console.error('Error:', result.error);
      if (result.zaptraResponse) {
        console.error('Zaptra Response:', JSON.stringify(result.zaptraResponse, null, 2));
      }
    }

  } catch (error) {
    console.error('🚨 Test failed with error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testWhatsAppService();
