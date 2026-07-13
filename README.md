\# 🌿 VerdantVerse



> \*\*An AI-Powered MERN Stack Plant Store\*\*

>

> A modern full-stack e-commerce web application for plant lovers. VerdantVerse allows users to browse plants, receive AI-powered plant recommendations, securely manage their accounts, and enjoy a seamless shopping experience.



\---



\## 📖 Table of Contents



\- \[Overview](#-overview)

\- \[Features](#-features)

\- \[Tech Stack](#-tech-stack)

\- \[Project Structure](#-project-structure)

\- \[Installation](#-installation)

\- \[Environment Variables](#-environment-variables)

\- \[Database Seeding](#-database-seeding)

\- \[Running the Application](#-running-the-application)

\- \[API Overview](#-api-overview)

\- \[Future Enhancements](#-future-enhancements)

\- \[Author](#-author)



\---



\# 📌 Overview



VerdantVerse is a full-stack MERN application designed to simplify online plant shopping while enhancing user experience through AI-assisted recommendations.



The application provides secure authentication, product browsing, shopping cart functionality, image handling, and intelligent plant suggestions powered by Groq AI.



\---



\# ✨ Features



\## 👤 User Features



\- User Registration

\- Secure Login \& Authentication

\- JWT Authorization

\- Browse Plant Collection

\- Search Plants

\- View Plant Details

\- Shopping Cart

\- Responsive User Interface



\## 🤖 AI Features



\- AI-powered Plant Recommendation

\- Intelligent Plant Assistance using Groq API



\## 🔒 Security



\- JWT Authentication

\- Password Hashing using bcrypt

\- Protected Routes

\- Environment Variable Configuration



\## 🖼️ Media



\- Plant Image Storage

\- Image Upload using Multer



\---



\# 🛠 Tech Stack



\## Frontend



\- React.js

\- JavaScript

\- HTML5

\- CSS3

\- Axios



\## Backend



\- Node.js

\- Express.js



\## Database



\- MongoDB

\- Mongoose



\## Authentication



\- JWT

\- bcryptjs



\## AI



\- Groq API



\## File Upload



\- Multer



\---



\# 📂 Project Structure



```

VerdantVerse

│

├── backend

│   ├── controllers

│   ├── middleware

│   ├── models

│   ├── routes

│   ├── assets

│   ├── seedPlants.js

│   ├── package.json

│   └── server.js

│

├── frontend

│   ├── public

│   ├── src

│   ├── package.json

│   └── ...

│

├── .gitignore

├── README.md

└── LICENSE (optional)

```



\---



\# 🚀 Installation



\## 1. Clone the Repository



```bash

git clone https://github.com/Harshitha-310/VerdantVerse.git

```



\---



\## 2. Navigate to the Project



```bash

cd VerdantVerse

```



\---



\## 3. Install Backend Dependencies



```bash

cd backend

npm install

```



\---



\## 4. Install Frontend Dependencies



Open another terminal.



```bash

cd frontend

npm install

```



\---



\# 🔑 Environment Variables



Create a `.env` file inside the \*\*backend\*\* folder.



```env

PORT=5000



MONGODB\_URI=your\_mongodb\_connection\_string



JWT\_SECRET=your\_secret\_key



GROQ\_API\_KEY=your\_groq\_api\_key

```



\---



\# 🌱 Database Seeding



Populate the MongoDB database with sample plant data.



Navigate to the backend directory.



```bash

node seedPlants.js

```



This will insert the default plant collection into MongoDB.



\---



\# ▶ Running the Application



\## Start Backend



```bash

cd backend

npm run dev

```



Backend runs on:



```

http://localhost:5000

```



\---



\## Start Frontend



Open another terminal.



```bash

cd frontend

npm start

```



Frontend runs on:



```

http://localhost:3000

```



\---



\# 🔄 Application Workflow



```

User

&#x20;  │

&#x20;  ▼

React Frontend

&#x20;  │

Axios Requests

&#x20;  │

Express Backend

&#x20;  │

Authentication

&#x20;  │

MongoDB Database

&#x20;  │

Groq AI Recommendation

```



\---



\# 📡 API Overview



\### Authentication



\- Register User

\- Login User

\- JWT Authentication



\### Plants



\- Get All Plants

\- Get Plant Details



\### Cart



\- Add to Cart

\- Remove from Cart

\- View Cart



\### AI



\- Generate Plant Recommendation



\---



\# 📸 Screenshots



Add screenshots here after running the project.



Example:



```

Home Page



Login Page



Plant Details



Shopping Cart



AI Recommendation

```



\---



\# 🎯 Future Enhancements



\- ❤️ Wishlist

\- ⭐ Product Reviews

\- 💳 Online Payments

\- 📦 Order Tracking

\- 👨‍💼 Admin Dashboard

\- 📧 Email Notifications

\- 🌙 Dark Mode

\- 🔍 Advanced Search \& Filters



\---



\# 🤝 Contributing



Contributions are welcome.



1\. Fork the repository



2\. Create a new branch



```bash

git checkout -b feature-name

```



3\. Commit changes



```bash

git commit -m "Added new feature"

```



4\. Push the branch



```bash

git push origin feature-name

```



5\. Create a Pull Request



\---



\# 📜 License



This project is licensed under the MIT License.



\---



\# 👩‍💻 Author



\*\*Sudha Harshitha\*\*



Computer Engineering Student



Passionate about Full Stack Development, AI, and Software Engineering.



\---



\## ⭐ If you like this project



Give the repository a ⭐ on GitHub!

