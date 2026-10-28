# Bizwoke Review - Node.js & MongoDB Backend

A robust, enterprise-grade REST API backend built with **Node.js**, **Express.js (ES Modules)**, and **MongoDB (Mongoose)** to completely replace Convex.

---

## 🚀 Key Architectural Features

1. **Role-Based Access Control (RBAC)**:
   - `SUPER_ADMIN`: Global system configuration, multi-branch overview, branch creation/management, pricing package control, user provisioning, audit log inspection.
   - `BRANCH_ADMIN`: Scoped branch management, user creation, review platforms setup, branch analytics.
   - `BRANCH_USER`: Strictly read-only access to branch metrics, reviews, and logs.
2. **Branch Security & Data Isolation**:
   - Automated server-side tenant isolation prevents cross-branch access.
3. **Star-Gating Feedback System**:
   - 4–5 Star ratings: Marked as positive and redirected/prompted to external platforms (Google Reviews, Facebook, etc.).
   - 1–3 Star ratings: Gated to a private internal survey/complaint form to resolve issues before they reach public platforms.
4. **Automated Seeding on First Boot**:
   - Pre-seeds Super Admin account (`nktech@gmail.com` / `123456`).
   - Pre-seeds default pricing packages, essential subscription plans, survey questions, and system settings.
5. **Privacy Scrubbing & Centralized Audit Logger**:
   - Request access logs (`METHOD /path STATUS (duration ms)`).
   - Automatically masks passwords, secrets, tokens, and sensitive keys from all logs.

---

## 🛠️ API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user / company admin
- `POST /api/auth/login` - Authenticate user & receive JWT token
- `POST /api/auth/verify-email` - Verify email using 6-digit code
- `POST /api/auth/resend-code` - Resend verification code
- `GET /api/auth/me` - Get current authenticated user profile & quota

### Branches (`/api/branches`)
- `GET /api/branches/summary` - Aggregate metrics for Super Admin Slider (ratings, review count, user count)
- `GET /api/branches` - List branches (all for Super Admin, scoped for Branch Admin)
- `GET /api/branches/:id` - Get branch details
- `POST /api/branches` - Create branch (Super Admin only)
- `PUT /api/branches/:id` - Update branch details
- `DELETE /api/branches/:id` - Soft-delete branch

### Reviews & Star Gating (`/api/reviews`)
- `GET /api/reviews/context/:formKey` - Public context for `/wtr/[formKey]` customer feedback page
- `POST /api/reviews/rating` - Submit customer feedback (Star Gating logic)
- `POST /api/reviews/generate-text` - AI / Smart template review text generator
- `GET /api/reviews` - Protected list of branch reviews with filters (star, search, pagination)
- `GET /api/reviews/stats` - Rating distribution (1–5 stars) & positive vs critical percentages

### Platforms (`/api/platforms`)
- `GET /api/platforms` - Get configured platforms (Google, FB, TripAdvisor, etc.)
- `POST /api/platforms` - Add new review platform
- `PUT /api/platforms/:id` - Update platform link, icon, status
- `DELETE /api/platforms/:id` - Delete platform and recredit quota

### Surveys (`/api/surveys`)
- `GET /api/surveys/active` - Public active questions for private survey
- `POST /api/surveys/submit` - Submit answers to private survey
- `GET /api/surveys/analytics` - Question score aggregates per branch
- `GET /api/surveys/all` - List all questions (Super Admin)
- `POST /api/surveys` - Add question
- `PUT /api/surveys/:id` - Update question
- `PUT /api/surveys/reorder` - Reorder questions array
- `DELETE /api/surveys/:id` - Delete question

### Users (`/api/users`)
- `GET /api/users` - List users with branch isolation
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user role / branch
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/check-duplicate` - Check username / company existence

### Plans & Pricing (`/api/plans`)
- `GET /api/plans/pricing/active` - Public active pricing packages for registration
- `GET /api/plans/pricing` - All pricing packages
- `POST /api/plans/pricing` - Create pricing package
- `PUT /api/plans/pricing/:id` - Update pricing package
- `DELETE /api/plans/pricing/:id` - Delete pricing package

---

## ⚙️ How to Run

1. **Configure Environment Variables**:
   In `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/bizwoke_review
   # or MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bizwoke_review?retryWrites=true&w=majority
   JWT_SECRET=super_secret_jwt_key_bizwoke_review_2026
   ```

2. **Start Backend Server**:
   ```bash
   npm run dev
   ```

3. **Default Seeded Accounts**:
   - **Super Admin**: `nktech@gmail.com` / `123456`
