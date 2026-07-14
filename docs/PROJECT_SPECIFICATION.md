# Project Specification & Product Requirements Document (PRD)

This document is the official, authoritative source of truth and product requirements specification for **Shortly**. It defines the full scope, functional interfaces, user stories, security bounds, milestones, and technical constraints. It serves as the onboarding reference for all engineering team members.

---

## 1. Project Overview

### 1.1 Project Name
**Shortly** — Premium Link Management & Analytics Platform.

### 1.2 Project Description
Shortly is a full-stack, developer-grade link shortening and analytics platform designed to solve the aesthetic, user experience, and trackability problems associated with sharing long, complex web links.

### 1.3 Vision
To empower content creators, digital marketers, developers, and businesses with complete control over their shared digital real estate through clean, beautiful, fast, and secure short links backed by accessible analytics.

### 1.4 Mission
To deliver a high-performance, responsive URL shortener utilizing free deployment tiers, conforming to human-designed editorial standards, and featuring a clean boundary architecture that is ready to scale to enterprise levels in later versions.

### 1.5 Objectives
- Build a lightweight SPA client that renders in $<2\text{s}$ and follows the sand-charcoal-crimson design guidelines.
- Build a fast, secure Express.js REST API that resolves redirection mappings in $<30\text{ms}$.
- Establish database models and data flows in MongoDB that log and aggregate redirection clicks asynchronously.
- Deliver the system completely runnable on free resources (Vercel, Render, MongoDB Atlas Free) with zero operational cost.

### 1.6 Target Audience
- **Digital Marketers:** Need clean, customized slugs for social campaigns and click tracking.
- **Content Creators:** Require simple links for link-in-bio sections that look visually premium.
- **Recruiters & Professionals:** Share resume links and portfolio paths that fit neatly into resumes and emails.
- **Local Small Businesses:** Need printable, crisp QR codes linked to their menus, locations, or reviews.
- **Developers:** Require simple API links and self-contained redirects for utility scripts.

### 1.7 Business Value
Shortly turns long, ugly URLs into extensions of a user's brand. By shortening links, it increases click-through rates (CTR) by up to 34% compared to long, unreadable raw query strings, while simultaneously capturing analytics data that informs marketing spend and viewer engagement.

### 1.8 Real-World Use Cases
- **Resume Customization:** A software engineer shortens a long Google Drive link to `short.ly/john-resume` to print on physical business cards.
- **Offline Restaurant Menu:** A restaurant owner shortens `https://my-local-bistro.com/assets/menus/summer-dinner-v4.pdf` to `short.ly/bistro-summer` and prints the associated Shortly QR code on table stands.
- **Campaign Tracking:** A marketer generates `short.ly/spring-sale` to share on Twitter and monitors click volumes daily to measure social media engagement.

---

## 2. Problem Statement

### 2.1 The Issue with Long URLs
Modern web links are often cluttered with trackers, query parameters, and lengthy folder structures. These links are visually ugly, difficult to read, hard to write manually, and consume character limits on platforms like Twitter/X. They look unprofessional and spammy, which degrades user trust.

### 2.2 Insufficiency of Existing Solutions
Current free URL shorteners are often heavily restricted:
- They force users into confusing, ad-filled redirection dashboards.
- They hide basic click analytics behind expensive monthly paywalls.
- They generate generic, AI-looking, purple-colored interfaces that clash with clean design aesthetics.
- They limit custom alias creations on free accounts.

### 2.3 The Crucial Need for Analytics
A link creator needs to know if their audience is actively clicking. Without knowing *when* they click, *where* they are referred from, and *what browser* they use, creators cannot evaluate the effectiveness of their distribution channels.

### 2.4 Why QR Codes Matter
In a mobile-first world, users do not type URLs. They scan codes. Businesses require high-quality, scalable QR codes that map cleanly to short links for print flyers, menu stands, and sign-ups.

### 2.5 Centralized Link Management
Users sharing multiple links across campaigns require a single, secure dashboard to search, review, create, delete, and evaluate all their active web redirects in one place.

---

## 3. Proposed Solution

Shortly resolves these issues by delivering a self-contained, developer-ready link workspace:

```
[ Long URL Entry ] ──> [ Shortly Engine ] ──> [ Custom Short Alias ] 
                                                   │
                                                   ├──> Immediate 302 Redirection
                                                   └──> Asynchronous Click Logging & QR Code Generation
```

