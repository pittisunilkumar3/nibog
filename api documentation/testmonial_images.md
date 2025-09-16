# create or update image for testimonial 

POST https://ai.alviongs.com/webhook/nibog/testmonialimages/update

payload :-

{
  "testimonial_id": 101,
  "image_url": "https://example.com/images.jpg",
  "priority": 1,
  "is_active": true
}

response :- 

[
    {
        "id": 1,
        "testimonial_id": 101,
        "image_url": "https://example.com/images.jpg",
        "priority": 1,
        "is_active": true,
        "created_at": "2025-09-16T04:30:24.635Z",
        "updated_at": "2025-09-16T04:30:24.635Z"
    }
]





