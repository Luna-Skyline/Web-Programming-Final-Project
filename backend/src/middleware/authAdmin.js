import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";

const protectAdmin = async (req, res, next) => {
  let token;

  //Check Authorization header for Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //Fallback: check cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  //No token found
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");

    //Fetch admin user from DB, exclude password
    const admin = await AdminUser.findById(decoded.adminId).select(
      "-password_hash"
    );
    if (!admin) {
      return res.status(401).json({ message: "Not authorized as admin" });
    }

    //Attach admin to request for downstream routes
    req.admin = admin;

    next();
  } catch (error) {
    console.error("Admin token verification failed:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protectAdmin;
