import { useEffect, useState, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Employees = ({ currentUser }) => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate(); // For navigation

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

  // remove employee
  const removeEmployee = (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!isConfirmed) {
      return; // User cancelled the deletion
    }
    axios
      .delete(`http://localhost:8000/api/admin/${id}`)
      .then((res) => {
        console.log("Employee deleted successfully");
        setEmployees(employees.filter((employee) => employee._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting employee:", error);
      });
  };

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
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => navigate(`/employee-profile/${row.original._id}`)}
            >
              View
            </Button>
            {currentUser.role === "admin" &&
              row.original._id !== currentUser._id && (
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => removeEmployee(row.original._id)}
                >
                  Delete
                </Button>
              )}
          </div>
        ),
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
