# GLT Frontend Developer Guide

This guide shows how to connect a frontend app to the GLT backend deployed on Render.

## API base URL

- Production: `https://gltbackend.onrender.com`
- Local development: `http://localhost:3000`

Use the base URL from an environment variable in your frontend so you can switch between local and production easily.

Example:

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
```

## Authentication

The backend uses JWT authentication.

- Login returns `{ token, user }`
- Send the token on protected requests using either:
  - `Authorization: Bearer <token>`
  - `x-auth-token: <token>`

Recommended frontend pattern:

1. Log in and store the token in memory or secure storage.
2. Add the token to every protected request.
3. If the user signs out, clear the token.

## Signup workflow

The signup flow is:

1. User enters full name, email, password.
2. User selects branch.
3. User selects role: `member` or `steward`.

If the user selects `member`:
- Account is active immediately as a member.

If the user selects `steward`:
- Account is created as a member first.
- The frontend should then show a document upload step.
- The user keeps member access while the document is under review.
- After admin approval, the account becomes a steward automatically.

## Endpoints

### Public endpoints

- `GET /api/branches`
  - Returns available branches for the signup form.

- `POST /api/auth/register`
  - Body:
    - `fullName`
    - `email`
    - `password`
    - `role`
    - `branch`
  - If `role` is `steward`, the backend keeps the user as a member and marks them for verification.

- `POST /api/auth/login`
  - Body:
    - `email`
    - `password`

### Protected endpoints

- `POST /api/verification/upload`
  - Use `multipart/form-data`
  - File field name: `document`
  - Accepted file types: `.pdf`, `.jpg`, `.jpeg`, `.png`
  - Max file size: 5MB

- `GET /api/verification/pending`
  - Admin only
  - Lists pending steward verification requests

- `POST /api/verification/:id/approve`
  - Admin only
  - Optional body: `{ notes }`

- `POST /api/verification/:id/reject`
  - Admin only
  - Optional body: `{ notes }`

## Example frontend flow

### 1. Load branches

```js
const response = await fetch(`${API_BASE_URL}/api/branches`);
const branches = await response.json();
```

### 2. Register user

```js
await fetch(`${API_BASE_URL}/api/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    password: 'secret123',
    role: 'steward',
    branch: selectedBranchId
  })
});
```

### 3. Login and store token

```js
const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { token, user } = await loginResponse.json();
```

### 4. Upload verification document

```js
const formData = new FormData();
formData.append('document', fileInput.files[0]);

await fetch(`${API_BASE_URL}/api/verification/upload`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`
  },
  body: formData
});
```

## UI behavior suggestions

- After signup with `steward`, route the user to an upload screen.
- Show a clear message that they can continue using the app as a member while verification is pending.
- Add a status badge in the UI for `pending`, `approved`, and `rejected` states.
- If rejected, allow the user to upload a new file.

## Admin review flow

1. Admin logs in.
2. Admin loads `GET /api/verification/pending`.
3. Admin opens a document or filename.
4. Admin approves or rejects with notes.

## Recommended frontend environment variables

```env
VITE_API_BASE_URL=https://gltbackend.onrender.com
```

For local development:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Notes

- The backend currently accepts token-based auth in headers.
- Use the Render URL for deployed/staging testing and the localhost URL for development.
- If you need a smoother UX, the frontend can cache the token and branch list in local storage.
