# 📝 COPY-PASTE FIX CODE

## File 1: `app/api/payments/phonepe-status/route.ts`

### Find this section (around line 148):
```typescript
if (isSuccess) {
  console.log("Server API route: Payment was successful, creating booking and payment records");

  try {
    // Extract transaction info
    const transactionId = responseData.data.transactionId;
    const merchantTransactionId = responseData.data.merchantTransactionId;
    const amount = responseData.data.amount;
    const paymentState = responseData.data.state;

    console.log(`Server API route: Processing payment success for transaction: ${transactionId}`);

    // Check if booking already exists for this transaction ID to prevent duplicates
    const bookingRef = generateConsistentBookingRef(transactionId);
    console.log(`Server API route: ⚠️ IDEMPOTENCY CHECK: Checking for existing booking with reference: ${bookingRef}`);
```

### Replace the ENTIRE `if (isSuccess) { ... }` block (including the try-catch that goes with it, ending around line 760) with this:

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
        console.log(`⚠️ Could not check for existing booking (API error)`);
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

---

## File 2: `app/payment-callback/page.tsx`

### Find this code inside the `checkPaymentStatus` function:
```typescript
if (status === 'SUCCESS') {
  console.log('✅ Payment successful - checking if booking was created by server callback')
```

### Add this code RIGHT AFTER that log statement (before the try block):

```typescript
// Handle booking pending state - retry until booking is created
if (statusData.bookingPending) {
  console.log('⏳ Booking pending - waiting for server callback...');
  setProcessingBooking(true);
  
  const maxRetries = 10; // 10 retries over ~50 seconds  
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    console.log(`Retry ${retryCount + 1}/${maxRetries} - waiting 5 seconds...`);
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    
    try {
      const retryStatus = await checkPhonePePaymentStatus(txnId, bookingDataFromStorage);
      
      if (retryStatus.bookingCreated) {
        console.log('✅ Booking created! Redirecting...');
        const bookingRef = retryStatus.bookingData?.booking_ref || txnId;
        setBookingRef(bookingRef);
        localStorage.setItem('lastBookingRef', bookingRef);
        
        // Redirect to confirmation page
        setTimeout(() => {
          router.push(`/booking-confirmation?ref=${encodeURIComponent(bookingRef)}`);
        }, 2000);
        return;
      }
    } catch (retryError) {
      console.error('Error during retry:', retryError);
    }
    
    retryCount++;
  }
  
  // Max retries reached
  console.error('❌ Max retries reached - booking not found');
  setError(`Booking is taking longer than expected. Your payment was successful (Transaction ID: ${txnId}). Please check your email or contact support.`);
  setProcessingBooking(false);
  return;
}

// If booking already exists (created by server callback)
if (statusData.bookingCreated && statusData.bookingData?.booking_ref) {
  console.log('✅ Booking exists! Redirecting...');
  const bookingRef = statusData.bookingData.booking_ref;
  setBookingRef(bookingRef);
  localStorage.setItem('lastBookingRef', bookingRef);
  
  // Redirect to confirmation page
  setTimeout(() => {
    router.push(`/booking-confirmation?ref=${encodeURIComponent(bookingRef)}`);
  }, 2000);
  return;
}
```

---

## ✅ VERIFICATION

After making these changes, you should see these logs:

### Server-Side Logs (phonepe-status):
```
✅ Payment successful - checking if server callback created booking
🔒 CLIENT CHECK - Will NOT create booking, only verify
⏳ Checking for booking with reference: PPT250123...
```

### Client-Side Logs (payment-callback page):
```
⏳ Booking pending - waiting for server callback...
Retry 1/10 - waiting 5 seconds...
Retry 2/10 - waiting 5 seconds...
✅ Booking created! Redirecting...
```

---

## 🧪 TEST CHECKLIST

1. ✅ Make a test payment
2. ✅ Check console logs - should see "CLIENT CHECK - Will NOT create booking"
3. ✅ Check database - run this query:
```sql
SELECT b.booking_id, b.booking_ref, b.created_at, p.transaction_id
FROM bookings b
LEFT JOIN payments p ON b.booking_id = p.booking_id
WHERE b.created_at > NOW() - INTERVAL '1 HOUR'
ORDER BY b.created_at DESC
LIMIT 5;
```
4. ✅ Verify only 1 booking for the test payment
5. ✅ Verify booking_ref matches between booking and payment
6. ✅ Check email - should receive only 1 confirmation email

---

## 🚨 IMPORTANT

**Before making changes:**
```bash
git add .
git commit -m "Before double booking fix"
```

**After making changes:**
```bash
git add .
git commit -m "Fix: Prevent double booking by making phonepe-status read-only"
```

---

## 📊 EXPECTED RESULTS

### Database Query Should Show:
```
booking_id | booking_ref    | created_at          | transaction_id
-----------+----------------+--------------------+------------------------
245        | PPT250123456   | 2025-01-23 10:30   | OMO250123103045678
```

### Should NOT Show (Duplicate):
```
booking_id | booking_ref    | created_at          | transaction_id
-----------+----------------+--------------------+------------------------
245        | PPT250123456   | 2025-01-23 10:30   | OMO250123103045678
246        | PPT250123457   | 2025-01-23 10:30   | OMO250123103045678  ❌
```

---

**That's it! Copy the code above and paste it into the files. Test with a payment and verify no duplicates in the database.**
