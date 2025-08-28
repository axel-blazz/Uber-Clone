# Uber-Clone Backend API

This backend provides user and captain registration, authentication, profile, and logout endpoints for the Uber-Clone project.

---

## USER ROUTES

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

#### Responses

- **201 Created**
  ```json
  {
    "user": { ...userObject },
    "token": "JWT_TOKEN"
  }
  ```
- **400 Bad Request**
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
- **500 Internal Server Error**
  ```json
  {
    "message": "Error message"
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

- `email` (string, required, valid email, min 5 chars)
- `password` (string, required, min 6 chars)

#### Responses

- **200 OK**
  ```json
  {
    "user": { ...userObject },
    "jwt_token": "JWT_TOKEN"
  }
  ```
- **400 Bad Request**
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
- **500 Internal Server Error**
  ```json
  {
    "message": "Error message"
  }
  ```

---

### 3. Get User Profile

**URL:** `/api/user/profile`  
**Method:** `GET`  
**Description:** Returns the authenticated user's profile.  
**Authentication:** Requires JWT token in cookie or `Authorization` header.

#### Responses

- **200 OK**
  ```json
  {
    "user": { ...userObject }
  }
  ```
- **401 Unauthorized**
  ```json
  {
    "message": "Authorization denied"
  }
  ```
  or
  ```json
  {
    "message": "Token has been revoked"
  }
  ```
  or
  ```json
  {
    "message": "Token is not valid"
  }
  ```
- **404 Not Found**
  ```json
  {
    "message": "User not found"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "message": "Server error"
  }
  ```

---

### 4. Logout User

**URL:** `/api/user/logout`  
**Method:** `GET`  
**Description:** Logs out the user by clearing the JWT cookie and blacklisting the token.  
**Authentication:** Requires JWT token in cookie or `Authorization` header.

#### Responses

- **200 OK**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "message": "Server error"
  }
  ```

---

## CAPTAIN ROUTES

### 1. Register Captain

**URL:** `/api/captain/register`  
**Method:** `POST`  
**Description:** Registers a new captain.

#### Request Body

```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Smith"
  },
  "email": "jane@example.com",
  "password": "yourpassword",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

- `fullname.firstname` (string, required, min 3 chars)
- `fullname.lastname` (string, optional, min 3 chars)
- `email` (string, required, valid email)
- `password` (string, required, min 6 chars)
- `vehicle.color` (string, required, min 3 chars)
- `vehicle.plate` (string, required, min 3 chars)
- `vehicle.capacity` (integer, required, min 1)
- `vehicle.vehicleType` (string, required, one of: `car`, `bike`, `van`)

#### Responses

- **201 Created**
  ```json
  {
    "captain": { ...captainObject },
    "token": "JWT_TOKEN"
  }
  ```
- **400 Bad Request**
  ```json
  {
    "errors": [ ... ]
  }
  ```
  or
  ```json
  {
    "message": "Captain already exists"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "message": "Error message"
  }
  ```

---

### 2. Login Captain

**URL:** `/api/captain/login`  
**Method:** `POST`  
**Description:** Authenticates a captain and returns a JWT token.

#### Request Body

```json
{
  "email": "jane@example.com",
  "password": "yourpassword"
}
```

- `email` (string, required, valid email)
- `password` (string, required, min 6 chars)

#### Responses

- **200 OK**
  ```json
  {
    "captain": { ...captainObject },
    "jwt_token": "JWT_TOKEN"
  }
  ```
- **400 Bad Request**
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
- **500 Internal Server Error**
  ```json
  {
    "message": "Error message"
  }
  ```

---

### 3. Get Captain Profile

**URL:** `/api/captain/profile`  
**Method:** `GET`  
**Description:** Returns the authenticated captain's profile.  
**Authentication:** Requires JWT token in cookie or `Authorization` header.

#### Responses

- **200 OK**
  ```json
  {
    "user": { ...captainObject }
  }
  ```
- **401 Unauthorized**
  ```json
  {
    "message": "Authorization denied"
  }
  ```
  or
  ```json
  {
    "message": "Token has been revoked"
  }
  ```
  or
  ```json
  {
    "message": "Token is not valid"
  }
  ```
- **404 Not Found**
  ```json
  {
    "message": "User not found"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "message": "Server error"
  }
  ```

---

### 4. Logout Captain

**URL:** `/api/captain/logout`  
**Method:** `GET`  
**Description:** Logs out the captain by clearing the JWT cookie and blacklisting the token.  
**Authentication:** Requires JWT token in cookie or `Authorization` header.

#### Responses

- **200 OK**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "message": "Server error"
  }
  ```

