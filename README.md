# HR e-Leave Tracking Web App (Node.js + MongoDB + TOTP)

A complete reference implementation for your seminar topic: **Application of Time-Based One-Time Password (TOTP) Algorithm for Human Resource E-Leave Tracking Web App**.

## Features
- User registration with password hashing (bcrypt)
- TOTP 2FA with `speakeasy` + QR code provisioning (`qrcode`)
- JWT-based authentication
- Employee dashboard: apply leave, view history
- Admin dashboard: view/approve/reject pending leaves
- MongoDB data models for users and leaves

## Tech Stack
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, bcryptjs
- **Security:** Helmet, CORS, Rate Limiting
- **2FA:** speakeasy, qrcode
- **Frontend:** Bootstrap-based static HTML/CSS/JS

## Setup

### 1. Clone & Install
```bash
npm install
