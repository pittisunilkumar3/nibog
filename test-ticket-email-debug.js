/**
 * Debug ticket email delivery issues
 */

async function debugTicketEmailDelivery() {
  console.log('🧪 Debugging Ticket Email Delivery');
  console.log('=' .repeat(50));

  // Test 1: Check email settings
  console.log('\n📧 Test 1: Email Settings Check');
  console.log('-'.repeat(30));
  
  try {
    const emailSettingsResponse = await fetch('http://localhost:3111/api/emailsetting/get');
    const emailSettings = await emailSettingsResponse.json();
    
    console.log('📡 Email settings response status:', emailSettingsResponse.status);
    console.log('📡 Email settings:', JSON.stringify(emailSettings, null, 2));
    
    if (emailSettings && emailSettings.length > 0) {
      const settings = emailSettings[0];
      console.log('✅ Email settings found');
      console.log('📧 SMTP Host:', settings.smtp_host);
      console.log('📧 SMTP Port:', settings.smtp_port);
      console.log('📧 From Email:', settings.from_email);
      console.log('📧 From Name:', settings.from_name);
    } else {
      console.log('❌ No email settings found');
    }
  } catch (error) {
    console.log('❌ Email settings test failed:', error.message);
  }

  // Test 2: Test ticket email API endpoint
  console.log('\n🎫 Test 2: Ticket Email API Endpoint');
  console.log('-'.repeat(30));
  
  try {
    // Test with a real booking reference (you might need to create one first)
    const testBookingRef = 'MAN250806976'; // Use a recent booking reference
    
    console.log('📋 Testing with booking reference:', testBookingRef);
    
    const ticketResponse = await fetch('http://localhost:3111/api/send-ticket-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingRef: testBookingRef,
        bookingId: 288
      }),
    });

    const ticketResult = await ticketResponse.json();
    
    console.log('📡 Ticket API response status:', ticketResponse.status);
    console.log('📡 Ticket API response:', JSON.stringify(ticketResult, null, 2));
    
    if (ticketResult.success) {
      console.log('✅ Ticket email API working');
    } else {
      console.log('❌ Ticket email API failed');
      console.log('❌ Error:', ticketResult.error);
    }
  } catch (error) {
    console.log('❌ Ticket email API test failed:', error.message);
  }

  // Test 3: Test ticket details retrieval
  console.log('\n🎫 Test 3: Ticket Details Retrieval');
  console.log('-'.repeat(30));
  
  try {
    const testBookingRef = 'MAN250806976';
    
    const ticketDetailsResponse = await fetch(`http://localhost:3111/api/booking/ticket-details?bookingRef=${testBookingRef}`);
    const ticketDetails = await ticketDetailsResponse.json();
    
    console.log('📡 Ticket details response status:', ticketDetailsResponse.status);
    console.log('📡 Ticket details:', JSON.stringify(ticketDetails, null, 2));
    
    if (ticketDetails && ticketDetails.length > 0) {
      console.log('✅ Ticket details found');
      console.log('📋 Number of tickets:', ticketDetails.length);
      console.log('📋 First ticket:', {
        booking_ref: ticketDetails[0].booking_ref,
        child_name: ticketDetails[0].child_name,
        parent_email: ticketDetails[0].parent_email,
        event_title: ticketDetails[0].event_title
      });
    } else {
      console.log('❌ No ticket details found');
    }
  } catch (error) {
    console.log('❌ Ticket details test failed:', error.message);
  }

  // Test 4: Test email sending directly
  console.log('\n📧 Test 4: Direct Email Sending Test');
  console.log('-'.repeat(30));
  
  try {
    const testEmailData = {
      to: 'pittisunilkumar3@gmail.com',
      subject: 'Test Ticket Email - NIBOG',
      html: `
        <h1>Test Ticket Email</h1>
        <p>This is a test email to verify email delivery is working.</p>
        <p>If you receive this, the email system is functional.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
      settings: null // Will be fetched by the API
    };

    const emailResponse = await fetch('http://localhost:3111/api/send-receipt-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEmailData),
    });

    const emailResult = await emailResponse.json();
    
    console.log('📡 Email API response status:', emailResponse.status);
    console.log('📡 Email API response:', JSON.stringify(emailResult, null, 2));
    
    if (emailResult.success) {
      console.log('✅ Direct email sending working');
      console.log('📧 Check your email for the test message');
    } else {
      console.log('❌ Direct email sending failed');
      console.log('❌ Error:', emailResult.error);
    }
  } catch (error) {
    console.log('❌ Direct email test failed:', error.message);
  }

  // Test 5: Test QR code generation
  console.log('\n🔲 Test 5: QR Code Generation Test');
  console.log('-'.repeat(30));
  
  try {
    const QRCode = require('qrcode');
    
    const testQRData = JSON.stringify({
      ref: 'TEST123456789',
      id: 12345,
      name: 'Test Child',
      game: 'Test Event',
      slot_id: 1
    });

    console.log('📋 QR code data:', testQRData);
    
    // Test browser-compatible QR code generation
    const qrCodeDataURL = await QRCode.toDataURL(testQRData, {
      width: 200,
      margin: 2,
      errorCorrectionLevel: 'M'
    });
    
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    console.log('✅ QR code generation working');
    console.log('📏 QR code buffer size:', buffer.length, 'bytes');
    
  } catch (error) {
    console.log('❌ QR code generation failed:', error.message);
  }

  console.log('\n📝 DEBUGGING SUMMARY:');
  console.log('1. Check if email settings are configured properly');
  console.log('2. Verify ticket details exist in database for the booking');
  console.log('3. Test if email sending service is working');
  console.log('4. Check if QR code generation is functional');
  console.log('5. Look for any errors in the ticket email service logs');
  
  console.log('\n🔧 TROUBLESHOOTING STEPS:');
  console.log('- Ensure SMTP settings are correct in email configuration');
  console.log('- Check if booking exists and has associated ticket details');
  console.log('- Verify email service is not blocked by firewall/antivirus');
  console.log('- Check spam/junk folder for ticket emails');
  console.log('- Review server logs for detailed error messages');
}

// Run the debug test
debugTicketEmailDelivery();
