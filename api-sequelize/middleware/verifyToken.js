// middleware.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token received:", token);

  if (!token) {
    return res.status(401).json({ message: "Not Authenticated!" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(403).json({ message: "Token is not valid!" });
    }

    console.log("Decoded payload:", payload); // تحقق من id و role
    req.userId = payload.id;
    req.userRole = payload.role;
    next();
  });
};
// دالة إضافية للتحقق من أن المستخدم مسؤول
export const verifyAdmin = (req, res, next) => {
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({ message: "Not Authorized! Admins only." });
  }
  next();
};