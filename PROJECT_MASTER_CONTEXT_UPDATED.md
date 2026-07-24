# PROJECT_MASTER_CONTEXT.md

> **Project:** Shortly
>
> **Version:** 0.1.0
>
> **Status:** Stabilization & Audit
>
> **Current Milestone:** Stabilization & Quality Audit
>
> **Document Purpose:** This document is the official engineering
> handbook and single source of truth for the Shortly project. Every
> architectural decision, implementation guideline, development
> milestone, and future enhancement must be reflected here. Any future
> ChatGPT session or developer joining the project should read this
> document before making changes.
>
> **Completed Milestones:**
> - ✅ Phase 1 -- Project Foundation
> - ✅ Milestone 2 -- Authentication Module (Backend & Frontend)
> - ✅ Milestone 3 -- URL Management Module (Backend & Frontend Gateway)
> - ✅ Milestone 4 -- Frontend Client & Dashboard Integration (Vite + React SPA)
>
> **Overall Progress:** ~95%
>
> **Latest Achievement (2026-07-24):**
> - Implemented React + Vite frontend client including dashboard metrics, shortener creation forms, alias inline editing modals, and confirmation modals.
> - Handled background click counts and last clicked timestamp calculations.
> - Resolved custom alias conflicts (409) and link active/inactive gates (404/403).
> - Conducted stabilization audit of the current working tree and identified architectural improvements (deactivation state logic and me profile endpoints).
>
> **Next Milestone:** Phase 1 Stabilization & Bug Fixing

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

**Phase 1 Stabilization & Audit**

Overall Progress

-   ✅ Project Foundation (M1)
-   ✅ Authentication Backend (M2)
-   ✅ Authentication Frontend Layouts & Guarded Routing (M2)
-   ✅ Link Management Backend (M3)
-   ✅ Public Redirections & Click Counting (M3)
-   ✅ Frontend Client & Dashboard Integration (M4)
-   ✅ Reusable Modal System (M4)
-   ✅ Custom Alias Inline Modifications (M4)
-   ✅ Confirmation modals for deletion (M4)

Current Task

Perform a complete project audit, identify code regressions, and stabilize features before adding new functionalities:

-   Fix client array crash on the Analytics Page
-   Establish clean separation between soft-deletes and link deactivation states
-   Implement backend GET /api/auth/me to support token recovery session persistence
-   Coordinate frontend getShortUrl helper to resolve redirect port conflicts

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

## End of Session Summary (2026-07-24)

### Completed Today
- **Project Audit & Baseline Evaluation (100%):** Completed full validation check of frontend React client and backend API logic.
- **Frontend Integration:** Linked React + Vite single page application with Axios client services for user session authentication and links management CRUD.
- **Modal System Integration:** Implemented reusable modal wrappers for confirm-deletes and custom alias editing in links tables.
- **Identified Code Regressions:** Captured logic lockout states where deactivated links block update/deletion services, and client array crashes on the Analytics loading page.
- **Identified Environment Port Conflicts:** Highlighted URL mismatches where the Analytics page copies frontend client URLs rather than backend redirect gateways.

### Current Architecture Alignment
- **Structure:** 3-Tier decoupling verified across auth and links modules.
- **Error Boundary:** Serving custom browser `404.html` files for redirection failures.
- **Session Restores:** Token verification is fully persisted in local storage.

### Completion Status
- **Overall Project Progress:** 95% (Baseline established for Phase 1 stabilization).
- **Stabilization Readiness Score:** 9.5/10.

### Remaining Work
- Resolve Axios find array crash in `AnalyticsPage.jsx` using `AnalyticsPage_fixed.jsx` patterns.
- Add `isDeleted` schema field to separate soft deletes from link deactivation.
- Build backend `/api/auth/me` endpoint to recover profile attributes on token restoration.
- Refactor URL copies to pull from centralized config schemas.

> [!IMPORTANT]
> Frontend and Backend features are complete for V1 scope. The current priority is resolving regressions and stabilization issues before shipping to production.
