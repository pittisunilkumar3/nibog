/**
 * Test the booking confirmation API with the fixed WhatsApp service
 */

// Check if fetch is available (for Node.js environments)
if (typeof fetch === 'undefined') {
  // Try to import node-fetch for Node.js
  try {
    const { default: fetch } = await import('node-fetch');
    global.fetch = fetch;
  } catch (e) {
    console.error('❌ fetch is not available. Please install node-fetch or run in a browser environment.');
    process.exit(1);
  }
}

async function checkServerHealth() {
  const maxRetries = 10;
  const retryDelay = 3000; // 3 seconds

  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`🔍 Checking server health (attempt ${i + 1}/${maxRetries})...`);

      // Try the WhatsApp health endpoint first
      const response = await fetch('http://localhost:3000/api/whatsapp/health', {
        method: 'GET'
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Server is running and healthy!');
        console.log('📱 WhatsApp service status:', result.healthy ? 'Healthy' : 'Unhealthy');
        return true;
      }
    } catch (error) {
      console.log(`⏳ Server not ready yet (${error.message}), retrying in ${retryDelay/1000}s...`);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  console.log('❌ Server is not responding. Please start the Next.js server with: npm run dev');
  console.log('💡 Make sure to run: npm run dev in another terminal');
  return false;
}

async function testBookingAPI() {
  console.log('🧪 Testing booking confirmation API...');

  // Check if server is running first
  const serverHealthy = await checkServerHealth();
  if (!serverHealthy) {
    console.log('💡 To start the server, run: npm run dev');
    return;
  }

  // Sample booking data for testing - using realistic customer data format
  const testBookingData = {
    bookingId: 12345,
    bookingRef: 'B0012345',
    parentName: 'Rajesh Kumar',
    parentPhone: '6281102112', // Your test number
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
      },
      {
        gameName: 'Mini Obstacle Course',
        gameTime: '12:00 PM - 12:30 PM',
        gamePrice: 700
      }
    ],
    addOns: [
      {
        name: 'Participation Certificate',
        quantity: 1,
        price: 200
      },
      {
        name: 'Photo Package',
        quantity: 1,
        price: 500
      },
      {
        name: 'Snack Box',
        quantity: 1,
        price: 300
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

      // Additional debugging for delivery issues
      console.log('\n🔍 DELIVERY TROUBLESHOOTING:');
      console.log('1. ✅ API call successful - message was sent to Zaptra');
      console.log('2. 📱 Check if the phone number has WhatsApp installed');
      console.log('3. 🔔 Check if WhatsApp notifications are enabled');
      console.log('4. 📞 Verify the phone number format:', testBookingData.parentPhone, '→ formatted as +91' + testBookingData.parentPhone);
      console.log('5. ⏰ WhatsApp delivery can take 1-5 minutes');
      console.log('6. 🚫 Check if the number has blocked business messages');
      console.log('7. 📱 Some numbers may not receive messages if they haven\'t opted in to business messages');

    } else {
      console.error('❌ Booking confirmation API - FAILED');
      console.error('Error:', result.error);
      if (result.zaptraResponse) {
        console.error('Zaptra Response:', JSON.stringify(result.zaptraResponse, null, 2));
      }

      // Analyze common failure reasons
      console.log('\n🔍 FAILURE ANALYSIS:');
      if (result.error && result.error.includes('Invalid phone number')) {
        console.log('❌ Phone number format issue - check if number is valid');
      }
      if (result.zaptraResponse && result.zaptraResponse.message) {
        console.log('🔍 Zaptra says:', result.zaptraResponse.message);
      }
    }

  } catch (error) {
    console.error('🚨 Test failed with error:', error.message);
    console.error('💡 Make sure the Next.js server is running on http://localhost:3000');
  }
}

// Run the test
testBookingAPI();