### 3.1 Core Capabilities
- **Instant Redirection:** Ultra-fast lookup from short slug to original long URL via temporary redirection (`302 Found`), preserving SEO and click tracking parameters.
- **Aesthetic Customization:** Fully editable slugs (custom aliases) so links read clearly (e.g., `short.ly/portfolio-2026`).
- **Real-Time Visual QR Generation:** Renders vector-sharp, high-contrast QR codes for any created link directly in the browser for print download.
- **No-Bloat Analytics Dashboard:** Displays aggregated click timelines, referrer breakdowns, and device audits in a responsive grid.

### 3.2 User Experience
The user lands on a warm sand-themed interface. They enter their destination link and optional custom slug. Upon shortening, the card transitions cleanly to display their new short URL, copy buttons, and an exportable QR code. Below the input card, they can review their existing links list and click any link to review its detailed click log dashboard.

---

## 4. Project Goals

### 4.1 Primary Goals
- Implement user authentication and link management (create, read, update, delete).
- Build the redirect mapping logic and analytics recording engine.
- Satisfy all visual requirements set by the project design standards.

### 4.2 Secondary Goals
- Achieve clean, responsive layouts from $375\text{px}$ up to $1440\text{px}$.
- Secure all API endpoints with schema validation and query rate limits.

### 4.3 Learning Goals
- Master the **Controller-Service-Repository** pattern in pure JavaScript.
- Build clean, accessible components using Vanilla CSS without relying on utility framework generators.

### 4.4 Portfolio Goals
- Deploy a production-ready, highly polished full-stack application that exhibits professional repository hygiene.
- Document a clean, forward-compatible codebase that demonstrates preparation for enterprise-level scaling.

---

## 5. Scope

### 5.1 In Scope (Version 1)
- User sign-up, login, and secure session management (JWT).
- URL shortening, custom slug overrides, and soft validation.
- Interactive link listings with search and filter attributes.
- Click logging (device, browser, referrer, timestamp).
- Dashboard rendering click timelines and statistical breakdowns.
- Visual QR code rendering and downloading.
- Fully responsive Vanilla CSS layouts and design token alignment.

### 5.2 Out of Scope (Version 1)
- Custom domains configuration.
- Shared workspaces and collaborative team features.
- Paid subscription layers.
- Automatic link pre-caching or web-scraping metadata.

### 5.3 Version 2 Features
- Redis integration for redirection caching.
- BullMQ background workers for click-logging decoupling.
- Multi-member team access control.
- Custom domain DNS mapping and SSL generation.

### 5.4 Future Ideas
- Deep link routing based on device operating systems (iOS vs. Android).
- Automatic malware scanning of destination URLs prior to redirect.

---

## 6. Functional Requirements

Every functional requirement is cataloged below with its priority and acceptance guidelines.

```
Priority Index:
P0: Critical core features (Required for basic operation)
P1: Important features (Required for the standard user experience)
P2: Optional features (Polishes, animations, advanced attributes)
```

### 6.1 Requirements Directory

#### FR-001: User Registration
- **Purpose:** Allow new users to create accounts.
- **Description:** Collects user email and password, hashes the password via `bcrypt`, and registers the user profile in MongoDB.
- **Priority:** P0
- **Dependencies:** None
- **Acceptance Criteria:**
  1. Rejects duplicate emails.
  2. Enforces password strength constraints (minimum 8 characters).
  3. Returns a structured success response on successful signup.

#### FR-002: Login
- **Purpose:** Authenticate existing users.
- **Description:** Verifies credentials against MongoDB and signs a JWT token returned to the client.
- **Priority:** P0
- **Dependencies:** FR-001
- **Acceptance Criteria:**
  1. Validates password hashes correctly.
  2. Returns a JSON token payload valid for 24 hours.
  3. Rejects incorrect passwords with a structured `401 Unauthorized` response.

#### FR-003: Logout
- **Purpose:** Terminate user session.
- **Description:** Clears the client-side authentication token/session memory.
- **Priority:** P0
- **Dependencies:** FR-002
- **Acceptance Criteria:**
  1. Discards the active token on the client.
  2. Redirects the user cleanly to the login view.

#### FR-004: Create Link
- **Purpose:** Shorten a long URL.
- **Description:** Receives a long destination URL and optional custom alias, generates a unique Base62 slug, and stores the mapping under the authenticated user's profile.
- **Priority:** P0
- **Dependencies:** FR-002
- **Acceptance Criteria:**
  1. Validates destination URL format.
  2. Automatically generates a unique 6-character alphanumeric slug if no custom alias is provided.
  3. Enforces uniqueness on custom alias values.
  4. Returns the created link object matching the Standard API response format.

