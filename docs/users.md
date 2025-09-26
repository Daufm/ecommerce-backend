# User Authentication API Documentation

**Base URL:** `http://localhost:3000/api/users/`

---

## Endpoints

### 1. Register User

- **Endpoint:** `POST /register`
- **Description:** Create a new user and send a verification email.

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "StrongPassword123!",
  "addresses": [
    {
      "label": "Home",
      "name": "Jane Doe",
      "line1": "123 Main St",
      "line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "Ethiopia",
      "phone": "+1234567890"
    }
  ]
}
```

**Success Response:** `201 Created`

```json
{
  "message": "User created successfully. Verification email sent.",
  "user": {
    "id": "634b1f2e1234abcd5678ef01",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "addresses": [
      {
        "label": "Home",
        "name": "Jane Doe",
        "line1": "123 Main St",
        "line2": "Apt 4B",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "Ethiopia",
        "phone": "+1234567890"
      }
    ]
  }
}
```

---

### 2. Verify Email

- **Endpoint:** `GET /verify-email?token=...`
- **Description:** Verify a user’s email using the token sent via email.

**Query Parameters:**

- `token` (string): Verification token from email

**Success Response:** `200 OK`

```json
{ "message": "Email verified successfully" }
```

**Error Responses:**

- `400 Bad Request` – Token missing or invalid
- `404 Not Found` – User not found

---

### 3. Sign In

- **Endpoint:** `POST /login`
- **Description:** Log in a user and return an access token.

**Request Body:**

```json
{
  "email": "jane@example.com",
  "password": "StrongPassword123!"
}
```

**Success Response:** `200 OK`

```json
{
  "message": "Sign-in successful",
  "token": "JWT_ACCESS_TOKEN_HERE"
}
```

**Error Responses:**

- `400 Bad Request` – Missing fields or invalid credentials
- `400 Bad Request` – Email not verified

---

### 4. Refresh Token

- **Endpoint:** `POST /refresh-token`
- **Description:** Generate a new access token using the refresh token.

**Request:**

- Requires `refreshToken` as an HTTP-only cookie.

**Success Response:** `200 OK`

```json
{ "accessToken": "NEW_JWT_ACCESS_TOKEN_HERE" }
```

**Error Responses:**

- `401 Unauthorized` – Missing refresh token
- `403 Forbidden` – Invalid or expired refresh token

---

### 5. Logout

- **Endpoint:** `POST /logout`
- **Description:** Log out a user and invalidate the refresh token.

**Request Body:**

```json
{ "refreshToken": "REFRESH_TOKEN_HERE" }
```

**Success Response:** `200 OK`

```json
{ "message": "Logout successful" }
```

**Error Responses:**

- `400 Bad Request` – Missing refresh token
- `403 Forbidden` – Invalid token

---

### 6. Forgot Password

- **Endpoint:** `POST /forgot-password`
- **Description:** Send a password reset link to the user’s email.

**Request Body:**

```json
{ "email": "jane@example.com" }
```

**Success Response:** `200 OK`

```json
{
  "message": "If you are registered, we will send you an email with instructions to reset your password."
}
```

---

### 7. Reset Password

- **Endpoint:** `POST /reset-password`
- **Description:** Reset the user’s password using the token from email.

**Request Body:**

```json
{
  "token": "RESET_TOKEN_HERE",
  "newPassword": "NewStrongPassword123!"
}
```

**Success Response:** `200 OK`

```json
{ "message": "Password has been reset successfully." }
```

---

### 8. Get User Profile

- **Endpoint:** `GET /profile`
- **Description:** Return the user profile.  
  **Requires:** `Authorization: Bearer JWT_ACCESS_TOKEN` header.

**Success Response:** `200 OK`

```json
{
  "user": {
    "id": "634b1f2e1234abcd5678ef01",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "roles": ["customer"],
    "addresses": [
      {
        "label": "Home",
        "name": "Jane Doe",
        "line1": "123 Main St",
        "line2": "Apt 4B",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "Ethiopia",
        "phone": "+1234567890"
      }
    ],
    "isEmailVerified": true
  }
}
```

**Error Responses:**

- `401 Unauthorized` – Missing or invalid token
- `404 Not Found` – User not found

---

## Notes & Best Practices

- **Sensitive fields** (e.g., `passwordHash`, `refreshTokens`, `resetPasswordToken`) are never returned in any API response.
- All `POST` endpoints expect a JSON body with `Content-Type: application/json`.
- Use Bearer tokens for protected routes.
- Email verification and password reset links should point to the backend URL for testing (`http://localhost:3000/api/users/...`).
- Always use HTTPS in production for secure cookie and token handling.

---
