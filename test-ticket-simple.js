/**
 * Test the simpler ticket email API endpoint
 */

async function testSimpleTicketEmail() {
  console.log('🧪 Testing simple ticket email API...');
  
  try {
    console.log('📧 Testing /api/send-ticket-email endpoint...');

    const response = await fetch('http://localhost:3111/api/send-ticket-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingRef: 'PPT123456789', // Test with a booking reference
        bookingId: 12345
      }),
    });

    const result = await response.json();
    
    console.log('📡 API Response Status:', response.status);
    console.log('📡 API Response:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ Ticket email sent successfully!');
      console.log(`📧 Recipient: ${result.recipient}`);
    } else {
      console.log('❌ Failed to send ticket email');
      console.log('❌ Error:', result.error);
    }

  } catch (error) {
    console.error('🚨 Test failed:', error.message);
  }
}

// Run the test
testSimpleTicketEmail();
