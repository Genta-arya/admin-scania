import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import handleError from "../../utils/HandleError";
import { CheckLogin } from "../API/authentikasi/_serviceAuthentikasi";
import useAuth from "../../utils/useAuthStore";

const useCheckLogin = () => {
  const { setAuthData, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkLogins = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      try {
        const response = await CheckLogin(token);
        setAuthData(response.data);
        if (location.pathname === "/login") {
          navigate("/");
        }

      } catch (error) {
        handleError(error, navigate);
      } finally {
        setIsLoading(false);
      }
    };

    checkLogins();
  }, [navigate, setAuthData]);

  return {
    user,
    isLoading,
  };
};

export default useCheckLogin;
