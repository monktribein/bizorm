import React from "react";
import { Link } from "react-router-dom";
import bizormLogoImg from "../../assets/bizorm-logo.jpg";

export const BizormLogo = ({ 
  size = "md", 
  variant = "full", 
  showTagline = true, 
  to = "/", 
  className = "",
  style = {},
}) => {
  const heightMap = {
    sm: 32,
    md: 42,
    lg: 52,
    xl: 64,
  };
  const heightPx = typeof size === "number" ? size : heightMap[size] || 42;

  const logoGraphic = (
    <div
      className={`bizorm-logo-wrap ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        textDecoration: "none",
        userSelect: "none",
      }}
    >
      <img
        src={bizormLogoImg}
        alt="BizORM™ - Customer Experience. Stronger Brands."
        style={{
          height: `${heightPx}px`,
          width: "auto",
          maxWidth: "100%",
          objectFit: "contain",
          display: "block",
          mixBlendMode: "multiply",
          ...style,
        }}
      />
    </div>
  );

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  if (to) {
    return (
      <Link 
        to={to} 
        onClick={handleClick}
        style={{ textDecoration: "none", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
        title="BizORM™ - Customer Experience. Stronger Brands."
      >
        {logoGraphic}
      </Link>
    );
  }

  return logoGraphic;
};

export default BizormLogo;
