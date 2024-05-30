import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  Button,
  Snackbar,
  Autocomplete,
  Card,
  CardContent,
  Typography,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import Header from "../../components/Header";
import { userRequest } from "../../requestMethod";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const SettingAlert = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [days, setDays] = useState(null);
  const [globalDays, setGlobalDays] = useState(null);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [userSettings, setUserSettings] = useState(null);
  // @ts-ignore
  const user = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
       
          const response = await userRequest.get("/service/getserviceswithuser");
          setServices(response.data);
          setLoading(false);
        }

      catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const response = await userRequest.get(`/settings/${user._id}`);
      const settings = response.data;

      // Map service names to their IDs
      const serviceIdToNameMap = services.reduce((acc, service) => {
        acc[service._id] = service.nom;
        return acc;
      }, {});

      // Add service names to custom notifications
      const updatedCustomNotifications = settings.customNotifications.map(
        (notif) => ({
          ...notif,
          serviceName: serviceIdToNameMap[notif.serviceId],
        })
      );

      setUserSettings({
        ...settings,
        customNotifications: updatedCustomNotifications,
      });
      setSettingsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching user settings:", error);
      toast.error("Error fetching settings", {
        duration: 4000,
        position: "top-right",
      });
    }
  };

  const handleSettingsDialogClose = () => {
    setSettingsDialogOpen(false);
  };

  const handleConfirmClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    setConfirm(true);
    setOpen(false);
    try {
      const response = await userRequest.put(`/settings/${user._id}`, {
        globalNotificationDays: globalDays,
        customNotifications: [],
      });
      toast.success(response.data.message, {
        duration: 4000,
        position: "top-right",
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Error setting alert", {
        duration: 4000,
        position: "top-right",
      });
    }
  };

  const handleCancel = () => {
    setConfirm(false);
    handleConfirmClose(); // Ferme la boîte de dialogue lorsque Cancel est cliqué
  };

  const handleConfirmOpen = () => {
    setOpen(true);
  };

  const handleSubmit = async () => {
    handleConfirmClose();
    try {
      const response = await userRequest.put(`/settings/${user._id}`, {
        customNotifications: [
          {
            serviceId: selectedService,
            notificationDays: days,
          },
        ],
      });
      toast.success(response.data.message, {
        duration: 4000,
        position: "top-right",
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error setting alert:", error);
      toast.error("Error setting alert", {
        duration: 4000,
        position: "top-right",
      });
    }
  };

  return (
    <Box>
      <Toaster />
      <Header
        title="Customize Your Alert"
        subTitle="Adjust your alert settings here"
      />
      <Box sx={{ padding: 0.5 }}></Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={fetchUserSettings}
          sx={{ mb: 2, textTransform: "capitalize" }}
        >
          See All Your Settings
        </Button>
      </Box>
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color={"#DAB30A"}>
            Customize Your Global Alert :
          </Typography>
          <Typography variant="body1" gutterBottom>
            Choose your date to receive an alert to remind you about the
            expiration of all your services.
          </Typography>
          <TextField
            label="Number of days after which you will receive your global alert:"
            variant="filled"
            value={globalDays}
            onChange={(e) => setGlobalDays(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              onClick={handleConfirmOpen}
              sx={{ textTransform: "capitalize" }}
            >
              Customize for All
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color={"#DAB30A"}>
            Customize Your Alert For a Specific Service:
          </Typography>
          <Typography variant="body1" gutterBottom>
            To customize your Alert to remind you about the date of expiration
            for one service, enter your data here:
          </Typography>

          <Autocomplete
            options={services.map((service) => ({
              label: service.nom,
              value: service._id, // ou tout autre identifiant unique si nécessaire
            }))}
            onChange={(event, newValue) => {
              setSelectedService(newValue.value);
            }}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Service Name"
                variant="filled"
                fullWidth
                sx={{ mb: 3 }}
              />
            )}
          />

          <TextField
            label="Number of days after which you will receive your alert:"
            variant="filled"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
          />

          <Box sx={{ textAlign: "right" }}>
            <Button
              type="submit"
              sx={{ textTransform: "capitalize" }}
              variant="contained"
              onClick={handleSubmit}
            >
              Customize for One
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure about these number of days?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={settingsDialogOpen}
        onClose={handleSettingsDialogClose}
        aria-labelledby="settings-dialog-title"
        aria-describedby="settings-dialog-description"
      >
        <DialogTitle id="settings-dialog-title">{"Your Settings"}</DialogTitle>
        <DialogContent>
          {userSettings ? (
            <Box>
              <Typography variant="h6">
                Global Notification Days: {userSettings.globalNotificationDays}
              </Typography>
              <Typography variant="h6">Custom Notifications:</Typography>
              {userSettings.customNotifications.length > 0 ? (
                userSettings.customNotifications.map((notif) => (
                  <Box key={notif.serviceId} sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      Service ID: {notif.serviceId}
                    </Typography>
                    <Typography variant="body1">
                      Service Name: {notif.serviceName}
                    </Typography>
                    <Typography variant="body1">
                      Notification Days: {notif.notificationDays}
                    </Typography>
                    <Divider />
                  </Box>
                ))
              ) : (
                <Typography variant="body1">
                  No custom notifications set.
                </Typography>
              )}
            </Box>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingsDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingAlert;
