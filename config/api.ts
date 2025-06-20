// API Base URL
export const API_BASE_URL = "https://ai.alviongs.com/webhook/v1/nibog";

// Authentication API endpoints
export const AUTH_API = {
  SUPERADMIN: {
    LOGIN: `${API_BASE_URL}/superadmin/login`,
    VERIFY: `${API_BASE_URL}/superadmin/verify`,
    LOGOUT: `${API_BASE_URL}/superadmin/logout`,
  },
  USER: {
    LOGIN: `${API_BASE_URL}/user/login`,
    VERIFY: `${API_BASE_URL}/user/verify`,
    LOGOUT: `${API_BASE_URL}/user/logout`,
  },
};

// City API endpoints - Exactly as specified in the API documentation
export const CITY_API = {
  CREATE: `${API_BASE_URL}/city/create`,     // POST
  UPDATE: `${API_BASE_URL}/city/update`,     // POST
  GET: `${API_BASE_URL}/city/get`,           // GET with body (non-standard but specified in docs)
  GET_ALL: `${API_BASE_URL}/city/get-all`,   // GET
  DELETE: `${API_BASE_URL}/city/delete`,     // DELETE with body
};

// Venue API endpoints - Exactly as specified in the API documentation with correct case
export const VENUE_API = {
  CREATE: `${API_BASE_URL.replace('/v1/', '/V1/')}/venues/create`,
  UPDATE: `${API_BASE_URL.replace('/v1/', '/V1/')}/venues/update`,
  GET: `${API_BASE_URL.replace('/v1/', '/V1/')}/venues/get`,
  GET_ALL: `${API_BASE_URL.replace('/v1/', '/V1/')}/venues/get-all`,
  GET_BY_CITY: `${API_BASE_URL.replace('/v1/', '/V1/')}/venues/get-by-city`,
  GET_ALL_WITH_CITY: `${API_BASE_URL.replace('/v1/', '/V1/')}/venues/getall-with-city`,
  DELETE: `${API_BASE_URL.replace('/v1/', '/V1/')}/venues/delete`,
};

// Baby Game API endpoints
const BABY_GAME_BASE_URL = "https://ai.alviongs.com/webhook/V1/nibog";
export const BABY_GAME_API = {
  CREATE: `${BABY_GAME_BASE_URL}/babygame/create`,
  UPDATE: `${BABY_GAME_BASE_URL}/babygame/update`,
  GET: `${BABY_GAME_BASE_URL}/babygame/get`,
  GET_ALL: `${BABY_GAME_BASE_URL}/babygame/get-all`,
  DELETE: `${BABY_GAME_BASE_URL}/babygame/delete`,
};

// Event API endpoints
export const EVENT_API = {
  CREATE: "https://ai.alviongs.com/webhook/v1/nibog/event-game-slots/create", // POST - This is the endpoint for creating events with games and slots
  GET: "https://ai.alviongs.com/webhook/v1/nibog/event-game-slots/get",       // POST with id in body
  GET_ALL: "https://ai.alviongs.com/webhook/v1/nibog/event-game-slots/get-all", // GET
  UPDATE: "https://ai.alviongs.com/webhook/v1/nibog/event-game-slots/update", // POST with full event data
  DELETE: "https://ai.alviongs.com/webhook/v1/nibog/event-game-slots/delete", // POST with id in body
};



// Social Media API endpoints
export const SOCIAL_MEDIA_API = {
  CREATE: "https://ai.alviongs.com/webhook/v1/nibog/socialmedia/create", // POST
  GET: "https://ai.alviongs.com/webhook/v1/nibog/socialmedia/get", // GET
};



// Email Settings API endpoints
export const EMAIL_SETTING_API = {
  CREATE: "https://ai.alviongs.com/webhook/v1/nibog/emailsetting/create", // POST
  GET: "https://ai.alviongs.com/webhook/v1/nibog/emailsetting/get", // GET
};




// General Settings API endpoints
export const GENERAL_SETTING_API = {
  CREATE: "https://ai.alviongs.com/webhook/v1/nibog/generalsetting/create", // POST
  GET: "https://ai.alviongs.com/webhook/v1/nibog/generalsetting/get", // GET
};




// User Authentication API endpoints
export const USER_AUTH_API = {
  REGISTER: "https://ai.alviongs.com/webhook/v1/nibog/user/register", // POST
  LOGIN: "https://ai.alviongs.com/webhook/v1/nibog/user/login", // POST
};

// User Management API endpoints
export const USER_API = {
  GET_ALL: "https://ai.alviongs.com/webhook/v1/nibog/user/get-all", // GET
  GET: "https://ai.alviongs.com/webhook/v1/nibog/user/get", // GET with id
  UPDATE: "https://ai.alviongs.com/webhook/v1/nibog/user/edit", // POST - Using the edit endpoint as specified in the API docs
  DELETE: "https://ai.alviongs.com/webhook/v1/nibog/user/delete", // POST
};

// Booking API endpoints
export const BOOKING_API = {
  CREATE: "https://ai.alviongs.com/webhook/v1/nibog/bookingsevents/create", // POST
  GET_ALL: "https://ai.alviongs.com/webhook/v1/nibog/bookingsevents/get-all", // GET
  UPDATE: "https://ai.alviongs.com/webhook/v1/nibog/bookingsevents/update", // POST
};

// Promo Code API endpoints
export const PROMO_CODE_API = {
  CREATE: "https://ai.alviongs.com/webhook/v1/nibog/promocode/create", // POST
  GET_ALL: "https://ai.alviongs.com/webhook/v1/nibog/promocode/get-all", // GET
  GET_BY_ID: "https://ai.alviongs.com/webhook/v1/nibog/promocode/get", // POST
};

// PhonePe API endpoints are now in config/phonepe.ts
