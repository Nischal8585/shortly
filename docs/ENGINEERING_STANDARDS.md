# Engineering Standards & Architecture Handbook

This document serves as the official, permanent engineering handbook and architectural rulebook for **Shortly**. Every developer and AI assistant contributing to this codebase must adhere strictly to these principles, naming conventions, structural patterns, security baselines, and quality guidelines.

---

## 1. Architecture Principles

Our engineering culture prioritizes clarity, maintainability, and clean separation of concerns. All development must align with the following core architectural principles:

### 1.1 Single Responsibility Principle (SRP)
- **Definition:** A module, class, function, or component should have one, and only one, reason to change.
- **Application to Shortly:** 
  - An Express controller must only handle request parsing and response formatting. It must never perform business calculations or run database queries.
  - A React component should only render its designated section of the UI. If it has to manage UI state, perform data fetching, and parse tables, it must be split into sub-components or custom hooks.

### 1.2 Don't Repeat Yourself (DRY)
- **Definition:** Every piece of knowledge or logic must have a single, unambiguous, authoritative representation within a system.
- **Application to Shortly:**
  - Avoid duplicate styling. Utilize the CSS custom variables defined in `index.css` for theme colors and spacing instead of hardcoding raw values in individual files.
  - Avoid duplicate database query operations. Abstract query filters (like checking if a link is active) into the repository layer rather than duplicating the query logic across multiple services.

### 1.3 Keep It Simple (KISS)
- **Definition:** Systems work best if they are kept simple rather than made complex; simplicity should be a key goal in design, and unnecessary complexity should be avoided.
- **Application to Shortly:**
  - Do not introduce state management libraries like Redux or complex caching systems in Phase 1. Simple React state hooks and standard database queries are sufficient until scale demands otherwise.
  - Avoid deep ternary operations or nested callback trees. Write flat, readable code using early returns.

### 1.4 You Aren't Gonna Need It (YAGNI)
- **Definition:** Always implement things when you actually need them, never when you just foresee that you may need them.
- **Application to Shortly:**
  - Do not build advanced feature skeletons (such as team workspace management, custom domain routing, or QR code styling configurations) during early development phases. Focus entirely on the immediate milestone objectives.

### 1.5 Composition over Inheritance
- **Definition:** Design systems by combining simple, decoupled behaviors and components rather than inheriting behavior from large, rigid base classes.
- **Application to Shortly:**
  - In React, construct complex page layouts by composing flexible, reusable UI primitives (e.g., `<Card>`, `<Button>`, `<Input>`) rather than creating monolithic, specialized layout structures.

### 1.6 Fail Fast
- **Definition:** Immediately report any condition that is likely to lead to a failure, rather than continuing to execute under buggy state.
- **Application to Shortly:**
  - In the backend, validate incoming request bodies at the routing entry point using schema middlewares. Reject malformed requests immediately with a `400 Bad Request` before invoking any service layer logic.

### 1.7 Explicit is Better Than Implicit
- **Definition:** Avoid hidden behaviors, auto-magic resolutions, or undocumented conventions.
- **Application to Shortly:**
  - Write explicit function parameters rather than relying on unstructured argument arrays.
  - Declare clear database schemas in Mongoose rather than using unchecked `Mixed` types.

### 1.8 Readability over Cleverness
- **Definition:** Code is read far more often than it is written. Avoid "clever" one-liners, shorthand notations, or obscure features if they degrade readability.
- **Application to Shortly:**
  - Prefer clear `if/else` statements or switch blocks over complex nested logical evaluations.
  - Ensure variable names describe their contents (e.g., `destinationUrl` instead of `d`).

---

## 2. Folder Ownership Rules

To ensure a strict separation of concerns, every folder in the codebase has a single, non-overlapping responsibility. Placing code in the incorrect folder degrades maintainability and is considered a critical architectural violation.

```
backend/src/
├── config/                # Only application configuration (e.g., server ports, Mongoose connectors)
├── controllers/           # Only HTTP request parsing and response delivery
├── middlewares/           # Only Express request/response interceptors (e.g., auth, rate-limiting)
├── models/                # Only database schemas and model declarations
├── repositories/          # Only database query operations
├── routes/                # Only mapping HTTP methods and paths to controllers/middlewares
├── services/              # Only core business logic
└── utils/                 # Only reusable, stateless helper functions
```

### 2.1 Backend Folder Responsibility Matrix

