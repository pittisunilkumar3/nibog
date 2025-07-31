/**
 * WhatsApp notification service for booking confirmations
 * Integrates with Zaptra WhatsApp platform via API
 */

import {
  getWhatsAppSettings,
  logWhatsAppEvent,
  safeWhatsAppCall,
  WhatsAppSettings
} from './whatsappConfigService';

export interface WhatsAppBookingData {
  bookingId: number;
  bookingRef?: string;
  parentName: string;
  parentPhone: string; // Customer's WhatsApp number
  childName: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  totalAmount: number;
  paymentMethod: string;
  transactionId: string;
  gameDetails: Array<{
    gameName: string;
    gameTime: string;
    gamePrice: number;
  }>;
  addOns?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  zaptraResponse?: any;
}

/**
 * Validate and format phone number for WhatsApp
 */
function formatPhoneNumber(phone: string): string | null {
  if (!phone) return null;
  
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Handle Indian numbers
  if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
    return `+${cleanPhone}`;
  } else if (cleanPhone.length === 10) {
    return `+91${cleanPhone}`;
  } else if (cleanPhone.startsWith('+')) {
    return phone; // Already formatted
  }
  
  // For other international numbers, assume they're correctly formatted
  if (cleanPhone.length >= 10) {
    return `+${cleanPhone}`;
  }
  
  return null;
}

/**
 * Generate WhatsApp message content for booking confirmation
 */
function generateWhatsAppMessage(bookingData: WhatsAppBookingData): string {
  const gamesList = bookingData.gameDetails
    .map(game => `• ${game.gameName} - ${game.gameTime} - ₹${game.gamePrice}`)
    .join('\n');

  const addOnsList = bookingData.addOns && bookingData.addOns.length > 0
    ? '\n\n*Add-ons:*\n' + bookingData.addOns
        .map(addon => `• ${addon.name} (Qty: ${addon.quantity}) - ₹${addon.price}`)
        .join('\n')
    : '';

  const bookingRef = bookingData.bookingRef || `B${String(bookingData.bookingId).padStart(7, '0')}`;

  return `🎉 *Booking Confirmed!*

Hi ${bookingData.parentName},

Your booking has been confirmed:

📅 *Event:* ${bookingData.eventTitle}
🗓️ *Date:* ${bookingData.eventDate}
📍 *Venue:* ${bookingData.eventVenue}
👶 *Child:* ${bookingData.childName}
🎫 *Booking ID:* ${bookingRef}

*Games Booked:*
${gamesList}${addOnsList}

💰 *Total Amount:* ₹${bookingData.totalAmount}
💳 *Payment:* ${bookingData.paymentMethod}
🔗 *Transaction ID:* ${bookingData.transactionId}

Thank you for choosing NIBOG! 🎈

_Powered by Zaptra_ 📱`;
}

/**
 * Send WhatsApp message via Zaptra API with safety measures
 * Supports both template messages and text messages
 */
