import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { params } = await Promise.resolve(context);
    const bookingId = params.id;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    // For now, we'll get the booking from the get-all endpoint and filter by ID
    // since there's no specific get-by-id endpoint in the API documentation
    const apiUrl = "https://ai.alviongs.com/webhook/v1/nibog/bookingsevents/get-all";

    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `API returned error status: ${response.status}` },
        { status: response.status }
      );
    }

    // Get the response data
    const responseText = await response.text();

    let allBookings;
    try {
      // Try to parse the response as JSON
      allBookings = JSON.parse(responseText);
    } catch (parseError) {
      return NextResponse.json(
        {
          error: "Failed to parse API response"
        },
        { status: 500 }
      );
    }

    // Validate that we have an array
    if (!Array.isArray(allBookings)) {
      return NextResponse.json(
        { error: "Invalid API response format" },
        { status: 500 }
      );
    }

    // Find the specific booking by ID
    const booking = allBookings.find((b: any) =>
      String(b.booking_id) === String(bookingId)
    );

    if (!booking) {
      return NextResponse.json(
        { error: `Booking with ID ${bookingId} not found` },
        { status: 404 }
      );
    }

    // Flatten child info if present
    let result = booking;
    if (Array.isArray(booking.children) && booking.children.length > 0) {
      const child = booking.children[0];
      result = {
        ...booking,
        child_full_name: child.child_full_name,
        child_date_of_birth: child.child_date_of_birth,
        child_school_name: child.child_school_name,
        child_gender: child.child_gender,
        child_is_active: child.child_is_active,
        child_created_at: child.child_created_at,
        child_updated_at: child.child_updated_at,
        child_id: child.child_id
      };
    }
    // Return the specific booking
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    // Handle specific error types
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: "Request timeout - the booking service is taking too long to respond" },
        { status: 504 }
      );
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return NextResponse.json(
        { error: "Unable to connect to booking service" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to get booking" },
      { status: 500 }
    );
  }
}
