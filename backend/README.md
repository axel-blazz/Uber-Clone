# Uber-Clone Backend API

This backend provides user and captain registration, authentication, profile, and logout endpoints for the Uber-Clone project.

# Uber-Clone Backend API

This document provides a standardized API reference for the Uber-Clone backend.

Base URL: `http://localhost:4000/api`

Authentication

- Primary: JWT via HTTP-only cookie named `token` or the `Authorization: Bearer <token>` header.

Conventions

- Use JSON for request and response bodies unless noted.
- Validation: `express-validator` patterns are suggested for each endpoint.

Layout for each endpoint

- URL
- Method
- Authentication (Yes/No)
- Description
- Query parameters (for GET)
- Request body (for POST/PUT)
- Validations (express-validator)
- Successful response (example)
- Error responses (examples)
- Example curl

---

## USER

### POST /user/register

- Authentication: No
- Description: Register a new user.

Request body

```json
{
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john@example.com",
  "password": "yourpassword"
}
```

Validations

- `body('fullname.firstname').isString().isLength({ min: 3 })`
- `body('email').isEmail().isLength({ min: 5 })`
- `body('password').isString().isLength({ min: 6 })`

Success (201)

```json
{
  "user": {
    /* user object */
  },
  "token": "JWT_TOKEN"
}
```

Errors

- 400: Validation errors or user already exists
- 500: Server error

Example

```bash
curl -X POST http://localhost:4000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"John","lastname":"Doe"},"email":"john@example.com","password":"yourpassword"}'
```

---

### POST /user/login

- Authentication: No
- Description: Login and receive JWT.

Request body

```json
{ "email": "john@example.com", "password": "yourpassword" }
```

Validations

- `body('email').isEmail()`
- `body('password').isString().isLength({ min: 6 })`

Success (200)

```json
{
  "user": {
    /* user object */
  },
  "jwt_token": "JWT_TOKEN"
}
```

Errors

- 400: Invalid credentials or validation errors
- 500: Server error

Example

```bash
curl -X POST http://localhost:4000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"yourpassword"}'
```

---

### GET /user/profile

- Authentication: Yes
- Description: Returns authenticated user's profile.

Success (200)

```json
{
  "user": {
    /* user object */
  }
}
```

Errors

- 401: Authorization denied / invalid token / revoked
- 404: User not found
- 500: Server error

Example

```bash
curl -X GET http://localhost:4000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### GET /user/logout

- Authentication: Yes
- Description: Clears JWT cookie and blacklists token.

Success (200)

```json
{ "message": "Logged out successfully" }
```

Errors

- 500: Server error

Example

```bash
curl -X GET http://localhost:4000/api/user/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## CAPTAIN

### POST /captain/register

- Authentication: No
- Description: Register a new captain.

Request body

```json
{
  "fullname": { "firstname": "Jane", "lastname": "Smith" },
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

Validations

- `body('fullname.firstname').isString().isLength({ min: 3 })`
- `body('email').isEmail()`
- `body('password').isString().isLength({ min: 6 })`
- `body('vehicle.color').isString().isLength({ min: 3 })`
- `body('vehicle.plate').isString().isLength({ min: 3 })`
- `body('vehicle.capacity').isInt({ min: 1 })`
- `body('vehicle.vehicleType').isIn(['car','bike','van'])`

Success (201)

```json
{
  "captain": {
    /* captain object */
  },
  "token": "JWT_TOKEN"
}
```

Errors

- 400: Validation errors or captain exists
- 500: Server error

Example

```bash
curl -X POST http://localhost:4000/api/captain/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"Jane","lastname":"Smith"},"email":"jane@example.com","password":"yourpassword","vehicle":{"color":"Red","plate":"ABC123","capacity":4,"vehicleType":"car"}}'
```

---

### POST /captain/login

- Authentication: No
- Description: Login and receive JWT.

Request body

```json
{ "email": "jane@example.com", "password": "yourpassword" }
```

Validations

- `body('email').isEmail()`
- `body('password').isString().isLength({ min: 6 })`

Success (200)

```json
{
  "captain": {
    /* captain object */
  },
  "jwt_token": "JWT_TOKEN"
}
```

Errors

- 400: Invalid credentials or validation errors
- 500: Server error

Example

```bash
curl -X POST http://localhost:4000/api/captain/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"yourpassword"}'
```

---

### GET /captain/profile

- Authentication: Yes
- Description: Returns authenticated captain's profile.

Success (200)

```json
{
  "captain": {
    /* captain object */
  }
}
```

Errors

- 401: Authorization denied / invalid token / revoked
- 404: Captain not found
- 500: Server error

Example

```bash
curl -X GET http://localhost:4000/api/captain/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### GET /captain/logout

