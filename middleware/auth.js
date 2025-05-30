const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authenticate token middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; 

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token - user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(500).json({ message: "Token verification failed" });
  }
};

// Authorize admin middleware
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Authorize super admin only
const authorizeSuperAdmin = (req, res, next) => {
  if (req.user.role !== "super admin") {
    return res.status(403).json({ message: "Super admin access required" });
  }
  next();
};

// Authorize technician only
const authorizeTechnician = (req, res, next) => {
  if (req.user.role !== "technician") {
    return res.status(403).json({ message: "Technician access required" });
  }
  next();
};

const authorizeAdminOrTechnician = (req, res, next) => {
  if (req.user?.role === 'admin' || req.user?.role === 'technician' || req.user?.role === 'super admin') {
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = {
  authenticateToken,
  authorizeAdmin,
  authorizeSuperAdmin,
  authorizeTechnician,
  authorizeAdminOrTechnician
};
