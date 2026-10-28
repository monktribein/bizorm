export const enforceRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const currentRole = req.user.getNormalizedRole();
    if (!allowedRoles.includes(currentRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of [${allowedRoles.join(", ")}], but you have role [${currentRole}]`,
      });
    }

    next();
  };
};

export const enforceWriteAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  const role = req.user.getNormalizedRole();
  if (role === "BRANCH_USER") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Branch users have strictly read-only access",
    });
  }

  next();
};

export const enforceBranchAccess = (branchIdField = "branchId") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const role = req.user.getNormalizedRole();
    if (role === "SUPER_ADMIN") {
      return next(); // Super admin has global access
    }

    const targetBranchId = req.params[branchIdField] || req.body[branchIdField] || req.query[branchIdField];
    if (targetBranchId && req.user.branchId) {
      if (req.user.branchId.toString() !== targetBranchId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Cross-branch access denied",
        });
      }
    }

    next();
  };
};
