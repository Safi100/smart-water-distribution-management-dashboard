import axios from "axios";
import { useEffect, useState } from "react";
import "./dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState({
    totalEmployees: 0,
    totalCustomers: 0,
    totalDistributors: 0,
    totalCities: 0,
  });
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/dashboard")
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="wrapper py-4">
      <div className="dashboard_row">
        <a href="/customers" className="dashboard_data_div">
          <h2>Total customers</h2>
          <p className="mt-3 fw-bold fs-3">{data.totalCustomers}</p>
        </a>
        <a href="/employees" className="dashboard_data_div">
          <h2>Total empyloyees</h2>
          <p className="mt-3 fw-bold fs-3">{data.totalEmployees}</p>
        </a>
        <a href="/cities" className="dashboard_data_div">
          <h2>Total cities</h2>
          <p className="mt-3 fw-bold fs-3">{data.totalCities}</p>
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
