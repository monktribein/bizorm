import { verifyToken } from "../utils/jwt.js";
import { User } from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User associated with this token no longer exists",
      });
    }

    if (user.active === 2) {
      return res.status(403).json({
        success: false,
        message: "Account has been suspended or deactivated",
      });
    }

    req.user = user;
    req.userRole = user.getNormalizedRole();
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid or expired",
      error: error.message,
    });
  }
};

// Optional auth: attaches req.user if token exists, but doesn't block public requests
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      if (user && user.active !== 2) {
        req.user = user;
        req.userRole = user.getNormalizedRole();
      }
    } catch {
      // Ignore token failure for public routes
    }
  }
  next();
};
