# Musicbocks
A platform for rating and reviewing your favorite albums from your favorite artists. It's like letterboxd for music.

<img width="1369" height="689" alt="image" src="https://github.com/user-attachments/assets/8370bafd-1a9b-49ef-af4c-a5564e047db6" />

## Tech Stack
Frontend: React, Tailwind CSS
Backend: Node/Express
Database: PostgresQL

# System Design
This is the initial design I came up for the app, I added some new routes but the core functionality of the app remains the same!

<img width="1027" height="570" alt="image" src="https://github.com/user-attachments/assets/b5b43313-5e3a-4e0b-a52a-5086a4209fa8" />

## Auth Flow
<img width="334" height="519" alt="image" src="https://github.com/user-attachments/assets/ee1cfa29-9a92-410b-be95-f8e7e40fac9d" />

## ER Diagram
<img width="771" height="450" alt="erd" src="https://github.com/user-attachments/assets/c16f6cb8-97af-4f8c-a1ae-52bb6111066e" />

## Endpoints

### GET `/search/:query`
Search for artists.  
**Middleware:** `artistResponse`  
**Response:** JSON results or `"no results"` if nothing is found.

---

### GET `/artist/:query`
Get artist information.  
**Handler:** `albumResponse`  

---

### GET `/album/:id`
Get album information.  
**Handler:** `albumInfo`  

---

### POST `/signup`
Create a new user.  
**Handler:** `createUsers`  

---

### POST `/login`
Login an existing user.  
**Handler:** `loginUser`  

---

### DELETE `/logout`
Logout the current user.  
Destroys the session and clears the cookie.  
**Response:** 
```json
{
  "success": true,
  "message": "logged out"
}
