import React, { useState } from "react";
import { Box, Alert, AlertTitle, Link, useTheme, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import Header from "../../components/Header";
import { Toaster } from "react-hot-toast";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const initialAlertsData = [
  {
    severity: "warning",
    message: "A simple warning alert with an example link.",
    linkText: "example link",
  },
];

const SeeAlerts = () => {
  const [alertsData, setAlertsData] = useState(initialAlertsData);
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

  const handleRemoveAlert = (index) => {
    setAlertsData((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
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
      <Header title="Services" subTitle="List of services" />
      {alertsData.map((alert, index) => (
        <Box
          key={index}
          sx={{
            mb: 1,
            p: 2,
            borderRadius: 1,
            color: "white",
            bgcolor: getBgColor(alert.severity),
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

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
      >
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
