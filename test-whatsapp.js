/**
 * Test script for WhatsApp booking confirmation
 * This will send a test message directly to Zaptra API
 */

async function testWhatsAppTemplate() {
  console.log('🧪 Starting WhatsApp template test...');

  // Environment variables (hardcoded for testing)
  const ZAPTRA_API_URL = 'https://demo.zaptra.in/api/wpbox';
  const ZAPTRA_API_TOKEN = 'QqfIcXJtovwgUSGMtX1a3PY0XbXQCETeqFMlfjYi5c0aa036';
  const TEST_PHONE = '+919346015886';

  // Sample booking data for template variables
  const templateData = [
    'Test Parent',                    // {{1}} - customer_name
    'Birthday Party Celebration',     // {{2}} - event_title
    '2024-01-15',                    // {{3}} - event_date
    'NIBOG Party Hall, Bangalore',   // {{4}} - venue_name
    'Test Child',                    // {{5}} - child_name
    'B0012345',                      // {{6}} - booking_ref
    '2500',                          // {{7}} - total_amount
    'PhonePe'                        // {{8}} - payment_method
  ];

  try {
    console.log('📱 Sending WhatsApp template message...');
    console.log('📞 Target phone:', TEST_PHONE);
    console.log('🎯 Template name: booking_confirmation');
    console.log('📋 Template data:', templateData);

    // Call Zaptra API directly
    const response = await fetch(`${ZAPTRA_API_URL}/sendtemplatemessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: ZAPTRA_API_TOKEN,
        phone: TEST_PHONE,
        template_name: 'booking_confirmation',
        template_language: 'en',  // Correct language for booking_confirmation template
        template_data: templateData
      }),
    });

    const result = await response.json();

    console.log('📡 API Response Status:', response.status);
    console.log('📡 API Response:', JSON.stringify(result, null, 2));

    if (response.ok && result.status === 'success') {
      console.log('✅ WhatsApp template message sent successfully!');
      console.log('📨 Message ID:', result.message_id);
      console.log('📱 Check your WhatsApp (9346015886) for the booking confirmation message');
    } else {
      console.error('❌ Failed to send WhatsApp template message');
      console.error('Error:', result.message || 'Unknown error');
    }

  } catch (error) {
    console.error('🚨 Test failed with error:', error.message);
  }
}

// Run the test
testWhatsAppTemplate();
