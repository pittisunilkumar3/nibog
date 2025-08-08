import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const enriched = {
      ...payload,
      timestamp: new Date().toISOString(),
    }
    // For now, just log to server console. In production, persist to DB or external log service.
    console.log('📧 BULK EMAIL LOG:', JSON.stringify(enriched))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Bulk email log error:', error)
    return NextResponse.json({ success: false, error: 'Invalid log payload' }, { status: 400 })
  }
}