#### FR-005: Delete Link
- **Purpose:** Disable a shortened link.
- **Description:** Removes a link mapping from the database, disabling subsequent redirects.
- **Priority:** P0
- **Dependencies:** FR-004
- **Acceptance Criteria:**
  1. Limits deletion permissions strictly to the user who created the link.
  2. Subsequent calls to the deleted short link return a standard `404 Not Found` response.

#### FR-006: Edit Link
- **Purpose:** Update the destination of an active short link.
- **Description:** Allows modifying the destination URL of an existing link object.
- **Priority:** P1
- **Dependencies:** FR-004
- **Acceptance Criteria:**
  1. Restricts edits to the resource owner.
  2. Validates new destination URL formatting.
  3. Update applies immediately to all future redirect traffic.

#### FR-007: Search & Filter Links
- **Purpose:** Manage large sets of links.
- **Description:** Provides a client-side and API-side input to query links by destination domain, short code, or label, and filter by creation dates.
- **Priority:** P1
- **Dependencies:** FR-004
- **Acceptance Criteria:**
  1. Executes searches dynamically.
  2. Integrates pagination with a default size limit of 10.

#### FR-008: QR Code Generation
- **Purpose:** Support physical sharing of links.
- **Description:** Renders a high-contrast black-and-white QR code linking to the shortened URL path.
- **Priority:** P1
- **Dependencies:** FR-004
- **Acceptance Criteria:**
  1. Renders the QR code directly inside the dashboard link detail card.
  2. Provides an export/download button to save the QR code as a PNG or SVG.

#### FR-009: Analytics Dashboard
- **Purpose:** Show traffic performance metrics.
- **Description:** Renders charts and lists detailing click counts over time, referrer domains, and user client attributes (browsers/operating systems).
- **Priority:** P1
- **Dependencies:** FR-010
- **Acceptance Criteria:**
  1. Displays aggregate counts accurately.
  2. Categorizes referrers (e.g. "Direct", "Twitter", "GitHub").
  3. Adapts spacing cleanly to mobile displays.

#### FR-010: Link Redirection
- **Purpose:** Forward users to their destination.
- **Description:** Listens on `/` for short code entries, fetches the original URL, logs the click parameters asynchronously, and redirects the client.
- **Priority:** P0
- **Dependencies:** FR-004
- **Acceptance Criteria:**
  1. Responds immediately with HTTP Status `302 Found` and the `Location` header set to the destination URL.
  2. Logs click details (IP, User-Agent, Referrer, timestamp) asynchronously in the background.
  3. Gracefully responds with a clean `404 Not Found` page if the code is invalid or expired.

---

## 7. Non-Functional Requirements

These requirements dictate operational limits and quality attributes:

### 7.1 Performance
- **Redirection Time:** Redirection path database lookups must resolve in under $30\text{ms}$.
- **Page Load Speed:** The client application must achieve a Lighthouse performance score of $\ge 90$ with a First Contentful Paint (FCP) of under $1.5\text{s}$.

### 7.2 Security
- **Data Protection:** Hash all user passwords using `bcrypt` (10 rounds) before inserting them into MongoDB.
- **JWT Lifespan:** Authentication tokens must use HS256 encryption and automatically expire after 24 hours.
- **Input Validation:** Enforce strict validation schemas on all POST and PUT requests. Apply NoSQL injection sanitizers.

### 7.3 Availability & Scalability
- **Uptime:** Deliver a target of 99.9% uptime using cloud providers.
- **Architectural Flexibility:** Code must isolate database lookups behind the repository pattern to allow adding Redis without rewriting logic in later stages.

### 7.4 Maintainability
- **Linting:** Maintain zero ESLint warning flags.
- **Code Standards:** 100% compliance with `docs/ENGINEERING_STANDARDS.md`.

### 7.5 Accessibility (a11y)
- **Contrast Check:** Maintain WCAG AA standards ($4.5:1$ text contrast ratio).
- **Tap Targets:** All touchscreen targets must occupy at least $44 \times 44\text{px}$ of interactive space.
- **Navigation:** Enforce full keyboard navigation support.