| Folder | Permitted Operations | Strict Bans (NEVER place here) |
| :--- | :--- | :--- |
| **`routes/`** | Map endpoints to controllers; attach route middlewares. | No business logic, no controller implementations, no database calls. |
| **`controllers/`** | Validate request input schemas; call service layer functions; send HTTP JSON responses. | No direct Mongoose queries, no business calculations, no direct external API fetches. |
| **`services/`** | Implement shortening logic, slug checks, validation logic; orchestrate data operations. | Never access Express `req` or `res` objects; no direct raw Mongoose queries. |
| **`repositories/`** | Execute database operations (e.g., `Link.findOne()`, `Click.create()`). | No controller logic, no business rules, no direct Express interaction. |
| **`models/`** | Define Mongoose schemas, types, custom database validators, and indexes. | No business rules, no controllers, no external integrations. |
| **`middlewares/`** | Intercept requests (e.g., auth checks, header validation, rate-limiting). | No business logic, no data persistence, no main routing mappings. |
| **`utils/`** | Stateless, reusable helpers (e.g., date formats, URL checkers). | No state variables, no database access, no business logic orchestration. |
| **`config/`** | Load environment configurations; export DB connectors. | No controllers, no business logic, no routes. |

---

## 3. Environment Variable Standards

Environment configurations isolate the application's configuration from its code execution path, ensuring security and portability.

### 3.1 Hard Rules
- **Never Hardcode Secrets:** Never place database passwords, JWT signing keys, or server ports directly in the source code.
- **Strictly Local `.env`:** The `.env` file contains sensitive secrets and environment configuration. It **must never** be committed to Git. Ensure it is listed in the root `.gitignore`.
- **Production Injection:** In production environments, configurations must be injected via the environment provider variables rather than read from physical files.

### 3.2 Naming Conventions & Standard Envs
Use uppercase snake case (`UPPER_SNAKE_CASE`) for all environment variables. The following variables represent our standard environment configuration:

```env
# Network Configuration
PORT=5001

# Databases & Caching
MONGO_URI=mongodb://localhost:27017/shortly
JWT_SECRET=your_jwt_secret_key_minimum_32_characters

# Application Base URLs
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5001

# Environment State
NODE_ENV=development
```

---

## 4. Logging Standards

Consistent, clear logs are essential for monitoring system health and diagnosing production bugs.

### 4.1 Development Logging
- `console.log`, `console.warn`, and `console.error` are permitted **only during active local debugging**.
- All temporary logging statements must be removed before opening a Pull Request.

### 4.2 Production Logging
- **Strip Debugging Logs:** Production code must be clean of generic console outputs.
- **Privacy & Security Bans:** Do not log sensitive user data, passwords, JWT tokens, API keys, or raw request payloads that contain authentication details.
- **Prefer Structured Logging:** Errors should be logged with details (timestamps, request path, error stacks) rather than generic text statements. Use the `morgan` middleware to automatically format and log incoming HTTP metadata.

---

## 5. Standard API Response Format

Every API endpoint must return a predictable, standardized JSON structure. This consistency enables client applications to implement uniform error-handling, loading states, and data models.

### 5.1 Success Response Schema
A successful request must always return `success: true` and place the payload within a `data` object:
```json
{
  "success": true,
  "message": "Link created successfully.",
  "data": {
    "shortCode": "a3B7",
    "destinationUrl": "https://example.com",
    "createdAt": "2026-07-14T06:00:00.000Z"
  }
}
```

