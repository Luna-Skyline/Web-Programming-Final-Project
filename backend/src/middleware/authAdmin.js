import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";

const protectAdmin = async (req, res, next) => {
  let token;

  // 1. Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2. Check cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // ---- No token → allow request but admin = null ----
  if (!token) {
    req.admin = null;
    return next();
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");

    const admin = await AdminUser.findById(decoded.adminId).select(
      "-password_hash"
    );

    // If admin no longer exists (deleted, disabled, etc.)
    if (!admin) {
      req.admin = null;
      return next();
    }

    // Attach admin user
    req.admin = admin;

    next();
  } catch (error) {
    // ---- Token expired? Allow request but clear admin ----
    if (error.name === "TokenExpiredError") {
      console.warn("Admin token expired (allowing request)");
      req.admin = null;
      return next();
    }

    // Any other JWT error
    console.error("Admin token verification failed:", error);
    req.admin = null;
    return next();
  }
};

export default protectAdmin;
