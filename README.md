# Web Programming Final Project  
A complete full-stack web application built with **React + Vite**, **Node.js/Express**, and **MongoDB Atlas**.  
This system includes an **Admin Panel**, **Product Management**, and MongoDB cloud database collections for e-commerce and retail operations.

This submission includes **all source code (frontend + backend)**, **MongoDB configuration**, and **complete documentation packaged inside this GitHub repository**, including a clear and detailed **README.md** as required for academic project submission.

---

# 📘 Project Overview
This project is a full-stack web system designed for school/academic purposes.  
It includes all required components inside the GitHub repository:

- Frontend (React + Vite)
- Backend API (Node.js / Express)
- MongoDB Atlas database configuration
- Documentation and setup instructions
- A complete and detailed README.md file

The system manages:

- Products  
- Categories  
- Suppliers  
- Orders  
- Inventory  
- Admin users  
- Customers  

It is built to be modular, scalable, and easy to maintain.

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
- MongoDB Compass (optional)

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
│ └── .env # Not committed, example provided
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
1️⃣ Get your MongoDB Atlas connection string
Example:

perl
Copy code
mongodb+srv://username:password@cluster0.cpu6nrc.mongodb.net/
2️⃣ Create .env inside /server
ini
Copy code
MONGO_URI="your connection string here"
PORT=5000
JWT_SECRET="your-secret-key"
3️⃣ Backend MongoDB connection (Mongoose)
js
Copy code
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
🔐 Environment Variables
Create server/.env
makefile
Copy code
MONGO_URI=
PORT=5000
JWT_SECRET=
Create client/.env
ini
Copy code
VITE_API_URL=http://localhost:5000
▶ Running the Project
Run backend
sh
Copy code
cd server
npm run dev
Run frontend
sh
Copy code
cd client
npm run dev
URLs
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
The admin panel allows administrators to:

Add / Update / Delete Products

Manage Inventory

Manage Categories

Manage Suppliers

View Orders

View Customer Information

Generate reports (optional)


View Orders

View Customer Information

Generate reports (optional)
