# Web Programming Final Project  
A complete full-stack web application built with **React + Vite**, **Node.js/Express**, and **MongoDB Atlas**.  
This system includes an **Admin Panel**, **Product Management**, and MongoDB cloud database collections for e-commerce and retail operations.

---

# 📌 Table of Contents
1. [Project Overview](#project-overview)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Project Structure](#project-structure)  
5. [Installation Guide](#installation-guide)  
6. [MongoDB Setup](#mongodb-setup)  
7. [Environment Variables](#environment-variables)  
8. [Running the Project](#running-the-project)  
9. [API Endpoints](#api-endpoints)  
10. [Admin Panel Overview](#admin-panel-overview)  
11. [Screenshots (Optional)](#screenshots-optional)  
12. [License](#license)

---

# 📘 Project Overview
This project is a web-based system designed for school/academic purposes.  
It uses **React (frontend)** and **MongoDB Atlas (database)** to manage:

- Products  
- Categories  
- Suppliers  
- Orders  
- Inventory  
- Admin users  
- Customers  

The system is modular, scalable, and easy to maintain.

---

# ✨ Features

### ✅ Frontend (React + Vite)
- Modern UI built with reusable components  
- Product list & details  
- Admin product management  
- Category and supplier management  
- Dashboard pages  
- API integration with backend  

### ✅ Backend (Node + Express)
- REST API for all modules  
- Secure MongoDB connection  
- Model-based architecture  
- Error handling  
- User authentication (JWT-ready)

### ✅ MongoDB Atlas
Includes these collections:

### **Database: `e-commerce`**
- `products`
- `orders`
- `users`

### **Database: `retail-store`**
- `adminusers`
- `categories`
- `customers`
- `inventories`
- `orderdetails`
- `orders`
- `products`
- `suppliers`

---

# 🧱 Tech Stack

### **Frontend**
- React  
- Vite  
- CSS  
- Axios  

### **Backend**
- Node.js  
- Express  
- Mongoose  

### **Database**
- MongoDB Atlas  
- Compass (optional)

---

# 📁 Project Structure

project-root/
│
├── client/ # React + Vite Frontend
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── index.html
│ └── vite.config.js
│
├── server/ # Backend (Node + Express)
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── server.js
│ └── .env
│
└── README.md

yaml
Copy code

---

# 🛠 Installation Guide

### 1️⃣ Clone the repository
```sh
git clone https://github.com/your-username/your-repo.git
cd your-repo
2️⃣ Install frontend dependencies
sh
Copy code
cd client
npm install
3️⃣ Install backend dependencies
sh
Copy code
cd ../server
npm install
🗄 MongoDB Setup
1️⃣ Get your connection string from MongoDB Atlas
Example:

perl
Copy code
mongodb+srv://username:password@cluster0.cpu6nrc.mongodb.net/
2️⃣ Create your .env file inside server/
ini
Copy code
MONGO_URI="your connection string here"
PORT=5000
JWT_SECRET="your-secret-key"
3️⃣ Connect backend to MongoDB using Mongoose
js
Copy code
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));
🔐 Environment Variables
Create server/.env:

makefile
Copy code
MONGO_URI=
PORT=5000
JWT_SECRET=
Create client/.env for API usage:

ini
Copy code
VITE_API_URL=http://localhost:5000
▶ Running the Project
Run backend
arduino
Copy code
cd server
npm run dev
Run frontend
arduino
Copy code
cd client
npm run dev
Both should run at:

Frontend: http://localhost:5173

Backend: http://localhost:5000

📡 API Endpoints
Products
bash
Copy code
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
Categories
bash
Copy code
GET    /api/categories
POST   /api/categories
Suppliers
bash
Copy code
GET    /api/suppliers
POST   /api/suppliers
Orders
bash
Copy code
GET    /api/orders
POST   /api/orders
🛠 Admin Panel Overview
The admin panel allows:

Add / Update / Delete Products

Manage Inventory

Manage Categories

Manage Suppliers

View Orders

View Customer Information

Generate reports (optional)
