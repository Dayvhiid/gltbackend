# Signup & Steward Verification Workflow

This document describes the end-to-end signup flow and steward verification process for the GLT backend.

## High-level user journey

1. User creates an account with:
   - Full name
   - Email
   - Password
2. User selects their branch from the available branches list.
3. User selects desired account type:
   - `Member`
   - `Steward`

If Member:
- Account is activated immediately as a `member`.
- User gains normal member access.

If Steward:
- The user account is created as a `member` (initially).
- `stewardRequested` flag is set on the user account.
- The user is prompted to upload a verification document.
- After uploading, the document is stored and a verification record is created with `pending` status.
- The user continues using the platform as a member while verification is pending.
- Admins can review pending verifications and approve or reject them.
  - If approved: user role is upgraded to `steward` and steward privileges are enabled immediately.
  - If rejected: the user remains a member and can re-upload another document.

---

## Data model changes (backend)

- `User` (updated):
  - `stewardRequested: Boolean` — whether the user applied to be a steward.
  - `verification` subdocument:
    - `status`: `none|pending|approved|rejected`
    - `document`: stored file path
    - `submittedAt`, `reviewedAt`, `reviewer`, `notes`

- `Verification` (new model):
  - `user` (ref `User`)
  - `document`: stored file path
  - `status`: `pending|approved|rejected`
  - `submittedAt`, `reviewedAt`, `reviewer`, `notes`

The separate `Verification` model makes it easier to list history and pending requests for admin review.

---

## API endpoints (implemented)

- POST `/api/auth/register`
  - Request body: `{ fullName, email, password, role, branch }`
  - If `role === 'steward'`, the server creates the user as a `member` and sets `stewardRequested: true`. The frontend should then prompt the user to upload a verification document.

- POST `/api/verification/upload` (protected)
  - Upload field: `document` (form-data)
  - Stores file under `uploads/verifications/` and creates a `Verification` record with `status: pending`.
  - Updates the user's `verification.status` to `pending` and sets `stewardRequested: true`.

- GET `/api/verification/pending` (protected, admin)
  - Returns list of pending verification requests for admin review.

- POST `/api/verification/:id/approve` (protected, admin)
  - Approves the verification; sets verification status to `approved`, updates `User.role` to `steward`, and marks timestamps.

- POST `/api/verification/:id/reject` (protected, admin)
  - Rejects the verification; sets verification status to `rejected`, updates user verification subdocument and allows re-upload.

---

## File upload details

- Uploads are handled via `multer` and stored locally at `uploads/verifications/`.
- Accepted file types: `.pdf`, `.jpg`, `.jpeg`, `.png`.
- Max file size: 5MB.

Note: In production you may want to upload files to cloud storage (S3, Azure Blob, etc.) and store public or signed URLs instead of local disk paths.

---

## Frontend guidance

- After registering with role `steward`, send the user to a verification upload flow where they submit the verification document (multipart/form-data, field name `document`).
- The user should be allowed to continue using member features while verification is pending.
- Once the admin approves, your client can fetch the updated user profile (or rely on a push/notification) and update UI to expose steward features.
- If the verification is rejected, show the reviewer notes and allow re-upload.

---

## Admin notes

- Admins should review documents carefully and add notes when approving/rejecting.
- Consider adding an audit log or email notifications for approvals/rejections.

---

## Implementation notes & next steps

- This implementation stores files locally and adds `multer` as a dependency. Run `npm install` after pulling changes.
- Optional improvements:
  - Integrate cloud storage for documents.
  - Add email notifications for status updates.
  - Add rate-limiting and virus scanning on uploads.

