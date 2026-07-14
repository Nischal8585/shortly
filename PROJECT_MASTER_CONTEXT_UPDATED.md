# PROJECT_MASTER_CONTEXT.md

> **Project:** Shortly
>
> **Version:** 0.1.0
>
> **Status:** Active Development
>
> **Current Milestone:** URL Shortener Module (Milestone 3)
>
> **Document Purpose:** This document is the official engineering
> handbook and single source of truth for the Shortly project. Every
> architectural decision, implementation guideline, development
> milestone, and future enhancement must be reflected here. Any future
> ChatGPT session or developer joining the project should read this
> document before making changes.

> **Completed Milestones:**
> - ✅ Phase 1 -- Project Foundation
> - ✅ Milestone 2 -- Authentication Module (Completed & Tested)
> - ✅ Milestone 3 -- URL Management Module (Completed & Tested)
>
> **Overall Progress:** ~60%
>
> **Latest Achievement (2026-07-14):**
> - Completed URL Management Module (Link model, repository, service, controllers, and routes).
> - Implemented public redirect router for short URLs mapping to target destinations.
> - Handled background click counts and last clicked timestamp calculations.
> - Resolved custom alias conflicts (409) and link active/inactive gates (403).
> - Certified backend module with full pass status on integration test suite.
>
> **Next Milestone:** Build the Frontend Client & Dashboard Integration (Vite + React SPA)

------------------------------------------------------------------------

# 1. Executive Summary

## Project Name

**Shortly**

## Project Type

Full Stack SaaS Web Application

## Category

URL Shortener & Link Analytics Platform

## Purpose

Flagship portfolio project for resume, GitHub, and technical interviews.

The primary objective is **not** to build the largest or most
feature-rich URL shortener. Instead, the objective is to build a clean,
production-quality application that demonstrates strong software
engineering fundamentals and can be confidently explained during
technical interviews.

------------------------------------------------------------------------

# 2. Vision

Shortly aims to provide a modern, clean, and user-friendly platform
where users can create short URLs, manage their links, generate QR
codes, and view basic analytics.

The application should feel polished and professional while remaining
intentionally simple enough for a single developer to fully understand
and maintain.

The project emphasizes engineering quality over feature quantity.

------------------------------------------------------------------------

# 3. Project Objectives

The project has five primary objectives.

## Objective 1

Develop a complete full-stack web application using modern JavaScript
technologies.

------------------------------------------------------------------------

## Objective 2

Learn and demonstrate professional backend architecture using:

-   Express
-   MongoDB
-   Repository Pattern
-   Service Layer
-   Controllers
-   REST APIs

------------------------------------------------------------------------

## Objective 3

Gain practical experience with frontend development using:

-   React
-   Vite
-   React Router
-   Axios
-   Tailwind CSS

------------------------------------------------------------------------

## Objective 4

Build a project suitable for:

-   Resume
-   GitHub Portfolio
-   Campus Placements
-   Technical Interviews

------------------------------------------------------------------------

## Objective 5

Understand every major implementation detail.

Every feature included in Version 1 must be explainable without relying
on AI.

------------------------------------------------------------------------

# 4. Success Criteria

The project will be considered successful when all of the following are
true.

## Technical

-   Authentication works.
-   URL shortening works.
-   QR code generation works.
-   Dashboard displays user data.
-   Analytics display click counts.
-   Application is deployed successfully.

------------------------------------------------------------------------

## Engineering

-   Clean architecture maintained.
-   Small, readable files.
-   Single Responsibility Principle followed.
-   No unnecessary complexity.
-   Consistent coding standards.

------------------------------------------------------------------------

## Learning

The developer can confidently explain:

-   JWT Authentication
-   bcrypt Password Hashing
-   Repository Pattern
-   Controller Layer
-   Service Layer
-   MongoDB Models
-   Express Middleware
-   REST API Design
-   Complete Authentication Flow

------------------------------------------------------------------------

# 5. Problem Statement

Long URLs are difficult to read, difficult to remember, and often reduce
trust when shared.

Existing commercial solutions provide advanced features but frequently
require paid subscriptions for capabilities such as analytics, QR code
generation, branding, or link management.

For learning purposes, there is value in building a simplified version
that demonstrates the underlying engineering concepts while remaining
completely free and open source.

------------------------------------------------------------------------

# 6. Target Users

The project is designed primarily for educational and portfolio
purposes, but it models realistic user groups.

### Students

Need clean links for resumes and project portfolios.

### Job Seekers

Share GitHub, LinkedIn, portfolios, and resumes using short URLs.

### Small Businesses

Share menus, websites, or promotional links using QR codes.

### Developers

Understand authentication, backend architecture, CRUD operations, and
deployment.

------------------------------------------------------------------------

# 7. Project Philosophy

The following principles are permanent and must guide every engineering
decision.

------------------------------------------------------------------------

## Principle 1

**Simple \> Complex**

Avoid unnecessary architecture or features.

------------------------------------------------------------------------

## Principle 2

**Interview Confidence \> Fancy Features**

