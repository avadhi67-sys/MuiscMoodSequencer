# 🎵 SonicFlow 2.0 • Music Mood Sequencer (Full-Stack MVC)
> **Continuous Assessment 4 / Evaluation 2**: Complete Backend Development with **Node.js, Express & MongoDB Atlas**, strict **MVC (Model-View-Controller) Architecture**, **JWT + Bcrypt Security**, **Multer Audio & Cover Ingestion**, and **Automated API Testing (Postman / Thunder Client)**.

---

## 📋 Syllabus & Lecture Mapping (Lectures 1–24)

This project comprehensively fulfills every single requirement from the evaluation syllabus:

| Syllabus Module | Project Implementation & Verification |
| :--- | :--- |
| **Async JS, Promises, Async/Await** | Asynchronous Mongoose operations, async/await route handlers & error catching across all controllers. |
| **Fetch API & REST Consumption** | `frontend/js/storage.js`, `frontend/js/auth.js`, and `frontend/js/admin-dashboard.js` consuming backend REST endpoints. |
| **Node.js, V8 Engine, Modules** | Built on Node.js using standard CommonJS modules (`require`, `module.exports`), `path`, and `fs`. |
| **File System (`fs`) & Path Module** | `middleware/upload.js` & `controllers/songController.js` for disk storage and cleanup of media files. |
| **HTTP Module & Request-Response** | Express HTTP server managing request/response lifecycle, headers, cookies, and JSON payloads. |
| **NPM, package.json, Environment Variables** | Configured `package.json` with scripts, `.env` for secrets (`PORT`, `MONGODB_URI`, `JWT_SECRET`). |
| **Express.js Server, Routing & Middleware** | Express 5 application with modular routers, body parsing (`express.json({limit: '50mb'})`), and cookie parsing. |
| **CRUD REST APIs** | Full CRUD implemented for Songs (`/api/songs`) and Artists (`/api/artists`). |
| **Validation & Error Handling Middleware** | Custom 404 handler (`notFound`) and global exception middleware (`errorHandler`) in `middleware/errorHandler.js`. |
| **JWT Authentication & Bcrypt** | Salted password hashing (10 rounds) in `models/User.js`, JWT token signing and verification in `middleware/auth.js`. |
| **Multer File Uploads** | Multi-part form-data processing for MP3 audio and cover image artwork in `middleware/upload.js`. |
| **MongoDB & MongoDB Atlas** | Cloud database connection in `config/db.js`, auto-seeding in `seed/seeder.js`, schemas, validation, and virtuals. |
| **API Testing** | Pre-built Postman / Thunder Client collection (`postman/SonicFlow_API_Collection.postman_collection.json`). |

---

## 📁 Repository & Project Structure

As required for the evaluation, **both `frontend` and `backend` folders are present in the same GitHub repository**:

