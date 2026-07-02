# FindItBack Backend API Documentation

Welcome to the backend API of **FindItBack**, a production-quality full-stack Lost and Found web application. This server is built using Node.js, Express, MongoDB (Mongoose), and JWT authentication.

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed and a running instance of MongoDB (either locally or on MongoDB Atlas).

### 2. Install Dependencies
Navigate to the `backend` folder and install the required modules:
```bash
cd backend
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the `backend/` directory (you can copy `.env.example` as a starting point) and adjust the parameters:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/finditback
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Run the Server
* **Development Mode (with auto-reload):**
  ```bash
  npm run dev
  ```
* **Production Mode:**
  ```bash
  npm start
  ```

---

## 🛠️ Environment Variables Configuration

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | The port the Express server will listen on. | `5000` |
| `MONGO_URI` | The connection string for your MongoDB database. | `mongodb://localhost:27017/finditback` |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens. | *Required* |
| `JWT_EXPIRES_IN` | Session duration for issued tokens. | `7d` |
| `NODE_ENV` | Running environment mode (`development` or `production`). | `development` |

---

## 📡 API Endpoints Reference

All requests should be sent to the base URL: `http://localhost:5000`. Headers for authenticated requests must include `Authorization: Bearer <token>`.

### 1. Authentication (`/api/auth`)

| Method | Endpoint | Access | Description | Request Body Payload |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Register a new account. | `{ "name": "...", "email": "...", "phone": "...", "password": "..." }` |
| **POST** | `/api/auth/login` | Public | Log in with email and password. | `{ "email": "...", "password": "..." }` |
| **GET** | `/api/auth/me` | **Private** | Retrieve the logged-in user profile. | *None* |

---

### 2. Lost & Found Items (`/api/items`)

| Method | Endpoint | Access | Description | Payload / Query Parameters |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/items` | **Private** | Create a lost/found listing. | `{ "title": "...", "description": "...", "category": "...", "status": "Lost/Found", "location": "...", "date": "YYYY-MM-DD", "imageUrl": "...", "contactPreference": "..." }` |
| **GET** | `/api/items` | Public | Get all active listings. | Supports query filters: `?search=wallet`, `?category=Keys`, `?status=Lost`, `?sortBy=createdAt&order=desc` |
| **GET** | `/api/items/my-listings` | **Private** | Fetch only listings posted by the user. | *None* |
| **GET** | `/api/items/:id` | Public | Get detailed view of a single listing. | *None (Id parameter)* |
| **PUT** | `/api/items/:id` | **Private** *(Owner)* | Update item details. | Fields to update (e.g. `{ "status": "Resolved" }`) |
| **DELETE** | `/api/items/:id` | **Private** *(Owner)* | Delete a listing. | *None* |

---

### 3. Claim Requests (`/api/claims`)

| Method | Endpoint | Access | Description | Payload / Query Parameters |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/claims` | **Private** | Submit a claim request for an item. | `{ "itemId": "...", "message": "Proof of ownership..." }` |
| **GET** | `/api/claims/my-claims` | **Private** | Get claims filed by the user. | *None* |
| **GET** | `/api/claims/received` | **Private** | Get claims received on user's items. | *None* |
| **PUT** | `/api/claims/:id` | **Private** *(Owner)* | Accept or Reject an incoming claim. | `{ "status": "Accepted" }` or `{ "status": "Rejected" }` |

> [!NOTE]
> Accepting a claim request automatically:
> 1. Updates the target claim status to `Accepted`.
> 2. Rejects all other pending claims for that item (updates them to `Rejected`).
> 3. Shifts the corresponding Item status to `Resolved`.

---

## 🛡️ Security Features
* **Hashed Passwords**: Password fields are hashed on the database layer with `bcryptjs` via Mongoose middleware pre-save hooks.
* **JWT Guard**: Secure authentication utilizing signed JSON Web Tokens inside authorization headers.
* **Owner Protection**: Explicit user matching prevents non-owners from editing, deleting, or altering listings and verifying claim actions.