- Authentication: Yes
- Description: Clears JWT cookie and blacklists token.

Success (200)

```json
{ "message": "Logged out successfully" }
```

Errors

- 500: Server error

Example

```bash
curl -X GET http://localhost:4000/api/captain/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### GET /captain/available

- Authentication: Yes
- Description: Return captains within a radius filtered by vehicle type.

Query parameters

- `lat` (number, required)
- `lng` (number, required)
- `radius` (number, optional, km, default: 5)
- `vehicleType` (string, optional)

Validations

- `query('lat').isFloat()`
- `query('lng').isFloat()`
- `query('radius').optional().isFloat()`
- `query('vehicleType').optional().isIn(['car','bike','van'])`

Success (200)

```json
{
  "captains": [
    /* array of captain objects */
  ]
}
```

Example

```bash
curl -X GET "http://localhost:4000/api/captain/available?lat=12.9716&lng=77.5946&radius=5&vehicleType=car" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## MAPS

### GET /maps/get-coordinates

- Authentication: Yes
- Description: Returns latitude and longitude for a given address.

Query parameters

- `address` (string, required)

Validations

- `query('address').isString().isLength({ min: 3 })`

Success (200)

```json
{ "coordinates": { "lat": 12.9716, "lng": 77.5946 } }
```

Errors

- 400: Missing or invalid address
- 500: Server error

Example

```bash
curl -X GET "http://localhost:4000/api/maps/get-coordinates?address=MG%20Road%20Bangalore" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### GET /maps/get-address

- Authentication: Yes
- Description: Returns address for given latitude and longitude.

Query parameters

- `lat` (number, required)
- `lng` (number, required)

Validations

- `query('lat').isFloat()`
- `query('lng').isFloat()`

Success (200)

```json
{ "address": "123 Main St, City, Country" }
```

Example

```bash
curl -X GET "http://localhost:4000/api/maps/get-address?lat=12.9716&lng=77.5946" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### GET /maps/get-distance-duration

- Authentication: Yes
- Description: Returns distance (meters) and duration (seconds) between two points.

Query parameters

- `originLat`, `originLng`, `destLat`, `destLng` (all required)

Validations

- `query('originLat').isFloat()` etc.

Success (200)

```json
{ "distance": 1200, "duration": 300 }
```

Example

```bash
curl -X GET "http://localhost:4000/api/maps/get-distance-duration?originLat=12.9716&originLng=77.5946&destLat=12.9352&destLng=77.6245" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### GET /maps/place-suggestions

- Authentication: Yes
- Description: Auto-complete place suggestions from Google Places API.

Query parameters

- `input` (string, required)

Success (200)

```json
{
  "suggestions": [
    { "description": "MG Road, Bengaluru, Karnataka, India", "place_id": "..." }
  ]
}
```

Example

```bash
curl -X GET "http://localhost:4000/api/maps/place-suggestions?input=MG%20Road" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## RIDE

### POST /ride/create-ride

- Authentication: Yes
- Description: Request a new ride (user-facing).

Request body

```json
{ "pickup": "123 Main St, City", "vehicleType": "car" }
```

Validations

- `body('pickup').isString().isLength({ min: 3 })`
- `body('vehicleType').isString().isIn(['car','bike','van'])`

Success (201)

```json
{
  "ride": {
    /* ride object */
  }
}
```

Errors

- 400: Validation errors or "No captains available nearby"
- 500: Server error or "No hospitals found nearby"

Example

```bash
curl -X POST http://localhost:4000/api/ride/create-ride \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"pickup":"123 Main St, City","vehicleType":"car"}'
```

---

### POST /ride/confirm

- Authentication: Yes
- Description: Captain confirms and accepts a pending ride; OTP may be used.

Request body

```json
{ "rideId": "<rideObjectId>", "captainId": "<captainObjectId>", "otp": "1234" }
```

Validations

- `body('rideId').isMongoId()`
- `body('captainId').isMongoId()`
- `body('otp').isNumeric().isLength({ min: 4, max: 6 })`

Success (200)

```json
{
  "ride": {
    /* ride object with status accepted */
  }
}
```

Example

```bash
curl -X POST http://localhost:4000/api/ride/confirm \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"rideId":"<rideId>","captainId":"<captainId>","otp":"1234"}'
```

---

### POST /ride/cancel

- Authentication: Yes
- Description: Cancel a ride (user or captain).

