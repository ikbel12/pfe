import React, { useState } from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Avatar, styled, useTheme, Typography, Tooltip } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { HomeOutlined } from "@mui/icons-material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import Diversity1OutlinedIcon from "@mui/icons-material/Diversity1Outlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import NotificationImportantOutlinedIcon from "@mui/icons-material/NotificationImportantOutlined";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/apiCalls";
import ProfileDialog from "../page/profile/ProfileDialog";
import EditNotificationsOutlinedIcon from "@mui/icons-material/EditNotificationsOutlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
  // @ts-ignore
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Array1 = [
  { text: "Dashboard", icon: <HomeOutlinedIcon />, path: "/home" },
  {
    text: "Suppliers List",
    icon: <ContactsOutlinedIcon />,
    path: "supplier",
  },
  {
    text: "Services List",
    icon: <LocalActivityOutlinedIcon />,
    path: "services",
  },
  {
    text: "Clients List",
    icon: <Diversity1OutlinedIcon />,
    path: "client",
  },
  {
    text: "Reclamation Form",
    icon: <ReportProblemOutlinedIcon />,
    path: "reclamation",
  },
  {
    text: "Setting Alert",
    icon: <EditNotificationsOutlinedIcon />,
    path: "alertsetting",
  },

  {
    text: " See All Alerts",
    icon: <NotificationImportantOutlinedIcon />,
    path: "seeAlert",
  },
  {
    text: " See All Bills",
    icon: <PointOfSaleOutlinedIcon />,
    path: "facture",
  },
];

const Array2 = [
  { text: "Manage Team", icon: <PeopleOutlinedIcon />, path: "team" },
  {
    text: "Add Permessions ",
    icon: <AddTaskOutlinedIcon />,
    path: "permession",
  },
  {
    text: "User Permessions ",
    icon: <PersonAddAlt1OutlinedIcon />,
    path: "userPermession",
  },
  {
    text: "Client Permessions ",
    icon: <GroupAddOutlinedIcon />,
    path: "clientPermission",
  },
];

const Array4 = [
  {
    text: "logout",
    icon: <ExitToAppOutlinedIcon />,
    path: "/",
    function: "logout",
  },
];

const SideBar = ({ open, handleDrawerClose, user }) => {
  let location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false); // State for ProfileDialog

  const handleProfileDialogOpen = () => {
    setProfileDialogOpen(true);
  };

  const handleProfileDialogClose = () => {
    setProfileDialogOpen(false);
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader sx={{ display: "flex", alignItems: "center" }}>
        {open && (
          <img
            src="/assets/MedianetLogo.png"
            alt="Logo"
            style={{
              maxWidth: "85%",
              height: "auto",
              transition: open ? "" : "max-width 0.25s ease-out",
            }}
          />
        )}
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Avatar
        sx={{
          mx: "auto",
          width: open ? 90 : 50,
          height: open ? 90 : 50,
          my: 1,
          border: "2px solid grey",
          transition: "0.25s",
        }}
        alt="Remy Sharp"
        src={`http://localhost:3000/${user?.image}`}
      />
      <Typography
        align="center"
        sx={{
          fontSize: open ? 17 : 0,
          transition: "0.25s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer", // Add cursor pointer for click indication
          opacity: open ? 1 : 0, // Contrôle de l'opacité
        }}
        onClick={handleProfileDialogOpen} // Open ProfileDialog on click
      >
        <Tooltip title="Modify" arrow>
          <PersonOutlinedIcon
            sx={{ fontSize: 17, mr: 1, transition: "0.25s" }}
            onClick={handleProfileDialogOpen} // Open ProfileDialog on click
            style={{ cursor: "pointer" }} // Add cursor pointer for click indication
          />
        </Tooltip>
        {`${user?.prenom} ${user?.nom}`}
      </Typography>
      <Typography
        align="center"
        sx={{
          fontSize: open ? 15 : 0,
          transition: "0.25s",
          color: theme.palette.info.main,
        }}
      >
        {user?.isAdmin && user?.isSuperAdmin
          ? "Super Admin"
          : user?.isAdmin
          ? "Admin"
          : "User"}
      </Typography>

      <Divider />
      <List>
        {Array1.map((item) => {
          if (item.path === "facture" && !user.isAdmin) return null;
          if (item.text === "Dashboard" && !user.isAdmin) return null;
          return (
            <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
              <Tooltip title={open ? null : item.text} placement="left">
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                  }}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    bgcolor:
                      location.pathname === item.path
                        ? theme.palette.mode === "dark"
                          ? grey[800]
                          : grey[300]
                        : null,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      <List>
        {Array2.map((item) => {
          if (item.path === "team" && !user.isAdmin) return;
          if (item.path === "permession" && !user.isAdmin) return;
          if (item.path === "clientPermission" && !user.isAdmin) return;
          if (item.path === "userPermession" && !user.isAdmin) return;
          // check if the role of user = admin
          return (
            <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
              <Tooltip title={open ? null : item.text} placement="left">
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                  }}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    bgcolor:
                      location.pathname === item.path
                        ? theme.palette.mode === "dark"
                          ? grey[800]
                          : grey[300]
                        : null,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
      {user.isAdmin && <Divider sx={{ mt: 2, mb: 2 }} />}

      <List>
        {Array4.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
            <Tooltip title={open ? null : item.text} placement="left">
              <ListItemButton
                onClick={() => {
                  if (item.function === "logout") {
                    logout(dispatch);
                  } else {
                    navigate(item.path);
                  }
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  bgcolor:
                    location.pathname === item.path
                      ? theme.palette.mode === "dark"
                        ? grey[800]
                        : grey[300]
                      : null,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      {/* Add the ProfileDialog component */}
      <ProfileDialog
        open={profileDialogOpen}
        handleClose={handleProfileDialogClose}
      />
    </Drawer>
  );
};

export default SideBar;
