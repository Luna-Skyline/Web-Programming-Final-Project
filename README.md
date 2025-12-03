# 🖥️ Web Programming Final Project  
A complete full-stack web application built with **React + Vite**, **Node.js/Express**, and **MongoDB Atlas**.  
This system includes an **Admin Panel**, **Product Management**, and MongoDB cloud database collections for retail-store operations.

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
```
project-root/
│
├── backend/
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   ├── .env # Not committed, example provided
│   ├── package-lock.json
│   ├── package.json
│   ├── seedAdmin.js
│   ├── seedInventory.js
│   └── seedProducts.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── routes/
│   │   │   └── services/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```
---

# 🛠 Installation Guide

Follow the instructions below to install and run the project.

1️⃣ Clone the Repository
- git clone https://github.com/Luna-Skyline/Web-Programming-Final-Project.git
- cd your-repo

2️⃣ Install Dependencies
- Backend(/backend)
  - cd backend
  - npm install
- Frontend(/frontend)
  - cd frontend
  - npm install

3️⃣ Set Up MongoDB Database
- Create a MongoDB database named:
  - retail-store
- Inside this DB, manually create the initial collections
  - Category Sample Document (Categories Collection):
    - ```
      {
          "category_name": "Fantasy",
          "description": "Fantasy book category",
          "is_active": true,
          "genre": "Fiction"
      }
      ```
  - Supplier Sample Document (Suppliers Collection):
      - ```
        {
          "supplier_name": "ABC Books Supplier",
          "contact_person": "John Doe",
          "email": "abcbooks@example.com",
          "phone": "123-456-7890",
          "address": "123 Street, City",
          "is_active": true
        }
  - You may insert additional sample documents as needed.
    
4️⃣ Configure the Backend .env File
- Inside the backend folder, create:
  - backend/.env
   - Paste this in the .env file:
     - ```
        PORT=5000
        MONGO_URI=your-mongodb-atlas-connection-string
        MONGO_DBNAME=retail-store
        JWT_SECRET=mysecretkey
       
5️⃣ Run Seed Files (Admin, Inventory, Products)
- From the backend folder:
 - ```
   cd backend
    node seedAdmin.js
    node seedInventory.js
    node seedProducts.js
- This loads:
  - AdminUser
  - Inventory
  - Products

6️⃣ Run the Backend Server
- npx nodemon src/server.js

7️⃣ Run the Frontend
- npm run dev

8️⃣ Open the App in Your Browser
- Visit: http://localhost:5173
