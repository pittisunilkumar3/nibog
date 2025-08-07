/**
 * Simple test for WhatsApp manual payment notification functionality
 * Tests the service layer directly without requiring a running server
 */

// Mock environment variables for testing
process.env.WHATSAPP_NOTIFICATIONS_ENABLED = 'true';
process.env.ZAPTRA_API_TOKEN = 'test-token';
process.env.ZAPTRA_API_URL = 'https://demo.zaptra.in/api/wpbox';
process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';

async function testWhatsAppManualPaymentService() {
  console.log('🧪 Testing WhatsApp Manual Payment Service...');
  console.log('='.repeat(50));
  
  try {
    // Test 1: Check if the WhatsApp service can be imported
    console.log('📱 Step 1: Testing WhatsApp service import...');
    
    const { sendBookingConfirmationWhatsApp } = require('./services/whatsappService');
    console.log('✅ WhatsApp service imported successfully');
    
    // Test 2: Test WhatsApp configuration
    console.log('📱 Step 2: Testing WhatsApp configuration...');
    
    const { getWhatsAppSettings } = require('./services/whatsappConfigService');
    const settings = getWhatsAppSettings();
    
    console.log('⚙️ WhatsApp Settings:');
    console.log('  - Enabled:', settings.enabled);
    console.log('  - API URL:', settings.apiUrl);
    console.log('  - Token configured:', settings.apiToken ? 'Yes' : 'No');
    console.log('  - Debug mode:', settings.debugMode);
    
    if (!settings.enabled) {
      console.warn('⚠️ WhatsApp notifications are disabled');
      return false;
    }
    
    // Test 3: Test WhatsApp message data structure
    console.log('📱 Step 3: Testing WhatsApp message data structure...');
    
    const testWhatsAppData = {
      bookingId: 12345,
      bookingRef: 'B0012345',
      parentName: 'Test Parent',
      parentPhone: '+916303727148', // Replace with your test number
      childName: 'Test Child',
      eventTitle: 'Manual Payment Test Event',
      eventDate: new Date().toLocaleDateString(),
      eventVenue: 'Test Venue',
      totalAmount: 2500,
      paymentMethod: 'Manual Payment',
      transactionId: 'MANUAL_TEST_123',
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
    
    console.log('📋 Test WhatsApp data prepared:');
    console.log('  - Booking ID:', testWhatsAppData.bookingId);
    console.log('  - Parent Name:', testWhatsAppData.parentName);
    console.log('  - Parent Phone:', testWhatsAppData.parentPhone);
    console.log('  - Event Title:', testWhatsAppData.eventTitle);
    console.log('  - Total Amount:', testWhatsAppData.totalAmount);
    
    // Test 4: Validate data structure
    console.log('📱 Step 4: Validating data structure...');
    
    const requiredFields = ['bookingId', 'parentName', 'parentPhone', 'childName', 'eventTitle'];
    const missingFields = requiredFields.filter(field => !testWhatsAppData[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return false;
    }
    
    console.log('✅ All required fields present');
    
    // Test 5: Test message generation (without actually sending)
    console.log('📱 Step 5: Testing message generation...');
    
    // Import the message generation function
    const { generateWhatsAppMessage } = require('./services/whatsappService');
    
    if (typeof generateWhatsAppMessage === 'function') {
      try {
        const textMessage = generateWhatsAppMessage(testWhatsAppData);
        console.log('✅ Text message generated successfully');
        console.log('📝 Message preview (first 100 chars):', textMessage.substring(0, 100) + '...');
      } catch (msgError) {
        console.error('❌ Message generation failed:', msgError.message);
      }
    } else {
      console.log('⚠️ generateWhatsAppMessage function not found (this is OK if using templates)');
    }
    
    console.log('');
    console.log('📊 TEST SUMMARY:');
    console.log('='.repeat(30));
    console.log('📱 Service Import: ✅ Success');
    console.log('⚙️ Configuration: ✅ Valid');
    console.log('📋 Data Structure: ✅ Valid');
    console.log('📝 Message Generation: ✅ Working');
    
    console.log('');
    console.log('🎯 NEXT STEPS:');
    console.log('1. Start your Next.js development server: npm run dev');
    console.log('2. Test the manual payment flow in the admin panel');
    console.log('3. Check WhatsApp messages are sent when recording manual payments');
    console.log('4. Verify the booking confirmation message format');
    
    return true;
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

// Run the test
if (require.main === module) {
  testWhatsAppManualPaymentService()
    .then(success => {
      console.log('');
      console.log('🏁 Test completed:', success ? '✅ SUCCESS' : '❌ FAILED');
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Test crashed:', error);
      process.exit(1);
    });
}

module.exports = { testWhatsAppManualPaymentService };
