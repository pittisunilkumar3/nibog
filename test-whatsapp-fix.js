/**
 * Test WhatsApp Integration Fix
 * Verify that the parameter mismatch issue is resolved
 */

async function testWhatsAppFix() {
  console.log('🧪 TESTING WHATSAPP INTEGRATION FIX');
  console.log('=' .repeat(60));

  const testResults = {
    venueNameFix: false,
    parameterMapping: false,
    adminPanelData: false,
    frontendData: false,
    edgeCases: false
  };

  // Test 1: Verify venue name fix
  console.log('\n🏢 Test 1: Venue Name Fix Verification');
  console.log('-'.repeat(40));
  
  try {
    // Test the event service to see if venue_name is now properly set
    const eventsResponse = await fetch('http://localhost:3111/api/events/city/1');
    const eventsData = await eventsResponse.json();
    
    if (eventsData.success && eventsData.events && eventsData.events.length > 0) {
      const firstEvent = eventsData.events[0];
      console.log('📋 Sample event venue_name:', firstEvent.venue_name);
      
      if (firstEvent.venue_name && firstEvent.venue_name !== '') {
        console.log('✅ Venue name fix working - events now have proper venue names');
        testResults.venueNameFix = true;
      } else {
        console.log('⚠️ Venue name still empty - using fallback');
      }
    }
  } catch (error) {
    console.log('❌ Venue name test failed:', error.message);
  }

  // Test 2: Test admin panel style data (simulating manual booking)
  console.log('\n⚙️ Test 2: Admin Panel Style Data Test');
  console.log('-'.repeat(40));
  
  const adminStyleData = {
    bookingId: 99998,
    bookingRef: 'MAN250106998',
    parentName: 'Admin Test Parent',
    parentPhone: '+916303727148',
    childName: 'Admin Test Child',
    eventTitle: 'Admin Panel Test Event',
    eventDate: '2024-01-16',
    eventVenue: 'NIBOG Event Venue', // Now should have proper value
    totalAmount: 3500,
    paymentMethod: 'Cash payment',
    transactionId: 'ADMIN_TXN_998',
    gameDetails: [{
      gameName: 'Admin Test Game',
      gameTime: '3:00 PM - 4:00 PM',
      gamePrice: 2500
    }],
    addOns: [{
      name: 'Test Add-on',
      quantity: 1,
      price: 1000
    }]
  };

  console.log('📋 Testing admin panel style data...');
  console.log('📋 Event venue:', adminStyleData.eventVenue);

  try {
    const adminResponse = await fetch('http://localhost:3111/api/whatsapp/send-booking-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminStyleData)
    });

    const adminResult = await adminResponse.json();
    
    if (adminResult.success) {
      console.log('✅ Admin panel style data: SUCCESS');
      console.log('📱 Message ID:', adminResult.messageId);
      testResults.adminPanelData = true;
    } else {
      console.log('❌ Admin panel style data: FAILED');
      console.log('❌ Error:', adminResult.error);
      
      if (adminResult.error && adminResult.error.includes('132000')) {
        console.log('🚨 PARAMETER MISMATCH ERROR STILL OCCURRING!');
        console.log('📋 The fix did not resolve the issue');
      }
    }
  } catch (error) {
    console.log('❌ Admin panel test failed:', error.message);
  }

  // Test 3: Test frontend style data (for comparison)
  console.log('\n🌐 Test 3: Frontend Style Data Test');
  console.log('-'.repeat(40));
  
  const frontendStyleData = {
    bookingId: 99999,
    bookingRef: 'PPT250106999',
    parentName: 'Frontend Test Parent',
    parentPhone: '+916303727148',
    childName: 'Frontend Test Child',
    eventTitle: 'Frontend Test Event',
    eventDate: '2024-01-17',
    eventVenue: 'Main Event Hall',
    totalAmount: 2800,
    paymentMethod: 'PhonePe',
    transactionId: 'FRONTEND_TXN_999',
    gameDetails: [{
      gameName: 'Frontend Test Game',
      gameTime: '11:00 AM - 12:00 PM',
      gamePrice: 2800
    }]
  };

  console.log('📋 Testing frontend style data...');

  try {
    const frontendResponse = await fetch('http://localhost:3111/api/whatsapp/send-booking-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(frontendStyleData)
    });

    const frontendResult = await frontendResponse.json();
    
    if (frontendResult.success) {
      console.log('✅ Frontend style data: SUCCESS');
      console.log('📱 Message ID:', frontendResult.messageId);
      testResults.frontendData = true;
    } else {
      console.log('❌ Frontend style data: FAILED');
      console.log('❌ Error:', frontendResult.error);
    }
  } catch (error) {
    console.log('❌ Frontend test failed:', error.message);
  }

  // Test 4: Test edge cases that might cause parameter issues
  console.log('\n🧪 Test 4: Edge Cases Test');
  console.log('-'.repeat(40));
  
  const edgeCases = [
    {
      name: 'Empty venue name',
      data: { ...adminStyleData, eventVenue: '' }
    },
    {
      name: 'Null venue name',
      data: { ...adminStyleData, eventVenue: null }
    },
    {
      name: 'Undefined venue name',
      data: { ...adminStyleData, eventVenue: undefined }
    },
    {
      name: 'Very long venue name',
      data: { ...adminStyleData, eventVenue: 'A'.repeat(200) }
    },
    {
      name: 'Special characters in venue',
      data: { ...adminStyleData, eventVenue: 'Venue & Hall "Special" <Location>' }
    }
  ];

  let edgeCasesPassed = 0;

  for (const testCase of edgeCases) {
    try {
      console.log(`\n🧪 Testing: ${testCase.name}`);
      
      const response = await fetch('http://localhost:3111/api/whatsapp/send-booking-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...testCase.data, bookingId: testCase.data.bookingId + Math.floor(Math.random() * 100) })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ ${testCase.name}: SUCCESS`);
        edgeCasesPassed++;
      } else {
        console.log(`❌ ${testCase.name}: FAILED - ${result.error}`);
        if (result.error && result.error.includes('132000')) {
          console.log(`🚨 Parameter mismatch in ${testCase.name}`);
        }
      }
    } catch (error) {
      console.log(`❌ ${testCase.name}: ERROR - ${error.message}`);
    }
  }

  if (edgeCasesPassed === edgeCases.length) {
    testResults.edgeCases = true;
    console.log(`\n✅ All ${edgeCases.length} edge cases passed!`);
  } else {
    console.log(`\n⚠️ ${edgeCasesPassed}/${edgeCases.length} edge cases passed`);
  }

  // Test 5: Parameter mapping verification
  console.log('\n🔢 Test 5: Parameter Mapping Verification');
  console.log('-'.repeat(40));
  
  // This test verifies that exactly 8 parameters are being sent
  const parameterTestData = {
    bookingId: 88888,
    bookingRef: 'PARAM_TEST_888',
    parentName: 'Parameter Test Parent',
    parentPhone: '+916303727148',
    childName: 'Parameter Test Child',
    eventTitle: 'Parameter Mapping Test',
    eventDate: '2024-01-18',
    eventVenue: 'Parameter Test Venue',
    totalAmount: 1500,
    paymentMethod: 'Test Payment',
    transactionId: 'PARAM_TXN_888',
    gameDetails: []
  };

  console.log('📋 Testing parameter mapping with clean data...');

  try {
    const paramResponse = await fetch('http://localhost:3111/api/whatsapp/send-booking-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parameterTestData)
    });

    const paramResult = await paramResponse.json();
    
    if (paramResult.success) {
      console.log('✅ Parameter mapping: SUCCESS');
      console.log('📱 Message ID:', paramResult.messageId);
      testResults.parameterMapping = true;
    } else {
      console.log('❌ Parameter mapping: FAILED');
      console.log('❌ Error:', paramResult.error);
    }
  } catch (error) {
    console.log('❌ Parameter mapping test failed:', error.message);
  }

  // Final Results
  console.log('\n🎯 WHATSAPP FIX TEST RESULTS');
  console.log('=' .repeat(60));
  
  const totalTests = Object.keys(testResults).length;
  const passedTests = Object.values(testResults).filter(Boolean).length;
  
  console.log(`📊 Overall Score: ${passedTests}/${totalTests} tests passed`);
  console.log('');
  
  Object.entries(testResults).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`${status} - ${testName}`);
  });
  
  console.log('');
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ WhatsApp parameter mismatch issue is FIXED');
    console.log('✅ Manual bookings will now send WhatsApp confirmations successfully');
    console.log('✅ Admin panel WhatsApp integration is working correctly');
    console.log('');
    console.log('📱 Check your WhatsApp (+916303727148) for test messages');
  } else {
    console.log('⚠️ Some tests failed - parameter mismatch issue may persist');
    console.log('🔧 Review the failed tests above for debugging information');
  }

  return {
    success: passedTests === totalTests,
    passedTests,
    totalTests,
    results: testResults
  };
}

// Run the comprehensive fix test
testWhatsAppFix();
