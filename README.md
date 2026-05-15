# Opinio 🗳️

**The New Standard for Gathering Opinions.**

Opinio is a modern, high-performance polling application designed to make feedback collection beautiful and instant. Built with a focus on user experience, it allows anyone to create responsive polls in seconds, share them anywhere, and analyze results with live, real-time data visualization.

---

## 🚀 Deployed Links

- **Frontend:** [https://fe-opinio.vercel.app](https://fe-opinio.vercel.app)
- **Backend API:** [https://opinio-backend.onrender.com](https://opinio-backend.onrender.com) *(Update with your actual backend URL)*

---

## ✨ Features

- **Instant Poll Creation:** Build beautiful polls with multiple options in seconds.
- **Real-time Analytics:** Watch responses flow in live with interactive charts and automatic data calculation via Socket.io.
- **Secure & Anonymous Voting:** Choose between forced authentication for strict voting or anonymous submissions for broader reach.
- **Modern UI/UX:** A sleek, responsive interface with dark mode support, glassmorphism, and smooth animations.
- **Easy Sharing:** Generate unique, short links instantly to distribute your polls on social media, email, or chat.
- **Dashboard:** Manage your polls, view detailed analytics, and track engagement in one place.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Routing:** TanStack Router
- **State Management:** Zustand
- **Styling:** Vanilla CSS (Custom Design System)
- **Icons:** Lucide React (or custom SVG)
- **Data Fetching:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Real-time:** Socket.io
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt

---

## 🔄 Application Flow

1. **Onboarding:** Users can sign up or log in to access their personalized dashboard.
2. **Creation:** From the dashboard, users click "Create Poll," entering their question and options.
3. **Distribution:** A unique, shareable link is generated instantly.
4. **Voting:** Participants visit the link. Depending on settings, they vote anonymously or log in.
5. **Real-time Feedback:** As soon as a vote is cast, the poll creator and participants see the results update live without refreshing the page.
6. **Analysis:** The creator can revisit their dashboard at any time to see detailed participation metrics.

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB
- pnpm (recommended) or npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shubh-ujala/Opinio.git
   cd poll-Application
   ```

2. **Setup Backend:**
   ```bash
   cd Backend
   pnpm install
   ```
   Create a `.env` file in the `Backend` directory:
   ```env
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SALT=10
   FRONTEND_URL=http://localhost:5173
   ```
   Start the server:
   ```bash
   pnpm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   pnpm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:4000/api
   ```
   Start the dev server:
   ```bash
   pnpm run dev
   ```

---

## 📂 Project Structure

```text
poll-Application/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── api/        # Axios configuration
│   │   ├── components/ # Reusable UI components
│   │   ├── routes/     # TanStack routing & pages
│   │   └── store/      # Zustand state management
├── Backend/            # Node.js + Express backend
│   ├── src/
│   │   ├── models/     # Mongoose schemas
│   │   ├── routes/     # Express API routes
│   │   └── middleware/ # Auth & error handlers
└── README.md
```

---

## 📄 License

This project is licensed under the ISC License.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Shubh-ujala/Opinio/issues).

---

Developed with ❤️ by [Shubham](https://github.com/Shubh-ujala)
