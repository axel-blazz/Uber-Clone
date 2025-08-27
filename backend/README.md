# Uber-Clone Backend API

This backend provides user registration and authentication endpoints for the Uber-Clone project.

## Endpoints

---

### 1. Register User

**URL:** `/api/user/register`  
**Method:** `POST`  
**Description:** Registers a new user.

#### Request Body

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "yourpassword"
}
```

- `fullname.firstname` (string, required, min 3 chars)
- `fullname.lastname` (string, optional, min 3 chars)
- `email` (string, required, valid email, min 5 chars)
- `password` (string, required, min 6 chars)

#### Validation

- First name must be at least 3 characters long.
- Last name (if provided) must be at least 3 characters long.
- Email must be valid format.
- Password must be at least 6 characters long.

#### Responses

- **201 Created**
  ```json
  {
    "user": { ...userObject },
    "token": "JWT_TOKEN"
  }
  ```
- **400 Bad Request**
  - Validation errors or user already exists
  ```json
  {
    "errors": [ ... ]
  }
  ```
  or
  ```json
  {
    "message": "User already exists"
  }
  ```

---

### 2. Login User

**URL:** `/api/user/login`  
**Method:** `POST`  
**Description:** Authenticates a user and returns a JWT token.

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

- `email` (string, required, valid email)
- `password` (string, required, min 6 chars)

#### Validation

- Email must be valid format.
- Password must be at least 6 characters long.

#### Responses

- **200 OK**
  ```json
  {
    "user": { ...userObject },
    "jwt_token": "JWT_TOKEN"
  }
  ```
- **400 Bad Request**
  - Invalid credentials or validation errors
  ```json
  {
    "errors": [ ... ]
  }
  ```
  or
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

---

## Notes

- JWT token is sent as an HTTP-only cookie for authentication.
- All endpoints expect JSON data in the request body.
- Validation errors are returned as an array under the `errors` key.
- Passwords are hashed before saving.
- User registration checks for existing email.

---

## Environment Variables

- `JWT_SECRET`: Secret key for JWT signing.

---

## Models

- **User**
  - `fullname`: `{ firstname, lastname }`
  - `email`
  - `password` (hashed)
  - `socketId` (optional)

---

## Example Usage

**Register:**

```bash
curl -X POST http://localhost:PORT/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"John","lastname":"Doe"},"email":"john@example.com","password":"yourpassword"}'
```

**Login:**

```bash
curl -X POST http://localhost:PORT/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"yourpassword"}'
```
