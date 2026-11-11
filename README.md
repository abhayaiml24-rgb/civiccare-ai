# 🏥 CivicCare AI

### AI-Enabled Smart Civic Complaint Management System

CivicCare AI is a full-stack web application designed to simplify civic complaint management. It provides a platform where users can submit complaints related to civic issues and track their status.

The project aims to improve communication, transparency and efficiency in handling civic problems.

## 🚀 Features

- Submit civic complaints.
- View recently submitted complaints.
- Track complaint status.
- Manage complaints through CRUD operations.
- Categorize complaints based on civic issues.
- Store complaint information in MongoDB.
- Responsive frontend interface.

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- CSS / HTML

**Backend**
- Node.js
- Express.js
- Mongoose

**Database**
- MongoDB

**Development Tools**
- VS Code
- Git & GitHub
- MongoDB Compass

## 📂 Project Structure

```text
civiccare-ai/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/abhayaiml24-rgb/civiccare-ai.git
```

```bash
cd civiccare-ai
```

### 2. Setup Backend

```bash
cd server
npm install
```

Configure your environment variables in a `.env` file.

Example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/civiccare
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

**Note:** MongoDB Community Server must be installed and running for the local database configuration.

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/complaints` | Submit a complaint |
| GET | `/api/complaints` | Retrieve complaints |
| PUT | `/api/complaints/:id` | Update a complaint |
| DELETE | `/api/complaints/:id` | Delete a complaint |

## 📌 Project Objective

The objective of CivicCare AI is to develop a centralized civic complaint management platform that makes reporting and managing civic issues easier and more transparent.

## 👨‍💻 Author

**Abhay Sharma**

GitHub: [abhayaiml24-rgb](https://github.com/abhayaiml24-rgb)

---

⭐ If you find this project interesting, consider giving the repository a star!