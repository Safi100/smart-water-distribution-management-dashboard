import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { MaterialReactTable } from "material-react-table";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button } from "@mui/material";
import axios from "axios";

const Bills = () => {
  const [searchParams] = useSearchParams();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, SetSelectedCustomer] = useState({
    label: "All Customers",
    value: "All",
  });
  const statusOptions = [
    { label: "All", value: "All" },
    { label: "Paid", value: "Paid" },
    { label: "Unpaid", value: "Unpaid" },
  ];

  const statusParam = searchParams.get("status") || "All";

  const selectedStatus =
    statusOptions.find(
      (opt) => opt.value.toLowerCase() === statusParam.toLowerCase()
    ) || statusOptions[0];

  const [bills, setBills] = useState([]);
  const navigate = useNavigate();

  // Fetch customers
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/customer")
      .then((res) => {
        const customerOptions = res.data.map((customer) => ({
          value: customer._id,
          label: customer.name,
        }));
        setCustomers(customerOptions);
      })
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);

  // Fetch bills
  useEffect(() => {
    let url = `http://localhost:8000/api/bill?status=${selectedStatus.value}`;
    if (selectedCustomer.value !== "All") {
      url += `&customerId=${selectedCustomer.value}`;
    }

    axios
      .get(url)
      .then((res) => setBills(res.data))
      .catch((error) => console.error("Error fetching bills:", error));
  }, [selectedCustomer.value, selectedStatus.value]);

  const handleCustomerChange = (selectedOption) => {
    SetSelectedCustomer(selectedOption);
  };
  const handleStatusChange = (selectedOption) => {
    navigate(`/bills?status=${selectedOption.value}`);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#3a3b3c",
      border: "none",
      borderRadius: "5px",
      padding: "5px",
      color: "#fff",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#3a3b3c",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#5a5b5c" : "#3a3b3c",
      color: "#fff",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),
  };

  // Define columns for bills
  const columns = useMemo(
    () => [
      {
        id: "customer_name",
        header: "Customer",
        accessorFn: (row) => row.customer?.name || "Unknown",
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
      },
      {
        id: "letter_amount_used",
        header: "Letter Amount Used",
        accessorFn: (row) => row.amount,
      },
      {
        id: "fees",
        header: "Fees",
        accessorFn: (row) => `${row.fees}%`,
      },
      {
        id: "billing_date",
        header: "Billing Date",
        accessorFn: (row) => {
          const date = new Date(row.year, row.month - 1); // Month is 0-indexed
          const monthName = date.toLocaleString("en-US", { month: "long" });
          const year = date.getFullYear();
          return `${year} ${monthName}`; // → "2025 February"
        },
      },
      {
        id: "total",
        header: "Total (₪)",
        accessorFn: (row) => row.total_price.toFixed(2),
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        Cell: ({ row }) => (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate(`/bill/${row.original._id}`)}
          >
            View
          </Button>
        ),
      },
    ],
    [navigate]
  );

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#242526",
        paper: "#242526",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#AAAAAA",
      },
    },
    components: {
      MuiTableContainer: {
        styleOverrides: {
          root: {
            backgroundColor: "#242526",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: "#242526",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            backgroundColor: "#242526",
            color: "#FFFFFF",
          },
        },
      },
    },
  });

  return (
    <div className="wrapper p-4">
      <h1 className="mb-3">Bills</h1>
      <div className="row">
        <div className="input_div col-12 col-md-6 col-lg-4 mb-4">
          <label className="mb-2">Customer</label>
          <Select
            options={[{ label: "All Customers", value: "All" }, ...customers]}
            value={selectedCustomer}
            onChange={handleCustomerChange}
            placeholder="Select a customer..."
            styles={customStyles}
            className="z-3"
            required
          />
        </div>
        <div className="input_div col-12 col-md-6 col-lg-3 mb-4">
          <label className="mb-2">Status</label>
          <Select
            options={[
              { label: "All", value: "All" },
              { label: "Paid", value: "Paid" },
              { label: "Unpaid", value: "Unpaid" },
            ]}
            value={selectedStatus}
            onChange={handleStatusChange}
            placeholder="Select a customer..."
            styles={customStyles}
            className="z-3"
            required
          />
        </div>
      </div>
      {bills.length > 0 ? (
        <ThemeProvider theme={darkTheme}>
          <MaterialReactTable
            data={bills}
            columns={columns}
            initialState={{ pagination: { pageSize: 10 } }}
          />
        </ThemeProvider>
      ) : (
        <h2 className="text-danger">No bills...</h2>
      )}
    </div>
  );
};

export default Bills;
