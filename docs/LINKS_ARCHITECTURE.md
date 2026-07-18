# Link Management System Architecture

This document maps out the backend architecture, data model, APIs, code generation strategy, and integration roadmap for the link management module in Shortly.

---

## 1. Data Model

The link entity is represented by the following Mongoose schema details. All fields are optimized for performance, indexing, and validation constraints.

| Field Name | Data Type | Required | Default | Validation Rules | Indexing | Purpose |
|---|---|---|---|---|---|---|
| `_id` | ObjectId | Yes | Auto | MongoDB default | Primary key | Unique identifier |
| `originalUrl` | String | Yes | N/A | Must match `^https?:\/\/.+` | None | The target URL to redirect traffic to |
| `shortCode` | String | Yes | N/A | Min length: 5, Max length: 20 | Unique index | The unique slug matching the short URL path |
| `customAlias` | String | No | None | Matches alpha-numeric and dash | Sparse Unique index | Optional custom user-defined slug |
| `user` | ObjectId | Yes | N/A | References `User` model | Hash index | Reference to the owner of the link |
| `clicks` | Number | Yes | `0` | Min: `0` | None | Total count of redirection requests |
| `isActive` | Boolean | Yes | `true` | Boolean | None | Toggles whether redirection is allowed |
| `lastClickedAt`| Date | No | `null` | ISO Date | None | Timestamp of the most recent redirection event |
| `createdAt` | Date | Yes | Auto | Timestamp default | None | Record creation date |
| `updatedAt` | Date | Yes | Auto | Timestamp default | None | Record update date |

### Indexing Considerations
- **`shortCode` Unique Index**: Since redirection lookup queries `shortCode` on every single request, a unique index is mandatory to keep lookups at `O(1)` query complexity.
- **`user` Index**: Filtering lists of links for the active user's dashboard requires an index on `user` to keep sorting and loading fast.
- **`customAlias` Sparse Index**: Since many links will use randomized codes, the custom alias must use a sparse unique index to allow `null`/empty values without causing duplicate key index errors.

---

## 2. Short Code Strategy

We evaluated three potential strategies for generating redirection slug codes:

### 1. Crypto Random Hex
- **Description**: Generate random bytes via Node's crypto library and encode them to hex (base 16, characters `0-9` and `a-f`).
- **Evaluation**:
  - *Collision Probability*: High. A 6-character hex code yields only $16^6 \approx 16.7$ million unique combinations.
  - *Readability*: Fair. Alphanumeric characters are limited to `a-f`, producing longer strings to achieve high entropy.
  - *Dependency Footprint*: Zero (uses native Node `crypto`).
- **Verdict**: Rejected due to small search space and poorer readability relative to Base62.

### 2. NanoID
- **Description**: Standard cryptographically secure unique ID generator utilizing a 64-character URL-friendly alphabet (`A-Za-z0-9_-`).
- **Evaluation**:
  - *Collision Probability*: Low. At 6 characters, $64^6 \approx 68.7$ billion combinations.
  - *Readability*: Moderate. Symbols like dashes (`-`) and underscores (`_`) are permitted, which degrade link readability.
  - *Dependency Footprint*: High (requires third-party npm installation).
- **Verdict**: Rejected to avoid external dependency overhead and special symbol outputs.

### 3. Custom Random Base62 Alphabet (Selected)
- **Description**: Generate a random 6-character slug matching a custom Base62 alphabet (`[0-9a-zA-Z]`) mapped securely from cryptographically secure pseudo-random bytes.
- **Evaluation**:
  - *Collision Probability*: Extremely Low. At 6 characters, it supports $62^6 \approx 56.8$ billion unique combinations.
  - *URL Readability*: Perfect. Highly aesthetic alphanumeric strings without special symbols or dashes.
  - *Scalability*: High. Allows stateless, horizontal generation across distributed backend instances without database coordination locks.
  - *Security*: Excellent. Non-sequential hashes prevent systematic link-scraping or ID-harvesting attacks.
  - *Dependency Footprint*: Zero (custom selection loop using native Node `crypto.randomBytes()`).
  - *Interview Explainability*: High. Easily explained as combining Base62 URL shortener standards with stateless, cryptographically secure non-sequential generation.
- **Verdict**: Selected as the final blueprint strategy.

### Future Migration Considerations
If the active database volume grows to exceed 50% capacity of the 56.8 billion search space, we can dynamically scale the generated slug length from 6 to 7 characters. This immediately increases the available space to $62^7 \approx 3.5$ trillion combinations, without requiring migrations of existing 6-character records.

---

## 3. Custom Alias Design
Users can specify custom aliases to personalize their short links.
- **Syntax Rules**: Only letters, numbers, and dashes are allowed. Whitespace, slash, question marks, and other special characters are rejected.
- **Reserved Slugs**: Custom aliases cannot equal application layout paths to avoid hijacking site routes:
  `login`, `register`, `dashboard`, `analytics`, `profile`, `api`, `health`, `docs`, `home`, `logout`.
- **Length Limits**: Minimum 5, maximum 20 characters.
- **Collision Handling**: Custom aliases are mapped directly to `shortCode`. A duplicate check is performed against both the `customAlias` field and the `shortCode` field. If any matches are found, a `409 Conflict` error is returned.

---

## 4. API Endpoint Layout

### Create Short Link
- **Route**: `POST /api/links`
- **Purpose**: Creates a shortened link.
- **Authentication**: Required (JWT Bearer Token).
- **Authorization**: Active user only (automatically linked to the verified JWT userId).
- **Request Body**:
  ```json
  {
    "originalUrl": "https://news.ycombinator.com/item?id=12345",
    "customAlias": "hacker-news-discuss"
  }
  ```
