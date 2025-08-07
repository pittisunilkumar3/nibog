/**
 * Test script for WhatsApp #132000 error fix
 * This script tests the enhanced error handling and fallback mechanisms
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3111';

async function testWhatsApp132000Fix() {
  console.log('🧪 TESTING WHATSAPP #132000 ERROR FIX');
  console.log('='.repeat(60));
  
  // Test 1: Environment Configuration Verification
  console.log('⚙️ Test 1: Environment Configuration');
  console.log('-'.repeat(40));
  
  const envConfig = {
    WHATSAPP_NOTIFICATIONS_ENABLED: process.env.WHATSAPP_NOTIFICATIONS_ENABLED,
    WHATSAPP_USE_TEMPLATES: process.env.WHATSAPP_USE_TEMPLATES,
    WHATSAPP_DEBUG: process.env.WHATSAPP_DEBUG,
    ZAPTRA_API_TOKEN: process.env.ZAPTRA_API_TOKEN ? '***SET***' : 'NOT_SET'
  };
  
  console.log('📋 Current Configuration:');
  Object.entries(envConfig).forEach(([key, value]) => {
    const status = key === 'ZAPTRA_API_TOKEN' ? value : (value === 'true' ? '✅ ENABLED' : '❌ DISABLED');
    console.log(`   ${key}: ${status}`);
  });
  
  // Test 2: Template Structure Verification
  console.log('\n📋 Test 2: Template Structure Verification');
  console.log('-'.repeat(40));
  
  try {
    const templatesResponse = await fetch(`${BASE_URL}/api/whatsapp/templates`);
    
    if (!templatesResponse.ok) {
      console.log('❌ Templates API not accessible - server may not be running');
      console.log('   Start server with: npm run dev');
      return false;
    }
    
    const templatesData = await templatesResponse.json();
    
    if (templatesData.success) {
      const bookingTemplate = templatesData.templates.find(t => t.name === 'booking_confirmation_latest');
      
      if (bookingTemplate) {
        console.log('✅ booking_confirmation_latest template found');
        
        const components = JSON.parse(bookingTemplate.components);
        const bodyComponent = components.find(c => c.type === 'BODY');
        
        if (bodyComponent) {
          const parameters = bodyComponent.text.match(/\{\{\d+\}\}/g) || [];
          console.log(`📋 Template expects ${parameters.length} parameters:`, parameters);
          
          if (parameters.length === 8) {
            console.log('✅ Template parameter count matches service expectation (8)');
          } else {
            console.log('🚨 TEMPLATE MISMATCH!');
            console.log(`   Service sends: 8 parameters`);
            console.log(`   Template expects: ${parameters.length} parameters`);
          }
        }
      } else {
        console.log('❌ booking_confirmation_latest template not found');
      }
    } else {
      console.log('❌ Failed to fetch templates:', templatesData.error);
    }
  } catch (error) {
    console.log('❌ Template verification failed:', error.message);
  }
  
  // Test 3: Manual Payment WhatsApp Data Test
  console.log('\n📱 Test 3: Manual Payment WhatsApp Integration');
  console.log('-'.repeat(40));
  
  const testWhatsAppData = {
    bookingId: 99999,
    bookingRef: 'TEST_B99999',
    parentName: 'Test Parent',
    parentPhone: '+916303727148', // Replace with your test number
    childName: 'Test Child',
    eventTitle: '#132000 Fix Test Event',
    eventDate: new Date().toLocaleDateString(),
    eventVenue: 'Test Venue',
    totalAmount: 2500,
    paymentMethod: 'Manual Payment',
    transactionId: 'FIX_TEST_' + Date.now(),
    gameDetails: [{
      gameName: 'Test Game',
      gameTime: '10:00 AM - 11:00 AM',
      gamePrice: 2000
    }],
    addOns: [{
      name: 'Test Add-on',
      quantity: 1,
      price: 500
    }]
  };
  
  console.log('📋 Test Data Prepared:');
  console.log('   Booking ID:', testWhatsAppData.bookingId);
  console.log('   Parent Name:', testWhatsAppData.parentName);
  console.log('   Phone:', testWhatsAppData.parentPhone);
  console.log('   Event:', testWhatsAppData.eventTitle);
  console.log('   Amount:', testWhatsAppData.totalAmount);
  
  try {
    console.log('\n📱 Sending WhatsApp test message...');
    
    const whatsappResponse = await fetch(`${BASE_URL}/api/whatsapp/send-booking-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testWhatsAppData),
    });
    
    console.log('📡 Response Status:', whatsappResponse.status);
    
    const whatsappResult = await whatsappResponse.json();
    console.log('📡 Response Data:', JSON.stringify(whatsappResult, null, 2));
    
    if (whatsappResult.success) {
      console.log('✅ WhatsApp message sent successfully!');
      console.log('📱 Message ID:', whatsappResult.messageId);
      console.log('🎉 #132000 error fix is working!');
      return true;
    } else {
      console.log('❌ WhatsApp message failed');
      console.log('❌ Error:', whatsappResult.error);
      
      if (whatsappResult.error && whatsappResult.error.includes('132000')) {
        console.log('\n🚨 #132000 ERROR STILL OCCURRING!');
        console.log('📋 This indicates the fix needs further refinement');
        console.log('📋 Check server logs for detailed parameter information');
        
        if (whatsappResult.zaptraResponse) {
          console.log('📋 Zaptra Response:', JSON.stringify(whatsappResult.zaptraResponse, null, 2));
        }
      } else {
        console.log('✅ No #132000 error detected - different issue');
      }
      
      return false;
    }
  } catch (error) {
    console.log('❌ WhatsApp test failed with error:', error.message);
    return false;
  }
}

async function testManualPaymentAPI() {
  console.log('\n💳 Test 4: Manual Payment API Integration');
  console.log('-'.repeat(40));
  
  const testPaymentData = {
    booking_id: 99999, // Use a test booking ID
    amount: 2500,
    payment_method: 'Cash payment',
    payment_status: 'successful',
    transaction_id: 'FIX_TEST_' + Date.now(),
    admin_notes: 'Test payment for #132000 fix verification'
  };
  
  console.log('📋 Test Payment Data:');
  console.log('   Booking ID:', testPaymentData.booking_id);
  console.log('   Amount:', testPaymentData.amount);
  console.log('   Method:', testPaymentData.payment_method);
  console.log('   Status:', testPaymentData.payment_status);
  
  try {
    console.log('\n💳 Creating manual payment (this should trigger WhatsApp)...');
    
    const paymentResponse = await fetch(`${BASE_URL}/api/payments/manual/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPaymentData),
    });
    
    console.log('📡 Payment API Status:', paymentResponse.status);
    
    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      console.log('❌ Payment API failed:', errorText);
      return false;
    }
    
    const paymentResult = await paymentResponse.json();
    console.log('📡 Payment Result:', JSON.stringify(paymentResult, null, 2));
    
    if (paymentResult.success) {
      console.log('✅ Manual payment created successfully');
      console.log('📱 WhatsApp notification should have been sent automatically');
      console.log('💳 Payment ID:', paymentResult.payment_id);
      return true;
    } else {
      console.log('❌ Manual payment creation failed:', paymentResult.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Manual payment test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 STARTING COMPREHENSIVE WHATSAPP FIX TESTS');
  console.log('='.repeat(70));
  
  const results = {
    whatsappDirect: false,
    manualPayment: false
  };
  
  // Test WhatsApp directly
  results.whatsappDirect = await testWhatsApp132000Fix();
  
  // Test manual payment integration
  results.manualPayment = await testManualPaymentAPI();
  
  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('='.repeat(30));
  console.log('Direct WhatsApp Test:', results.whatsappDirect ? '✅ PASSED' : '❌ FAILED');
  console.log('Manual Payment Test:', results.manualPayment ? '✅ PASSED' : '❌ FAILED');
  
  const overallSuccess = results.whatsappDirect && results.manualPayment;
  console.log('Overall Result:', overallSuccess ? '🎉 ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED');
  
  if (!overallSuccess) {
    console.log('\n🔧 TROUBLESHOOTING STEPS:');
    console.log('1. Check server logs for detailed error information');
    console.log('2. Verify environment variables are set correctly');
    console.log('3. Ensure Zaptra API token is valid and active');
    console.log('4. Check template structure in Zaptra dashboard');
    console.log('5. Test with a real booking ID that exists in the system');
  }
  
  return overallSuccess;
}

// Run tests if called directly
if (require.main === module) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Test suite crashed:', error);
      process.exit(1);
    });
}

module.exports = { testWhatsApp132000Fix, testManualPaymentAPI, runAllTests };
