<h1 align="center">
  <img src="https://img.shields.io/badge/FindItBack-Lost%20%26%20Found%20Platform-6366f1?style=for-the-badge&logo=react&logoColor=white" alt="FindItBack" />
</h1>

<p align="center">
  A production-quality, full-stack <strong>Lost & Found web application</strong> built with the MERN stack.<br/>
  Modern UI, JWT authentication, real-time search & filter, and a full claim management workflow.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" />
</p>

---

## 📸 Screenshots

> _Screenshots of the application running locally. Clone the project and run it to see the full UI._

| Home Page | Items Board | Item Details |
|:---------:|:-----------:|:------------:|
| _(Add screenshot)_ | _(Add screenshot)_ | _(Add screenshot)_ |

| Dashboard | Add Item | Mobile View |
|:---------:|:--------:|:-----------:|
| _(Add screenshot)_ | _(Add screenshot)_ | _(Add screenshot)_ |

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register / login / logout with bcrypt password hashing
- 📋 **Item Listings** — Post Lost or Found items with title, description, category, location, date, image URL
- 🔍 **Live Search & Filter** — Debounced search across title, description & location; filter by type, category, and status
- 🗂 **Claim Request System** — Non-owners submit ownership proof claims; owners approve/reject with auto-cascade resolution
- 📊 **User Dashboard** — Manage your listings, track claims filed, and review claims received in tabbed view
- ✏️ **Full CRUD** — Create, read, update, delete listings with owner-only protection enforced on both frontend and backend
- 🚫 **Authorization Guards** — Protected routes on frontend (`ProtectedRoute`) + JWT middleware on backend
- 📱 **Fully Responsive** — Mobile-first design with animated hamburger navigation
- ⚡ **Framer Motion** — Smooth page entrance animations and micro-interactions on every card
- 🎨 **Modern SaaS UI** — Inter font, indigo/emerald color system, glassmorphism navbar, Lucide icons

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite, Tailwind CSS v4, React Router DOM v6, Axios, Framer Motion, Lucide React |
| **Backend** | Node.js + Express.js, Mongoose ODM |
| **Database** | MongoDB Atlas (cloud) or MongoDB local |
| **Auth** | JSON Web Tokens (JWT) + bcryptjs |
| **Dev Tools** | Nodemon, dotenv, CORS |
| **Deployment** | Render (backend), Vercel / Render (frontend) |

---

## 📂 Project Structure

```
FindItBack/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection (Mongoose)
│   ├── controllers/
│   │   ├── authController.js      # Register, login, get profile
│   │   ├── itemController.js      # CRUD + search/filter/sort
│   │   └── claimController.js     # Submit, list, resolve claims
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect() middleware
│   │   └── errorMiddleware.js     # Centralised error handler
│   ├── models/
│   │   ├── User.js                # User schema (name, email, phone, password)
│   │   ├── Item.js                # Item schema (type, status, category, location…)
│   │   └── ClaimRequest.js        # Claim schema (item ref, requester ref, message)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── itemRoutes.js
│   │   └── claimRoutes.js
│   ├── server.js                  # Express app entry point
│   ├── .env.example               # Environment variable template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Sticky navbar with mobile menu
│   │   │   ├── Footer.jsx
│   │   │   ├── ItemCard.jsx       # Animated listing card
│   │   │   ├── SearchFilter.jsx   # Search + filter toolbar
│   │   │   ├── StatusBadge.jsx    # Status pill badge
│   │   │   ├── ProtectedRoute.jsx # Auth guard component
│   │   │   ├── Loader.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state (user, token, login, logout)
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Hero + features + recent items
│   │   │   ├── Items.jsx          # All listings with search/filter
│   │   │   ├── LostItems.jsx      # Lost-only filtered view
│   │   │   ├── FoundItems.jsx     # Found-only filtered view
│   │   │   ├── ItemDetails.jsx    # Full item page + claim form
│   │   │   ├── AddItem.jsx        # Create listing form
│   │   │   ├── EditItem.jsx       # Edit listing form (owner only)
│   │   │   ├── Dashboard.jsx      # User's listings + claims hub
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── About.jsx
│   │   │   └── NotFound.jsx
│   │   ├── utils/
│   │   │   └── formatDate.js
│   │   ├── App.jsx                # Route definitions
│   │   ├── main.jsx
│   │   └── index.css              # Tailwind directives + Inter font
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 📡 API Documentation

Base URL (local): `http://localhost:5000/api`

