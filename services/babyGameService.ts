// Baby game service - handles all baby game related API calls

export interface BabyGame {
  id?: number;
  game_name: string;
  description?: string;
  game_description?: string; // For API request
  min_age?: number;
  min_age_months?: number; // For API request
  max_age?: number;
  max_age_months?: number; // For API request
  duration_minutes: number;
  suggested_price?: number;
  categories: string[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Create a new baby game
 * @param gameData The game data to create
 * @returns The created game
 */
export async function createBabyGame(gameData: BabyGame): Promise<BabyGame> {
  try {
    // Use our internal API route to avoid CORS issues
    const response = await fetch('/api/babygames/create', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData), // Send original gameData, let the API route handle field mapping
    });

    if (!response.ok) {
      await response.text(); // Consume the response body
      throw new Error(`API returned error status: ${response.status}`);
    }

    const data = await response.json();

    // Return the first item if it's an array, otherwise return the data
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    throw error;
  }
}

/**
 * Get all baby games
 * @returns A list of all baby games
 */
export async function getAllBabyGames(): Promise<BabyGame[]> {
  try {
    // Use our internal API route to avoid CORS issues
    const response = await fetch('/api/babygames/get-all', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned error status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Ensure we return an array
    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Get a baby game by ID
 * @param id The ID of the baby game to get
 * @returns The baby game with the specified ID
 */
export async function getBabyGameById(id: number): Promise<BabyGame> {
  try {
    // Use our internal API route to avoid CORS issues
    const response = await fetch('/api/babygames/get', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned error status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Return the first item if it's an array, otherwise return the data
    const gameData = Array.isArray(data) ? data[0] : data;

    if (!gameData) {
      throw new Error("No game data found");
    }

    return gameData;
  } catch (error) {
    throw error;
  }
}

/**
 * Update a baby game
 * @param gameData The game data to update
 * @returns The updated game
 */
export async function updateBabyGame(gameData: BabyGame): Promise<BabyGame> {
  if (!gameData.id) {
    throw new Error("Game ID is required for update");
  }

  try {
    // Use our internal API route to avoid CORS issues
    const response = await fetch('/api/babygames/update', {
      method: "POST", // Changed from PUT to POST as per API documentation
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData), // Send original gameData, let the API route handle field mapping
    });

    if (!response.ok) {
      await response.text(); // Consume the response body
      throw new Error(`API returned error status: ${response.status}`);
    }

    const data = await response.json();

    // Return the first item if it's an array, otherwise return the data
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a baby game
 * @param id The ID of the baby game to delete
 * @returns A success indicator
 */
export async function deleteBabyGame(id: number): Promise<{ success: boolean }> {
  if (!id || isNaN(Number(id)) || Number(id) <= 0) {
    throw new Error("Invalid game ID. ID must be a positive number.");
  }

  try {
    // Use our internal API route to avoid CORS issues
    const response = await fetch('/api/babygames/delete', {
      method: "POST", // Changed from DELETE to POST as per API documentation
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: Number(id) }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      try {
        // Try to parse the error response as JSON
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || `API returned error status: ${response.status}`);
      } catch (parseError) {
        // If parsing fails, throw a generic error
        throw new Error(`Failed to delete game. API returned status: ${response.status}`);
      }
    }

    // Try to parse the response
    try {
      const data = await response.json();

      // Check if the response indicates success
      if (data && (data.success === true || (Array.isArray(data) && data[0]?.success === true))) {
        return { success: true };
      }

      return { success: true }; // Default to success if we got a 200 response
    } catch (parseError) {
      // If we can't parse the response but got a 200 status, consider it a success
      return { success: true };
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Upload image for baby game
 * @param file The image file to upload
 * @returns Promise with the uploaded file path
 */
export async function uploadBabyGameImage(file: File): Promise<string> {
  try {
    console.log('Uploading baby game image...');

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/babygames/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload baby game image');
    }

    const result = await response.json();
    console.log('Successfully uploaded baby game image:', result.path);
    return result.path;
  } catch (error) {
    console.error('Error uploading baby game image:', error);
    throw error;
  }
}

/**
 * Upload game image to the gamesimage directory
 * @param file The image file to upload
 * @returns Promise with upload result containing path and filename
 */
export async function uploadGameImage(file: File): Promise<{
  success: boolean;
  path: string;
  filename: string;
  originalName: string;
  size: number;
}> {
  console.log("Uploading game image:", file.name);

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/gamesimage/upload', {
      method: 'POST',
      body: formData,
    });

    console.log(`Upload game image response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response: ${errorText}`);
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Game image uploaded:", data);

    return data;
  } catch (error) {
    console.error("Error uploading game image:", error);
    throw error;
  }
}

/**
 * Send game image data to external webhook
 * @param gameId The game ID
 * @param imageUrl The image URL/path
 * @param priority The priority of the image
 * @param isActive Whether the image is active
 * @returns Promise with webhook result
 */
export async function sendGameImageToWebhook(
  gameId: number,
  imageUrl: string,
  priority: number,
  isActive: boolean = true
): Promise<any> {
  console.log("Sending game image to webhook:", { gameId, imageUrl, priority, isActive });

  try {
    const response = await fetch('/api/gamesimage/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        game_id: gameId,
        image_url: imageUrl,
        priority: priority,
        is_active: isActive,
      }),
    });

    console.log(`Game image webhook response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response: ${errorText}`);
      throw new Error(`Webhook failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Game image webhook success:", data);

    return data;
  } catch (error) {
    console.error("Error sending game image to webhook:", error);
    throw error;
  }
}

/**
 * Fetch game images by game ID
 * @param gameId The game ID
 * @returns Promise with array of game images
 */
export async function fetchGameImages(gameId: number): Promise<any[]> {
  console.log("Fetching game images for game ID:", gameId);

  try {
    const response = await fetch('/api/gamesimage/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        game_id: gameId,
      }),
    });

    console.log(`Fetch game images response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response: ${errorText}`);
      throw new Error(`Fetch failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Game images fetched:", data);

    // Return the array of images, handling various response formats
    if (Array.isArray(data)) {
      return data.filter(img => img && typeof img === 'object');
    }

    // Handle case where API returns empty object or null
    return [];
  } catch (error) {
    console.error("Error fetching game images:", error);
    throw error;
  }
}
