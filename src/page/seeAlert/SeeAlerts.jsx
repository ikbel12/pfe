import React, { useEffect, useState } from "react";
import {
  Box,
  Alert,
  AlertTitle,
  Link,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import Header from "../../components/Header";
import toast, { Toaster } from "react-hot-toast";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { userRequest } from "../../requestMethod";

const initialAlertsData = [
  {
    severity: "warning",
    message: "A simple warning alert with an example link.",
    linkText: "example link",
  },
];

const SeeAlerts = () => {
  const [alertsData, setAlertsData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState(null);
  const theme = useTheme();

  const getBgColor = (severity) => {
    const isDarkMode = theme.palette.mode === "dark";
    switch (severity) {
      case "warning":
        return isDarkMode ? "#DAB30A" : "#F0C300";
      default:
        return "";
    }
  };
  useEffect(() => {
    const handleFetchAllAlerts = async () => {
      try {
        const response = await userRequest.get("/alerte/user");
        setAlertsData(response.data.alertes);
      } catch (error) {
        console.error(error);
      }
    };
    handleFetchAllAlerts();
  }, []);
  const handleRemoveAlert = async (index) => {
    try {
      await userRequest.delete(`/alerte/${alertsData[index]._id}`);
      toast.success("Alert deleted successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete alert");
    }
    setDialogOpen(false);
  };

  const handleOpenDialog = (index) => {
    setAlertToDelete(index);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setAlertToDelete(null);
  };

  return (
    <Box>
      <Toaster />
      <Header title="Alerts" subTitle="List of your all Alerts" />
      {alertsData.map((alert, index) => (
        <Box
          key={index}
          sx={{
            mb: 1,
            p: 2,
            borderRadius: 1,
            color: "white",
            bgcolor: getBgColor("warning"),
            position: "relative",
          }}
        >
          <IconButton
            size="small"
            sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
            onClick={() => handleOpenDialog(index)}
          >
            <ClearOutlinedIcon />
          </IconButton>
          <AlertTitle>A simple {alert.severity} alert</AlertTitle>
          {alert.message}{" "}
          <Link href="#" color="inherit" underline="always">
            {alert.linkText}
          </Link>
        </Box>
      ))}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this alert?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() => handleRemoveAlert(alertToDelete)}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SeeAlerts;
