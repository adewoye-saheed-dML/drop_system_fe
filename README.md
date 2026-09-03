# Limited Product Drop

A full-stack limited-inventory reservation and checkout system built with React, TypeScript, NestJS, Prisma, and PostgreSQL.

The core challenge is preventing overselling when multiple users attempt to reserve the same limited inventory concurrently.

## Features

- Limited product inventory
- Temporary reservations
- Reservation expiration
- Checkout
- Order creation
- Server-side price calculation
- PostgreSQL row-level locking
- Transactional inventory updates
- Checkout/expiration race protection
- Swagger API documentation
- Frontend loading states
- Frontend error handling
- Automated frontend and backend tests

## Architecture

```text
React + TypeScript
        |
        | HTTP
        v
NestJS REST API
        |
   +----+----+
   |         |
Products  Reservations
             |
             v
          Checkout
             |
             v
          Prisma
             |
             v
        PostgreSQL

# Concurrency Strategy

The most important correctness requirement is preventing inventory overselling.

Reservation creation runs inside a PostgreSQL transaction and locks the product row with `FOR UPDATE`.

```
Request A ----\
Request B -----+----> Lock product row
Request C ----/             |
                             v
                       Check inventory
                             |
                    +--------+--------+
                    |                 |
                  Enough          Insufficient
                    |                 |
                    v                 v
              Decrement stock      Reject
                    |
                    v
            Create reservation
```

This serializes concurrent inventory decisions for the same product.

## Checkout Race Protection

Checkout and expiration can occur at approximately the same time.

Both operations lock the reservation row before changing its state.

Therefore the reservation can only transition once:

```
ACTIVE
  |
  +--> COMPLETED
  |
  +--> EXPIRED
```

This prevents inventory from being released incorrectly after a successful checkout.

## Checkout

The backend calculates the order amount from the product price and reservation quantity.

The frontend never supplies the final amount.

Checkout performs:

1. Lock reservation.
2. Verify reservation exists.
3. Verify it is active.
4. Verify it has not expired.
5. Verify an order does not already exist.
6. Calculate amount using server-side product data.
7. Create the order.
8. Mark reservation as completed.

## API

### Products

```
GET /products
```

### Reservations

```
POST /reservations
GET /reservations/:id
```

### Checkout

```
POST /checkout
GET /checkout/:id
```

### Swagger

```
http://localhost:3000/api-docs
```

## Frontend Flow

```
Products
   |
   | Reserve
   v
Reservation
   |
   | Countdown
   v
Checkout
   |
   | Complete
   v
Success
```

## Local Setup

### Frontend

```bash
npm install
```

Create `.env`:

```
VITE_API_URL=http://localhost:3000/
```

Run:

```bash
npm run dev
```

### Backend

Configure:

```
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/inventory_db
CORS_ORIGINS=http://localhost:5173
```

Then:

```bash
npm install
npx prisma migrate deploy
npm run start:dev
```

## Testing

Frontend:

```bash
npm run test
npm run lint
npm run build
```

Backend:

```bash
npm test
npx jest --config ./test/jest-e2e.json
```

The backend test suite includes concurrent reservation tests and checkout-versus-expiration race tests.

## Design Decisions

### PostgreSQL

PostgreSQL provides the transaction and row-locking semantics required for safe concurrent inventory updates.

### Row Locking

A simple:

```
read stock -> check -> update
```

approach can oversell under concurrency.

The implementation instead locks the product before checking and changing inventory.

### Transactions

Inventory decrement and reservation creation happen in one transaction.

Checkout order creation and reservation completion also happen in one transaction.

### Backend Source of Truth

The frontend countdown is only a user-interface indicator.

The backend performs the authoritative expiration check during checkout.

### Trade-offs

This implementation intentionally avoids unnecessary infrastructure for the challenge.

Current limitations:

- No authentication
- No real payment gateway
- No queue/message broker
- No distributed cache
- Scheduled expiration worker

For a production-scale deployment, the expiration process could be moved to a durable job queue and observability could be expanded with metrics, tracing, and structured logs.

## Future Improvements

- Authentication and authorization
- Payment provider integration
- Checkout idempotency keys
- Rate limiting
- Distributed job processing
- Notifications
- Metrics and tracing
- Load testing

## Run Everything

Frontend:

```bash
npm install
npm run test
npm run lint
npm run build
```

Expected output:

```
Frontend tests   ✅
Lint             ✅
Production build ✅
```

Backend:

```bash
cd ~/projects/lm/drop_system
npm test
npx jest --config ./test/jest-e2e.json
```
