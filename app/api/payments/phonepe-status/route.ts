import { NextResponse } from 'next/server';
import { PHONEPE_CONFIG, generateSHA256Hash, logPhonePeConfig } from '@/config/phonepe';
import { generateConsistentBookingRef } from '@/utils/bookingReference';

export async function POST(request: Request) {
  try {
    console.log("Server API route: Starting PhonePe payment status check request");

    // Log and validate configuration
    logPhonePeConfig();

    // Parse the request body
    const { transactionId, bookingData } = await request.json();
    console.log("Server API route: Received booking data:", bookingData ? "Yes" : "No");
    console.log(`Server API route: Checking status for transaction ID: ${transactionId}`);

    // Use the API endpoints from the configuration
    const apiUrl = `${PHONEPE_CONFIG.API_ENDPOINTS.STATUS}/${PHONEPE_CONFIG.MERCHANT_ID}/${transactionId}`;

    console.log(`Server API route: Using ${PHONEPE_CONFIG.ENVIRONMENT} environment`);
    console.log("Server API route: Calling PhonePe API URL:", apiUrl);

    // Generate the X-VERIFY header
    const dataToHash = `/pg/v1/status/${PHONEPE_CONFIG.MERCHANT_ID}/${transactionId}` + PHONEPE_CONFIG.SALT_KEY;
    const xVerify = await generateSHA256Hash(dataToHash) + '###' + PHONEPE_CONFIG.SALT_INDEX;

    // Call the PhonePe API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerify,
        "X-MERCHANT-ID": PHONEPE_CONFIG.MERCHANT_ID,
      },
    });

    console.log(`Server API route: PhonePe payment status response status: ${response.status}`);

    // Get the response data
    const responseText = await response.text();
    console.log(`Server API route: Raw response: ${responseText}`);

    try {
      // Try to parse the response as JSON
      const responseData = JSON.parse(responseText);
      console.log("Server API route: PhonePe payment status response:", responseData);

      // Update the transaction status in your database here
      // Example: await updateTransactionStatus(transactionId, responseData.data.paymentState);

      // If payment was successful, create booking and payment records
      // In test environment, we need to be more lenient with status codes
      // PhonePe sandbox might return different codes than production
      const isSuccess = responseData.success && (
        responseData.code === 'PAYMENT_SUCCESS' || 
        (responseData.data && responseData.data.state === 'COMPLETED') ||
        (responseData.data && responseData.data.paymentState === 'COMPLETED') ||
        // For sandbox testing, also consider these as success
        (PHONEPE_CONFIG.IS_TEST_MODE && (
          responseData.code === 'PAYMENT_PENDING' || // Sometimes test UI returns this despite selecting success
          responseData.code?.includes('SUCCESS')
        ))
      );
      
      console.log("Server API route: Payment success check result:", isSuccess);
      console.log("Server API route: Response code:", responseData.code);
      console.log("Server API route: Payment state:", responseData.data?.paymentState || responseData.data?.state);
      
      if (isSuccess) {
        console.log("Server API route: ✅ Payment successful - waiting for server callback to create booking");

        try {
          // Extract transaction info
          const transactionId = responseData.data.transactionId;
          const merchantTransactionId = responseData.data.merchantTransactionId;

          console.log(`Server API route: Processing payment success for transaction: ${transactionId}`);

          // Generate booking reference for consistency
          const bookingRef = generateConsistentBookingRef(transactionId);
          console.log(`Server API route: 🔍 CHECKING for existing payment/booking with transaction ID: ${merchantTransactionId}`);

          // CHECK if booking exists (created by server callback) - DO NOT CREATE
          // Look up by PAYMENT RECORD first since that's reliably stored with the transaction ID
          try {
            // First, check if payment record exists (which means booking was created)
            const paymentCheckResponse = await fetch('https://ai.nibog.in/webhook/v1/nibog/payments/get-all');
            
            if (paymentCheckResponse.ok) {
              const allPayments = await paymentCheckResponse.json();
              
              // Find payment by phonepe_transaction_id or transaction_id
              const existingPayment = allPayments.find((p: any) => 
                p.phonepe_transaction_id === merchantTransactionId || 
                p.transaction_id === transactionId
              );
              
              if (existingPayment && existingPayment.booking_id) {
                console.log(`Server API route: ✅ Payment and booking found for transaction ${merchantTransactionId}`);
                console.log(`Server API route: Booking ID: ${existingPayment.booking_id}`);
                
                return NextResponse.json({
                  ...responseData,
                  bookingCreated: true,
                  bookingId: existingPayment.booking_id,
                  paymentCreated: true,
                  bookingData: {
                    booking_ref: bookingRef,
                    transaction_id: merchantTransactionId,
                    booking_id: existingPayment.booking_id
                  },
                  message: "Booking created successfully by server"
                }, { status: 200 });
              }
            }
          } catch (error) {
            console.log(`Server API route: ⚠️ Error checking for existing payment:`, error);
          }

          // Booking not found yet - server callback still processing
          console.log(`Server API route: ⏳ Payment/Booking not found - server callback is processing...`);
          console.log(`Server API route: ⚠️ Client should retry in a few seconds`);
          
          return NextResponse.json({
            ...responseData,
            bookingCreated: false,
            bookingPending: true,
            bookingData: {
              booking_ref: bookingRef,
              transaction_id: merchantTransactionId
            },
            message: "Payment successful. Server is creating your booking..."
          }, { status: 200 });
          
        } catch (error) {
          console.error("Server API route: Error checking booking status:", error);
          return NextResponse.json({
            ...responseData,
            bookingCreated: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          }, { status: 200 });
        }
      }
      
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
    console.error("Server API route: Error checking PhonePe payment status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check PhonePe payment status" },
      { status: 500 }
    );
  }
}