async function sendWhatsAppMessageSafe(
  phone: string,
  messageData: string | { templateName: string; templateData: any },
  settings: ReturnType<typeof getWhatsAppSettings>
): Promise<WhatsAppResponse> {
  try {
    console.log(`📱 Sending WhatsApp message to: ${phone}`);

    // Determine if using template or text message
    const isTemplate = typeof messageData === 'object';
    const endpoint = isTemplate ? '/sendtemplatemessage' : '/sendmessage';

    console.log(`📱 Using Zaptra API: ${settings.apiUrl}${endpoint}`);

    // Use AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), settings.timeoutMs);

    // Prepare request body based on message type
    const requestBody = isTemplate
      ? {
          token: settings.apiToken,
          phone: phone,
          template_name: messageData.templateName,
          template_language: 'en', // Correct language for booking_confirmation template
          components: messageData.templateData // Use 'components' instead of 'template_data'
        }
      : {
          token: settings.apiToken,
          phone: phone,
          message: messageData
        };

    const response = await fetch(`${settings.apiUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const responseData = await response.json();
    if (settings.debugMode) {
      console.log(`📱 Zaptra API response:`, responseData);
    }

    if (response.ok && responseData.status === 'success') {
      return {
        success: true,
        messageId: responseData.message_id,
        zaptraResponse: responseData
      };
    } else {
      return {
        success: false,
        error: responseData.message || `API returned status: ${response.status}`,
        zaptraResponse: responseData
      };
    }
  } catch (error) {
    console.error('📱 Error sending WhatsApp message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get available WhatsApp templates from Zaptra
 */
export async function getWhatsAppTemplates(): Promise<{
  success: boolean;
  templates?: any[];
  error?: string;
}> {
  try {
    const settings = getWhatsAppSettings();

    if (!settings.enabled || !settings.apiToken) {
      return {
        success: false,
        error: 'WhatsApp not configured'
      };
    }

    const response = await fetch(`${settings.apiUrl}/getTemplates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const responseData = await response.json();

    if (response.ok) {
      return {
        success: true,
        templates: responseData.templates || responseData
      };
    } else {
      return {
        success: false,
        error: responseData.message || 'Failed to get templates'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Main function to send booking confirmation via WhatsApp
 */
export async function sendBookingConfirmationWhatsApp(
  bookingData: WhatsAppBookingData
): Promise<WhatsAppResponse> {
  const startTime = Date.now();

  try {
    logWhatsAppEvent('attempt', {
      bookingId: bookingData.bookingId,
      phone: bookingData.parentPhone
    });

    console.log('📱 Starting WhatsApp booking confirmation...');
    console.log(`📱 Booking ID: ${bookingData.bookingId}`);
    console.log(`📱 Customer: ${bookingData.parentName}`);
    console.log(`📱 Phone: ${bookingData.parentPhone}`);

    // Get configuration with safety checks
    const settings = getWhatsAppSettings();

    // Check if WhatsApp notifications are enabled
    if (!settings.enabled) {
      logWhatsAppEvent('disabled', { bookingId: bookingData.bookingId });
      console.log('📱 WhatsApp notifications are disabled');
      return {
        success: false,
        error: 'WhatsApp notifications are disabled'
      };
    }

    // Validate API token
    if (!settings.apiToken) {
      logWhatsAppEvent('config_error', {
        bookingId: bookingData.bookingId,
        error: 'API token not configured'
      });
      console.error('📱 Zaptra API token not configured');
      return {
        success: false,
        error: 'Zaptra API token not configured'
      };
    }

    // Format and validate phone number
    const formattedPhone = formatPhoneNumber(bookingData.parentPhone);
    if (!formattedPhone) {
      logWhatsAppEvent('failure', {
        bookingId: bookingData.bookingId,
        phone: bookingData.parentPhone,
        error: 'Invalid phone number format'
      });
      console.error(`📱 Invalid phone number: ${bookingData.parentPhone}`);
      return {
        success: false,
        error: `Invalid phone number: ${bookingData.parentPhone}`
      };
    }

    // Try to use template first, fallback to text message
    let messageData: string | { templateName: string; templateData: any };

    // Check if we should use templates (you can configure this)
    const useTemplates = process.env.WHATSAPP_USE_TEMPLATES === 'true';

    if (useTemplates) {
      // Use Zaptra template with WhatsApp Business API components format
      // Based on the template structure you created in demo.zaptra.in
      const bookingRef = bookingData.bookingRef || `B${String(bookingData.bookingId).padStart(7, '0')}`;

      messageData = {
        templateName: 'booking_confirmation', // Template name in Zaptra
        templateData: [
          {
            type: "body",
            parameters: [
              { type: "text", text: bookingData.parentName },     // {{1}} - customer_name
              { type: "text", text: bookingData.eventTitle },     // {{2}} - event_title
              { type: "text", text: bookingData.eventDate },      // {{3}} - event_date
              { type: "text", text: bookingData.eventVenue },     // {{4}} - venue_name
              { type: "text", text: bookingData.childName },      // {{5}} - child_name
              { type: "text", text: bookingRef },                 // {{6}} - booking_ref
              { type: "text", text: bookingData.totalAmount.toString() }, // {{7}} - total_amount
              { type: "text", text: bookingData.paymentMethod }   // {{8}} - payment_method
            ]
          }
        ]
      };

      if (settings.debugMode) {
        console.log('📱 Using template:', messageData);
      }
    } else {
      // Generate text message as fallback
      messageData = generateWhatsAppMessage(bookingData);
      if (settings.debugMode) {
        console.log('📱 Generated text message:', messageData);
      }
    }

    // Send WhatsApp message with circuit breaker protection
    const result = await safeWhatsAppCall(
      () => sendWhatsAppMessageSafe(formattedPhone, messageData, settings),
      settings.fallbackEnabled ? () => Promise.resolve({
        success: false,
        error: 'WhatsApp service unavailable, fallback triggered'
      }) : undefined
    );

    const duration = Date.now() - startTime;

    if (result.success) {
      logWhatsAppEvent('success', {
        bookingId: bookingData.bookingId,
        phone: formattedPhone,
        messageId: result.messageId,
        duration
      });
      console.log(`✅ WhatsApp message sent successfully! Message ID: ${result.messageId}`);
    } else {
      logWhatsAppEvent('failure', {
        bookingId: bookingData.bookingId,
        phone: formattedPhone,
        error: result.error,
        duration
      });
      console.error(`❌ Failed to send WhatsApp message: ${result.error}`);
    }

    return result;

  } catch (error) {
    const duration = Date.now() - startTime;
    logWhatsAppEvent('failure', {
      bookingId: bookingData.bookingId,
      phone: bookingData.parentPhone,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration
    });
    console.error('📱 Error in sendBookingConfirmationWhatsApp:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Test function to verify WhatsApp integration
 */
export async function testWhatsAppIntegration(testPhone: string): Promise<WhatsAppResponse> {
  const testData: WhatsAppBookingData = {
    bookingId: 999999,
    bookingRef: 'TEST001',
    parentName: 'Test User',
    parentPhone: testPhone,
    childName: 'Test Child',
    eventTitle: 'Test Event',
    eventDate: new Date().toLocaleDateString(),
    eventVenue: 'Test Venue',
    totalAmount: 100,
    paymentMethod: 'Test',
    transactionId: 'TEST_TXN_001',
    gameDetails: [{
      gameName: 'Test Game',
      gameTime: '10:00 AM',
      gamePrice: 100
    }]
  };

  return sendBookingConfirmationWhatsApp(testData);
}
