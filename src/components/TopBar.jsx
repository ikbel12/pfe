import {
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  styled,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import { userRequest } from "../requestMethod";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
  // @ts-ignore
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const TopBar = ({ open, handleDrawerOpen, setMode }) => {
  const theme = useTheme();
  const [notification, setNotification] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const navigate = useNavigate();
  // @ts-ignore
  const user = useSelector((state) => state.user.userInfo);

  const [anchorEl, setAnchorEl] = useState(null);
  const openNotif = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchNotification = async () => {
    try {
      // Fetch notification data
      const response = await userRequest.get("/alerte/user");
      setNotification(response.data.alertes);
      setNotifCount(response.data.unreadAlertes.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      // Mark notification as read
      await userRequest.put(`/alerte/${id}/read`);
      const updatedNotifications = notification.map((notif) =>
        notif._id === id ? { ...notif, statut: "read" } : notif
      );
      setNotification(updatedNotifications);
      setNotifCount(
        updatedNotifications.filter((notif) => notif.statut === "unread").length
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSeeAllNotifications = () => {
    navigate("seeAlert");
    handleClose();
  };

  const displayedNotifications = notification
    .filter((notif) => notif.statut === "unread")
    .slice(0, 4);

  return (
    <AppBar
      position="fixed"
      // @ts-ignore
      open={open}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box flexGrow={1} />

        <Stack direction={"row"}>
          {theme.palette.mode === "light" ? (
            <IconButton
              onClick={() => {
                localStorage.setItem(
                  "currentMode",
                  theme.palette.mode === "dark" ? "light" : "dark"
                );
                setMode((prevMode) =>
                  prevMode === "light" ? "dark" : "light"
                );
              }}
              color="inherit"
            >
              <LightModeOutlinedIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => {
                localStorage.setItem(
                  "currentMode",
                  theme.palette.mode === "dark" ? "light" : "dark"
                );
                setMode((prevMode) =>
                  prevMode === "light" ? "dark" : "light"
                );
              }}
              color="inherit"
            >
              <DarkModeOutlinedIcon />
            </IconButton>
          )}
          <Badge
            badgeContent={notifCount}
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                top: 6,
                right: 6,
              },
            }}
          >
            <IconButton
              id="demo-positioned-button"
              aria-haspopup="true"
              onClick={handleClick}
              color="inherit"
            >
              <NotificationsOutlinedIcon />
            </IconButton>
          </Badge>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={openNotif}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {displayedNotifications.map((notif) => (
              <MenuItem key={notif._id} onClick={handleClose}>
                {notif.message}{" "}
                {notif.statut === "unread" && (
                  <Tooltip
                    title="Mark as read"
                    placement="top"
                    arrow
                    PopperProps={{
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -10], // Adjust the offset to reduce space between tooltip and icon
                          },
                        },
                      ],
                    }}
                  >
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleMarkAsRead(notif._id)}
                      sx={{
                        margin: 0,
                        padding: 0,
                        "&:hover": {
                          backgroundColor: theme.palette.action.selected, // Darker hover effect
                        },
                      }}
                    >
                      <DoneOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </MenuItem>
            ))}
            {notifCount === 0 && (
              <MenuItem onClick={handleClose}>No notifications</MenuItem>
            )}
            {notification.length > 1 && notifCount > 0 && (
              <MenuItem onClick={handleSeeAllNotifications}>
                See All alerts
              </MenuItem>
            )}
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