---

## MAPS ROUTES

### 1. Get Coordinates from Address

**URL:** `/api/maps/get-coordinates`
**Method:** `GET`
**Description:** Returns latitude and longitude for a given address.
**Authentication:** Requires JWT token in cookie or `Authorization` header.

#### Query Parameters

`address` (string, required)

#### Responses

- **200 OK**
  ```json
  {
    "coordinates": {
      "lat": 12.9716,
      "lng": 77.5946
    }
  }
  ```
- **400 Bad Request**
  ```json
  {
    "message": "Address query parameter is required"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "message": "Error message"
  }
  ```

### 2. Get Address from Coordinates

**URL:** `/api/maps/get-address`
**Method:** `GET`
**Description:** Returns address for given latitude and longitude.
**Authentication:** Requires JWT token in cookie or `Authorization` header.

#### Query Parameters

`lat` (number, required), `lng` (number, required)

#### Responses

- **200 OK**
  ```json
  {
    "address": "123 Main St, City, Country"
  }
  ```
- **400 Bad Request**
  ```json
  {
    "message": "lat and lng query parameters are required"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "message": "Error message"
  }
  ```

### 3. Get Distance and Duration Between Two Points

**URL:** `/api/maps/get-distance-duration`
**Method:** `GET`
**Description:** Returns the distance (in meters) and duration (in seconds) between two locations.
**Authentication:** Requires JWT token in cookie or `Authorization` header.

#### Query Parameters

- `originLat` (number, required): Latitude of origin
- `originLng` (number, required): Longitude of origin
- `destLat` (number, required): Latitude of destination
- `destLng` (number, required): Longitude of destination

#### Responses

- **200 OK**
  ```json
  {
    "distance": 1200,
    "duration": 300
  }
  ```
- **400 Bad Request**
  ```json
  {
    "message": "originLat, originLng, destLat, and destLng query parameters are required"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "message": "Error message"
  }
  ```

### 4. Get Place Suggestions (Auto-complete)

**URL:** `/api/maps/place-suggestions`
**Method:** `GET`
**Description:** Returns auto-suggested places for a given input string using Google Places API.
**Authentication:** Requires JWT token in cookie or `Authorization` header.

#### Query Parameters

`input` (string, required)

#### Responses

- **200 OK**
  ```json
  {
    "suggestions": [
      {
        "description": "MG Road, Bengaluru, Karnataka, India",
        "place_id": "ChIJLfySpTOuEmsRsc_JfJtljdc"
      }
      // ...more predictions
    ]
  }
  ```
- **400 Bad Request**
  ```json
  {
    "message": "input query parameter is required"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "message": "Error message"
  }
  ```

---

## HOSPITAL SERVICE

### Find Nearest Hospital

**Description:** Finds the nearest hospital to a given pickup location using the Google Maps Distance Matrix API.

**Usage:**
Call `findNearestHospital(pickupCoords)` where `pickupCoords` is an object `{ lat, lng }`.

**Returns:**

```json
{
  "_id": "...",
  "name": "City Hospital",
  "location": { "lat": ..., "lng": ... },
  "capacity": 50,
  "distance": 1200, // in meters
  "duration": 300   // in seconds
}
```

---

## Notes

