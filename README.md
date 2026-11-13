# 🚨 CivicCare AI

**AI-powered community problem reporting and management system** built with the MERN stack.

Users report civic problems such as garbage, broken streetlights, potholes and water leaks. An AI model automatically assigns a **category**, **priority** and **one-line summary** to each complaint, and an admin tracks every complaint from *Pending* to *Resolved* on a dashboard.

- **Live app:** [add your Vercel link here]
- **Backend API:** https://civiccare-ai-2nlo.onrender.com/api/test
- The backend runs on a free instance that sleeps when idle, so the first request can take up to a minute.

## Features

- Report a problem with a title, description and location
- AI analysis (Google Gemini) that fills in category, priority and summary
- Rule-based fallback so the app keeps working if the AI service is unavailable
- Dashboard with live statistics (MongoDB aggregation)
- Filter complaints by category, status and priority
- Admin mode (verified by the server) to update status or delete complaints
- AI help chatbot that explains how to report a problem

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), JavaScript, Bootstrap, Axios |
| Backend | Node.js, Express.js (REST API) |
| Database | MongoDB Atlas with Mongoose |
| AI | Google Gemini API |
| Hosting | Vercel (frontend), Render (backend) |

## Architecture

```
React frontend  ->  Express REST API  ->  MongoDB Atlas
                          |
                          +-->  Gemini AI service
```

The React app never talks to the database or the AI directly. All requests go through the Express API, which keeps the database password and AI key on the server.

## API endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/api/complaints` | Create a complaint (AI fills category, priority, summary) | Public |
| GET | `/api/complaints` | List complaints (filters: `category`, `status`, `priority`) | Public |
| GET | `/api/complaints/stats` | Count complaints by status | Public |
| GET | `/api/complaints/admin-check` | Verify the admin key | Admin |
| PUT | `/api/complaints/:id` | Update status | Admin |
| DELETE | `/api/complaints/:id` | Delete a complaint | Admin |
| POST | `/api/chat` | Chatbot reply | Public |

## Project structure

```
civiccare/
  client/                 React frontend
    src/App.jsx
    src/components/ReportForm.jsx
    src/components/Chatbot.jsx
  server/                 Express backend
    index.js
    models/Complaint.js
    routes/complaints.js
    routes/chat.js
    services/ai.js
```

## Run locally

**Requirements:** Node.js, a free MongoDB Atlas cluster, and a Gemini API key.

1. Clone the repository
   ```bash
   git clone https://github.com/abhayaiml24-rgb/civiccare-ai.git
   cd civiccare-ai
   ```
2. Set up the server
   ```bash
   cd server
   npm install
   ```
   Create a file named `.env` inside `server/`:
   ```
   MONGO_URI=your_mongodb_connection_string
   ADMIN_KEY=choose_an_admin_key
   AI_API_KEY=your_gemini_api_key
   AI_MODEL=gemini-3.5-flash
   ```
   Start it:
   ```bash
   npm run dev
   ```
3. Set up the client (in a second terminal)
   ```bash
   cd client
   npm install
   npm run dev
   ```
4. Open the link that Vite prints, usually `http://localhost:5173`.

The client reads the API address from `VITE_API_URL` and falls back to `http://localhost:5000/api`.

## Limitations and future scope

- No individual user accounts yet. Admin actions use a shared admin key.
- Possible additions: JWT login with roles, image upload, map location, email or SMS notifications, regional language support, and duplicate-complaint detection.

## Author

Abhay Sharma, BE AI & ML, CMR Institute of Technology, Bengaluru
Mini project for TYL Full Stack Development (26TYLFSDCSE), 2026-27