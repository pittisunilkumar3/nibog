#!/usr/bin/env node

/**
 * Mobile Crypto Compatibility Test Script
 * 
 * This script tests the mobile-compatible SHA256 implementation
 * to ensure it works correctly across different environments.
 * 
 * Usage:
 *   node scripts/test-mobile-crypto.js
 */

const crypto = require('crypto');

// Test data
const testCases = [
  {
    input: "hello world",
    expected: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
  },
  {
    input: "The quick brown fox jumps over the lazy dog",
    expected: "d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592"
  },
  {
    input: "",
    expected: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  },
  {
    input: "NIBOG_TEST_PAYMENT_123456789",
    expected: crypto.createHash('sha256').update("NIBOG_TEST_PAYMENT_123456789").digest('hex')
  }
];

// Node.js reference implementation
function nodeJsSHA256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Pure JavaScript SHA256 implementation (same as in config/phonepe.ts)
function sha256Fallback(message) {
  // Convert string to UTF-8 bytes
  const msgBuffer = new TextEncoder().encode(message);
  
  // SHA-256 constants
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  // Initial hash values
  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

  // Pre-processing: adding padding bits
  const msgLength = msgBuffer.length;
  const bitLength = msgLength * 8;
  
  // Create padded message
  const paddedLength = Math.ceil((msgLength + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLength);
  padded.set(msgBuffer);
  padded[msgLength] = 0x80; // Append '1' bit
  
  // Append length as 64-bit big-endian integer
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLength - 4, bitLength & 0xffffffff, false);
  view.setUint32(paddedLength - 8, Math.floor(bitLength / 0x100000000), false);

  // Process message in 512-bit chunks
  for (let chunk = 0; chunk < paddedLength; chunk += 64) {
    const w = new Array(64);
    
    // Copy chunk into first 16 words of message schedule
    for (let i = 0; i < 16; i++) {
      w[i] = view.getUint32(chunk + i * 4, false);
    }
    
    // Extend the first 16 words into the remaining 48 words
    for (let i = 16; i < 64; i++) {
      const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    // Initialize working variables
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

    // Main loop
    for (let i = 0; i < 64; i++) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    // Add this chunk's hash to result
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  // Produce the final hash value as a 256-bit number (hex string)
  return [h0, h1, h2, h3, h4, h5, h6, h7]
    .map(h => h.toString(16).padStart(8, '0'))
    .join('');
}

// Helper function for right rotation
function rightRotate(value, amount) {
  return (value >>> amount) | (value << (32 - amount));
}

// Run tests
console.log('🧪 Testing Mobile-Compatible SHA256 Implementation\n');

let allTestsPassed = true;

for (let i = 0; i < testCases.length; i++) {
  const testCase = testCases[i];
  console.log(`Test ${i + 1}: "${testCase.input}"`);
  
  try {
    const nodeResult = nodeJsSHA256(testCase.input);
    const fallbackResult = sha256Fallback(testCase.input);
    const expectedResult = testCase.expected;
    
    console.log(`   Node.js result:  ${nodeResult}`);
    console.log(`   Fallback result: ${fallbackResult}`);
    console.log(`   Expected result: ${expectedResult}`);
    
    if (nodeResult === expectedResult && fallbackResult === expectedResult) {
      console.log('   ✅ PASSED\n');
    } else {
      console.log('   ❌ FAILED\n');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}\n`);
    allTestsPassed = false;
  }
}

if (allTestsPassed) {
  console.log('🎉 All tests passed! Mobile crypto implementation is working correctly.');
} else {
  console.log('❌ Some tests failed. Please check the implementation.');
  process.exit(1);
}
