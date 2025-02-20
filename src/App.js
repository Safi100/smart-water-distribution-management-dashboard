import React, { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import Navbar from "./components/navbar/Navbar";
import { useAuth } from "./context/AuthContext";
import "./index.css";

axios.defaults.withCredentials = true;

// Lazy load components
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const NotFoundPage = lazy(() => import("./pages/notfound/NotFound"));
const LoginPage = lazy(() => import("./pages/auth/Login"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPassword"));
const NewCityPage = lazy(() => import("./pages/newCity/NewCity"));
const CustomersPage = lazy(() => import("./pages/customers/Customers"));
const EmployeePage = lazy(() => import("./pages/employees/Employees"));
const CitiesPage = lazy(() => import("./pages/cities/Cities"));

function Layout({ children }) {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/forgot-password"];
  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && !currentUser && location.pathname !== "/forgot-password") {
      navigate("/login");
    }
  }, [currentUser, loading, navigate, useLocation]);

  return (
    <Suspense>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/add-city" element={<NewCityPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/cities" element={<CitiesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Suspense>
  );
}

export default App;