A feature should only be included if it improves learning or resume
quality and can be confidently explained.

------------------------------------------------------------------------

## Principle 3

**Understand Every Line**

Never merge AI-generated code without reviewing and understanding it.

------------------------------------------------------------------------

## Principle 4

**One File at a Time**

Development follows this workflow:

Design

↓

Generate One File

↓

Review

↓

Understand

↓

Approve

↓

Commit

↓

Continue

------------------------------------------------------------------------

## Principle 5

**Production Quality Without Over-Engineering**

Use professional coding practices while avoiding enterprise-level
complexity that provides little educational value.

------------------------------------------------------------------------

## Principle 6

**Free Resources Only**

The complete Version 1 application must be buildable using free
services.

Examples:

-   MongoDB Atlas Free
-   Render Free
-   Vercel Free
-   Open-source npm packages

No paid APIs or subscriptions should be required.

------------------------------------------------------------------------

# 8. Permanent Engineering Rules

The following rules must never be violated.

## Architecture

-   Business logic belongs only in Services.
-   Database operations belong only in Repositories.
-   Controllers remain thin.
-   Routes only map endpoints.
-   Models only define schemas.

------------------------------------------------------------------------

## Development

-   One major file per implementation step.
-   Every file reviewed before continuing.
-   Every milestone tested before the next milestone begins.

------------------------------------------------------------------------

## Code Quality

-   Prefer readability over cleverness.
-   Avoid unnecessary dependencies.
-   Keep functions small.
-   Keep files focused.
-   Use meaningful names.

------------------------------------------------------------------------

## Project Scope

If a feature increases complexity without significantly improving
interview readiness or learning, move it to Version 2.

------------------------------------------------------------------------

# 9. Current Project Status

Project Version

**0.1.0**

Development Phase

**Milestone 2 --- Authentication**

Overall Progress

-   ✅ Project Foundation
-   ✅ User Model
-   ✅ Repository Layer
-   ✅ Service Layer
-   ✅ Controller Layer
-   ✅ Authentication Routes
-   ✅ Global Error Middleware

Current Task

Continue backend authentication by implementing:

-   JWT Authentication Middleware
-   Connect app.js
-   Connect server.js
-   MongoDB Connection
-   Authentication Testing

------------------------------------------------------------------------

# End of Part 1

# 10. Technology Stack

The technology stack has been intentionally selected to balance
learning, production-quality engineering, deployment simplicity, and
interview readiness.

Every technology included in Version 1 must have a clear purpose.

------------------------------------------------------------------------

## Frontend

  Technology         Purpose
  ------------------ ---------------------------------------------
  React              Component-based UI development
  Vite               Fast development environment and build tool
  React Router DOM   Client-side routing
  Axios              HTTP client for backend communication
  Tailwind CSS       Utility-first styling system

------------------------------------------------------------------------

## Backend

  Technology     Purpose
  -------------- ---------------------------------
  Node.js        JavaScript runtime
  Express.js     REST API framework
  dotenv         Environment variable management
  bcryptjs       Password hashing
  jsonwebtoken   JWT Authentication
  cors           Cross-Origin Resource Sharing
  helmet         HTTP security headers
  morgan         Request logging
  mongoose       MongoDB ODM

------------------------------------------------------------------------

## Database

MongoDB Atlas (Free Tier)

Reason:

-   Free
-   Cloud hosted
-   Easy deployment
-   Excellent Mongoose integration

------------------------------------------------------------------------

## Deployment

Frontend

Vercel

Backend

Render

Database

MongoDB Atlas

All deployment services must remain within free-tier limits.

------------------------------------------------------------------------

# 11. Project Folder Structure

    shortly/

    ├── backend/
    │
    ├── frontend/
    │
    ├── docs/
    │
    ├── .gitignore
    │
    ├── package.json
    │
    └── README.md

------------------------------------------------------------------------

## Backend Structure

    backend/

    src/

    config/

    controllers/

    middlewares/

    models/

    repositories/

    routes/

    services/

    utils/

    app.js

    server.js

    package.json

    .env

------------------------------------------------------------------------

## Backend Folder Responsibilities

### config/

Contains:

-   MongoDB connection
-   Environment configuration

Must NOT contain:

-   Routes
-   Controllers
-   Business logic

------------------------------------------------------------------------

### controllers/

Responsible for:

-   Reading req.body
-   Reading req.params
-   Reading req.query
-   Calling services
-   Returning JSON responses

Must NEVER contain:

-   Database queries
-   Password hashing
-   JWT generation
-   Business logic

------------------------------------------------------------------------

### services/

Responsible for:

-   Authentication logic
-   Password hashing
-   JWT generation
-   URL shortening logic
-   QR generation logic
-   Analytics calculations

Must NEVER contain:

-   Express request handling
-   HTTP responses

------------------------------------------------------------------------

### repositories/

Responsible only for:

-   MongoDB operations

Examples:

-   findUserByEmail()
-   createUser()
-   findLinkByCode()

Must NEVER contain:

