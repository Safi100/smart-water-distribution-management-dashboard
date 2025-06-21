import axios from "axios";

// API Configuration
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

// إضافة interceptor لإضافة Authorization header تلقائياً
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// إضافة interceptor للاستجابة للتعامل مع انتهاء صلاحية التوكن
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      // إذا كان التوكن غير صالح، احذفه واتجه لصفحة تسجيل الدخول
      // لكن فقط إذا لم نكن بالفعل في صفحة login
      localStorage.removeItem("access_token");
      localStorage.removeItem("c_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export { API_BASE_URL };
