import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const AuthContext = createContext([]);

export function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = () => {
    setLoading(true);
    if (!Cookies.get("c_user")) {
      setLoading(false);
      return;
    }
    axios
      .get("http://localhost:8000/api/admin/current-user")
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const logout = () => {
    axios
      .post("http://localhost:8000/api/admin/logout")
      .then(() => {
        setCurrentUser(null);
        window.location.href = "/login";
      })
      .catch((err) => console.log(err));
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
