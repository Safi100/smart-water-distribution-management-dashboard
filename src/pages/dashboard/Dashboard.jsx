import axios from "axios";
import { useEffect, useState } from "react";
import "./dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState({
    totalEmployees: 0,
    totalCustomers: 0,
    totalDistributors: 0,
    totalCities: 0,
    totalPaidBills: 0,
    totalUnPaidBills: 0,
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
          <h4>Total customers</h4>
          <p className="mt-3 fw-bold fs-4">{data.totalCustomers}</p>
        </a>
        <a href="/employees" className="dashboard_data_div">
          <h4>Total empyloyees</h4>
          <p className="mt-3 fw-bold fs-4">{data.totalEmployees}</p>
        </a>
        <a href="/cities" className="dashboard_data_div">
          <h4>Total cities</h4>
          <p className="mt-3 fw-bold fs-4">{data.totalCities}</p>
        </a>
        <a href="/bills?status=Paid" className="dashboard_data_div">
          <h4>Total paid bills</h4>
          <p className="mt-3 fw-bold fs-4">{data.totalPaidBills}</p>
        </a>
        <a href="/bills?status=Unpaid" className="dashboard_data_div">
          <h4>Total unpaid bills</h4>
          <p className="mt-3 fw-bold fs-4">{data.totalUnPaidBills}</p>
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