### 🔑 Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/register` | Public | Register new user (name, email, phone, password) |
| `POST` | `/login` | Public | Login and receive JWT token |
| `GET` | `/me` | 🔒 Protected | Get logged-in user's profile |

### 📦 Items — `/api/items`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/` | 🔒 Protected | Create a new Lost/Found listing |
| `GET` | `/` | Public | Get all items. Query params: `search`, `type`, `status`, `category`, `sortBy`, `order` |
| `GET` | `/my-listings` | 🔒 Protected | Get items posted by the current user |
| `GET` | `/:id` | Public | Get single item with populated owner info |
| `PUT` | `/:id` | 🔒 Owner only | Update listing details |
| `DELETE` | `/:id` | 🔒 Owner only | Delete listing |

**Example filter query:**
```
GET /api/items?type=Lost&category=Electronics&search=iphone&sortBy=createdAt&order=desc
```

### 📩 Claims — `/api/claims`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/` | 🔒 Protected | Submit a claim request (itemId + message) |
| `GET` | `/my-claims` | 🔒 Protected | Get all claims filed by the logged-in user |
| `GET` | `/received` | 🔒 Protected | Get all claims received on user's items |
| `PUT` | `/:id` | 🔒 Owner only | Accept or Reject a claim (status: Accepted\|Rejected) |

> **Claim Resolve Logic**: Accepting a claim → automatically rejects all other pending claims for that item → marks the item status as `Resolved`.

---

## 🔧 Local Setup & Installation

### Prerequisites
- Node.js v18+ and npm
- MongoDB Atlas account **or** local MongoDB installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/finditback.git
cd finditback
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your values:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/finditback
JWT_SECRET=your_super_secure_random_jwt_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Start the backend dev server:
```bash
npm run dev
# API running at http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend dev server:
```bash
npm run dev
# App running at http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## 🌐 Deployment (Render)

### Deploy Backend on Render

1. Push your code to GitHub (make sure `.env` is in `.gitignore`)
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node
5. Add Environment Variables in the Render dashboard:
   ```
   MONGO_URI=<your_atlas_connection_string>
   JWT_SECRET=<your_secret_key>
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   ```
6. Click **Deploy**. Note your backend URL (e.g. `https://finditback-api.onrender.com`)

### Deploy Frontend on Render (Static Site)

1. Go to Render → **New Static Site**
2. Connect the same repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://finditback-api.onrender.com/api
   ```
5. Click **Deploy**

---

## 🔐 Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Optional | Server port (default: 5000) |
| `MONGO_URI` | ✅ Yes | MongoDB connection string |
| `JWT_SECRET` | ✅ Yes | Secret key for signing JWT tokens (min 32 chars) |
| `JWT_EXPIRES_IN` | Optional | Token expiry (default: `7d`) |
| `NODE_ENV` | Optional | `development` or `production` |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ Yes | Full URL to the backend API (no trailing slash) |

---

## 🗺️ Future Improvements

- [ ] **Image Upload** — Replace imageUrl text field with direct file upload (Cloudinary or AWS S3)
- [ ] **Email Notifications** — Notify users via email when their claim is accepted/rejected (Nodemailer / SendGrid)
- [ ] **Real-time Updates** — Live notifications for new claims using WebSockets (Socket.io)
- [ ] **Map Integration** — Plot item locations on an interactive map (Google Maps / Leaflet.js)
- [ ] **OTP Password Reset** — Email-based OTP flow for forgotten passwords
- [ ] **Admin Panel** — Admin dashboard to moderate listings and manage users
- [ ] **Pagination** — Server-side pagination for large item datasets
- [ ] **Item Expiry** — Auto-expire and archive listings after N days
- [ ] **Multilingual** — i18n support for multiple languages
- [ ] **PWA** — Progressive Web App support for offline browsing

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/YourFeatureName`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push to branch: `git push origin feature/YourFeatureName`
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ by <strong>Vibhanshu</strong>
</p>
