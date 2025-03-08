import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button } from "@mui/material";
import axios from "axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate(); // For navigation

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
  }, []);

  // Dark theme configuration
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

  // Define columns
  const columns = useMemo(
    () => [
      {
        id: "identity_number",
        header: "Identity Number",
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
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        Cell: ({ row }) => (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate(`/customer/${row.original._id}`)}
          >
            View Profile
          </Button>
        ),
      },
    ],
    [navigate]
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
