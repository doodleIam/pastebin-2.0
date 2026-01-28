Deployed Frontend: https://pastebin-2-0.vercel.app

Deployed Backend: https://pastebin-2-0-backend.onrender.com

How to Run Locally
Backend

Clone the repository and navigate to backend:

git clone https://github.com/your-username/pastebin-2-0.git
cd backend


Install dependencies:

npm install


Create a .env file:

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.pt1s6td.mongodb.net/pastebin
TEST_MODE=0
PORT=3000


Start the server:

npm run dev


Runs on http://localhost:3000

Health check: http://localhost:3000/api/healthz

Frontend

Navigate to frontend:

cd frontend


Install dependencies:

npm install


Create a .env file:

VITE_PUBLIC_API_URL=http://localhost:3000


Start the frontend:

npm run dev


Runs on http://localhost:5173

API calls point to backend via VITE_PUBLIC_API_URL.

Persistence Layer

MongoDB Atlas

Stores: content, ttl_seconds, max_views, createdAt, views

Ensures data survives across requests and deployments

Design Decisions

Separate frontend and backend for serverless deployment compatibility.

Safe HTML rendering to prevent script execution.

TTL and max views constraints checked per fetch; paste becomes unavailable immediately when triggered.

Submission Requirements Covered

Deployed URL: Frontend & Backend above

Public Git repository: This repo

Local run instructions: Shown above

Persistence layer: MongoDB Atlas

Design decisions: Explained above

API Endpoints
Health Check
GET /api/healthz
Response: { "ok": true }

Create Paste
POST /api/pastes
Body: {
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}
Response: {
  "id": "string",
  "url": "https://pastebin-2-0.vercel.app/p/<id>"
}

Fetch Paste
GET /api/pastes/:id
Response: {
  "content": "string",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}


Unavailable paste: returns 404 with JSON response