Request body

```json
{ "rideId": "<rideObjectId>", "reason": "User changed plans" }
```

Validations

- `body('rideId').isMongoId()`
- `body('reason').optional().isString().isLength({ min: 3 })`

Success (200)

```json
{
  "message": "Ride cancelled",
  "ride": {
    /* ride object with status cancelled */
  }
}
```

Example

```bash
curl -X POST http://localhost:4000/api/ride/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"rideId":"<rideId>","reason":"User changed plans"}'
```

---

### GET /ride/status

- Authentication: Yes
- Description: Get ride status and details.

Query params

- `rideId` (string, required)

Success (200)

```json
{
  "ride": {
    "_id": "...",
    "status": "accepted",
    "captain": {
      /* ... */
    }
  }
}
```

Example

```bash
curl -X GET "http://localhost:4000/api/ride/status?rideId=<rideId>" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## MODELS

### User

- `fullname`: { `firstname`: String, `lastname`: String }
- `email`: String (required, unique)
- `password`: String (required, hashed, select: false)
- `socketId`: String (optional)

### Captain

- `fullname`: { `firstname`, `lastname` }
- `email`: String (required, unique, lowercase)
- `password`: String (required, hashed, select: false)
- `socketId`: String (optional)
- `status`: String (enum: ['active','inactive'], default: 'inactive')
- `vehicle`: { `color`, `plate`, `capacity`, `vehicleType` }
- `location`: { `lat`: Number, `lng`: Number }
- `isAvailable`: Boolean (default: true)

Notes: prefer GeoJSON `Point` for production geospatial queries; if using `{lat,lng}` add a 2dsphere index wrapper or adapt queries to $geoWithin with $centerSphere.

### Hospital

- `name`: String (required)
- `location`: { `lat`: Number, `lng`: Number }
- `capacity`: Number (optional, default: 0)
- `isAccepting`: Boolean (optional, default: true)

### Ride

- `user`: ObjectId (ref: 'user', required)
- `captain`: ObjectId (ref: 'captain')
- `pickup`: String (required)
- `pickupCoords`: { `lat`: Number, `lng`: Number }
- `destination`: ObjectId (ref: 'hospital', required)
- `fare`: Number
- `distance`: Number (meters)
- `duration`: Number (seconds)
- `status`: String (enum: ['pending','accepted','ongoing','completed','cancelled'], default: 'pending')
- `otp`: String (select: false)
- `otpExpires`: Date
- `payment`: { paymentID, orderId, signature }
- timestamps

---

## NOTES & RECOMMENDATIONS

- Use `express-validator` consistently on routes for all inputs.
- Keep sensitive fields (`password`, `otp`) with `select: false` in Mongoose schemas.
- Prefer GeoJSON `Point` for production geospatial indexing; otherwise ensure queries align with the stored format.
- Keep `OTP` expiry short (e.g., 5 minutes) and store `otpExpires`.

---

If you'd like, I can implement the missing schema fields (`pickupCoords`, `otp`, `otpExpires`, `isAvailable`) and create the route handlers for `/ride/confirm`, `/ride/cancel`, and `/captain/available`.

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

---

## RIDE ROUTES

### 1. Create Ride

**URL:** `/api/ride/create-ride`  
**Method:** `POST`  
**Description:** Requests a new ride for a user.  
**Authentication:** Requires JWT token in cookie or `Authorization` header.

#### Request Body

```json
{
  "pickup": "123 Main St, City",
  "vehicleType": "car"
}
```

- `pickup` (string, required, min 3 chars)
- `vehicleType` (string, required, one of: `car`, `bike`, `van`)

#### Validations (express-validator)

- `body('pickup').isString().isLength({ min: 3 })`
- `body('vehicleType').isString().isIn(['car','bike','van'])`

#### Responses

- **201 Created**
  ```json
  {
    "ride": {
      "_id": "...",
      "user": { ...userObject },
      "pickup": "123 Main St, City",
      "pickupCoords": { "lat": 12.97, "lng": 77.59 },
      "destination": { ...hospitalObject },
      "fare": 120,
      "distance": 5000,
      "duration": 600,
      "vehicleType": "car",
      "status": "pending"
    }
  }
  ```
- **400 Bad Request**
  ```json
  { "message": "No captains available nearby" }
  ```
- **500 Internal Server Error**
  ```json
  { "message": "No hospitals found nearby" }
  ```

### 2. Confirm Ride

**URL:** `/api/ride/confirm`  
**Method:** `POST`  
**Description:** Captain confirms and accepts a pending ride (also used when user/captain provides OTP).  
**Authentication:** Requires JWT token.

#### Request Body

```json
{
  "rideId": "<rideObjectId>",
  "captainId": "<captainObjectId>",
  "otp": "1234"
}
```

#### Validations

- `body('rideId').isMongoId()`
- `body('captainId').isMongoId()`
- `body('otp').isNumeric().isLength({ min: 4, max: 6 })`

#### Responses

- **200 OK**
  ```json
  { "ride": { ...rideObjectWithStatusAccepted } }
  ```
- **400 Bad Request**
  ```json
  { "message": "Invalid OTP or ride cannot be accepted" }
  ```

### 3. Cancel Ride

**URL:** `/api/ride/cancel`  
**Method:** `POST`  
**Description:** Allows user or captain to cancel a pending/accepted ride.  
**Authentication:** Requires JWT token.

#### Request Body

```json
{
  "rideId": "<rideObjectId>",
  "reason": "User changed plans"
}
```

#### Validations

- `body('rideId').isMongoId()`
- `body('reason').optional().isString().isLength({ min: 3 })`

#### Responses

- **200 OK**
  ```json
  { "message": "Ride cancelled", "ride": { ...rideObjectWithStatusCancelled } }
  ```

### 4. Get Ride Status

**URL:** `/api/ride/status`  
**Method:** `GET`  
**Description:** Returns the current status and details for a ride.  
**Authentication:** Requires JWT token.

#### Query Parameters

- `rideId` (string, required)

#### Responses

- **200 OK**
  ```json
  { "ride": { "_id": "...", "status": "accepted", "captain": {... } } }
  ```

---

## CAPTAIN (ADDITIONAL) ROUTES

### 1. Get Available Captains

**URL:** `/api/captain/available`  
**Method:** `GET`  
**Description:** Returns captains within a radius around a coordinate filtered by vehicle type.
**Authentication:** Requires JWT token.

#### Query Parameters

- `lat` (number, required)
- `lng` (number, required)
- `radius` (number, optional, in km, default: 5)
- `vehicleType` (string, optional, one of `car`,`bike`,`van`)

#### Validations

- `query('lat').isFloat()`
- `query('lng').isFloat()`
- `query('radius').optional().isFloat()`
- `query('vehicleType').optional().isIn(['car','bike','van'])`

#### Responses

- **200 OK**
  ```json
  { "captains": [ { "_id": "...", "fullname": {...}, "vehicleType":"car", "location": {"lat":...,"lng":...} } ] }
  ```

---

## MODEL & VALIDATION UPDATES

Below are model field clarifications and small additions introduced after initial scaffolding.

- **Ride** (updates / additions)

  - `pickupCoords`: `{ lat: Number, lng: Number }` (added — used for routing & distance calculations)
  - `otp`: `String` (select: false) — one-time-code sent/used for confirming pickup
  - `otpExpires`: `Date` — optional expiry for OTP (e.g. 5 minutes)
  - `timestamps`: `createdAt`, `updatedAt` (recommended)
  - `payment`: `{ paymentID, orderId, signature }` (optional — retained for payment gateways)

- **Captain** (clarifications)

  - `location`: `{ lat: Number, lng: Number }` (use consistent lat/lng keys)
  - `isAvailable`: `Boolean` (default: true) — used to filter available captains
  - ensure a geospatial index exists for quick radius queries (e.g. either GeoJSON or $geoWithin with {lat,lng})

- **Hospital** (additional optional flag)
  - `isAccepting`: `Boolean` (optional, default: true) — if a hospital is temporarily not accepting transfers

### Validation summary (recommended patterns)

- Use `express-validator` on routes to validate required fields, types, and enums.
- For IDs prefer `isMongoId()` checks.
- For coordinates prefer `isFloat()` and a small sanity range check when possible.

---

## EXAMPLES (new)

**Confirm Ride:**

```bash
curl -X POST http://localhost:4000/api/ride/confirm \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"rideId":"<rideId>","captainId":"<captainId>","otp":"1234"}'
```

**Get Available Captains:**

```bash
curl -X GET "http://localhost:4000/api/captain/available?lat=12.9716&lng=77.5946&radius=5&vehicleType=car" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## NOTES

- These additions are intentionally minimal and focused on keeping the API predictable. If you prefer GeoJSON `Point` documents for captain `location` instead of `{lat,lng}`, update the models and queries accordingly; both approaches are common, but GeoJSON enables `$near` queries and indexes like `{ type: "Point", coordinates: [lng, lat] }`.