### 7.6 Responsiveness & Browser Support
- **Mobile First:** Page elements must scale smoothly down to $375\text{px}$ mobile viewport widths without layouts clipping or overflowing.
- **Browser Compatibility:** Support all modern browsers (Chrome, Safari, Firefox, Edge).

### 7.7 Deployment
- **Client Hosting:** Vercel/Cloudflare Pages.
- **Server Hosting:** Render or Fly.io free tiers.
- **Database Hosting:** MongoDB Atlas free tier.

---

## 8. User Stories

We define user success through 20 detailed user personas:

### 8.1 Marketers & Content Creators
1.  **As a digital marketer**, I want to create custom short links (e.g. `short.ly/spring-promo`) so that my social media campaign links look professional and brand-aligned.
2.  **As an Instagram creator**, I want to generate a short link to place in my bio so that it fits cleanly on one line and doesn't look like spam.
3.  **As a product marketer**, I want to track referrer metrics on my short links so that I can see whether Twitter or LinkedIn drives the most conversions.
4.  **As a YouTuber**, I want to share short links for affiliate items in my video descriptions so that the visual real estate looks organized.

### 8.2 Business Owners & Offline Operators
5.  **As a local coffee shop owner**, I want to convert my PDF dinner menu link into a Shortly QR code so that I can print it on table stands for contactless scanning.
6.  **As an event organizer**, I want to put a short link on my print posters (e.g., `short.ly/rsvp-jazz`) so that passersby can easily memorize and type it.
7.  **As a SaaS startup founder**, I want to evaluate click timelines on my sign-up link during launch week so that I can monitor real-time traffic spikes.
8.  **As a real estate agent**, I want to create custom links for home walkthrough videos so that I can easily send them via SMS to buyers.

### 8.3 Recruiters, Job Seekers, & Professionals
9.  **As a job seeker**, I want to shorten my drive resume URL to `short.ly/kate-cv` so that it fits neatly on my physical resume and is easy to enter.
10. **As a recruiter**, I want to track clicks on my job application link so that I can tell if candidates are opening the position details from email campaigns.
11. **As a college professor**, I want to generate a short URL for syllabus documents so that students can access the resource during lectures without copy errors.
12. **As a freelance designer**, I want to shorten my portfolio link to `short.ly/design-showcase` to share in client pitches.

### 8.4 Developers & Engineers
13. **As a software developer**, I want my backend redirect logic to execute in under 30ms so that my users do not experience latency lag during routing.
14. **As an automation engineer**, I want to delete old links programmatically when campaigns expire so that I don't maintain dead redirect paths.
15. **As a systems administrator**, I want to rate-limit shortening requests on the API so that malicious scripts cannot crash the server or exhaust our MongoDB limits.
16. **As a security auditor**, I want all user credentials to be hashed and environment variables stored safely so that user data is never compromised.

### 8.5 Everyday Users & Students
17. **As a university student**, I want to shorten long Wikipedia links when writing online papers so that my references page looks clean and properly formatted.
18. **As a group project leader**, I want to share a short link to our shared slide deck so that my teammates can load it instantly on their phones.
19. **As a community manager**, I want to shorten our chat invitation link so that I can display it clearly in our social banners.
20. **As a mobile user**, I want to tap buttons that are at least 44px tall so that I don't accidentally press the wrong option when viewing the dashboard.

---

## 9. Success Criteria

Shortly is considered successful if it satisfies all of the following parameters:

- **Performance Gate:** Redirections from code to target resolve in $<30\text{ms}$ (excluding network transit times).
- **Design Review:** Passing 100% of the checks in `docs/DESIGN_STANDARDS.md` (no purples, editorial layout, premium sand theme).
- **Zero Cost Deployment:** Runs continuously on free tiers (Vercel, Render, MongoDB Atlas) without exceeding limits or incurring costs.
- **Code Health:** Zero compilation warnings, zero linter errors, and 100% adherence to folder ownership constraints.

---

## 10. Milestones

```
M1: Foundation ──> M2: Auth ──> M3: URL CRUD ──> M4: Layout ──> M5: Analytics ──> M6: QR Code ──> M7: Deploy ──> M8: V2 Prep
```

### Milestone 1: Project Foundation (Completed)
- Establish monorepo workspace configuration.
- Set up Express server with health routes and basic Mongoose initialization.
- Create React Vite application and write CSS design tokens.
- Complete documentation audit.

### Milestone 2: Authentication
- Develop user signup, login, and token verification endpoints.
- Store hashed passwords in MongoDB.
- Build login and signup views on the frontend; manage client session token persistence.

