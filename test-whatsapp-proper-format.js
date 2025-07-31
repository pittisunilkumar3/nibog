/**
 * Test with proper WhatsApp Business API template format
 * Based on Meta's official documentation
 */

async function testProperWhatsAppFormat() {
  console.log('🧪 Testing proper WhatsApp Business API template format...');
  
  const ZAPTRA_API_URL = 'https://demo.zaptra.in/api/wpbox';
  const ZAPTRA_API_TOKEN = 'QqfIcXJtovwgUSGMtX1a3PY0XbXQCETeqFMlfjYi5c0aa036';
  const TEST_PHONE = '+919346015886';
  
  // Test data
  const testData = [
    'Test Parent',                    // {{1}} - customer_name
    'Birthday Party Celebration',     // {{2}} - event_title  
    '2024-01-15',                    // {{3}} - event_date
    'NIBOG Party Hall, Bangalore',   // {{4}} - venue_name
    'Test Child',                    // {{5}} - child_name
    'B0012345',                      // {{6}} - booking_ref
    '2500',                          // {{7}} - total_amount
    'PhonePe'                        // {{8}} - payment_method
  ];

  // Format according to WhatsApp Business API specification
  // This is the exact format Meta expects for template messages
  const properFormat = {
    token: ZAPTRA_API_TOKEN,
    phone: TEST_PHONE,
    template_name: 'booking_confirmation',
    template_language: 'en',
    template_data: {
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: testData[0] },  // {{1}}
            { type: "text", text: testData[1] },  // {{2}}
            { type: "text", text: testData[2] },  // {{3}}
            { type: "text", text: testData[3] },  // {{4}}
            { type: "text", text: testData[4] },  // {{5}}
            { type: "text", text: testData[5] },  // {{6}}
            { type: "text", text: testData[6] },  // {{7}}
            { type: "text", text: testData[7] }   // {{8}}
          ]
        }
      ]
    }
  };

  try {
    console.log('🔄 Testing proper WhatsApp Business API format...');
    console.log('📤 Request body:', JSON.stringify(properFormat, null, 2));
    
    const response = await fetch(`${ZAPTRA_API_URL}/sendtemplatemessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(properFormat),
    });

    const result = await response.json();
    
    console.log('📡 Status:', response.status);
    console.log('📡 Response:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.status === 'success') {
      console.log('✅ Proper WhatsApp format - SUCCESS!');
      console.log('📨 Message ID:', result.message_id);
      console.log('📱 Check your WhatsApp for the message');
    } else {
      console.log('❌ Proper WhatsApp format - FAILED:', result.message || 'Unknown error');
    }
    
  } catch (error) {
    console.log('🚨 Test failed:', error.message);
  }

  // Also test the simple array format that worked before
  console.log('\n🔄 Testing simple array format for comparison...');
  
  const simpleFormat = {
    token: ZAPTRA_API_TOKEN,
    phone: TEST_PHONE,
    template_name: 'booking_confirmation',
    template_language: 'en',
    template_data: testData
  };

  try {
    const response2 = await fetch(`${ZAPTRA_API_URL}/sendtemplatemessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simpleFormat),
    });

    const result2 = await response2.json();
    
    console.log('📡 Simple format status:', response2.status);
    console.log('📡 Simple format response:', JSON.stringify(result2, null, 2));
    
  } catch (error) {
    console.log('🚨 Simple format test failed:', error.message);
  }
}

// Run the test
testProperWhatsAppFormat();
