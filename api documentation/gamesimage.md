# Game Image create

POST https://ai.alviongs.com/webhook/nibog/gamesimage/create

Payload:-

{
  "game_id": 123,
  "image_url": "https://example.com/images/game123.jpg",
  "priority": 1,
  "is_active": true
}


Responsive:-

[
    {
        "id": 2,
        "game_id": 123,
        "image_url": "https://example.com/images/game123.jpg",
        "priority": 1,
        "is_active": true,
        "created_at": "2025-09-15T08:24:01.024Z",
        "updated_at": "2025-09-15T08:24:01.024Z"
    }
]


# Getting the image

POST https://ai.alviongs.com/webhook/nibog/gamesimage/get

payload :-

{
    "game_id":4
}

responsive :-

[
    {
        "id": 4,
        "game_id": 131,
        "image_url": "./upload/gameimages/gameimage_1757947801601_4538.png",
        "priority": 1,
        "is_active": true,
        "created_at": "2025-09-15T09:20:04.921Z",
        "updated_at": "2025-09-15T09:20:04.921Z"
    }
]



# update game image 

POST https://ai.alviongs.com/webhook/nibog/gamesimage/update

payload :-

{
    "game_id": 131,
    "image_url": "./upload/gameimages/gameimage_1757947801601_4538.png",
    "priority": 1,
    "is_active": true
}

response :-

[
    {
        "id": 4,
        "game_id": 131,
        "image_url": "./upload/gameimages/gameimage_1757947801601_4538.png",
        "priority": 1,
        "is_active": true,
        "created_at": "2025-09-15T09:20:04.921Z",    
        "updated_at": "2025-09-15T09:20:04.921Z"
    }
]




