## creating the footer setting

POST :- https://ai.alviongs.com/webhook/v1/nibog/footer_setting/post

payload :-

{
  "company_name": "Nibog Pvt Ltd",
  "company_description": "Nibog is a premium organizer of children's events like baby olympics, games, and fun educational activities.",
  "address": "1st Floor, Plot No 123, Madhapur, Hyderabad, Telangana, 500081",
  "phone": "+91-9876543210",
  "email": "support@nibog.com",
  "newsletter_enabled": true,
  "copyright_text": "© 2025 Nibog. All rights reserved."
}


responsive :-

[
  {
    "id": 1,
    "company_name": "Nibog Pvt Ltd",
    "company_description": "Nibog is a premium organizer of children's events like baby olympics, games, and fun educational activities.",
    "address": "1st Floor, Plot No 123, Madhapur, Hyderabad, Telangana, 500081",
    "phone": "+91-9876543210",
    "email": "support@nibog.com",
    "newsletter_enabled": true,
    "copyright_text": "© 2025 Nibog. All rights reserved."
  }
]


## get the footer setting

GET :- https://ai.alviongs.com/webhook/v1/nibog/footer_setting/get

responsive :-

[
  {
    "company_name": "Nibog Pvt Ltd",
    "company_description": "Nibog is a premium organizer of children's events like baby olympics, games, and fun educational activities.",
    "address": "1st Floor, Plot No 123, Madhapur, Hyderabad, Telangana, 500081",
    "phone": "+91-9876543210",
    "email": "support@nibog.com",
    "newsletter_enabled": true,
    "copyright_text": "© 2025 Nibog. All rights reserved.",
    "facebook_url": "https://facebook.com/nibog/test",
    "instagram_url": "https://instagram.com/nibog",
    "twitter_url": "https://twitter.com/nibog",
    "youtube_url": "https://youtube.com/nibog",
    "created_at": "2025-05-05T07:42:19.317Z",
    "updated_at": "2025-08-07T07:28:04.468Z"
  }
]


