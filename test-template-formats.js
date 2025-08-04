/**
 * Test different template data formats to find the correct one
 */

async function testTemplateFormats() {
  console.log('🧪 Testing different template data formats...');
  
  const ZAPTRA_API_URL = 'https://zaptra.in/api/wpbox';
  const ZAPTRA_API_TOKEN = 'ub94jy7OiCmCiggguxLZ2ETkbYkh5OtpNX3ZYISD737595b9';
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

  // Format 1: Array of strings (current format)
  console.log('\n📋 Testing Format 1: Array of strings');
  await testFormat('Array of strings', {
    token: ZAPTRA_API_TOKEN,
    phone: TEST_PHONE,
    template_name: 'booking_confirmation_latest',
    template_language: 'en_US',
    template_data: testData
  });

  // Format 2: Object with numbered keys
  console.log('\n📋 Testing Format 2: Object with numbered keys');
  await testFormat('Object with numbered keys', {
    token: ZAPTRA_API_TOKEN,
    phone: TEST_PHONE,
    template_name: 'booking_confirmation_latest',
    template_language: 'en_US',
    template_data: {
      '1': testData[0],
      '2': testData[1],
      '3': testData[2],
      '4': testData[3],
      '5': testData[4],
      '6': testData[5],
      '7': testData[6],
      '8': testData[7]
    }
  });

  // Format 3: WhatsApp API format with components
  console.log('\n📋 Testing Format 3: WhatsApp API components format');
  await testFormat('WhatsApp API components', {
    token: ZAPTRA_API_TOKEN,
    phone: TEST_PHONE,
    template_name: 'booking_confirmation_latest',
    template_language: 'en_US',
    template_data: {
      components: [
        {
          type: "body",
          parameters: testData.map(value => ({ type: "text", text: value }))
        }
      ]
    }
  });

  // Format 4: Simple object with parameter names
  console.log('\n📋 Testing Format 4: Object with parameter names');
  await testFormat('Object with parameter names', {
    token: ZAPTRA_API_TOKEN,
    phone: TEST_PHONE,
    template_name: 'booking_confirmation_latest',
    template_language: 'en_US',
    template_data: {
      customer_name: testData[0],
      event_title: testData[1],
      event_date: testData[2],
      venue_name: testData[3],
      child_name: testData[4],
      booking_ref: testData[5],
      total_amount: testData[6],
      payment_method: testData[7]
    }
  });
}

async function testFormat(formatName, requestBody) {
  const ZAPTRA_API_URL = 'https://zaptra.in/api/wpbox';

  try {
    console.log(`🔄 Testing ${formatName}...`);
    console.log(`📤 Request body:`, JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${ZAPTRA_API_URL}/sendtemplatemessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    
    console.log(`📡 Status: ${response.status}`);
    console.log(`📡 Response:`, JSON.stringify(result, null, 2));
    
    if (response.ok && result.status === 'success') {
      console.log(`✅ ${formatName} - SUCCESS!`);
      return true;
    } else {
      console.log(`❌ ${formatName} - FAILED: ${result.message || 'Unknown error'}`);
      return false;
    }
    
  } catch (error) {
    console.log(`🚨 ${formatName} - ERROR: ${error.message}`);
    return false;
  }
}

// Run the tests
testTemplateFormats();
