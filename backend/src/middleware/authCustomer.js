import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";

export const protectCustomer = async (req, res, next) => {
  let token;

  // 1. Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2. Check cookie if no header token
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // No token found
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");

    // Fetch customer from DB
    const customer = await Customer.findById(decoded.customerId).select(
      "-password_hash"
    );

    if (!customer) {
      return res.status(401).json({ message: "Not authorized as a customer" });
    }

    // Attach customer to request
    req.customer = customer;

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protectCustomer;

// For Random JWT Secret Generation
// node -e "console.log(require('node:crypto').randomBytes(8).toString('hex'))"