### 5.2 Error Response Schema
Failed requests must return `success: false` and place the error details in a structured `error` block, along with an optional list of fields that failed validation:
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "destinationUrl",
      "message": "Invalid URL formatting."
    }
  ]
}
```

### 5.3 Technical Benefits of Consistency
- **Predictable Client Deserialization:** The client application can intercept all requests with standard logic checking for `success === true` before processing the payload.
- **Uniform Error Display:** Standardizes user alerts and toast notifications since the error message is always found in `response.data.message`.

---

## 6. JavaScript Coding Standards

### 6.1 Naming Rules
- **Variables / Functions:** Use `camelCase`. Names must be descriptive nouns or action verbs.
  ```javascript
  const userLinks = [];
  function resolveDestinationUrl() { ... }
  ```
- **React Components / Files:** Use `PascalCase` (e.g., `Navbar.jsx`, `Button.jsx`).
- **Constants:** Use `UPPER_SNAKE_CASE` (e.g., `MAX_REDIRECT_LIMIT = 5`).
- **Imports:** Place imports in clean logical blocks. Prefer absolute imports (configured via Vite/Webpack aliases) over deep relative lookups.

### 6.2 Formatting & Comments
- Maintain standard spacing. Do not leave blank line gaps within functions unless separating logical blocks.
- Comment blocks must explain the *why*, not the *what*.
- Every export should use standard JS Doc blocks to define parameters and returns.

---

## 7. React Standards

### 7.1 Component Structure
Components must follow a consistent, linear lifecycle layout:
1.  **Imports**: React dependencies, components, styling, helpers.
2.  **Statics**: Constants, helper functions defined outside the render scope.
3.  **Hooks**: Core state management, route hooks, custom hooks.
4.  **Effects**: `useEffect` declarations.
5.  **Handlers**: Event handling functions (e.g., `handleSubmit`, `handleCopy`).
6.  **Render**: Returns clean semantic JSX.

### 7.2 Hooks & State Management
- **Rule of Hooks**: Never call hooks conditionally or inside loops.
- **Custom Hooks**: Extract complex fetch or local storage logic into custom hooks (e.g., `useFetchLinks`, `useLocalStorage`).
- **Props**: Forward props explicitly. Avoid spreading props (`{...props}`) unless writing generic UI wrapper components.

### 7.3 Performance Guidelines
- **Avoid Unnecessary Re-renders:** Do not declare objects or inline anonymous functions directly inside JSX props. Extract them or utilize `useCallback`/`useMemo` ONLY when profiling proves a performance bottleneck.
- **Lazy Loading:** Dynamically import secondary pages (e.g., the detailed analytics panel) using `React.lazy()` and wrap them in a `<Suspense>` container.
- **Image Optimization:** Always define image dimensions (`width` and `height`) to prevent Layout Shift. Set `loading="lazy"` on non-hero images.

---

## 8. Express Standards

### 8.1 Controller Execution
- Controllers must act only as a bridge. They retrieve inputs, trigger services, and respond.
- Wrap all controllers in a generic error handler wrapper to avoid wrapping every function in explicit `try/catch` boilerplate blocks.

### 8.2 Service Integration
- Services must operate as pure modules. They do not know about express context, cookies, headers, or request payloads directly. Pass only required inputs.

### 8.3 Repositories
- Repositories abstract the database. If MongoDB is replaced by another document store or SQL database in the future, only files in this directory will change.

---

## 9. MongoDB Standards

### 9.1 Conventions
- **Collections**: Plural, lower camelCase (e.g., `links`, `clicks`).
- **Models**: Singular, PascalCase (e.g., `Link`, `Click`).
- **Indexes**: Fields queried regularly (`shortCode`, `userId`) must be explicitly indexed.
- **References**: Establish references between schemas using Mongoose `ObjectId` and `ref` attributes.

---

## 10. Performance Standards

To maintain responsiveness on free tiers and mobile devices, we enforce strict performance boundaries:

- **Pagination:** Never return unbounded collections. All link list and click audit endpoints must enforce page size constraints (`limit` capped to a maximum of 50).
- **Debouncing Inputs:** Front-end search inputs must be debounced by a minimum of `300ms` before triggering API queries.
- **Avoid Duplicate Requests:** Cache or deduplicate concurrent component fetches using state tracking or custom query clients.
- **Minimizing DB Projections:** Always limit fields returned from MongoDB to only those required by the active service logic (e.g., `.select('destinationUrl status')`).
- **React Rendering:** Ensure correct, stable key properties are assigned when rendering array lists. Never use array index values as the React component key.

---

## 11. Accessibility Standards

Our interface must be clean, usable, and accessible to all users:

- **Semantic HTML:** Use appropriate HTML5 tags (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`) rather than generic `<div>` wrappers.
- **Interactive Focus States:** All buttons, links, and text inputs must feature a highly visible focus state ring when navigating via keyboard. Do not disable `outline: none` without providing a custom focus replacement style.
- **Form Labels:** Every input element must have a corresponding, descriptive `<label>` or explicit `aria-label`.
- **Keyboard Navigation:** Users must be able to navigate the entire app and submit forms using only the `Tab` and `Enter` keys.
- **Color Contrast:** Keep color contrast at or above **WCAG AA** standards ($4.5:1$ for normal text, $3:1$ for large headings).
- **Touch Target Size:** Interactive elements must have a minimum interactive tap size of **$44 \times 44\text{px}$** to ensure usability on mobile touchscreens.
- **Screen Reader Friendliness:** All non-text visual components must include clear `alt` text descriptions or `aria-hidden="true"` attributes if purely decorative.

---

## 12. Testing Strategy

While automated test suites are not active in Phase 1, the following structure outlines our future testing architecture to ensure regression-free features:

```
shortly/
└── backend/
    └── tests/
        ├── unit/           # Testing isolated business logic (e.g., code generation hashing)
        ├── integration/    # Testing DB repository lookups and data persistence transitions
        └── api/            # Supertest suites calling API routes and asserting status codes
```

