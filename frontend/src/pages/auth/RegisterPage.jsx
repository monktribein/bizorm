import React from "react";
import { AuthPage } from "./AuthPage";

export const RegisterPage = (props) => {
  return <AuthPage {...props} defaultTab="register" />;
};

export default RegisterPage;
