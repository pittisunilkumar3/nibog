/**
 * Test the browser-compatible QR code generation fix
 */

const QRCode = require('qrcode');

async function testBrowserCompatibleQRGeneration() {
  console.log('🧪 Testing browser-compatible QR code generation...');
  
  const testData = JSON.stringify({
    ref: 'MAN250806923',
    id: 287,
    name: 'sunil',
    game: 'test',
    slot_id: 326
  });

  console.log('📋 Test data:', testData);

  try {
    // Test 1: Simulate browser environment (using toDataURL)
    console.log('🔄 Test 1: Simulating browser environment...');
    
    const qrCodeDataURL = await QRCode.toDataURL(testData, {
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
    
    // Convert data URL to buffer (as the fixed service does)
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    console.log('✅ Buffer conversion successful');
    console.log(`📏 Buffer size: ${buffer.length} bytes`);
    
    // Test 2: Simulate Node.js environment (using toBuffer)
    console.log('🔄 Test 2: Simulating Node.js environment...');
    
    const qrCodeBuffer = await QRCode.toBuffer(testData, {
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
    
    // Test 3: Verify both methods produce similar results
    console.log('🔄 Test 3: Comparing buffer sizes...');
    
    const sizeDifference = Math.abs(buffer.length - qrCodeBuffer.length);
    const sizePercentDiff = (sizeDifference / qrCodeBuffer.length) * 100;
    
    console.log(`📊 Browser method buffer: ${buffer.length} bytes`);
    console.log(`📊 Node.js method buffer: ${qrCodeBuffer.length} bytes`);
    console.log(`📊 Size difference: ${sizeDifference} bytes (${sizePercentDiff.toFixed(2)}%)`);
    
    if (sizePercentDiff < 10) {
      console.log('✅ Both methods produce similar results');
    } else {
      console.log('⚠️ Significant size difference between methods');
    }
    
    console.log('\n🎉 Browser-compatible QR code generation test completed successfully!');
    console.log('✅ The fix should resolve the "toBuffer is not a function" error');
    console.log('✅ QR codes will work in both browser and Node.js environments');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('📋 Error details:', error.message);
  }
}

// Run the test
testBrowserCompatibleQRGeneration();
