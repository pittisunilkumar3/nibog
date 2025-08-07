/**
 * Test QR code generation for PDF tickets
 */

const QRCode = require('qrcode');
const fs = require('fs');

async function testQRCodeGeneration() {
  console.log('🧪 Testing QR code generation...');
  
  // Test data similar to what would be used in tickets
  const testQRData = JSON.stringify({
    ref: 'PPT123456789',
    id: 12345,
    name: 'Test Child',
    game: 'Birthday Party Celebration',
    slot: 'Morning Session'
  });

  console.log('📋 QR code data:', testQRData);

  try {
    // Test 1: Generate QR code as buffer (for PDF)
    console.log('🔄 Testing QR code buffer generation...');
    const qrCodeBuffer = await QRCode.toBuffer(testQRData, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    
    console.log('✅ QR code buffer generated successfully');
    console.log(`📏 Buffer size: ${qrCodeBuffer.length} bytes`);
    
    // Save buffer to file for verification
    fs.writeFileSync('test-qr-buffer.png', qrCodeBuffer);
    console.log('💾 QR code buffer saved as test-qr-buffer.png');

    // Test 2: Generate QR code as data URL (for web display)
    console.log('🔄 Testing QR code data URL generation...');
    const qrCodeDataURL = await QRCode.toDataURL(testQRData, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    
    console.log('✅ QR code data URL generated successfully');
    console.log(`📏 Data URL length: ${qrCodeDataURL.length} characters`);
    console.log(`🔗 Data URL preview: ${qrCodeDataURL.substring(0, 100)}...`);

    // Test 3: Test with simpler data
    console.log('🔄 Testing with simpler QR data...');
    const simpleData = 'NIBOG-TEST-12345';
    const simpleQRBuffer = await QRCode.toBuffer(simpleData, {
      width: 200,
      margin: 2,
      errorCorrectionLevel: 'L'
    });
    
    console.log('✅ Simple QR code generated successfully');
    console.log(`📏 Simple buffer size: ${simpleQRBuffer.length} bytes`);
    
    fs.writeFileSync('test-qr-simple.png', simpleQRBuffer);
    console.log('💾 Simple QR code saved as test-qr-simple.png');

    // Test 4: Convert buffer to base64 (for PDF embedding)
    console.log('🔄 Testing buffer to base64 conversion...');
    const base64String = qrCodeBuffer.toString('base64');
    console.log('✅ Base64 conversion successful');
    console.log(`📏 Base64 length: ${base64String.length} characters`);
    console.log(`🔗 Base64 preview: ${base64String.substring(0, 100)}...`);

    console.log('\n🎉 All QR code generation tests passed!');
    console.log('📁 Check the generated PNG files to verify QR codes are working');

  } catch (error) {
    console.error('❌ QR code generation failed:', error);
    console.error('📋 Error details:', error.message);
  }
}

// Run the test
testQRCodeGeneration();
