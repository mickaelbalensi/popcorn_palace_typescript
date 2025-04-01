# Popcorn Palace Movie Ticket Booking System

<!-- <p align="center">
  <img src="frontend/admin-front/public/List%20Showtimes.png" alt="Left Image" width="45%" style="float: left; margin-right: 10px;">
  <img src="frontend/customer-front/public/Movie%20booking.png" alt="Right Image" width="45%" style="float: right;">
</p> -->
| Admin - Showtimes Menu  | Customer - Movie Booking |
|------------|------------|
| ![Left](frontend/admin-front/public/List%20Showtimes.png) | ![Right](frontend/customer-front/public/Movie%20booking.png) |

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

