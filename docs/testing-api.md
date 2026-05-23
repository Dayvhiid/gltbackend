# API Testing Guide — GLT Backend (Local)

This guide explains how to run the backend locally and test the signup and steward verification endpoints.

## Prerequisites
- Node.js (16+ recommended)
- MongoDB running locally or a connection string to a MongoDB Atlas cluster

## Environment
Create a `.env` file in the project root with at least the following entries:

```
MONGODB_URI=mongodb://localhost:27017/glt-app
JWT_SECRET=your_jwt_secret_here
PORT=3000
NODE_ENV=development
```

Replace values as appropriate.

## Install & Start

```bash
# from project root
npm install
npm run dev
```

The server will run on `http://localhost:3000` by default.

## Optional: Seed sample data

The repo includes `seed.js` which creates sample branches and an admin user. Note: `seed.js` currently creates the admin user with a plain-text password `123456` (no hashing). Because the auth system stores/compares hashed passwords, the seeded admin may not be able to log in. Recommended options:

A) Use the register endpoint to create an admin, then update the role in the database:

1. Register an account via the API:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Admin User","email":"admin@example.com","password":"adminpass","role":"member","branch":"<branchId>"}'
```

2. In MongoDB, find that user's object and set `role` to `admin` (using Mongo shell or a GUI like MongoDB Compass):

```js
// example mongo shell commands
use glt-app
db.users.updateOne({ email: 'admin@example.com' }, { $set: { role: 'admin' } })
```

B) Modify `seed.js` to hash the password before saving (recommended). Example change in `seed.js`:

```js
const bcrypt = require('bcryptjs');
const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash('123456', salt);
// ... set password: hashed when creating admin user
```

After adjusting, run:

```bash
node seed.js
```

## Testing Flow — curl examples

1) Register (member):

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test Member","email":"test1@example.com","password":"pass123","role":"member","branch":"<branchId>"}'
```

2) Register (steward applicant):

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Steward Applicant","email":"stew@example.com","password":"pass123","role":"steward","branch":"<branchId>"}'
```

3) Login to get token:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"stew@example.com","password":"pass123"}'

# Response includes { token, user }
```

4) Upload verification document (use token):

```bash
curl -X POST http://localhost:3000/api/verification/upload \
  -H "Authorization: Bearer <token>" \
  -F "document=@/absolute/path/to/document.pdf"
```

5) List pending verifications (admin):

```bash
curl -X GET http://localhost:3000/api/verification/pending \
  -H "Authorization: Bearer <admin_token>"
```

6) Approve a verification:

```bash
curl -X POST http://localhost:3000/api/verification/<verificationId>/approve \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"notes":"Verified documents ok"}'
```

7) Reject a verification:

```bash
curl -X POST http://localhost:3000/api/verification/<verificationId>/reject \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"notes":"Document unclear, please re-upload"}'
```

## Testing with Postman
- Import the above curl commands into Postman (Paste Raw Text) or create requests manually.
- For upload: set body type to `form-data`, add key `document` and set type `File`.
- For protected requests, add header `Authorization: Bearer <token>`.

## Notes and troubleshooting
- Branch list endpoint is not implemented; you can extract branch IDs from the `seed.js` output or the database.
- If you cannot login as the seeded admin, follow the recommended steps to create an admin user and set `role: 'admin'` in the DB.
- Uploaded files are placed in `uploads/verifications/` relative to the repository root. Ensure your environment has write permissions for that directory.

## Next steps (recommended)
- Add `GET /api/branches` to expose branches to the frontend.
- Implement `GET /api/auth/me` to return the current user profile (helps frontend detect role changes).
- Add email notifications when verification is approved/rejected.