### Milestone 3: URL Management
- Write Link Schema in MongoDB.
- Implement API controller to generate unique Base62 slugs.
- Create the backend endpoints to shorten, delete, search, and list links.
- Set up unit testing for slug generation.

### Milestone 4: Dashboard Layout
- Refine dashboard layouts on the client.
- Connect URL creation form to the backend API.
- Render the recent links grid with active copy buttons.

### Milestone 5: Link Redirection & Analytics
- Write detailed Click schema.
- Implement redirection route `GET /:code` yielding immediate 302 responses.
- Implement background logging of click parameters.
- Build analytics charts and aggregates showing device, browser, and timeline counts.

### Milestone 6: QR Code System
- Integrate client-side QR renderer in the dashboard.
- Create vector download buttons.

### Milestone 7: Production Deployment
- Configure production CORS and environment variables.
- Deploy database to MongoDB Atlas Free, server to Render, and client to Vercel.
- Complete final responsive audits and milestone sign-off check.

### Milestone 8: Version 2 Roadmap
- Prepare code boundaries for Redis cache repository integration.
- Document background queuing routes.

---

## 11. Risks & Mitigations

### 11.1 Technical Risk: High Redirection Latency
- *Risk:* Fetching redirection records from MongoDB directly on every route request takes too long.
- *Mitigation:* Index the `shortCode` field. Structure the code with the Repository pattern in V1 so that a Redis cache layer can be added easily in V2.

### 11.2 Security Risk: Spam and Phishing Link Creation
- *Risk:* Bad actors use Shortly to create redirects to malware pages, causing blacklisting of our domain.
- *Mitigation:* Limit link creations using backend rate limiters. Implement an asynchronous verification utility to inspect target URLs against safety domains in Phase 2.

### 11.3 Deployment Risk: Cold Start Sleep
- *Risk:* Render free tier servers go to sleep after 15 minutes of inactivity, causing high latency for the first request.
- *Mitigation:* Implement a simple ping cron job or explain this expected behavior to portfolio reviewers, recommending a warm-up call before testing the app.

---

## 12. Assumptions

- **Local Storage:** Assume the client browser supports `localStorage` to persist JWT session tokens.
- **Node Environment:** Assume Node.js version $\ge 18$ is active on the hosting servers.
- **DNS Host:** Assume the platform operates under a single domain in V1 (e.g. `shortly.com` for both API and client, resolved by route prefixes).

---

## 13. Constraints

- **Free Limits:** Must reside entirely within free tiers. MongoDB storage limit is $512\text{MB}$.
- **No Build Tools outside standard configs:** Must avoid complex transpilation configs. Use clean JavaScript.
- **Vanilla CSS:** No Tailwind or CSS-in-JS.
- **No Paid APIs:** Must not depend on premium geolocation databases or paid QR libraries.

---

## 14. Future Roadmap

### Version 1.5 (Minor Updates)
- Add tag groupings for links.
- Implement user password recovery emails.

### Version 2 (Scale Upgrades)
- Integrate Redis for redirection cache.
- Decouple logging with BullMQ background queues.
- Introduce teams and shared links dashboard.

### Version 3 (Enterprise Upgrades)
- Support custom domain DNS resolution.
- Provide advanced API integrations for automation scripts.

---

## 15. Appendix

### 15.1 Glossary
- **Base62:** Alphanumeric encoding representation using symbols `0-9`, `a-z`, and `A-Z` to generate short URLs without special character confusion.
- **Custom Alias:** A user-specified slug replacing the default random code (e.g., `shortly/my-page` instead of `shortly/aB3x9`).
- **Lighthouse:** An open-source, automated tool by Google to measure web page quality metrics.

### 15.2 Abbreviations
- **JWT:** JSON Web Token
- **SPA:** Single Page Application
- **PRD:** Product Requirements Document
- **REST:** Representational State Transfer
- **NFR:** Non-Functional Requirement

### 15.3 Technology Summary
- **Frontend:** React, Vite, Vanilla CSS.
- **Backend:** Node.js, Express.js, Mongoose.
- **Hosting:** Vercel (client), Render (server), MongoDB Atlas (database).

### 15.4 Architecture Summary
The codebase follows a decoupled client-server structure. The backend utilizes the **Controller-Service-Repository** pattern. The frontend is built as a lightweight, responsive SPA. Data transfer utilizes strict JSON configurations over HTTP.
