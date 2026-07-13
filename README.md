# 🌿 VerdantVerse

<div align="center">

# AI-Powered MERN Stack Plant Store

*A modern full-stack web application that combines e-commerce with AI-powered plant recommendations.*

</div>

---

## 📖 Overview

VerdantVerse is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application developed to provide a seamless online plant shopping experience.

The application allows users to browse a curated collection of plants, securely register and log in, manage their shopping cart, and receive AI-powered plant recommendations through the Groq API.

The project demonstrates the implementation of modern web development concepts including REST APIs, authentication, database management, responsive frontend development, and AI integration.

---

# ✨ Features

### 👤 User Management

* User Registration
* Secure Login
* JWT Authentication
* Protected Routes
* Password Encryption using bcrypt

### 🌱 Plant Store

* Browse Plant Collection
* View Plant Details
* Search Plants
* Responsive Product Cards
* Dynamic Plant Information

### 🛒 Shopping Cart

* Add Plants to Cart
* Remove Items
* Update Cart
* Persistent Cart Data

### 🤖 AI Integration

* AI-powered Plant Recommendations
* Intelligent Plant Suggestions
* Groq API Integration

### 🖼️ Image Management

* Plant Image Display
* Image Upload Support using Multer

### 🔒 Security

* JWT Authentication
* Password Hashing
* Environment Variable Protection
* Secure API Design

---

# 🛠️ Tech Stack

## Frontend

* React.js
* HTML5
* CSS3
* JavaScript (ES6+)
* Axios

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Authentication

* JSON Web Token (JWT)
* bcryptjs

## AI

* Groq API

## File Handling

* Multer

---

# 📂 Project Structure

```text
VerdantVerse
│
├── backend
│   ├── assets
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── seedPlants.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   ├── package.json
│   ├── package-lock.json
│   └── ...
│
├── .gitignore
├── README.md
└── .env.example
```

---

# ⚙️ Prerequisites

Before running the project, install the following software:

* Node.js (v18 or later recommended)
* npm
* MongoDB (Local or MongoDB Atlas)
* Git

---

# 🚀 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/Harshitha-310/VerdantVerse.git
```

Move into the project directory.

```bash
cd VerdantVerse
```

---

# 📦 Install Dependencies

## Backend

```bash
cd backend
npm install
```

## Frontend

Open another terminal.

```bash
cd frontend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **backend** directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GROQ_API_KEY=your_groq_api_key
```

Example (Local MongoDB):

```env
MONGODB_URI=mongodb://127.0.0.1:27017/verdantverse
```

---

# 🌱 Seed the Database

Populate MongoDB with sample plant data.

Navigate to the backend folder.

```bash
cd backend
```

Run the seed script.

```bash
node seedPlants.js
```

The script clears any existing sample plant data and inserts a fresh collection into the database.

---

# ▶ Running the Application

## Step 1: Start MongoDB

If using a local MongoDB installation, ensure the MongoDB service is running before starting the application.

---

## Step 2: Start the Backend Server

Open a terminal.

```bash
cd backend
npm run dev
```

If your project does not use **nodemon**, run:

```bash
npm start
```

Backend URL:

```
http://localhost:5000
```

---

## Step 3: Start the Frontend

Open a new terminal.

```bash
cd frontend
npm start
```

Frontend URL:

```
http://localhost:3000
```

---

# 🔄 Application Flow

```
User
   │
   ▼
React Frontend
   │
Axios HTTP Requests
   │
Express.js Backend
   │
Authentication & Business Logic
   │
MongoDB Database
   │
Groq AI Recommendation Service
```

---

# 📡 API Modules

The backend is organized into multiple API modules responsible for different functionalities.

### Authentication

* User Registration
* User Login
* JWT Verification

### Plants

* Retrieve Plant List
* Retrieve Plant Details

### Shopping Cart

* Add Product
* Remove Product
* View Cart

### AI

* Generate AI Plant Recommendations

---

# 💡 Key Concepts Implemented

* MERN Stack Development
* RESTful API Design
* JWT Authentication
* Password Hashing
* MongoDB CRUD Operations
* MVC Architecture
* AI API Integration
* Responsive UI Design
* Image Upload Handling
* Environment Variable Configuration

---

# 🔮 Future Enhancements

* Wishlist
* Product Reviews & Ratings
* Online Payment Integration
* Order History
* Order Tracking
* Admin Dashboard
* Inventory Management
* Email Notifications
* Dark Mode
* Advanced Filters & Sorting

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature-name
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push the branch.

```bash
git push origin feature-name
```

5. Open a Pull Request.

---

# 📄 License

This project is intended for educational and portfolio purposes. No license has been specified.

---

# 👩‍💻 Author

**Harshi**

Computer Engineering Student

Interested in:

* Full Stack Development
* Artificial Intelligence
* Software Engineering
* Data Analytics

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
