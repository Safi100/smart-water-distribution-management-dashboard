import React, { useState, useContext, useEffect } from "react"; // Import useState
import {
  Badge,
  MenuItem,
  Box,
  Menu,
  IconButton,
  Avatar,
  Tooltip,
  ListItemIcon,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Logout from "@mui/icons-material/Logout";
// import NotificationsIcon from "@mui/icons-material/Notifications";
import { stringAvatar } from "../Avatar";
// import Loading from "../loading/Loading";
// import Logo from "../../assets/logo.png";
import Axios from "axios";
import { AuthContext } from "../../context/AuthContext";
// import { NotificationContext } from "../../context/NotificationContext";
import "./navbar.css";
// SEARCH RESULTS DIV
// import UserSearch from "../search/UserSearch";
// import GameSearch from "../search/GameSearch";

function Navbar() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNav, setAnchorElNav] = useState(null);

  const openUser = Boolean(anchorElUser);
  const openNav = Boolean(anchorElNav);

  const handleClickUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleClickNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // get current user
  const [currentUser, setCurrentUser] = useState(null);
  const authContext = useContext(AuthContext);
  useEffect(() => {
    setCurrentUser(authContext.currentUser);
  }, [authContext]);
  // logout user
  const handleLogoutAndCloseMenu = () => {
    authContext.logout(); // Call the logout method from authContext
    handleCloseUserMenu(); // Close the user menu
  };

  // const notificationContext = useContext(NotificationContext);

  // search
  const handleSearch = (e) => {
    const text = e.target.value.trimStart();
    setSearch(text);
  };
  const [search, setSearch] = useState("");
  const [search_result, setSearch_result] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (search.length > 0) {
      setLoading(true);
      Axios.get(`http://localhost:8000/api/search?q=${search}`)
        .then((res) => {
          setSearch_result(res.data);
          console.log(res.data);

          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [search]);

  return (
    <div className="navbar_container">
      <div className="wrapper">
        <div className="top">
          <div className="left">
            <div className="logo">
              <a href="/" className="logo_a">
                <img src="/assets/logo.png" alt="Water logo" />
              </a>
              <span className="menu_btn">
                <IconButton onClick={handleClickNavMenu}>
                  <MenuIcon sx={{ color: "#fff" }} />
                </IconButton>
                <Menu
                  anchorEl={anchorElNav}
                  id="nav-menu"
                  open={openNav}
                  onClose={handleCloseNavMenu}
                  onClick={handleCloseNavMenu}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      color: "#fff",
                      bgcolor: "#242526",
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "#242526",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleCloseNavMenu}>
                    <a href={"/"}>Home</a>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <a href={"/add-city"}>Add city</a>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <a href={"/add-tank"}>Add tank</a>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <a href={"/add-employee"}>Add employee</a>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <a href={"/add-customer"}>Add customer</a>
                  </MenuItem>
                </Menu>
              </span>
            </div>
          </div>
          <div className="search header_search">
            <SearchIcon color="inherit" />
            <input
              value={search}
              onChange={handleSearch}
              type="text"
              placeholder="Search..."
            />
            {search.length > 0 && (
              <div className="header_search_result">
                {loading ? (
                  <div />
                ) : (
                  // <Loading />
                  <>
                    {search_result.length > 0 ? (
                      search_result.map((result) => (
                        <div
                          className="result"
                          onClick={() => setSearch("")}
                          key={result._id}
                        >
                          {result.type === "customer" && (
                            <a
                              href={`/customer/${result._id}`}
                              className="userResult"
                            >
                              <div className="image">
                                <Avatar {...stringAvatar(`${result.title}`)} />
                              </div>
                              <div>
                                <p className="title mb-0">
                                  {result.title} - {result.identity_number}
                                </p>
                                <p className="mb-0">{result.email}</p>
                              </div>
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <h2 className="no_reuslt">No Result...</h2>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="right">
            {currentUser && (
              <>
                {/* <a href="/notifications">
                  <Badge
                    badgeContent={notificationContext.notifications.length}
                    max={99}
                    color="success"
                    sx={{ cursor: "pointer" }}
                  >
                    <NotificationsIcon sx={{ color: "#fff" }} />
                  </Badge>
                </a> */}

                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleClickUserMenu} size="small">
                      <Avatar
                        {...stringAvatar(`${currentUser.name}`)}
                        // sx={{ bgcolor: "#2e7d32" }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Menu
                  anchorEl={anchorElUser}
                  id="account-menu"
                  open={openUser}
                  onClose={handleCloseUserMenu}
                  onClick={handleCloseUserMenu}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      color: "#fff",
                      bgcolor: "#242526",
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "#242526",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <a
                      href={`/admin-profile/${currentUser._id}`}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Avatar /> Profile
                    </a>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogoutAndCloseMenu}>
                    <ListItemIcon>
                      <Logout fontSize="small" sx={{ color: "#fff" }} />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>
        </div>
        <div className="search mobile_search header_search">
          <SearchIcon color="inherit" />
          <input
            className="header_search"
            value={search}
            onChange={handleSearch}
            type="text"
            placeholder="Search..."
          />
          {search.length > 0 && (
            <div className="header_search_result">
              {loading ? (
                <div />
              ) : (
                // <Loading />
                <>
                  {search_result.length > 0 ? (
                    search_result.map((result) => (
                      <div
                        className="result"
                        onClick={() => setSearch("")}
                        key={result._id}
                      >
                        {/* {result.isUser ? (
                          <UserSearch user={result} />
                        ) : (
                          <GameSearch game={result} />
                        )} */}
                      </div>
                    ))
                  ) : (
                    <h2 className="no_reuslt">No Result...</h2>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Navbar;
