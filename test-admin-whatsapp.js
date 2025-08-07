/**
 * Test script for Admin Panel WhatsApp Integration
 * Tests the WhatsApp confirmation functionality in admin manual booking
 */

const BASE_URL = 'http://localhost:3111';

// Test data for admin manual booking WhatsApp confirmation
const adminBookingTestData = {
  bookingId: 99999,
  bookingRef: 'ADMIN_TEST_001',
  parentName: 'Admin Test Parent',
  parentPhone: '+916303727148', // Test phone number
  childName: 'Admin Test Child',
  eventTitle: 'Admin Manual Booking Test Event',
  eventDate: '2024-01-15',
  eventVenue: 'Test Venue - Admin Panel',
  totalAmount: 2500,
  paymentMethod: 'Cash payment',
  transactionId: 'ADMIN_TXN_001',
  gameDetails: [{
    gameName: 'Test Game - Admin',
    gameTime: '10:00 AM - 11:00 AM',
    gamePrice: 2500
  }],
  addOns: [{
    name: 'Test Add-on',
    quantity: 1,
    price: 200
  }]
};

async function testWhatsAppHealth() {
  console.log('\n🏥 Testing WhatsApp Health Check...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/whatsapp/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();
    
    if (response.ok && result.healthy) {
      console.log('✅ WhatsApp Health Check - PASSED');
      console.log('📱 Configuration:', {
        enabled: result.settings.enabled,
        apiUrl: result.settings.apiUrl,
        debugMode: result.settings.debugMode
      });
      return true;
    } else {
      console.log('❌ WhatsApp Health Check - FAILED');
      console.log('❌ Error:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return false;
  }
}

async function testWhatsAppTemplates() {
  console.log('\n📋 Testing WhatsApp Templates...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/whatsapp/templates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ WhatsApp Templates - AVAILABLE');
      console.log('📋 Templates count:', result.templates?.length || 0);
      if (result.templates && result.templates.length > 0) {
        console.log('📋 Available templates:', result.templates.map(t => t.name || t.template_name).join(', '));
      }
      return true;
    } else {
      console.log('❌ WhatsApp Templates - FAILED');
      console.log('❌ Error:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Templates test failed:', error.message);
    return false;
  }
}

async function testAdminWhatsAppConfirmation() {
  console.log('\n📱 Testing Admin Panel WhatsApp Confirmation...');
  console.log('👤 Parent:', adminBookingTestData.parentName);
  console.log('👶 Child:', adminBookingTestData.childName);
  console.log('📞 Phone:', adminBookingTestData.parentPhone);
  console.log('🎮 Event:', adminBookingTestData.eventTitle);
  console.log('💰 Amount:', adminBookingTestData.totalAmount);
  console.log('💳 Payment:', adminBookingTestData.paymentMethod);
  
  try {
    const response = await fetch(`${BASE_URL}/api/whatsapp/send-booking-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminBookingTestData),
    });

    const result = await response.json();
    
    console.log('📡 API Response Status:', response.status);
    console.log('📡 API Response:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.success) {
      console.log('✅ Admin WhatsApp Confirmation - SUCCESS!');
      console.log('📱 Message ID:', result.messageId);
      console.log('📱 Check your WhatsApp for the admin booking confirmation');
      return true;
    } else {
      console.log('❌ Admin WhatsApp Confirmation - FAILED');
      console.log('❌ Error:', result.error);
      if (result.zaptraResponse) {
        console.log('❌ Zaptra Response:', JSON.stringify(result.zaptraResponse, null, 2));
      }
      return false;
    }
  } catch (error) {
    console.log('❌ Admin WhatsApp test failed:', error.message);
    return false;
  }
}

async function compareWithFrontendData() {
  console.log('\n🔄 Comparing with Frontend Booking Data Format...');
  
  // Frontend-style data format for comparison
  const frontendStyleData = {
    bookingId: 88888,
    bookingRef: 'FRONTEND_TEST_001',
    parentName: 'Frontend Test Parent',
    parentPhone: '+916303727148',
    childName: 'Frontend Test Child',
    eventTitle: 'Frontend Style Test Event',
    eventDate: '2024-01-15',
    eventVenue: 'Test Venue - Frontend',
    totalAmount: 3000,
    paymentMethod: 'PhonePe',
    transactionId: 'FRONTEND_TXN_001',
    gameDetails: [{
      gameName: 'Frontend Test Game',
      gameTime: '2:00 PM - 3:00 PM',
      gamePrice: 3000
    }]
  };
  
  try {
    const response = await fetch(`${BASE_URL}/api/whatsapp/send-booking-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(frontendStyleData),
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Frontend Style Data - SUCCESS');
      console.log('📱 Message ID:', result.messageId);
      return true;
    } else {
      console.log('❌ Frontend Style Data - FAILED');
      console.log('❌ Error:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Frontend comparison test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 ADMIN PANEL WHATSAPP INTEGRATION TEST SUITE');
  console.log('================================================');
  
  const results = {
    healthCheck: false,
    templates: false,
    adminConfirmation: false,
    frontendComparison: false
  };
  
  // Run all tests
  results.healthCheck = await testWhatsAppHealth();
  results.templates = await testWhatsAppTemplates();
  results.adminConfirmation = await testAdminWhatsAppConfirmation();
  results.frontendComparison = await compareWithFrontendData();
  
  // Summary
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('========================');
  console.log(`🏥 Health Check: ${results.healthCheck ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📋 Templates: ${results.templates ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📱 Admin Confirmation: ${results.adminConfirmation ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🔄 Frontend Comparison: ${results.frontendComparison ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall Score: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! Admin WhatsApp integration is working perfectly!');
  } else {
    console.log('⚠️ Some tests failed. Check the logs above for details.');
  }
  
  return results;
}

// Run the tests
runAllTests().catch(console.error);
