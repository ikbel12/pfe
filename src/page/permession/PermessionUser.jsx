import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  Button,
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
} from "@mui/material";
import Header from "../../components/Header";
import toast, { Toaster } from "react-hot-toast";

const PermissionUser = () => {
  const [services, setServices] = useState([
    { label: "Service 1", value: "1" },
    { label: "Service 2", value: "2" },
    { label: "Service 3", value: "3" },
  ]);
  const [selectedService, setSelectedService] = useState([]);
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(null);
  const [globalDays, setGlobalDays] = useState([]);
  const [additionalField, setAdditionalField] = useState([]);

  const [serviceID, setServiceID] = useState([]);
  const [userID, setUserID] = useState([]);
  const [supplierID, setSupplierID] = useState([]);
  const [clientID, setClientID] = useState([]);

  const handleConfirmClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    toast.success("Settings updated successfully!", {
      duration: 4000,
      position: "top-right",
    });
  };

  const handleCancel = () => {
    handleConfirmClose();
  };

  const handleConfirmOpen = () => {
    setOpen(true);
  };

  const handleSubmit = () => {
    handleConfirmClose();
    toast.success("Custom alert set successfully!", {
      duration: 4000,
      position: "top-right",
    });
  };

  return (
    <Box>
      <Toaster />
      <Header
        title="Customize User Permissions"
        subTitle="Adjust user permissions settings here"
      />
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="body1" gutterBottom>
            Enter the IDs of Services :
          </Typography>
          <Autocomplete
            multiple
            id="serviceID"
            options={services}
            value={serviceID}
            onChange={(event, newValue) => setServiceID(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Service ID"
                variant="filled"
                fullWidth
                sx={{ mb: 3 }}
              />
            )}
          />
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            Choose the User ID :
          </Typography>
          <Autocomplete
            multiple
            id="userID"
            options={[
              { label: "User 1", value: "1" },
              { label: "User 2", value: "2" },
              { label: "User 3", value: "3" },
            ]}
            value={userID}
            onChange={(event, newValue) => setUserID(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="User ID"
                variant="filled"
                fullWidth
                sx={{ mb: 3 }}
              />
            )}
          />
          <Typography variant="body1" gutterBottom>
            Choose the Supplier ID :
          </Typography>
          <Autocomplete
            multiple
            id="supplierID"
            options={[
              { label: "Supplier 1", value: "1" },
              { label: "Supplier 2", value: "2" },
              { label: "Supplier 3", value: "3" },
            ]}
            value={supplierID}
            onChange={(event, newValue) => setSupplierID(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Supplier ID"
                variant="filled"
                fullWidth
                sx={{ mb: 3 }}
              />
            )}
          />
          <Typography variant="body1" gutterBottom>
            Choose the client ID :
          </Typography>
          <Autocomplete
            multiple
            id="clientID"
            options={[
              { label: "Client 1", value: "1" },
              { label: "Client 2", value: "2" },
              { label: "Client 3", value: "3" },
            ]}
            value={clientID}
            onChange={(event, newValue) => setClientID(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Client ID"
                variant="filled"
                fullWidth
                sx={{ mb: 3 }}
              />
            )}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              onClick={handleConfirmOpen}
              sx={{ textTransform: "capitalize" }}
            >
              Confirm
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
        <DialogTitle id="alert-dialog-title">{"Confirm Settings"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure about the permession ?
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

export default PermissionUser;
