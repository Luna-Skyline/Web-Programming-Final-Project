# React + Vite + Node.js + MongoDB

This repository contains the source code for the Web Programming Final Project using React (Vite) for the frontend, Express for the backend, and MongoDB for the database. It includes separate environments for client and server, hot module reload (HMR), and a clean folder structure for scalable development.

Currently, two official React plugins for Vite are available:

[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) uses Babel (or oxc when used with rolldown-vite) for Fast Refresh

[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react-swc) uses SWC for Fast Refresh Web Programming Final Project

🚀 Features

React + Vite fast development environment

Modular folder structure for components, pages, and utilities

Reusable UI components

Clean and simple styling using CSS

Image and asset organization inside /public

Optimized build for deployment

📁 Project Structure
Web-Programming-Final-Project-main/
│
├── public/                # Static assets (images, icons, etc.)
│
├── src/
│   ├── assets/            # Logos, UI assets
│   ├── components/        # Reusable UI components
│   ├── pages/             # Main user-facing pages
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
│
├── README.md              # Project documentation
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite config
└── .gitignore

🛠️ Installation & Setup

Make sure you have Node.js (LTS) installed.

1. Install dependencies
npm install

2. Run in development mode
npm run dev

3. Build for production
npm run build

4. Preview production build
npm run preview

📦 Technologies Used

React

Vite

JavaScript (ES6+)

CSS

Node.js + npm

📚 Notes

All components are modular and easy to edit.

You may reorganize or extend the structure as needed.

Images are placed in public/ for easy access via /image.jpg.
🗄️ MongoDB Database Setup

This project uses MongoDB Atlas as the cloud database.
Your cluster may contain multiple databases, including:

admin

e-commerce

orders

products

users

retail-store

adminusers

categories

customers

inventories

orderdetails

orders

products

suppliers

sample_mflix (default MongoDB sample dataset)

local (system database)

🔌 1. MongoDB Connection String

Create a .env file in the project root:

MONGO_URI="your-mongodb-connection-string"


Example (DO NOT commit your real password):

MONGO_URI="mongodb+srv://username:password@cluster0.cpu6nrc.mongodb.net/"

🧩 2. Connecting to MongoDB in Your App

If you have a backend (Node.js), use:

import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Error:", err));

🗃 3. Using the Collections

You may access your collections from:

e-commerce/products
e-commerce/orders
e-commerce/users
retail-store/categories
retail-store/products
retail-store/suppliers
retail-store/customers


These collections can be used for:

Product management

Supplier management

Order processing

Admin users

Customer data

Inventory

🔐 Environment Variables

Make sure you create a .env file (not committed to GitHub):

MONGO_URI=http://localhost:5173/
PORT=5000
JWT_SECRET=your_secret_here

📝 License

This project is created for academic purposes and may be reused or modified as needed.
