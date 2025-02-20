import { useEffect, useState, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/admin")
      .then((res) => {
        setEmployees(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error fetching employees data:", error);
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
      {
        id: "role",
        header: "Role",
        accessorKey: "role",
      },
    ],
    []
  );

  return (
    <div className="wrapper py-4">
      <h2 className="mb-4">Employees ({employees.length})</h2>
      <ThemeProvider theme={darkTheme}>
        <MaterialReactTable
          data={employees}
          columns={columns}
          initialState={{ pagination: { pageSize: 10 } }}
        />
      </ThemeProvider>
    </div>
  );
};

export default Employees;
