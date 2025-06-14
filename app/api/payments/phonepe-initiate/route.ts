import { NextResponse } from 'next/server';
import { PHONEPE_API, PHONEPE_CONFIG } from '@/config/phonepe';

export async function POST(request: Request) {
  try {
    console.log("Server API route: Starting PhonePe payment initiation request");
    console.log(`PhonePe Environment: ${PHONEPE_CONFIG.ENVIRONMENT}`);
    console.log(`PhonePe Merchant ID: ${PHONEPE_CONFIG.MERCHANT_ID}`);

    // Parse the request body
    const { request: base64Payload, xVerify, transactionId, bookingId } = await request.json();
    console.log(`Server API route: Received transaction ID: ${transactionId}, booking ID: ${bookingId}`);

    // Determine the API URL based on environment (production vs sandbox)
    const apiUrl = PHONEPE_CONFIG.IS_TEST_MODE
      ? PHONEPE_API.TEST.INITIATE
      : PHONEPE_API.PROD.INITIATE;

    console.log(`Server API route: Using ${PHONEPE_CONFIG.ENVIRONMENT} environment`);
    console.log("Server API route: Calling PhonePe API URL:", apiUrl);

    // Call the PhonePe API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerify,
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    console.log(`Server API route: PhonePe payment initiation response status: ${response.status}`);

    // Get the response data
    const responseText = await response.text();
    console.log(`Server API route: Raw response: ${responseText}`);

    try {
      // Try to parse the response as JSON
      const responseData = JSON.parse(responseText);
      console.log("Server API route: PhonePe payment initiation response:", responseData);

      // Store the transaction details in your database here
      // This is important for reconciliation and callback handling
      // Example: await storeTransactionDetails(transactionId, bookingId, responseData);

      return NextResponse.json(responseData, { status: 200 });
    } catch (parseError) {
      console.error("Server API route: Error parsing response:", parseError);
      // If parsing fails but we got a 200 status, consider it a success
      if (response.status >= 200 && response.status < 300) {
        return NextResponse.json({ success: true }, { status: 200 });
      }
      // Otherwise, return the error
      return NextResponse.json(
        {
          error: "Failed to parse PhonePe API response",
          rawResponse: responseText.substring(0, 500) // Limit the size of the raw response
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Server API route: Error initiating PhonePe payment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate PhonePe payment" },
      { status: 500 }
    );
  }
}
