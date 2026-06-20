# Frontend Integration Guide — GLT Backend

This document explains how your frontend should interact with the backend endpoints created for signup, login, and steward verification.

**Base URL**
- When running locally: `http://localhost:3000`
- Production: use your deployed URL (set by the backend team)

**Authentication**
- The backend uses JWTs for protected endpoints.
- Token is returned on successful login as `{ token, user }`.
- The middleware accepts either an `x-auth-token` header or an `Authorization: Bearer <token>` header. Example:
  - `x-auth-token: <token>`
  - `Authorization: Bearer <token>`

---

**Endpoints for Signup/Login**

- POST `/api/auth/register`
  - Purpose: Create a new user account.
  - Body (JSON):
    - `fullName` (string)
    - `email` (string)
    - `password` (string)
    - `role` (string) — either `member` or `steward` (if `steward` the user will be created as a `member` and flagged for steward verification)
    - `branch` (string) — branch ObjectId
  - Response: `201` with JSON `{ token }` (same as login)
  - Notes: If frontend sends `role: 'steward'`, the backend will create the user as a `member` and set `stewardRequested: true` on the user record. After register, prompt the user to upload a verification document.

- POST `/api/auth/login`
  - Purpose: Authenticate and receive a JWT
  - Body (JSON): `{ email, password }`
  - Response: `{ token, user }` where `user` contains `{ id, fullName, role, branch }`.

---

**Verification (Steward) Flow**

- POST `/api/verification/upload` (protected)
  - Purpose: Upload verification document for steward application.
  - Method: `POST` with `multipart/form-data`.
  - Field name: `document` (file)
  - Headers: Auth header (`x-auth-token` or `Authorization: Bearer <token>`)
  - Successful Response: `201` and the created verification record.
  - Accepted file types: `.pdf`, `.jpg`, `.jpeg`, `.png`. Max size 5MB.

- GET `/api/verification/pending` (protected, admin)
  - Purpose: Admins list pending verifications.
  - Response: array of pending verification records (populated with user's `fullName`, `email`, `branch`).

- POST `/api/verification/:id/approve` (protected, admin)
  - Purpose: Approve a verification request. Upgrades the user to `steward`.
  - Body (JSON): optional `{ notes }`.

- POST `/api/verification/:id/reject` (protected, admin)
  - Purpose: Reject a verification request; user remains a `member`.
  - Body (JSON): optional `{ notes }`.

---

**Example Fetch (Register + Upload)**

1) Register as steward (frontend should then show upload page):

```js
// Register
const resp = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ fullName: 'Jane Doe', email: 'jane@example.com', password: 'secret', role: 'steward', branch: '<branchId>' })
});
const data = await resp.json();
const token = data.token;

// Show upload UI to user with token stored in memory or secure storage.
```

2) Upload verification document (after user registers and logs in):

```js
const formData = new FormData();
formData.append('document', fileInput.files[0]);

await fetch('/api/verification/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

Notes for the frontend:
- Keep tokens in memory or secure storage (httpOnly cookies are recommended, but frontend must align with backend).
- Allow users to continue using member features while verification is pending.
- Poll or re-fetch the user profile to detect when `role` changes to `steward` so you can enable steward features.

---

**Missing/Optional Backend Endpoints**
- There is currently no public endpoint to fetch branches (`Branch` model exists but no route). You can request the backend team add `GET /api/branches` to fetch available branches.

---

**Sample curl commands**

Register (member):

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Alice","email":"alice@example.com","password":"pass123","role":"member","branch":"<branchId>"}'
```

Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"pass123"}'
```

Upload verification (using token):

```bash
curl -X POST http://localhost:3000/api/verification/upload \
  -H "Authorization: Bearer <token>" \
  -F "document=@/path/to/doc.pdf"
```

---

