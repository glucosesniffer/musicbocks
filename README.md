# Musicbocks
A platform for rating and reviewing your favorite albums from your favorite artists. It's like letterboxd for music.

<img width="1369" height="689" alt="image" src="https://github.com/user-attachments/assets/8370bafd-1a9b-49ef-af4c-a5564e047db6" />

## Tech Stack
**Frontend:** React, Tailwind CSS  
**Backend:** Node.js, Express  
**Database:** PostgreSQL

# System Design
This is the initial design I came up for the app, I added some new routes but the core functionality of the app remains the same!

<img width="1027" height="570" alt="image" src="https://github.com/user-attachments/assets/b5b43313-5e3a-4e0b-a52a-5086a4209fa8" />

## Auth Flow
<img width="334" height="519" alt="image" src="https://github.com/user-attachments/assets/ee1cfa29-9a92-410b-be95-f8e7e40fac9d" />

## ER Diagram
<img width="771" height="450" alt="erd" src="https://github.com/user-attachments/assets/c16f6cb8-97af-4f8c-a1ae-52bb6111066e" />

## API Endpoints

### Search & Discovery

#### GET `/search/:query`
Search for artists.  
**Handler:** `artistResponse`  
**Response:** JSON results or `"no results"` if nothing is found.

#### GET `/`
Get main page content with featured albums.  
**Handler:** `mainPage`

---

### Artist & Album Information

#### GET `/artist/:query`
Get artist information and albums.  
**Handler:** `albumResponse`

#### GET `/album/:id`
Get album information including user's rating and all reviews.  
**Handler:** `albumInfo`

---

### Authentication

#### POST `/signup`
Create a new user account.  
**Handler:** `createUsers`

#### POST `/login`
Login an existing user.  
**Handler:** `loginUser`

#### DELETE `/logout`
Logout the current user.  
Destroys the session and clears the cookie.  
**Response:** 
```json
{
  "success": true,
  "message": "logged out"
}
```

---

### Reviews & Ratings

#### POST `/review`
Add or update a review for an album.  
**Handler:** `addReviews`  
**Body:**
```json
{
  "rating": 5,
  "album_id": 123,
  "review_text": "Amazing album!"
}
```

#### PUT `/review/update`
Update an existing review.  
**Handler:** `updateReview`  
**Body:**
```json
{
  "review_id": 456,
  "rating": 4,
  "review_text": "Updated review text"
}
```

#### DELETE `/review/:id`
Delete a review.  
**Handler:** `deleteReview`  
**Auth:** Required (user can only delete their own reviews)

---

### User Profile

#### GET `/profile`
Get current user's profile information.  
**Handler:** `getUserProfile`  
**Auth:** Required

#### GET `/profile/reviews`
Get all reviews by the current user.  
**Handler:** `getUserReviews`  
**Auth:** Required

#### PUT `/profile/picture`
Update user's profile picture.  
**Handler:** `updateProfilePicture`  
**Auth:** Required  
**Body:**
```json
{
  "profile_picture": "base64_encoded_image"
}
```

---

### Artist Ratings

#### POST `/artist/rating`
Add or update a rating for an artist.  
**Handler:** `addArtistRating`

#### GET `/artist/:id/rating`
Get rating for a specific artist.  
**Handler:** `getArtistRating`
