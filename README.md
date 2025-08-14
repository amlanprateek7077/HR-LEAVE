# HR e-Leave Tracking Web App (Node.js + MongoDB + TOTP)

A complete reference implementation for your seminar topic: **Application of Time-Based One-Time Password (TOTP) Algorithm for Human Resource E-Leave Tracking Web App**.

## Features
- User registration with password hashing (bcrypt)
- TOTP 2FA with `speakeasy` + QR code provisioning (`qrcode`)
- JWT auth
- Employee dashboard: apply leave, view history
- Admin dashboard: view/approve/reject pending leaves
- MongoDB data models

## Tech Stack
- Node.js, Express
- MongoDB (Mongoose)
- JWT, bcryptjs
- speakeasy, qrcode
- Bootstrap-based static frontend

## Setup

1. **Clone & install**
```bash
npm install
```
2. **Configure env**
Create `.env` (you can copy `.env.sample`):
```
MONGODB_URI=mongodb://127.0.0.1:27017/totp_hr_leave
JWT_SECRET=change_this_super_secret_key
PORT=8000
```
3. **Run**
```bash
npm start
```
Open: http://localhost:8000

## Usage Flow
- Register a user → QR appears → scan in Google Authenticator → enter code to enable TOTP.
- Login → if TOTP enabled, you'll be prompted for 6-digit code.
- Go to `/dashboard.html` (employee) or `/admin.html` (admin).

## Make an Admin
In MongoDB, change a user's `role` to `"admin"` manually:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

## Notes
- This is an educational reference aligned with your research paper.
- For production, add HTTPS, better logging, secret rotation, and robust validation.
