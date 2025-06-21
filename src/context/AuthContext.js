import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const AuthContext = createContext([]);

export function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // فقط إذا لم نكن في صفحة login
    if (window.location.pathname !== "/login") {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = () => {
    setLoading(true);
    const token = localStorage.getItem("access_token");
    const cUser = localStorage.getItem("c_user");

    if (!token || !cUser) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/admin/current-user`)
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        // إذا كان التوكن غير صالح، احذفه من localStorage
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("c_user");
          setCurrentUser(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const logout = () => {
    axios
      .post(`${API_BASE_URL}/admin/logout`)
      .then(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("c_user");
        setCurrentUser(null);
        window.location.href = "/login";
      })
      .catch((err) => {
        console.log(err);
        // حتى لو فشل الطلب، احذف التوكن محلياً
        localStorage.removeItem("access_token");
        localStorage.removeItem("c_user");
        setCurrentUser(null);
        window.location.href = "/login";
      });
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, fetchCurrentUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
