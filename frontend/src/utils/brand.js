/**
 * Utility helper to safely get the active business/brand name,
 * ensuring fallback when database value is placeholder like "na", "n/a", or empty.
 */
export const getCleanBrandName = (user, companyDetails) => {
  const primary = (user?.cmpy || "").trim();
  if (
    primary &&
    primary.toLowerCase() !== "na" &&
    primary.toLowerCase() !== "n/a" &&
    primary.toLowerCase() !== "null" &&
    primary.toLowerCase() !== "undefined"
  ) {
    return primary;
  }

  const secondary = (companyDetails?.cmpyName || "").trim();
  if (
    secondary &&
    secondary.toLowerCase() !== "na" &&
    secondary.toLowerCase() !== "n/a" &&
    secondary.toLowerCase() !== "null" &&
    secondary.toLowerCase() !== "undefined"
  ) {
    return secondary;
  }

  if (user?.fname) {
    return `${user.fname}'s Business`;
  }

  return "My Business";
};
