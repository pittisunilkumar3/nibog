/**
 * Test WhatsApp integration for manual payment confirmations
 * This script tests the complete flow of manual payment recording and WhatsApp notifications
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function testManualPaymentWhatsAppIntegration() {
  console.log('🧪 Testing Manual Payment WhatsApp Integration...');
  console.log('='.repeat(60));
  
  // Test data - replace with actual booking ID from your system
  const testBookingId = 12345; // Replace with a real booking ID
  const testManualPaymentData = {
    booking_id: testBookingId,
    amount: 2500,
    payment_method: 'Cash payment',
    payment_status: 'successful',
    payment_date: new Date().toISOString(),
    transaction_id: `MANUAL_TEST_${Date.now()}`,
    admin_notes: 'Test manual payment for WhatsApp integration',
    reference_number: 'TEST_REF_001'
  };

  console.log('📋 Test Manual Payment Data:');
  console.log(JSON.stringify(testManualPaymentData, null, 2));
  console.log('');

  try {
    // Step 1: Test manual payment creation (which should trigger WhatsApp)
    console.log('💳 Step 1: Creating manual payment record...');
    
    const paymentResponse = await fetch(`${BASE_URL}/api/payments/manual/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testManualPaymentData),
    });

    if (!paymentResponse.ok) {
      console.error('❌ Manual payment creation failed:', paymentResponse.status);
      const errorText = await paymentResponse.text();
      console.error('Error details:', errorText);
      return false;
    }

    const paymentResult = await paymentResponse.json();
    console.log('✅ Manual payment created successfully');
    console.log('📋 Payment result:', paymentResult);
    
    if (paymentResult.success) {
      console.log('💳 Payment ID:', paymentResult.payment_id);
      console.log('📱 WhatsApp notification should have been sent automatically');
    }

    console.log('');

    // Step 2: Test direct WhatsApp API with booking data
    console.log('📱 Step 2: Testing direct WhatsApp API call...');
    
    const whatsappTestData = {
      bookingId: testBookingId,
      bookingRef: `B${String(testBookingId).padStart(7, '0')}`,
      parentName: 'Test Parent',
      parentPhone: '+916303727148', // Replace with your test phone number
      childName: 'Test Child',
      eventTitle: 'Manual Payment Test Event',
      eventDate: new Date().toLocaleDateString(),
      eventVenue: 'Test Venue',
      totalAmount: testManualPaymentData.amount,
      paymentMethod: 'Manual Payment',
      transactionId: testManualPaymentData.transaction_id,
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

    const whatsappResponse = await fetch(`${BASE_URL}/api/whatsapp/send-booking-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(whatsappTestData),
    });

    const whatsappResult = await whatsappResponse.json();
    
    if (whatsappResponse.ok && whatsappResult.success) {
      console.log('✅ Direct WhatsApp API test - SUCCESS!');
      console.log('📨 Message ID:', whatsappResult.messageId);
      console.log('📱 Check your WhatsApp for the test message');
    } else {
      console.error('❌ Direct WhatsApp API test - FAILED');
      console.error('Error:', whatsappResult.error);
      if (whatsappResult.zaptraResponse) {
        console.error('Zaptra Response:', JSON.stringify(whatsappResult.zaptraResponse, null, 2));
      }
    }

    console.log('');

    // Step 3: Verify WhatsApp settings
    console.log('⚙️ Step 3: Checking WhatsApp configuration...');
    
    const whatsappEnabled = process.env.WHATSAPP_NOTIFICATIONS_ENABLED === 'true';
    const zaptraToken = process.env.ZAPTRA_API_TOKEN ? '***SET***' : 'NOT_SET';
    const zaptraUrl = process.env.ZAPTRA_API_URL || 'DEFAULT';
    
    console.log('📱 WhatsApp Enabled:', whatsappEnabled);
    console.log('🔑 Zaptra Token:', zaptraToken);
    console.log('🌐 Zaptra URL:', zaptraUrl);
    
    if (!whatsappEnabled) {
      console.warn('⚠️ WhatsApp notifications are disabled. Set WHATSAPP_NOTIFICATIONS_ENABLED=true');
    }
    
    if (zaptraToken === 'NOT_SET') {
      console.warn('⚠️ Zaptra API token not configured. Set ZAPTRA_API_TOKEN in environment');
    }

    console.log('');
    console.log('📊 TEST SUMMARY:');
    console.log('='.repeat(40));
    console.log('💳 Manual Payment Creation:', paymentResult.success ? '✅ Success' : '❌ Failed');
    console.log('📱 WhatsApp API Test:', whatsappResult.success ? '✅ Success' : '❌ Failed');
    console.log('⚙️ WhatsApp Configuration:', whatsappEnabled && zaptraToken !== 'NOT_SET' ? '✅ OK' : '⚠️ Issues');
    
    return paymentResult.success && whatsappResult.success;

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

// Run the test
if (require.main === module) {
  testManualPaymentWhatsAppIntegration()
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

module.exports = { testManualPaymentWhatsAppIntegration };
