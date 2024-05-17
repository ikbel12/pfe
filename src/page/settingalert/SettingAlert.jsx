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

const SettingAlert = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3000/api/service/getallservices"
        );
        setServices(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConfirmOpen = () => {
    setOpen(true);
  };

  const handleConfirmClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setConfirm(true);
    setOpen(false);
  };

  const handleCancel = () => {
    setConfirm(false);
    handleConfirmClose(); // Ferme la boîte de dialogue lorsque Cancel est cliqué
  };

  const handleSubmit = () => {
    console.log("Changes saved successfully");
    handleConfirmClose();
  };

  return (
    <Box>
      <Header
        title="Customize Your Alert"
        subTitle="Adjust your alert settings here"
      />
      <Box sx={{ padding: 0.5}}></Box>
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="body1" gutterBottom>
            Choose your date to receive an alert to remind you about the
            expiration of all your subscriptions.
          </Typography>
          <TextField
            label="Number of days after which you will receive your global alert:"
            variant="filled"
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
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            To customize your Alert to remind you about the date of expiration
            for one subscription, enter your data here:
          </Typography>

          <Autocomplete
            options={services.map((service) => ({
              label: service.nom,
              value: service._id, // ou tout autre identifiant unique si nécessaire
            }))}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Subscription Name"
                variant="filled"
                fullWidth
                sx={{ mb: 3 }}
              />
            )}
          />

          <TextField
            label="Number of days after which you will receive your alert:"
            variant="filled"
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

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={3000}
        onClose={handleConfirmClose}
      >
        <Typography
          variant="body1"
          gutterBottom
          sx={{ backgroundColor: "#2196F3", color: "white", p: 2 }}
        >
          {confirm ? "Changes saved successfully" : "Canceled!"}
        </Typography>
      </Snackbar>

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
    </Box>
  );
};

export default SettingAlert;