- **Responses**:
  - `201 Created`: Returns the full link model object.
  - `400 Bad Request`: Validation checks fail.
  - `409 Conflict`: Custom alias is already in use.

### Get User Links
- **Route**: `GET /api/links`
- **Purpose**: Retrieves all links owned by the authenticated user.
- **Authentication**: Required (JWT Bearer Token).
- **Authorization**: User can only fetch links where `link.user === userId`.
- **Response**:
  - `200 OK`: Array of link documents.

### Redirect Short Link
- **Route**: `GET /:shortCode`
- **Purpose**: Redirects a visitor to the destination URL.
- **Authentication**: None (Public).
- **Authorization**: Public access, but the link must have `isActive = true`.
- **Response**:
  - `302 Found`: Redirects with header `Location: <originalUrl>`.
  - `403 Forbidden`: Link exists but `isActive = false`.
  - `404 Not Found`: Link does not exist.

### Update Link Settings
- **Route**: `PATCH /api/links/:id`
- **Purpose**: Modifies destination URL, alias, or toggles active status.
- **Authentication**: Required (JWT Bearer Token).
- **Authorization**: Strict owner-only check (`link.user === userId`).
- **Request Body**:
  ```json
  {
    "originalUrl": "https://news.ycombinator.com/item?id=99999",
    "isActive": false
  }
  ```
- **Response**:
  - `200 OK`: Returns the updated link document.
  - `403 Forbidden`: Access denied (not the owner).
  - `404 Not Found`: Link not found.
  - `409 Conflict`: New custom alias is taken.

### Delete Short Link
- **Route**: `DELETE /api/links/:id`
- **Purpose**: Deletes the link record and frees up custom aliases.
- **Authentication**: Required (JWT Bearer Token).
- **Authorization**: Strict owner-only check (`link.user === userId`).
- **Response**:
  - `200 OK`: Success message.
  - `403 Forbidden`: Access denied.
  - `404 Not Found`: Link not found.

---

## 5. Layered Architecture (Controller ➔ Service ➔ Repository)

To enforce clean separation of concerns, the module is divided into three distinct layers:

```
Request ➔ Controller ➔ Service ➔ Repository ➔ MongoDB
```

### 1. Controller Layer
- **Files**: `linkController.js`
- **Role**: Handles the HTTP request/response boundary.
- **Responsibilities**:
  - Extract parameters (params, query, body, user from request).
  - Check basic payload presence.
  - Formulate and send HTTP response statuses (`200`, `201`, `302`, `400`, `409`, `500`).
  - **No Business Logic**: Controllers never generate codes or check alias collisions directly.

### 2. Service Layer
- **Files**: `linkService.js`
- **Role**: Encapsulates business logic, calculations, and policy rules.
- **Responsibilities**:
  - Generate short codes via crypto functions.
  - Run collision verification loops.
  - Validate ownership match conditions.
  - Enforce alias naming rule constraints.
  - Perform incremental tracking updates.
  - Raise errors with semantic HTTP status codes (`statusCode` property on Error objects).

### 3. Repository Layer
- **Files**: `linkRepository.js`
- **Role**: Accesses database documents directly.
- **Responsibilities**:
  - Execute Mongoose query commands (`save`, `findOne`, `find`, `findByIdAndUpdate`, `findByIdAndDelete`).
  - Separate database queries from services to allow switching of database engines easily.

---

## 6. Ownership Authorization Rules
To guarantee privacy and security, strict ownership guards are enforced:
1. When a user requests to update or delete a link, the service layer queries the database to retrieve the target link record.
2. It compares the link's `user` ObjectId string with the verified `userId` extracted from the request's JWT payload.
3. If they do not match, the request immediately terminates with a `403 Forbidden` error. This is enforced directly in the service layer before any database mutation takes place.

---

## 7. Redirection Lifecycle
When a visitor accesses a short URL, the request flows as follows:

```
[Access /:shortCode]
       ↓
[Lookup link in DB by shortCode] ── (NotFound) ──> [404 Error]
       ↓
[Verify link.isActive === true]  ── (Inactive) ──> [403 Error]
       ↓
[Increment link.clicks count]
       ↓
[Set lastClickedAt = Date.now()]
       ↓
[Return HTTP 302 Redirect to originalUrl]
```

---

## 8. Future Architecture Roadmaps

### Click Analytics
- **Constraint**: Analytics must NOT be embedded as an array inside the `Link` document.
- **Why**: MongoDB document size is capped at 16MB. Embedding a list of clicks will cause the document to grow unbounded, slowing down lookups and eventually crashing.
- **Planned Collection (`Click` / `Analytics`)**:
  - `_id`: ObjectId
  - `link`: ObjectId (ref: Link)
  - `timestamp`: Date
  - `country`: String
  - `browser`: String
  - `device`: String (Desktop/Mobile/Tablet)
  - `os`: String (Windows/macOS/iOS/Android)
  - `referrer`: String
  - **IP Strategy**: We will parse IP addresses to determine country location, but will NOT store raw IPs in the database to maintain GDPR and CCPA privacy compliance.

### QR Code Integration
- In Phase 2, a QR code generation service (using packages like `qrcode`) will generate SVG or PNG representations of the short URL on the fly when requested (e.g. `GET /api/links/:id/qrcode`), avoiding storage overhead.

### Scalability Considerations
- **Caching**: Since redirects are read-heavy (`GET /:shortCode`), active codes can be cached in a memory database (e.g., Redis) with TTL expirations. Lookups bypass MongoDB entirely, boosting throughput to tens of thousands of requests per second.
- **Sharding**: Links can be sharded based on the hash of the `shortCode` field, distributing lookup and redirection traffic evenly across multiple database nodes.
