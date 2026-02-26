# Banking System - Ledger Service

A secure, scalable backend API for a banking system built with Node.js, Express.js, and MongoDB. This service implements a complete ledger-based transaction system with user authentication, account management, and financial transaction processing.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
  - [Authentication Routes](#authentication-routes)
  - [Account Routes](#account-routes)
  - [Transaction Routes](#transaction-routes)
- [Database Models](#database-models)
- [Authentication & Authorization](#authentication--authorization)
- [Error Handling](#error-handling)

---

## Features

✨ **Core Features:**

- 🔐 **User Authentication** - Secure registration and login with JWT tokens
- 🏦 **Account Management** - Create and manage multiple accounts per user
- 💰 **Transaction Processing** - Transfer funds between accounts with ledger tracking
- 📊 **Ledger System** - Double-entry bookkeeping for accurate balance tracking
- 🔒 **Security** - Password hashing with bcryptjs, JWT authentication, token blacklisting
- 📧 **Email Notifications** - Send emails on user registration and transactions
- ⚡ **Idempotency** - Prevents duplicate transactions with idempotency keys
- 🛡️ **Protected Routes** - All sensitive operations require authentication

---

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js v5.2.1
- **Database:** MongoDB (Mongoose v9.1.5)
- **Authentication:** JWT (jsonwebtoken v9.0.3)
- **Security:** bcryptjs v3.0.3
- **Email:** Nodemailer v7.0.12
- **Environment:** dotenv v17.2.3

---

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (local or cloud - MongoDB Atlas)
- npm or yarn package manager

### Step 1: Clone/Download the Project

```bash
cd "Banking System"
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env  # If example exists, or create new
```

### Step 4: Configure Environment Variables

See [Environment Variables](#environment-variables) section below.

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/banking-system?retryWrites=true&w=majority

# JWT Secret (use a strong, random string)
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random

# Email Configuration (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password


### How to Get Email Credentials:

1. Use Gmail with App Passwords:
   - Enable 2-Factor Authentication on Gmail
   - Generate an App-specific Password
   - Use that password in `EMAIL_PASSWORD`

2. Or use any SMTP service like SendGrid, Mailgun, etc.

---

## Running the Application

### Development Mode (with live reload)

```bash
npm run dev
```

Uses nodemon to auto-restart on file changes.

### Production Mode

```bash
npm start
```

### Expected Output

```
Server is running on port 3000
server is connected to DB
```

### Test the Server

```bash
curl http://localhost:3000
# Response: "Ledger Service is up and running"
```

---

## Project Structure

```
Banking System/
├── server.js                    # Application entry point
├── package.json                 # Dependencies and scripts
├── .env                        # Environment variables (not in git)
├── README.md                   # This file
└── src/
    ├── app.js                  # Express app configuration
    ├── config/
    │   └── db.js              # MongoDB connection setup
    ├── controllers/
    │   ├── auth.controller.js          # Auth logic (register, login, logout)
    │   ├── account.controller.js       # Account logic (create, retrieve, balance)
    │   └── transaction.controller.js   # Transaction logic (transfer, initial funds)
    ├── middleware/
    │   └── auth.middleware.js          # JWT verification, token blacklist check
    ├── models/
    │   ├── user.model.js       # User schema with password hashing
    │   ├── account.model.js    # Account schema (user's accounts)
    │   ├── transaction.model.js # Transaction schema (transfers)
    │   ├── ledger.model.js     # Ledger entries (debit/credit)
    │   └── blackList.model.js  # Blacklisted tokens (for logout)
    ├── routes/
    │   ├── auth.routes.js              # /api/auth routes
    │   ├── account.routes.js           # /api/accounts routes
    │   └── transaction.routes.js       # /api/transactions routes
    └── services/
        └── email.service.js            # Email sending service
```

---

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Response Format

All endpoints return JSON with the following structure:

**Success Response:**

```json
{
  "data": {},
  "message": "Success description",
  "status": "success"
}
```

**Error Response:**

```json
{
  "message": "Error description",
  "status": "failed"
}
```

---

## Authentication Routes

### `POST` - User Registration

**Endpoint:** `/api/auth/register`

**Description:** Create a new user account

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201 Created):**

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Cases:**

- `422 Unprocessable Entity` - User already exists with that email
- `400 Bad Request` - Missing required fields

**Example with cURL:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePass123",
    "name": "John Doe"
  }'
```

---

### `POST` - User Login

**Endpoint:** `/api/auth/login`

**Description:** Authenticate user and receive JWT token

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Cases:**

- `401 Unauthorized` - Invalid email or password

**Token Expiration:** 3 days

**Example with cURL:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePass123"
  }'
```

---

### `POST` - User Logout

**Endpoint:** `/api/auth/logout`

**Description:** Logout user by blacklisting the JWT token

**Headers:**

```
Authorization: Bearer <token>
Cookie: token=<token>
```

**Response (200 OK):**

```json
{
  "message": "User logged out successfully"
}
```

**Error Cases:**

- `401 Unauthorized` - Missing or invalid token

**Example with cURL:**

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Account Routes

### `POST` - Create New Account

**Endpoint:** `/api/accounts/`

**Description:** Create a new bank account for the authenticated user

**Headers (Required):**

```
Authorization: Bearer <token>
```

**Request Body:** None (empty body)

**Response (201 Created):**

```json
{
  "account": {
    "_id": "507f1f77bcf86cd799439012",
    "user": "507f1f77bcf86cd799439011",
    "status": "ACTIVE",
    "createdAt": "2024-02-26T10:30:00Z",
    "updatedAt": "2024-02-26T10:30:00Z"
  }
}
```

**Error Cases:**

- `401 Unauthorized` - Missing or invalid token

**Example with cURL:**

```bash
curl -X POST http://localhost:3000/api/accounts/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### `GET` - Get All User Accounts

**Endpoint:** `/api/accounts/`

**Description:** Retrieve all accounts belonging to the authenticated user

**Headers (Required):**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "accounts": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "user": "507f1f77bcf86cd799439011",
      "status": "ACTIVE",
      "createdAt": "2024-02-26T10:30:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "user": "507f1f77bcf86cd799439011",
      "status": "ACTIVE",
      "createdAt": "2024-02-26T11:20:00Z"
    }
  ]
}
```

**Error Cases:**

- `401 Unauthorized` - Missing or invalid token

**Example with cURL:**

```bash
curl -X GET http://localhost:3000/api/accounts/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### `GET` - Get Account Balance

**Endpoint:** `/api/accounts/balance/:accountId`

**Description:** Get the current balance of a specific account

**Headers (Required):**

```
Authorization: Bearer <token>
```

**URL Parameters:**

- `accountId` (string, required) - The MongoDB ID of the account

**Response (200 OK):**

```json
{
  "accountId": "507f1f77bcf86cd799439012",
  "balance": 5000.5
}
```

**Error Cases:**

- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Account not found or belongs to another user

**Example with cURL:**

```bash
curl -X GET http://localhost:3000/api/accounts/balance/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Transaction Routes

### `POST` - Create Transaction (Transfer Funds)

**Endpoint:** `/api/transactions/`

**Description:** Transfer funds from one account to another with complete ledger tracking

**Headers (Required):**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "fromAccount": "507f1f77bcf86cd799439012",
  "toAccount": "507f1f77bcf86cd799439013",
  "amount": 1000,
  "idempotencyKey": "unique-transaction-id-12345"
}
```

**Response (201 Created):**

```json
{
  "transaction": {
    "_id": "507f1f77bcf86cd799439020",
    "fromAccount": "507f1f77bcf86cd799439012",
    "toAccount": "507f1f77bcf86cd799439013",
    "amount": 1000,
    "status": "COMPLETED",
    "idempotencyKey": "unique-transaction-id-12345",
    "createdAt": "2024-02-26T12:45:00Z"
  }
}
```

**Field Descriptions:**

- `fromAccount` - Source account ID
- `toAccount` - Destination account ID
- `amount` - Transfer amount (in base currency units)
- `idempotencyKey` - Unique identifier to prevent duplicate transactions
- `status` - Transaction status (PENDING, COMPLETED, FAILED, REVERSED)

**Transaction Processing Steps:**

1. Validates request parameters
2. Checks idempotency key for duplicate transactions
3. Verifies both accounts are ACTIVE
4. Validates sender has sufficient balance
5. Creates transaction record
6. Creates DEBIT ledger entry (sender)
7. Creates CREDIT ledger entry (recipient)
8. Marks transaction as COMPLETED
9. Commits to database
10. Sends email notification

**Error Cases:**

- `400 Bad Request` - Missing required fields or invalid accounts
- `401 Unauthorized` - Missing or invalid token
- `400 Bad Request` - Insufficient balance
- `400 Bad Request` - Accounts not ACTIVE
- `200 OK` - _Idempotency:_ If same idempotencyKey sent again, returns original transaction

**Example with cURL:**

```bash
curl -X POST http://localhost:3000/api/transactions/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "fromAccount": "507f1f77bcf86cd799439012",
    "toAccount": "507f1f77bcf86cd799439013",
    "amount": 1000,
    "idempotencyKey": "txn-001-000001"
  }'
```

---

### `POST` - Create Initial Funds Transaction

**Endpoint:** `/api/transactions/system/initial-funds`

**Description:** System-only endpoint to add initial funds to an account (admin operation)

**Headers (Required):**

```
Authorization: Bearer <token>
(Token must be from a system/admin user)
```

**Request Body:**

```json
{
  "toAccount": "507f1f77bcf86cd799439012",
  "amount": 10000,
  "idempotencyKey": "initial-funds-001"
}
```

**Response (201 Created):**

```json
{
  "transaction": {
    "_id": "507f1f77bcf86cd799439021",
    "toAccount": "507f1f77bcf86cd799439012",
    "amount": 10000,
    "status": "COMPLETED",
    "type": "CREDIT",
    "idempotencyKey": "initial-funds-001",
    "createdAt": "2024-02-26T13:00:00Z"
  }
}
```

**Error Cases:**

- `401 Unauthorized` - Missing token or not system user
- `400 Bad Request` - Missing required fields

**Example with cURL:**

```bash
curl -X POST http://localhost:3000/api/transactions/system/initial-funds \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "toAccount": "507f1f77bcf86cd799439012",
    "amount": 10000,
    "idempotencyKey": "initial-funds-001"
  }'
```

---

## Database Models

### User Model

Stores user account information with password hashing.

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Account Model

Represents a user's bank account with balance tracking via ledger.

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  status: String (ACTIVE, SUSPENDED, CLOSED),
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model

Records all fund transfers between accounts.

```javascript
{
  _id: ObjectId,
  fromAccount: ObjectId (ref: Account),
  toAccount: ObjectId (ref: Account),
  amount: Number,
  status: String (PENDING, COMPLETED, FAILED, REVERSED),
  idempotencyKey: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

### Ledger Model

Double-entry bookkeeping entries for complete financial tracking.

```javascript
{
  _id: ObjectId,
  account: ObjectId (ref: Account),
  transaction: ObjectId (ref: Transaction),
  type: String (DEBIT, CREDIT),
  amount: Number,
  balance: Number (running balance),
  createdAt: Date
}
```

### BlackList Model

Stores blacklisted JWT tokens for logout functionality.

```javascript
{
  _id: ObjectId,
  token: String (the JWT token),
  createdAt: Date
}
```

---

## Authentication & Authorization

### How Authentication Works

1. **User Registration**
   - User provides email, password, and name
   - Password is hashed using bcryptjs
   - JWT token is generated (valid for 3 days)

2. **User Login**
   - User provides email and password
   - Password is compared with stored hash
   - On success, JWT token is issued
   - Token stored in cookie and returned in response

3. **Protected Routes**
   - All account and transaction routes require valid JWT
   - Token extracted from `Authorization` header or `token` cookie
   - Token verified against JWT_SECRET
   - Blacklist checked to prevent use of logged-out tokens
   - User information attached to request object (`req.user`)

4. **User Logout**
   - Token is added to blacklist database
   - Prevents reuse of logged-out tokens
   - User must login again to get new token

### Token Format

JWT tokens contain:

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "iat": 1703599200,
  "exp": 1703858400
}
```

### Sending Token in Requests

**Method 1: Authorization Header (Recommended)**

```bash
curl -H "Authorization: Bearer <your_token_here>" \
  http://localhost:3000/api/accounts/
```

**Method 2: Cookie**

```bash
curl --cookie "token=<your_token_here>" \
  http://localhost:3000/api/accounts/
```

---

## Error Handling

### Common HTTP Status Codes

| Code | Meaning              | Common Cause                                     |
| ---- | -------------------- | ------------------------------------------------ |
| 200  | OK                   | Successful GET, POST, or PUT request             |
| 201  | Created              | Resource successfully created                    |
| 400  | Bad Request          | Invalid request parameters or logic error        |
| 401  | Unauthorized         | Missing or invalid authentication token          |
| 404  | Not Found            | Resource doesn't exist                           |
| 422  | Unprocessable Entity | Unique constraint violation (e.g., email exists) |
| 500  | Server Error         | Unexpected server error                          |

### Example Error Responses

**Missing Token:**

```json
{
  "message": "Unauthorized access, token is missing",
  "status": 401
}
```

**Invalid Token:**

```json
{
  "message": "Unauthorized access, token is invalid",
  "status": 401
}
```

**Insufficient Balance:**

```json
{
  "message": "Insufficient balance for this transaction",
  "status": 400
}
```

**Account Not Found:**

```json
{
  "message": "Account not found",
  "status": 404
}
```

---

## Quick Start Checklist

- [ ] Clone/download the project
- [ ] Run `npm install`
- [ ] Create `.env` file with MongoDB URI and JWT_SECRET
- [ ] Add email credentials (EMAIL_USER, EMAIL_PASSWORD) to `.env`
- [ ] Run `npm run dev` for development
- [ ] Test base route: `curl http://localhost:3000`
- [ ] Create user: POST `/api/auth/register`
- [ ] Login: POST `/api/auth/login`
- [ ] Create account: POST `/api/accounts/`
- [ ] Add funds: POST `/api/transactions/system/initial-funds`
- [ ] Transfer funds: POST `/api/transactions/`
- [ ] Check balance: GET `/api/accounts/balance/:accountId`

---

## Troubleshooting

### "Cannot connect to MongoDB"

- Verify `MONGO_URI` in `.env` is correct
- Check internet connection
- Ensure IP address is whitelisted in MongoDB Atlas

### "JWT_SECRET is not defined"

- Add `JWT_SECRET` to `.env` file
- Use a long, random string

### "Email not sending"

- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- For Gmail, use App-specific Password (not regular Gmail password)
- Check email service is allowed in firewall

### "Port 3000 already in use"

- Change PORT in `.env` or server.js
- Or kill the process using port 3000

---

## License

ISC

---

## Support

For issues or questions, please check the code comments in respective files or contact the development team.

**Last Updated:** February 26, 2024