```
MuiscMoodSequencer-main/
├── backend/                                # Node.js & Express MVC Backend
│   ├── config/
│   │   └── db.js                           # Mongoose MongoDB Atlas connection
│   ├── controllers/                        # Controller Layer (Business Logic)
│   │   ├── authController.js               # User & Admin authentication logic
│   │   ├── songController.js               # Song CRUD & file upload handling
│   │   ├── artistController.js             # Artist discography & management
│   │   └── statsController.js              # System analytics calculations
│   ├── middleware/                         # Custom Middleware Layer
│   │   ├── auth.js                         # JWT token verification & RBAC (adminOnly)
│   │   ├── upload.js                       # Multer storage configuration for audio/covers
│   │   └── errorHandler.js                 # 404 & 500 error handling middleware
│   ├── models/                             # Model Layer (Mongoose Schemas)
│   │   ├── User.js                         # User Schema with Bcrypt & Role definition
│   │   ├── Song.js                         # Song Schema (tempo, energy, mood, audioUrl)
│   │   └── Artist.js                       # Artist Schema (name, bio, mood, image)
│   ├── routes/                             # Routing Layer (Endpoint Mappings)
│   │   ├── authRoutes.js                   # /api/auth routes
│   │   ├── songRoutes.js                   # /api/songs routes
│   │   ├── artistRoutes.js                 # /api/artists routes
│   │   └── statsRoutes.js                  # /api/stats route
│   ├── seed/
│   │   └── seeder.js                       # Auto-seeds default admin, user, and catalog
│   ├── uploads/                            # User-uploaded audio and cover art
│   ├── assets/                             # Sample audio MP3 tracks
│   ├── images/                             # Default cover artworks
│   ├── .env.example                        # Environment template for deployment
│   ├── package.json                        # Backend npm dependencies
│   └── server.js                           # Express server entry point
│
├── frontend/                               # Complete Frontend Client
│   ├── js/
│   │   ├── config.js                       # Centralized API URL switch (local vs deployed)
│   │   ├── storage.js                      # API consumer engine (replaces localStorage)
│   │   ├── auth.js                         # Login & Registration client logic
│   │   ├── app.js                          # Navigation, session verification & RBAC guard
│   │   ├── player.js                       # Audio streaming & playback controls
│   │   ├── admin-dashboard.js              # Admin Studio CRUD management
│   │   ├── user-dashboard.js               # Listener Search & Mood Filtering
│   │   ├── sequencer.js                    # Harmonic Mood Flow Matrix engine
│   │   └── library.js                      # 3D Grid & Cover Flow library
│   ├── css/                                # Noir Glassmorphic stylesheets
│   ├── assets/audio/                       # Pre-packaged audio tracks
│   ├── images/covers/                      # High-res cover artworks
│   ├── index.html                          # Landing page
│   ├── login.html                          # Login portal (with 1-click test fillers)
│   ├── signup.html                         # User & Admin registration
│   ├── admin-dashboard.html                # Dedicated Admin Dashboard
│   ├── user-dashboard.html                 # Dedicated User Dashboard
│   ├── library.html                        # Music Library
│   ├── artists.html                        # Artist Showcase
│   ├── sequencer.html                      # Mood Sequencer
│   └── search.html                         # Real-time Track Search
│
├── postman/                                # API Testing Suite
│   ├── SonicFlow_API_Collection.postman_collection.json
│   ├── SonicFlow_Local.postman_environment.json
│   └── SonicFlow_Production.postman_environment.json
│
├── .gitignore                              # Git exclusion rules (node_modules, .env)
├── server.js                               # Root dispatcher to backend/server.js
└── package.json                            # Root runner scripts
```

---

## 🏛️ MVC (Model-View-Controller) Architecture Explained

This project strictly adheres to the standard **MVC Architecture**:

1. **Model (`backend/models/`)**:
   - `User.js`: Defines user attributes, roles (`admin`, `user`), and encapsulates password hashing with `bcryptjs`.
   - `Song.js`: Defines track metadata, harmonic energy ($1$–$10$), tempo (BPM), mood classifications, and audio storage paths.
   - `Artist.js`: Defines creator profiles and relationships to songs.

2. **View (`frontend/` & JSON Views)**:
   - For the REST API: Standardized JSON formatted response objects `{ success: true, ... }`.
   - For the End User: Dedicated client views (`admin-dashboard.html`, `user-dashboard.html`, `library.html`, etc.) rendered in the browser.

3. **Controller (`backend/controllers/`)**:
   - `authController.js`: Authenticates users, validates inputs, manages cookies and JWT session tokens.
   - `songController.js`: Encapsulates song querying, sorting, Multer file handling, disk cleanup, and MongoDB mutations.
   - `artistController.js`: Computes live aggregate song counts and manages artist profiles.
   - `statsController.js`: Aggregates database-wide analytics.

4. **Routes (`backend/routes/`)**:
   - Pure routing declarations that map HTTP methods and URLs to their respective controller functions and middlewares (`protect`, `adminOnly`, `upload`).

---

## 🔑 Pre-Seeded Evaluation Credentials

