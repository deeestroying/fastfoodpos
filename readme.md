# 🍽️ Fast Food POS System

A full-stack point-of-sale application for quick-service restaurants, featuring menu management, order processing, inventory tracking, customer management, promotions, staff tools, and real-time analytics.

---

## 🛠️ Tech Stack

- **Backend:** Node.js · Express · MongoDB · Mongoose · JWT authentication  
- **Frontend:** React · Vite · React Router · React Context · Axios  
- **Styling:** Tailwind CSS · DaisyUI  
- **Data Visualization:** Chart.js  
- **Other:** dotenv · CORS

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 16  
- [MongoDB](https://www.mongodb.com/) (local or Atlas)  
- npm (bundled with Node.js)

### Installation

1. **Clone the repo**  
   ```bash
   git clone <your-repo-url>
   cd <repo-folder>

2. **Backend Setup**

   cd pos-backend
   npm install
   
   .  **Create a .env in pos-backend/:**
      MONGO_URI=your_mongo_connection_string
      JWT_SECRET=your_secret_key
      PORT=5000        # optional
      Start the API:

3. **Start the API**
npx nodemon server.js

4. **Frontend Setup**
   cd ../todo-app
   npm install 
   npm run dev

By default runs on http://localhost:5173 – it will proxy /api/* calls to your backend.