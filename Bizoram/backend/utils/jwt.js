import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const payload = {
    id: user._id,
    uname: user.uname,
    email: user.email,
    role: user.getNormalizedRole ? user.getNormalizedRole() : user.role,
    sadmin: user.sadmin,
    admin: user.admin,
    branchId: user.branchId,
    formKey: user.formKey,
  };

  const secret = process.env.JWT_SECRET || "default_jwt_secret_bizwoke";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || "default_jwt_secret_bizwoke";
  return jwt.verify(token, secret);
};
