# 🚀 IP Quest – Interactive Intellectual Property Learning Platform

IP Quest is a full-stack web application designed to make Intellectual Property (IP) education engaging through gamified learning experiences.
It combines interactive quizzes, real-time scoring, and modern UI to transform traditional learning into an immersive experience.

---

## ✨ Key Highlights

* 🎮 Gamified learning (True/False Rush, quizzes)
* ⚡ Real-time scoring & XP system
* 🏆 Leaderboard integration
* 🔐 Authentication system (Login/Register)
* 📱 Responsive and modern UI
* 🌐 Full-stack architecture (Frontend + Backend + Database)

---

## 🧠 Problem It Solves

Understanding Intellectual Property concepts is often theoretical and boring.
IP Quest turns it into an **interactive, game-driven learning experience**, improving engagement and retention.

---

## 🏗️ Tech Stack

### Frontend

* HTML5
* CSS3 (Custom design system, responsive UI)
* JavaScript (DOM manipulation, API integration)

### Backend

* Node.js
* Express.js (REST API architecture)

### Database

* MongoDB (NoSQL database)
* Mongoose (ODM)

---

## ⚙️ System Architecture

```id="arch1"
Frontend (Live Server / Browser)
        ↓
API Requests (HTTP)
        ↓
Backend (Node.js + Express)
        ↓
MongoDB Database
```

---

## 📂 Project Structure

```id="arch2"
IP-Quest/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── assets/
│   ├── index.html
│   ├── dashboard.html
│   └── game modules
```

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the repository

```id="step1"
git clone https://github.com/shagun1601/IP-Quest-.git
cd IP-Quest-
```

### 2. Install backend dependencies

```id="step2"
cd backend
npm install
```

### 3. Run backend server

```id="step3"
node server.js
```

Expected output:

```id="step4"
Server running on port 5001
MongoDB Connected: localhost
```

### 4. Run frontend

* Open frontend folder in VS Code
* Use Live Server OR open `index.html`

---

## 🌐 Deployment Strategy

| Layer    | Platform         |
| -------- | ---------------- |
| Frontend | GitHub Pages     |
| Backend  | Render / Railway |
| Database | MongoDB Atlas    |

---

## ⚠️ Limitations (Current)

* Backend hosted locally (not deployed)
* MongoDB uses localhost
* GitHub Pages supports only frontend

---

## 🔮 Future Enhancements

* 🌍 Full cloud deployment (production-ready)
* 🎯 Advanced analytics dashboard
* 🎮 Additional game modes
* 🔐 JWT-based authentication
* 📊 User progress tracking

---

## 💼 Why This Project Matters

This project demonstrates:

* Full-stack development skills
* API design and integration
* Database modeling
* Real-world application architecture
* Problem-solving through gamification

---

## 👨‍💻 Author

**Shagun Gupta**
B.Tech CSE Student

---

## 🤝 Contributing

Contributions are welcome.
Fork the repo and submit a pull request.

---

## ⭐ Show Your Support

If you like this project, consider giving it a ⭐ on GitHub.
