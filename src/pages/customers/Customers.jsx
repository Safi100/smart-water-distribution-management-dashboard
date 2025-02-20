import { useEffect, useState, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/customer")
      .then((res) => {
        setCustomers(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error fetching customers data:", error);
      });
  }, []); // <-- Added dependency array to prevent infinite calls

  // Dark theme configuration
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#242526",
        paper: "#242526", // Set table background
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
            backgroundColor: "#242526", // Ensure table container has the same background
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: "#242526", // Set paper background
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            backgroundColor: "#242526", // Apply background to table cells
            color: "#FFFFFF", // Ensure text is readable
          },
        },
      },
    },
  });

  // Define columns
  const columns = useMemo(
    () => [
      {
        id: "identity_number",
        header: "Identity_number",
        accessorKey: "identity_number",
      },
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email",
      },
      {
        id: "phone",
        header: "Phone Number",
        accessorKey: "phone",
      },
    ],
    []
  );

  return (
    <div className="wrapper py-4">
      <h2 className="mb-4">Customers ({customers.length})</h2>
      <ThemeProvider theme={darkTheme}>
        <MaterialReactTable
          data={customers}
          columns={columns}
          initialState={{ pagination: { pageSize: 10 } }}
        />
      </ThemeProvider>
    </div>
  );
};

export default Customers;
