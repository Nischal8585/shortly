# Link Management Database Design Blueprint

This document defines the schema designs, indexes, cardinality relationships, and expected query patterns for MongoDB.

---

## 1. Collections

The database schema utilizes three primary collections:
1. **`users`**: Contains authenticated user accounts, hashed passwords, and creation metadata.
2. **`links`**: Contains original destination URLs, generated short codes, optional custom aliases, ownership references, and status flags.
3. **`clicks`** (Future Analytics Phase): Log records containing click events and telemetry (browser, device, country, referrer).

---

## 2. Link Schema Design

| Field Name | Type | Required | Default | Validation | Purpose |
|---|---|---|---|---|---|
| `originalUrl` | String | Yes | None | Regex: `^https?:\/\/.+` | The absolute redirect destination URL. |
| `shortCode` | String | Yes | None | 5-20 characters, alphanumeric | Public slug matching the short URL path. |
| `customAlias` | String | No | None | 5-20 characters, alphanumeric & dashes | Optional customized brand slug provided by the user. |
| `user` | ObjectId | Yes | None | Reference to `users` collection | Identification of the link owner. |
| `clicks` | Number | Yes | `0` | Minimum: `0` | Running tally of successful redirection actions. |
| `isActive` | Boolean | Yes | `true` | Boolean | Flag to toggle redirection on/off. |
| `lastClickedAt`| Date | No | `null` | ISO Date | Timestamp of the most recent redirection event. |
| `createdAt` | Date | Yes | Auto | Timestamp | Date the link was created. |
| `updatedAt` | Date | Yes | Auto | Timestamp | Date the link settings were last modified. |

---

## 3. Indexing Strategy

To guarantee rapid query resolution and scalability, the following indices are enforced:

### 1. `shortCode` (Unique Index)
- **Definition**: `{ shortCode: 1 }` (Unique: Yes, Sparse: No)
- **Why it exists**: Redirection triggers a query by `shortCode` on every request. An index reduces query time to $O(1)$.
- **Expected Performance**: Lookup resolves in `< 1ms` even with millions of records, eliminating table scans.

### 2. `customAlias` (Sparse Unique Index)
- **Definition**: `{ customAlias: 1 }` (Unique: Yes, Sparse: Yes)
- **Why it exists**: Custom aliases must be unique. The sparse property prevents key collision errors for documents that omit this optional field.
- **Expected Performance**: Instantly rejects duplicate slug attempts at the database level.

### 3. `user` (Single-Field Index)
- **Definition**: `{ user: 1 }` (Unique: No, Sparse: No)
- **Why it exists**: Crucial for dashboard views where users fetch their catalog sorted by date.
- **Expected Performance**: Eliminates database-level sorting overhead when executing queries like `find({ user: userId })`.

### 4. `createdAt` (Single-Field Index)
- **Definition**: `{ createdAt: -1 }` (Unique: No, Sparse: No)
- **Why it exists**: Links are ordered chronologically on the user's dashboard.
- **Expected Performance**: Speeds up list pagination queries.

---

## 4. Relationships & Cardinality

```
[User] (1) ─── 0..* ─── (Many) [Link] (1) ─── 0..* ─── (Many) [Click]
```

### 1. User ➔ Link (1-to-Many)
- **Cardinality**: One user can own zero or many links. A link is owned by exactly one authenticated user.
- **Implementation**: Mongoose `ref` pointing to `User` model using `ObjectId`.
- **Ownership Verification**: Before executing mutations (update, delete), the service layer validates that the requesting user ID equals the link's `user` property.

### 2. Link ➔ Click (1-to-Many)
- **Cardinality**: One link can receive zero or many click event logs. A click record belongs to exactly one link.
- **Implementation**: Normalized storage. The `Click` document contains a `link` ObjectId property referencing the parent link.
- **Isolation Reason**: Click data grows unbounded. Embedding arrays of click logs inside the `Link` document would eventually exceed MongoDB's 16MB document size limit and degrade performance.

---

## 5. Query Patterns & Execution Plan

### 1. Create Link
- **Access Path**: Check custom alias availability ➔ Insert Link document.
- **Indexes Used**: `customAlias` (unique sparse check), `shortCode` (unique check).
- **Execution Plan**: MongoDB automatically queries indices to verify unique constraints before completing writes.
- **Scalability**: $O(log(N))$ index checks guarantee fast writes as collection size grows.

### 2. Retrieve User Links
- **Access Path**: `find({ user: userId }).sort({ createdAt: -1 })`
- **Indexes Used**: `{ user: 1 }` index.
- **Execution Plan**: Index scans locate matching records.
- **Scalability**: Dashboard lists remain fast even if users own thousands of links.

### 3. Lookup by Short Code (Redirection)
- **Access Path**: `findOne({ shortCode: slug })`
- **Indexes Used**: `{ shortCode: 1 }` (Unique).
- **Execution Plan**: Single key index lookup.
- **Scalability**: Core redirection path scales linearly and is highly suitable for front-line Redis caching.

### 4. Update Settings / Custom Alias
- **Access Path**: Fetch by ID ➔ Verify Owner ➔ Update fields.
- **Indexes Used**: `_id` (Primary Key), `customAlias` (uniqueness validation check).
- **Execution Plan**: Primary key search resolves instantly; index checks ensure the new custom alias does not conflict.
- **Scalability**: Prevents database mutations from executing if a slug collision occurs.

### 5. Soft Delete / Hard Delete
- **Access Path**: Fetch by ID ➔ Verify Owner ➔ Remove document.
- **Indexes Used**: `_id` (Primary Key).
- **Execution Plan**: Deletes record and automatically updates unique index maps.
- **Scalability**: Instantly releases custom alias strings back into the public namespace pool.

---

## 6. Reserved Keywords Blacklist

To prevent custom aliases from conflicting with application routes and endpoints, the following keywords are blacklisted:

| Reserved Keyword | Reason |
|---|---|
| `login` | Login page route (`/login`) |
| `register` | Registration page route (`/register`) |
| `dashboard` | User dashboard workspace (`/dashboard`) |
| `analytics` | User click analytics dashboard (`/analytics`) |
| `profile` | User profile settings screen (`/profile`) |
| `docs`, `documentation` | System user manual and guidelines (`/docs`) |
| `api` | Server backend routing prefix (`/api/*`) |
| `health`, `status` | System health check indicators (`/health`, `/status`) |
| `logout` | Logout trigger action |
| `home` | Alternative landing page references |
| `admin` | Reserved for future administration panels |

- **Verification Hook**: Enforced via a middleware regex validator or a simple array search inside the link service creation function before checking database collections.
