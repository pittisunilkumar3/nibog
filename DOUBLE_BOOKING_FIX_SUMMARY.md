# Double Booking Fix - Root Cause Analysis & Solution

## 🔴 ROOT CAUSE IDENTIFIED

The double registration issue happens because **BOTH** endpoints are creating bookings:

1. **Server Callback** (`/api/payments/phonepe-callback`) - PhonePe's webhook calls this → creates booking
2. **Client Status Check** (`/api/payments/phonepe-status`) - Client polls this → ALSO creates booking

### Race Condition Flow:
1. User completes payment on PhonePe
2. PhonePe calls server callback → starts creating booking #1
3. Client redirects to payment-callback page → calls phonepe-status → starts creating booking #2
4. Both bookings get created in database (no UNIQUE constraint on booking table)
5. Only ONE payment record is created (due to UNIQUE constraint on transaction_id)
6. **Result: 2 bookings, 1 payment = data inconsistency**

## ✅ SOLUTION

### Primary Fix: Server-First Architecture

**ONLY the server callback should create bookings**. The client status check should only:
1. Check payment status from PhonePe
2. Wait for server callback to complete booking creation  
3. Return existing booking data to client

### Changes Required:

#### 1. Fix `/api/payments/phonepe-status/route.ts`

**Remove** all booking creation logic after line 163. Replace with:

```typescript
if (isSuccess) {
  console.log("Server API route: ✅ Payment successful - waiting for server callback to create booking");

  try {
    const transactionId = responseData.data.transactionId;
    const bookingRef = generateConsistentBookingRef(transactionId);
    
    // Check if booking exists (created by server callback)
    const existingBookingResponse = await fetch('https://ai.nibog.in/webhook/v1/nibog/tickect/booking_ref/details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_ref_id: bookingRef })
    });

    if (existingBookingResponse.ok) {
      const existingBookings = await existingBookingResponse.json();
      if (existingBookings && existingBookings.length > 0) {
        console.log(`✅ Booking found - created by server callback`);
        return NextResponse.json({
          ...responseData,
          bookingCreated: true,
          bookingId: existingBookings[0].booking_id,
          bookingData: { booking_ref: bookingRef },
          message: "Booking created successfully by server"
        }, { status: 200 });
      }
    }
    
    // Booking not found yet - server callback still processing
    console.log(`⏳ Booking not found - server callback processing...`);
    return NextResponse.json({
      ...responseData,
      bookingCreated: false,
      bookingPending: true,
      bookingData: { booking_ref: bookingRef },
      message: "Payment successful. Server is creating your booking..."
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error checking booking status:", error);
    return NextResponse.json({
      ...responseData,
      bookingCreated: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 });
  }
}
```

#### 2. Update `/app/payment-callback/page.tsx`

Add retry logic to wait for server callback:

```typescript
// After calling checkPhonePePaymentStatus
if (status === 'SUCCESS') {
  if (statusData.bookingPending) {
    // Retry with exponential backoff
    const maxRetries = 10; // 10 retries over ~50 seconds
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const retryStatus = await checkPhonePePaymentStatus(txnId, bookingDataFromStorage);
      
      if (retryStatus.bookingCreated) {
        // Booking found! Redirect to confirmation
        router.push(`/booking-confirmation?ref=${retryStatus.bookingData.booking_ref}`);
        return;
      }
      
      retryCount++;
    }
    
    // Max retries reached
    setError('Booking is taking longer than expected. Please check your email or contact support.');
  } else if (statusData.bookingCreated) {
    // Booking already exists
    router.push(`/booking-confirmation?ref=${statusData.bookingData.booking_ref}`);
  }
}
```

#### 3. Strengthen Server Callback Idempotency

In `/api/payments/phonepe-callback/route.ts`, the existing idempotency check is good, but enhance it:

```typescript
// At line 850 - enhance the check
if (processedTransactions.has(transactionId)) {
  console.log(`⚠️ IDEMPOTENCY: Transaction ${transactionId} already processed`);
  
  // Return the existing booking data
  const bookingRef = generateConsistentBookingRef(transactionId);
  try {
    const existingBooking = await fetch('https://ai.nibog.in/webhook/v1/nibog/tickect/booking_ref/details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_ref_id: bookingRef })
    });
    
    if (existingBooking.ok) {
      const bookings = await existingBooking.json();
      if (bookings && bookings.length > 0) {
        return NextResponse.json({
          status: "SUCCESS",
          message: "Transaction already processed",
          booking_id: bookings[0].booking_id
        });
      }
    }
  } catch (e) {
    console.error("Error fetching existing booking:", e);
  }
  
  return NextResponse.json({
    status: "SUCCESS", 
    message: "Transaction already processed"
  });
}
```

## 📊 Testing Checklist

After implementing the fix:

1. ✅ Make a test payment
2. ✅ Check database - should see ONLY 1 booking record
3. ✅ Check database - should see ONLY 1 payment record  
4. ✅ Verify booking_ref matches between booking and payment tables
5. ✅ Verify user receives ONE confirmation email
6. ✅ Test with slow network (simulate server callback delay)
7. ✅ Test payment failure scenarios
8. ✅ Test concurrent requests (same transaction ID)

## 🎯 Expected Results

- **Before Fix**: 2 bookings + 1 payment (inconsistent)
- **After Fix**: 1 booking + 1 payment (consistent)

## 📝 Additional Improvements (Optional)

1. Add database UNIQUE constraint on `merchant_transaction_id` in bookings table
2. Add distributed lock mechanism (Redis) for high-traffic scenarios
3. Add webhook retry handling in case server callback fails
4. Implement booking status polling endpoint optimized for client retries

---

## Files to Modify

1. `app/api/payments/phonepe-status/route.ts` - **CRITICAL** (remove booking creation)
2. `app/payment-callback/page.tsx` - **IMPORTANT** (add retry logic)  
3. `app/api/payments/phonepe-callback/route.ts` - **OPTIONAL** (enhance idempotency)

The most critical fix is #1 - preventing `phonepe-status` from creating bookings.
