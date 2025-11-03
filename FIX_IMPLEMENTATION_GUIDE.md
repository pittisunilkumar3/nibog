# 🔧 STEP-BY-STEP FIX IMPLEMENTATION GUIDE

## CRITICAL FIX: Prevent Double Booking

### Root Cause
**Both** `phonepe-status` and `phonepe-callback` endpoints are creating bookings, causing duplicates.

---

## 📝 IMPLEMENTATION STEPS

### Step 1: Fix `app/api/payments/phonepe-status/route.ts`

**Location:** Line 148 (inside the `if (isSuccess)` block)

**Find this code:**
```typescript
if (isSuccess) {
  console.log("Server API route: Payment was successful, creating booking and payment records");
```

**Replace the ENTIRE try-catch block (lines 148-760) with:**

```typescript
if (isSuccess) {
  console.log("Server API route: ✅ Payment successful - checking if server callback created booking");
  console.log("Server API route: 🔒 CLIENT CHECK - Will NOT create booking, only verify");

  try {
    const transactionId = responseData.data.transactionId;
    const bookingRef = generateConsistentBookingRef(transactionId);
    
    console.log(`⏳ Checking for booking with reference: ${bookingRef}`);

    // Check if booking exists (created by server callback)
    try {
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
            paymentCreated: true,
            bookingData: { booking_ref: bookingRef },
            message: "Booking created successfully"
          }, { status: 200 });
        } else {
          // Booking not found yet - server callback still processing
          console.log(`⏳ Booking not found - server callback processing...`);
          
          return NextResponse.json({
            ...responseData,
            bookingCreated: false,
            bookingPending: true,
            bookingData: { booking_ref: bookingRef },
            message: "Payment successful. Server is creating your booking..."
          }, { status: 200 });
        }
      } else {
        // API error - assume server callback will handle it
        return NextResponse.json({
          ...responseData,
          bookingCreated: false,
          bookingPending: true,
          bookingData: { booking_ref: bookingRef },
          message: "Payment successful. Server is creating your booking."
        }, { status: 200 });
      }
    } catch (error) {
      console.log(`⚠️ Error checking booking:`, error);
      
      return NextResponse.json({
        ...responseData,
        bookingCreated: false,
        bookingPending: true,
        bookingData: { booking_ref: bookingRef },
        message: "Payment successful. Server is creating your booking."
      }, { status: 200 });
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
    
    return NextResponse.json({
      ...responseData,
      bookingCreated: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 });
  }
}
```

**What this does:**
- ✅ Checks if booking exists (created by server callback)
- ✅ Returns existing booking if found  
- ✅ Returns `bookingPending: true` if not found yet
- ❌ DOES NOT create bookings anymore

---

### Step 2: Add Retry Logic to Client

**File:** `app/payment-callback/page.tsx`

**Location:** Inside the `checkPaymentStatus` function, after calling `checkPhonePePaymentStatus`

**Find this code:**
```typescript
if (status === 'SUCCESS') {
  console.log('✅ Payment successful - checking if booking was created by server callback')
```

**Add retry logic right after the status check:**

```typescript
// If booking is pending, retry with exponential backoff
if (statusData.bookingPending) {
  console.log('⏳ Booking pending - waiting for server callback...');
  
  const maxRetries = 10; // 10 retries over ~50 seconds  
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    console.log(`Retry ${retryCount + 1}/${maxRetries} - waiting 5 seconds...`);
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    
    const retryStatus = await checkPhonePePaymentStatus(txnId, bookingDataFromStorage);
    
    if (retryStatus.bookingCreated) {
      console.log('✅ Booking created! Redirecting...');
      const bookingRef = retryStatus.bookingData?.booking_ref || txnId;
      router.push(`/booking-confirmation?ref=${encodeURIComponent(bookingRef)}`);
      return;
    }
    
    retryCount++;
  }
  
  // Max retries reached
  console.error('❌ Max retries reached - booking not found');
  setError('Booking is taking longer than expected. Please check your email or contact support with transaction ID: ' + txnId);
  return;
}

// If booking already exists
if (statusData.bookingCreated) {
  console.log('✅ Booking exists! Redirecting...');
  const bookingRef = statusData.bookingData?.booking_ref || txnId;
  router.push(`/booking-confirmation?ref=${encodeURIComponent(bookingRef)}`);
  return;
}
```

---

### Step 3: (Optional) Enhance Server Callback Idempotency

**File:** `app/api/payments/phonepe-callback/route.ts`

**Location:** Line 850 (the `processedTransactions` check)

**This is already good, but you can enhance it:**

```typescript
if (processedTransactions.has(transactionId)) {
  console.log(`⚠️ Transaction ${transactionId} already processed`);
  
  // Return existing booking data
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

---

## ✅ TESTING CHECKLIST

After implementing the fix:

1. **Test Payment Flow:**
   - Make a test payment  
   - Check terminal logs - should see "CLIENT CHECK - Will NOT create booking"
   - Check database - should see ONLY 1 booking record
   - Check database - should see ONLY 1 payment record

2. **Test with Delays:**
   - Simulate slow server callback
   - Client should retry and eventually find the booking
   - No duplicate bookings should be created

3. **Test Concurrency:**
   - Make payment and immediately refresh page
   - Should not create duplicates

4. **Verify Data:**
   - Check `booking_ref` matches in both booking and payment tables
   - Check user receives only ONE email

---

## 🎯 EXPECTED BEHAVIOR

### Before Fix:
```
Payment → Server Callback creates booking #1
       → Client Status Check creates booking #2  
Result: 2 bookings, 1 payment ❌
```

### After Fix:
```
Payment → Server Callback creates booking #1
       → Client Status Check finds booking #1
Result: 1 booking, 1 payment ✅
```

---

## 📊 Quick Test Query

Run this SQL to check for duplicates:

```sql
-- Check for duplicate bookings with same transaction
SELECT 
  b.booking_id,
  b.booking_ref,
  p.transaction_id,
  COUNT(*) OVER (PARTITION BY p.transaction_id) as booking_count
FROM bookings b
JOIN payments p ON b.booking_id = p.booking_id
WHERE p.created_at > NOW() - INTERVAL '1 DAY'
ORDER BY p.transaction_id, b.booking_id;
```

If `booking_count` > 1, you still have duplicates.

---

## 🚨 IMPORTANT NOTES

1. **Backup First:** Make sure you have a git commit before making changes
2. **Test in Sandbox:** Use PhonePe sandbox environment first
3. **Monitor Logs:** Watch both server callback and status check logs
4. **Database Check:** Verify no duplicates after each test payment

---

## 💡 WHY THIS WORKS

- **Single Source of Truth:** Only server callback creates bookings
- **Client is Read-Only:** Status check only reads/waits for booking
- **Idempotency:** Server callback checks before creating
- **Retry Logic:** Client waits for slow server callbacks
- **Atomic Operations:** No race conditions possible

---

**Need Help?** Check `DOUBLE_BOOKING_FIX_SUMMARY.md` for detailed analysis.
