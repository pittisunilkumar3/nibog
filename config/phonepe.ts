// PhonePe configuration file
// This centralizes all PhonePe-related configuration

// PhonePe API endpoints
export const PHONEPE_API = {
  TEST: {
    INITIATE: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
    STATUS: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status',
    REFUND: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/refund',
  },
  PROD: {
    INITIATE: 'https://api.phonepe.com/apis/hermes/pg/v1/pay',
    STATUS: 'https://api.phonepe.com/apis/hermes/pg/v1/status',
    REFUND: 'https://api.phonepe.com/apis/hermes/pg/v1/refund',
  }
};

// Helper function to safely access environment variables
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  // For server-side code
  if (typeof process !== 'undefined' && process.env) {
    // In Next.js, environment variables are available via process.env
    // This works for both .env and .env.local files
    return process.env[key] || defaultValue;
  }

  // For client-side code
  // Next.js automatically exposes environment variables prefixed with NEXT_PUBLIC_
  // If you need client-side access, prefix your env vars with NEXT_PUBLIC_
  if (typeof window !== 'undefined') {
    // For environment variables exposed to the client
    if (process.env[`NEXT_PUBLIC_${key}`]) {
      return process.env[`NEXT_PUBLIC_${key}`] || defaultValue;
    }

    // Fallback for any custom __ENV object that might be defined
    if ((window as any).__ENV && (window as any).__ENV[key]) {
      return (window as any).__ENV[key] || defaultValue;
    }
  }

  return defaultValue;
};

// Determine if we're in production mode
const isProduction = getEnvVar('PHONEPE_ENVIRONMENT', 'production') === 'production';

// PhonePe merchant configuration from environment variables
export const PHONEPE_CONFIG = {
  MERCHANT_ID: isProduction
    ? getEnvVar('PHONEPE_PROD_MERCHANT_ID', 'M11BWXEAW0AJ')
    : getEnvVar('PHONEPE_TEST_MERCHANT_ID', 'PGTESTPAYUAT86'),

  SALT_KEY: isProduction
    ? getEnvVar('PHONEPE_PROD_SALT_KEY', '63542457-2eb4-4ed4-83f2-da9eaed9fcca')
    : getEnvVar('PHONEPE_TEST_SALT_KEY', '96434309-7796-489d-8924-ab56988a6076'),

  SALT_INDEX: isProduction
    ? getEnvVar('PHONEPE_PROD_SALT_INDEX', '2')
    : getEnvVar('PHONEPE_TEST_SALT_INDEX', '1'),

  IS_TEST_MODE: !isProduction,
  ENVIRONMENT: isProduction ? 'production' : 'sandbox',
  APP_URL: getEnvVar('NEXT_PUBLIC_APP_URL', 'https://nibog.in'),
};

// Generate a SHA256 hash
export async function generateSHA256Hash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Base64 encode a string
export function base64Encode(str: string): string {
  if (typeof window !== 'undefined') {
    return btoa(str);
  } else {
    return Buffer.from(str).toString('base64');
  }
}

// Generate a unique transaction ID
export function generateTransactionId(bookingId: string | number): string {
  const timestamp = new Date().getTime();
  return `NIBOG_${bookingId}_${timestamp}`;
}

// Payment status types
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

// PhonePe payment request interface
export interface PhonePePaymentRequest {
  merchantId: string;
  merchantTransactionId: string;
  merchantUserId: string;
  amount: number;
  redirectUrl: string;
  redirectMode: string;
  callbackUrl: string;
  mobileNumber: string;
  paymentInstrument?: {
    type: string;
    [key: string]: any;
  };
}

// PhonePe payment response interface
export interface PhonePePaymentResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId: string;
    merchantTransactionId: string;
    instrumentResponse: {
      type: string;
      redirectInfo: {
        url: string;
        method: string;
      };
    };
  };
}

// Validate PhonePe configuration
export function validatePhonePeConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!PHONEPE_CONFIG.MERCHANT_ID) {
    errors.push('MERCHANT_ID is missing');
  }

  if (!PHONEPE_CONFIG.SALT_KEY) {
    errors.push('SALT_KEY is missing');
  }

  if (!PHONEPE_CONFIG.SALT_INDEX) {
    errors.push('SALT_INDEX is missing');
  }

  if (!PHONEPE_CONFIG.APP_URL) {
    errors.push('APP_URL is missing');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Log PhonePe configuration status
export function logPhonePeConfig(): void {
  const validation = validatePhonePeConfig();

  console.log('=== PhonePe Configuration ===');
  console.log(`Environment: ${PHONEPE_CONFIG.ENVIRONMENT}`);
  console.log(`Merchant ID: ${PHONEPE_CONFIG.MERCHANT_ID ? '✓ Set' : '✗ Missing'}`);
  console.log(`Salt Key: ${PHONEPE_CONFIG.SALT_KEY ? '✓ Set' : '✗ Missing'}`);
  console.log(`Salt Index: ${PHONEPE_CONFIG.SALT_INDEX ? '✓ Set' : '✗ Missing'}`);
  console.log(`App URL: ${PHONEPE_CONFIG.APP_URL ? '✓ Set' : '✗ Missing'}`);
  console.log(`Test Mode: ${PHONEPE_CONFIG.IS_TEST_MODE ? 'Enabled' : 'Disabled'}`);

  if (!validation.isValid) {
    console.error('PhonePe Configuration Errors:', validation.errors);
  } else {
    console.log('✓ PhonePe configuration is valid');
  }
  console.log('=============================');
}