The database automatically seeds test accounts on server startup for instant evaluation:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@sonicflow.com` | `admin123` | Full CRUD on Songs & Artists, View System Stats, User Directory |
| **🎧 User** | `user@sonicflow.com` | `user123` | Search, Mood Sequencing, Music Player, Read-only access |

> 💡 *Quick Test:* The login page (`login.html`) includes **one-click "Fill Admin" and "Fill User" buttons**!

---

## 🚀 Local Development Setup

### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install
```

### 2. Start the Server
```bash
npm start
```
The server will connect to MongoDB Atlas and launch at:
```
http://localhost:5000
```

### 3. Open the Application
Navigate to `http://localhost:5000` in your web browser. All HTML pages are served directly!

---

## ☁️ Backend Deployment Guide (e.g., Render)

To deploy your backend for continuous evaluation:

### Step 1: Push Repository to GitHub
Ensure all changes in `backend/` and `frontend/` are committed and pushed to your existing GitHub repository:
```bash
git add .
git commit -m "feat: complete MVC backend, frontend integration & postman suite"
git push origin main
```

### Step 2: Deploy to Render (Recommended & Free)
1. Go to [Render.com](https://render.com) and sign in.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   - **Name**: `sonicflow-backend` (or any name you prefer)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `mongodb+srv://avadhi3137beai24_db_user:Avadhi12@cluster0.ozfgkzq.mongodb.net/college?appName=Cluster0`
   - `JWT_SECRET` = `sonicflow_super_secret_jwt_key_2026_eval`
6. Click **Deploy Web Service**.
Deployed Linkc : "https://muiscmoodsequencer.onrender.com"
---

## 🔗 Frontend Integration (Switching to Deployed URL)

To switch the frontend to communicate with your deployed backend:

1. Open `frontend/js/config.js`.
2. Locate line 18:
   ```javascript
   const DEPLOYED_BACKEND_URL = "";
   ```
3. Paste your live backend URL:
   ```javascript
   const DEPLOYED_BACKEND_URL = "https://sonicflow-backend.onrender.com";
   ```
4. Save the file. All pages (`admin-dashboard.html`, `user-dashboard.html`, `login.html`, `library.html`, etc.) will now automatically send all API calls to your live deployed backend!

---

## 📮 API Testing Demonstration (Postman & Thunder Client)

A complete, pre-configured collection is included in the repository.

### How to Import & Test:
1. Open **Postman** (or the **Thunder Client** VS Code extension).
2. Click **Import**.
3. Select `postman/SonicFlow_API_Collection.postman_collection.json`.
4. Import the environment `postman/SonicFlow_Local.postman_environment.json` (or `SonicFlow_Production.postman_environment.json`).

### Demonstration Workflow:
1. **Health Check**:
   - Run `GET {{baseUrl}}/health` -> Returns `200 OK` (`"healthy and operational"`).
2. **Authentication**:
   - Run `POST {{baseUrl}}/api/auth/login` as Admin -> Automatically captures the JWT bearer token into the `{{token}}` variable.
   - Run `GET {{baseUrl}}/api/auth/me` -> Verifies profile decoding via JWT.
   - Run `GET {{baseUrl}}/api/auth/users` -> Lists all registered accounts in MongoDB.
3. **Songs CRUD**:
   - Run `GET {{baseUrl}}/api/songs` -> Returns song catalog from MongoDB Atlas.
   - Run `POST {{baseUrl}}/api/songs` -> Creates a new song record (Admin protected).
   - Run `PUT {{baseUrl}}/api/songs/:id` -> Updates song metadata.
   - Run `DELETE {{baseUrl}}/api/songs/:id` -> Deletes song and cleans up assets.
4. **Artists CRUD**:
   - Run `GET {{baseUrl}}/api/artists` -> Returns artists with live calculated song counts.
   - Run `POST {{baseUrl}}/api/artists` -> Creates a new artist profile.
5. **System Statistics**:
   - Run `GET {{baseUrl}}/api/stats` -> Returns total songs, artists, users, unique moods, and harmonic energy score averages.
