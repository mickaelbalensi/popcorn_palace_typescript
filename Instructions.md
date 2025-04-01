# Popcorn Palace Movie Ticket Booking System

<!-- <p align="center">
  <img src="frontend/admin-front/public/List%20Showtimes.png" alt="Left Image" width="45%" style="float: left; margin-right: 10px;">
  <img src="frontend/customer-front/public/Movie%20booking.png" alt="Right Image" width="45%" style="float: right;">
</p> -->
| Admin - Showtimes Menu  | Customer - Movie Booking |
|------------|------------|
| ![Left](frontend/admin-front/public/List%20Showtimes.png) | ![Right](frontend/customer-front/public/Movie%20booking.png) |

## Set Up the App

```bash
# development
$ docker compose build
```
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
$ cd backend

# 3 unit-tests:
# 1. for movies-service:

$ cd movies-service
$ npm install
$ npm run test
# 2. booking

$ cd ../booking-service
$ npm install
$ npm run test

# 3. showtimes
$ cd ../showtimes-service
$ npm install
$ npm run test
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