- **Unit Tests:** Target pure functions, helpers, and business logic inside the service layer. Dependencies must be mocked.
- **Integration Tests:** Validate database interactions and state updates within the repository layer. Requires a local or dockerized test database.
- **API Tests:** Verify Express endpoints end-to-end. Use libraries like `supertest` to trigger route controllers and validate HTTP response structures and status codes.
- **End-to-End (E2E) Tests:** Verify the complete user flow from browser interaction to backend persistence using frameworks like Playwright.

---

## 13. Dependency Rules

To keep the application fast and lean, developers must follow these package import guidelines:

- **Strict Necessity:** Introduce a new third-party library only when the effort of writing a custom solution would result in excessive development time or security risks.
- **Native First:** Prefer native ES6+ JavaScript methods (e.g., `Array.prototype.map`, `structuredClone`) over utility libraries like `lodash`.
- **Package Maintenance Check:** Never install packages that are deprecated, unmaintained, or lack active community support. Always review package download history and open issue queues on GitHub before adding them.
- **Unused Packages:** Scan the repository regularly and remove unused dependencies from `package.json` immediately.

---

## 14. Security Checklist

Verify that every feature conforms to this secure-by-default architecture checklist:

- **Validate Input:** Validate all incoming HTTP payloads at the routing border. Reject unexpected or excessive properties.
- **Sanitize Data:** Sanitize user inputs to prevent NoSQL query injection attacks (e.g., sanitize request keys to block keys starting with `$`).
- **Never Trust Frontend Validation:** Verify constraints on both client and server layers. Frontend validations are purely for user experience; backend validations are for security.
- **Password Hashing:** Passwords must be hashed using `bcrypt` (minimum 10 salt rounds) before database storage.
- **JWT Protection:** JWT secrets must be kept secure, randomly generated in production, and never logged or exposed.
- **Secure HTTP Headers:** Express apps must use the `helmet` package to automatically serve modern security headers.
- **Protect Stack Traces:** Disable verbose stack traces in production responses. Ensure errors only print generic logs while logging details to internal servers.

---

## 15. Documentation Standards

Keep project documentation up to date at all milestones:

- **README.md:** Provide clear local installation steps, dependencies, list of environment variables, and local execution scripts.
- **Architecture Diagrams:** Document complex data flows (such as analytics logging or redirection) using Mermaid formatting within the docs folder.
- **API Documentation:** Update markdown files listing routes, expected inputs, and response formats at every release cycle.
- **Database Schemas:** Keep a clean map of model properties, indexing paths, and entity relationships.

---

## 16. Milestone Approval Checklist

Before a milestone is marked complete, it must satisfy the following checks:

| Quality Gate | Verification Criteria | Verified |
| :--- | :--- | :---: |
| **Fully Runnable** | Application starts without errors via the root script `npm run dev`. | [ ] |
| **Production Compile** | Frontend builds into static assets without compiler warnings. | [ ] |
| **Console Hygiene** | Zero debug logging statements or warnings in client or server consoles. | [ ] |
| **Linter Compliance** | Linter rules pass cleanly with zero warnings. | [ ] |
| **Responsive UI** | Visual styles check out at 375px, 768px, and 1200px widths. | [ ] |
| **Architectural Boundaries** | Code separation is maintained (no database calls in controllers, etc.). | [ ] |
| **Documentation Sync** | Handbook and README files are updated to match current code changes. | [ ] |

---

## 17. Future Scalability (Version 2 Integration)

Our current design choices in Version 1 are structured to allow high-volume components to be added in Version 2 without rewriting the core application.

### 17.1 Redis Caching Layer
- **V1 Design:** The Service queries data from MongoDB using the Repository.
- **V2 Transition:** We will wrap the existing Repository in a Redis Caching decorator. When the Service requests a URL mapping, the Repository intercepts the call, reads Redis, and fallback-queries MongoDB on cache misses. The Service remains unchanged.

### 17.2 Async Click Analytics Queue
- **V1 Design:** The redirection controller triggers a fire-and-forget database insert to log clicks.
- **V2 Transition:** The Service layer will redirect the user immediately and push the click metadata to a Redis stream or BullMQ. A separate, decoupled background worker process will consume the queue and batch-insert logs into MongoDB. The HTTP request cycle is not blocked by slow write lookups.

### 17.3 Custom Domain Mapping
- **V1 Design:** Redirection queries run on a wild-card route mapping in `src/app.js`.
- **V2 Transition:** A middleware will inspect the request `Host` header. If it matches a custom domain, it maps it to the user's short code registry and routes it directly to the redirection controller, bypassing the dashboard SPA.
