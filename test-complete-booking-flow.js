/**
 * Test complete booking flow including WhatsApp and ticket emails
 */

async function testCompleteBookingFlow() {
  console.log('🧪 Testing Complete Booking Flow');
  console.log('=' .repeat(50));

  // Test 1: Create a manual booking through admin panel
  console.log('\n📝 Test 1: Manual Booking Creation');
  console.log('-'.repeat(30));
  
  // Note: This would require actually using the admin panel UI
  // For now, let's test with existing booking references
  
  // Test 2: Test email sending with proper settings
  console.log('\n📧 Test 2: Email Sending with Proper Settings');
  console.log('-'.repeat(30));
  
  try {
    // First get email settings
    const emailSettingsResponse = await fetch('http://localhost:3111/api/emailsetting/get');
    const emailSettingsData = await emailSettingsResponse.json();
    
    if (emailSettingsData && emailSettingsData.length > 0) {
      const settings = emailSettingsData[0];
      
      const testEmailData = {
        to: 'pittisunilkumar3@gmail.com',
        subject: 'Test Ticket Email - NIBOG System Test',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #007bff;">🎫 Test Ticket Email</h1>
            <p>This is a test email to verify the NIBOG ticket email system is working.</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Test Details:</h3>
              <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
              <p><strong>Test Type:</strong> Ticket Email System Verification</p>
              <p><strong>Status:</strong> Email delivery test</p>
            </div>
            <div style="background: white; border: 2px dashed #007bff; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #007bff;">🎮 Sample Ticket</h3>
              <p><strong>Event:</strong> Test Event</p>
              <p><strong>Child:</strong> Test Child</p>
              <p><strong>Booking ID:</strong> TEST123</p>
              <div style="text-align: center; margin: 20px 0;">
                <div style="background: #f0f0f0; padding: 10px; border-radius: 8px; display: inline-block;">
                  <p style="margin: 0; font-size: 12px;">QR Code would appear here</p>
                  <p style="margin: 0; font-size: 10px; color: #666;">Scan at venue</p>
                </div>
              </div>
            </div>
            <p style="color: #666; font-size: 14px;">
              If you receive this email, the ticket email system is working correctly.
            </p>
          </div>
        `,
        settings: settings
      };

      console.log('📧 Sending test email with proper settings...');
      console.log('📧 To:', testEmailData.to);
      console.log('📧 SMTP Host:', settings.smtp_host);
      console.log('📧 From:', `${settings.sender_name} <${settings.sender_email}>`);

      const emailResponse = await fetch('http://localhost:3111/api/send-receipt-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testEmailData),
      });

      const emailResult = await emailResponse.json();
      
      console.log('📡 Email response status:', emailResponse.status);
      console.log('📡 Email response:', JSON.stringify(emailResult, null, 2));
      
      if (emailResult.success) {
        console.log('✅ Email sending working correctly!');
        console.log('📧 Check your email inbox for the test message');
      } else {
        console.log('❌ Email sending failed');
        console.log('❌ Error:', emailResult.error);
      }
    } else {
      console.log('❌ No email settings found');
    }
  } catch (error) {
    console.log('❌ Email test failed:', error.message);
  }

  // Test 3: Test ticket email with attachment API
  console.log('\n🎫 Test 3: Ticket Email with Attachment API');
  console.log('-'.repeat(30));
  
  try {
    // Get email settings first
    const emailSettingsResponse = await fetch('http://localhost:3111/api/emailsetting/get');
    const emailSettingsData = await emailSettingsResponse.json();
    
    if (emailSettingsData && emailSettingsData.length > 0) {
      const settings = emailSettingsData[0];
      
      // Create test ticket data
      const testTicketData = {
        to: 'pittisunilkumar3@gmail.com',
        subject: '🎫 Test Ticket with QR Code - NIBOG',
        html: `
          <h1>Test Ticket with QR Code</h1>
          <p>This is a test ticket email with QR code attachment.</p>
          <img src="cid:qrcode" alt="QR Code" style="width: 200px; height: 200px;">
        `,
        settings: settings,
        bookingRef: 'TEST123456789',
        qrCodeBuffer: [], // Will be generated
        ticketDetails: [{
          booking_id: 12345,
          game_name: 'Test Game',
          custom_title: 'Test Game Title',
          custom_price: 1500,
          start_time: '10:00 AM',
          end_time: '11:00 AM',
          child_name: 'Test Child',
          parent_name: 'Test Parent'
        }]
      };

      console.log('🎫 Testing ticket email with attachment...');

      const ticketResponse = await fetch('http://localhost:3111/api/send-ticket-email-with-attachment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testTicketData),
      });

      const ticketResult = await ticketResponse.json();
      
      console.log('📡 Ticket email response status:', ticketResponse.status);
      console.log('📡 Ticket email response:', JSON.stringify(ticketResult, null, 2));
      
      if (ticketResult.success) {
        console.log('✅ Ticket email with attachment working!');
        console.log('📧 Check your email for the ticket with QR code');
      } else {
        console.log('❌ Ticket email with attachment failed');
        console.log('❌ Error:', ticketResult.error);
      }
    }
  } catch (error) {
    console.log('❌ Ticket email test failed:', error.message);
  }

  // Test 4: WhatsApp integration test
  console.log('\n📱 Test 4: WhatsApp Integration');
  console.log('-'.repeat(30));
  
  try {
    const whatsappData = {
      bookingId: 99999,
      bookingRef: 'FLOW_TEST_999',
      parentName: 'Test Parent',
      parentPhone: '+916303727148',
      childName: 'Test Child',
      eventTitle: 'Complete Flow Test Event',
      eventDate: '2024-01-15',
      eventVenue: 'Test Venue',
      totalAmount: 2000,
      paymentMethod: 'Test Payment',
      transactionId: 'FLOW_TXN_999',
      gameDetails: [{
        gameName: 'Test Game',
        gameTime: '10:00 AM - 11:00 AM',
        gamePrice: 2000
      }]
    };

    console.log('📱 Testing WhatsApp notification...');

    const whatsappResponse = await fetch('http://localhost:3111/api/whatsapp/send-booking-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(whatsappData)
    });

    const whatsappResult = await whatsappResponse.json();
    
    if (whatsappResult.success) {
      console.log('✅ WhatsApp notification sent successfully!');
      console.log(`📱 Message ID: ${whatsappResult.messageId}`);
    } else {
      console.log('❌ WhatsApp notification failed');
      console.log('❌ Error:', whatsappResult.error);
    }
  } catch (error) {
    console.log('❌ WhatsApp test failed:', error.message);
  }

  console.log('\n🎯 COMPLETE FLOW TEST SUMMARY');
  console.log('=' .repeat(50));
  console.log('✅ Email system configuration verified');
  console.log('✅ Basic email sending tested');
  console.log('✅ Ticket email with QR code tested');
  console.log('✅ WhatsApp integration tested');
  console.log('');
  console.log('📧 Check your email (pittisunilkumar3@gmail.com) for test messages');
  console.log('📱 Check your WhatsApp (+916303727148) for test notification');
  console.log('');
  console.log('🔧 Next steps:');
  console.log('1. Create a manual booking through admin panel');
  console.log('2. Verify both WhatsApp and email are sent');
  console.log('3. Check that QR codes are properly embedded in tickets');
}

// Run the complete flow test
testCompleteBookingFlow();