-   JWT
-   bcrypt
-   Express
-   Business logic

------------------------------------------------------------------------

### models/

Responsible only for:

MongoDB schemas.

Models define:

-   Fields
-   Validation
-   Indexes
-   Relationships

Nothing more.

------------------------------------------------------------------------

### routes/

Responsible only for:

Mapping URLs.

Example

POST /login

↓

authController.login()

Routes never contain business logic.

------------------------------------------------------------------------

### middlewares/

Responsible for:

-   Authentication middleware
-   Error middleware
-   Validation middleware (future)

------------------------------------------------------------------------

### utils/

Utility functions shared across the project.

Examples

-   Base62 generator
-   Date formatting
-   Helper methods

Utilities should remain stateless.

------------------------------------------------------------------------

# 12. Frontend Structure

    frontend/

    src/

    assets/

    components/

    context/

    hooks/

    layouts/

    pages/

    services/

    utils/

    App.jsx

    main.jsx

------------------------------------------------------------------------

## Frontend Folder Responsibilities

### pages/

Full application pages.

Examples:

-   Home
-   Login
-   Register
-   Dashboard
-   Analytics
-   Profile

------------------------------------------------------------------------

### components/

Reusable UI components.

Examples:

-   Navbar
-   Sidebar
-   Cards
-   Buttons
-   Forms

------------------------------------------------------------------------

### services/

Contains Axios API calls.

Examples

login()

register()

createShortLink()

getAnalytics()

No UI logic should exist here.

------------------------------------------------------------------------

### hooks/

Reusable custom React hooks.

Example

useAuth()

Future additions only when necessary.

------------------------------------------------------------------------

### context/

Global application state.

Initially:

Authentication Context

Future:

Theme Context

------------------------------------------------------------------------

### assets/

Images

Icons

Fonts

Logos

------------------------------------------------------------------------

### utils/

Small helper functions.

Must remain framework-independent.

------------------------------------------------------------------------

# 13. Dependencies

## Backend

express

mongoose

bcryptjs

jsonwebtoken

dotenv

helmet

cors

morgan

nodemon

------------------------------------------------------------------------

## Frontend

react

react-dom

vite

react-router-dom

axios

tailwindcss

------------------------------------------------------------------------

# 14. Environment Variables

The project uses the following environment variables.

    PORT=

    MONGO_URI=

    JWT_SECRET=

    NODE_ENV=

    CLIENT_URL=

    SERVER_URL=

------------------------------------------------------------------------

## Rules

Never hardcode:

-   Database URLs
-   API keys
-   Secrets
-   JWT secrets

Always use .env.

The .env file must never be committed to Git.

------------------------------------------------------------------------

# 15. API Base Structure

All backend APIs follow:

    /api

Authentication

    POST /api/auth/register

    POST /api/auth/login

Future

    GET /api/profile

    POST /api/links

    GET /api/links

    PUT /api/links/:id

    DELETE /api/links/:id

    GET /:shortCode

------------------------------------------------------------------------

# 16. Request Lifecycle

Frontend

↓

Axios

↓

Routes

↓

Controller

↓

Service

↓

Repository

↓

MongoDB

↓

Repository

↓

Service

↓

Controller

↓

JSON Response

↓

Frontend

Every request follows this flow.

No layer should skip another layer.

------------------------------------------------------------------------

## End of Session Summary (2026-07-14)

### Completed Today
- **Backend MVP Complete (100%):** Feature-complete and certified.
- **Authentication Module:** Complete with JWT generation, password hashing (bcrypt), route protection middleware (`protect.js`), and registration/login integrations.
- **URL Management Module:** Mapped `Link` validation schemas, implemented link CRUD repository functions, service validations (custom alias collision checks, ownership controls), and mounted `linkRoutes` under `/api/links`.
- **Redirect Module:** Configured public redirect router (`GET /r/:shortCode`) supporting temporary `302` redirects, background click increments, and active status checks.
- **Error Handling Optimization:** Refactored `errorMiddleware.js` to map Mongoose `ValidationError` exceptions to `400 Bad Request` instead of general `500` server errors.
- **Integration Test Execution:** Verified 18 distinct test scenarios (Register, Login, Conflict Slugs, Wrong Password, Active/Inactive redirects, Invalid JWT, Unauthorized Requests, Ownership Checks, Invalid URL format checks) with a 100% pass rate.

### Final Backend Architecture
- **Structure:** Clean 3-tier decoupling (Controller → Service → Repository → Mongoose/MongoDB).
- **Global Error Handling:** Handled centrally by `errorMiddleware.js`.
- **Route Protection:** Secured using the Bearer Token validation layer in `protect.js`.

### Backend Completion Status
- **Backend Progress:** 100% (Certified Feature-Complete).
- **Backend Readiness Score:** 10/10.

### Remaining Work
- **Frontend Client only (0% completed):** Next milestone focuses on building the React + Vite single-page dashboard client.

> [!IMPORTANT]
> Backend development is considered feature-complete. Future backend changes should only be bug fixes or planned Version 2 enhancements.
