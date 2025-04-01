# Popcorn Palace Movie Ticket Booking System

## Overview
The Popcorn Palace Movie Ticket Booking System is a comprehensive platform built with microservices architecture, running via **`Docker Compose`**. The system consists of **`backend`** services for movie management, theater operations, showtime scheduling, user management and booking functionalities, along with two separate **`frontend`** applications for administrators and customers.

## System Architecture

### Backend Services
- **Movie Service**: Manages movies available on the platform
- **Theater Service**: Handles theater management
- **Showtime Service**: Manages movie showtimes across theaters
- **User Service**: Handles user authentication and profiles
- **Booking Service**: Processes seat reservations and ticket bookings

### Frontend Applications
1. **Admin Front** (runs on http://localhost:5174):
   - Movie management (add, edit, delete movies)
   - Theater management (add, edit, delete theaters) 
   - Showtime scheduling and management
![Alt text](frontend/admin-front/public/List%20Showtimes.png)

2. **Customer Front** (runs on http://localhost:5173):
   - User registration and login
   - Movie browsing and discovery
   - Showtime selection
   - Seat booking functionality
![Alt text](frontend/customer-front/public/Movie%20booking.png)

## Technical Aspects
- **Backend**: Built using `Typescript`, leveraging its robust framework for creating RESTful APIs
- **Frontend**: Developed with `React` + `TypeScript` + `Vite`
- **Data Storage**: Can be managed using `PostgreSQL` database 
- **Deployment**: All services run as microservices orchestrated via Docker Compose

## API Documentation

### Movies APIs

| API Description           | Endpoint               | Request Body                          | Response Status | Response Body |
|---------------------------|------------------------|---------------------------------------|-----------------|---------------|
| Get all movies | GET /movies/all | | 200 OK | [ { "id": 12345, "title": "Sample Movie Title 1", "genre": "Action", "duration": 120, "rating": 8.7, "releaseYear": 2025 }, { "id": 67890, "title": "Sample Movie Title 2", "genre": "Comedy", "duration": 90, "rating": 7.5, "releaseYear": 2024 } ] |
| Add a movie | POST /movies | { "title": "Sample Movie Title", "genre": "Action", "duration": 120, "rating": 8.7, "releaseYear": 2025 } | 200 OK | { "id": 1, "title": "Sample Movie Title", "genre": "Action", "duration": 120, "rating": 8.7, "releaseYear": 2025 }|
| Update a movie | POST /movies/update/{movieTitle} | { "title": "Sample Movie Title", "genre": "Action", "duration": 120, "rating": 8.7, "releaseYear": 2025 } | 200 OK | |
| Delete a movie | DELETE /movies/{movieTitle} | | 200 OK | |

### Theaters APIs

| API Description           | Endpoint               | Request Body                          | Response Status | Response Body |
|---------------------------|------------------------|---------------------------------------|-----------------|---------------|
| Get all theaters | GET /theaters | | 200 OK | [ { "id": 1, "name": "Theater Name 1", "address": "123 Main St", "max_person": 300 }, { "id": 2, "name": "Theater Name 2", "address": "456 Oak Ave", "max_person": 200 } ] |
| Get theater by ID | GET /theaters/{id} | | 200 OK | { "id": 1, "name": "Theater Name 1", "address": "123 Main St", "max_person": 300 } |
| Get theater by name | GET /theaters/name/{name} | | 200 OK | { "id": 1, "name": "Theater Name 1", "address": "123 Main St", "max_person": 300 } |
| Create a theater | POST /theaters | { "name": "Theater Name", "address": "123 Main St", "max_person": 300 } | 200 OK | { "id": 1, "name": "Theater Name", "address": "123 Main St", "max_person": 300 } |
| Update a theater | PUT /theaters/{id} | { "name": "Updated Theater Name", "address": "123 Main St", "max_person": 350 } | 200 OK | { "id": 1, "name": "Updated Theater Name", "address": "123 Main St", "max_person": 350 } |
| Delete a theater | DELETE /theaters/{id} | | 200 OK | |

### Users APIs

| API Description           | Endpoint               | Request Body                          | Response Status | Response Body |
|---------------------------|------------------------|---------------------------------------|-----------------|---------------|
| Create a user | POST /users | { "firstName": "John", "lastName": "Doe", "email": "john.doe@example.com" } | 201 Created | { "id": "84438967-f68f-4fa0-b620-0f08217e76af" } |
| Get user ID by name | GET /users/id/{firstName}/{lastName} | | 200 OK | { "id": "84438967-f68f-4fa0-b620-0f08217e76af" } |

### Showtimes APIs

| API Description            | Endpoint                           | Request Body                                                                                                                                      | Response Status | Response Body                                                                                                                                                                                                                                                                   |
|----------------------------|------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Get showtime by ID | GET /showtimes/{showtimeId} | | 200 OK | { "id": 1, "price":50.2, "movieId": 1, "theater": "Sample Theater", "startTime": "2025-02-14T11:47:46.125405Z", "endTime": "2025-02-14T14:47:46.125405Z" } |
| Add a showtime | POST /showtimes | { "movieId": 1, "price":20.2, "theater": "Sample Theater", "startTime": "2025-02-14T11:47:46.125405Z", "endTime": "2025-02-14T14:47:46.125405Z" } | 200 OK | { "id": 1, "price":50.2,"movieId": 1, "theater": "Sample Theater", "startTime": "2025-02-14T11:47:46.125405Z", "endTime": "2025-02-14T14:47:46.125405Z" } |
| Update a showtime | POST /showtimes/update/{showtimeId}| { "movieId": 1, "price":50.2, "theater": "Sample Theater", "startTime": "2025-02-14T11:47:46.125405Z", "endTime": "2025-02-14T14:47:46.125405Z" } | 200 OK | |
| Delete a showtime | DELETE /showtimes/{showtimeId} | | 200 OK | |

### Bookings APIs

| API Description           | Endpoint       | Request Body                                     | Response Status | Response Body                                                                                                                                          |
|---------------------------|----------------|--------------------------------------------------|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| Book a ticket | POST /bookings | { "showtimeId": 1, "seatNumber": 15 , userId:"84438967-f68f-4fa0-b620-0f08217e76af"} | 200 OK | { "bookingId":"d1a6423b-4469-4b00-8c5f-e3cfc42eacae" } |

## Running the app

```bash
# development
$ docker compose up -d
```

After running docker compose, the applications will be available at:
- Admin front: http://localhost:5174
- Customer front: http://localhost:5173

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Project Structure

```
popcorn-palace/
├── compose.yml
├── backend/
│   ├── movies-service/
│   ├── theaters-service/
│   ├── showtimes-service/
│   ├── users-service/
│   └── bookings-service/
└── frontend/
    ├── admin-front/  # Runs on port 5174
    └── customer-front/  # Runs on port 5173
```