- JWT token is sent as an HTTP-only cookie for authentication.
- All endpoints expect JSON data in the request body (except GET requests).
- Validation errors are returned as an array under the `errors` key.
- Passwords are hashed before saving.
- Registration checks for existing email.
- Logout blacklists the token for 24 hours.

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
- **Captain**
  - `fullname`: `{ firstname, lastname }`
  - `email` (string, required, unique, lowercase)
  - `password` (string, required, hashed, select: false)
  - `socketId` (string, optional)
  - `status`: `active` or `inactive` (default: inactive)
  - `vehicle`: {
    - `color` (string, required, min 3 chars)
    - `plate` (string, required, min 3 chars)
    - `capacity` (number, required, min 1)
    - `vehicleType` (string, required, one of: `car`, `bike`, `van`)
      }
  - `location`: {
    - `ltd` (number)
    - `lng` (number)
      }
- **BlacklistToken**
  - `token`: JWT string
  - `createdAt`: Date (expires after 24 hours)
- **Hospital**
  - `name`: String (required)
  - `location`: {
    - `lat`: Number (required)
    - `lng`: Number (required)
      }
  - `capacity`: Number (optional, default: 0)
- **Ride**
  - `user`: ObjectId (ref: 'user', required)
  - `captain`: ObjectId (ref: 'captain')
  - `pickup`: String (required)
  - `destination`: ObjectId (ref: 'hospital', required)
  - `fare`: Number (required)
  - `status`: String (enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'], default: 'pending')
  - `duration`: Number (in seconds)
  - `distance`: Number (in meters)
  - `paymentID`: String
  - `orderId`: String
  - `signature`: String
  - `otp`: String (required, select: false)

---

## Example Usage

**Register User:**

```bash
curl -X POST http://localhost:4000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"John","lastname":"Doe"},"email":"john@example.com","password":"yourpassword"}'
```

**Login User:**

```bash
curl -X POST http://localhost:4000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"yourpassword"}'
```

**Get User Profile:**

```bash
curl -X GET http://localhost:4000/api/user/profile \
  --cookie "token=YOUR_JWT_TOKEN"
```

or

```bash
curl -X GET http://localhost:4000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Logout User:**

```bash
curl -X GET http://localhost:4000/api/user/logout \
  --cookie "token=YOUR_JWT_TOKEN"
```

or

```bash
curl -X GET http://localhost:4000/api/user/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

**Register Captain:**

```bash
curl -X POST http://localhost:4000/api/captain/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"Jane","lastname":"Smith"},"email":"jane@example.com","password":"yourpassword","vehicle":{"color":"Red","plate":"ABC123","capacity":4,"vehicleType":"car"}}'
```

**Login Captain:**

```bash
curl -X POST http://localhost:4000/api/captain/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"yourpassword"}'
```

**Get Captain Profile:**

```bash
curl -X GET http://localhost:4000/api/captain/profile \
  --cookie "token=YOUR_JWT_TOKEN"
```

or

```bash
curl -X GET http://localhost:4000/api/captain/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Logout Captain:**

```bash
curl -X GET http://localhost:4000/api/captain/logout \
  --cookie "token=YOUR_JWT_TOKEN"
```

or

```bash
curl -X GET http://localhost:4000/api/captain/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

**Get Coordinates from Address:**

```bash
curl -X GET "http://localhost:4000/api/maps/get-coordinates?address=MG%20Road%20Bangalore" \
  --cookie "token=YOUR_JWT_TOKEN"
```

**Get Address from Coordinates:**

```bash
curl -X GET "http://localhost:4000/api/maps/get-address?lat=12.9716&lng=77.5946" \
  --cookie "token=YOUR_JWT_TOKEN"
```

---

**Get Minimum Distance and Time:**

```bash
curl -X GET "http://localhost:4000/api/maps/get-distance-duration?originLat=12.9716&originLng=77.5946&destLat=12.9352&destLng=77.6245" \
  --cookie "token=YOUR_JWT_TOKEN"
```

---

**Get Place Suggestions:**

```bash
curl -X GET "http://localhost:4000/api/maps/place-suggestions?input=MG%20Road" \
  --cookie "token=YOUR_JWT_TOKEN"
```
