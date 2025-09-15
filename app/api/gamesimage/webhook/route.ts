import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Game image webhook request:', body);

    // Validate required fields
    const { game_id, image_url, priority, is_active } = body;
    
    if (!game_id) {
      return NextResponse.json(
        { error: 'game_id is required' },
        { status: 400 }
      );
    }

    if (!image_url) {
      return NextResponse.json(
        { error: 'image_url is required' },
        { status: 400 }
      );
    }

    if (priority === undefined || priority === null) {
      return NextResponse.json(
        { error: 'priority is required' },
        { status: 400 }
      );
    }

    // Prepare the payload for the external webhook
    // Use the local upload path as provided (e.g., "./upload/gamesimage/gameimage_123456789_123.jpg")
    const webhookPayload = {
      game_id: parseInt(game_id),
      image_url: image_url, // This will be the local path like "./upload/gamesimage/filename.jpg"
      priority: parseInt(priority),
      is_active: is_active !== undefined ? is_active : true
    };

    console.log('Sending to external webhook:', webhookPayload);
    console.log('External webhook URL:', 'https://ai.alviongs.com/webhook/nibog/gamesimage/create');

    // Send to external webhook
    const webhookResponse = await fetch('https://ai.alviongs.com/webhook/nibog/gamesimage/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    console.log(`External webhook response status: ${webhookResponse.status}`);

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error('External webhook error:', {
        status: webhookResponse.status,
        statusText: webhookResponse.statusText,
        errorText: errorText
      });
      return NextResponse.json(
        { error: `External webhook failed: ${webhookResponse.status} ${webhookResponse.statusText}`, details: errorText },
        { status: webhookResponse.status }
      );
    }

    const webhookResult = await webhookResponse.json();
    console.log('External webhook success:', {
      status: webhookResponse.status,
      result: webhookResult
    });

    return NextResponse.json(webhookResult, { status: 200 });

  } catch (error) {
    console.error('Game image webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process game image webhook' },
      { status: 500 }
    );
  }
}
