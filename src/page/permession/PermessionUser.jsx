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
  Grid,
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
  const [serviceID, setServiceID] = useState([]);
  const [userID, setUserID] = useState([]);
  const [supplierID, setSupplierID] = useState([]);
  const [clientID, setClientID] = useState([]);
  const [dialogOpen, setDialogOpen] = useState({
    userID: false,
    supplierID: false,
    clientID: false,
  });

  const handleConfirmClose = (type) => {
    setDialogOpen({ ...dialogOpen, [type]: false });
  };

  const handleCancel = (type) => {
    handleConfirmClose(type);
  };

  const handleConfirmOpen = (type) => {
    setDialogOpen({ ...dialogOpen, [type]: true });
  };

  const handleConfirmAction = (type) => {
    // Add logic for confirming settings
    handleConfirmClose(type);
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
          <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid item xs>
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
                  />
                )}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => handleConfirmOpen("userID")}
                sx={{ textTransform: "capitalize" }}
              >
                Confirm
              </Button>
            </Grid>
          </Grid>
          <Typography variant="body1" gutterBottom>
            Choose the Supplier ID :
          </Typography>
          <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid item xs>
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
                  />
                )}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => handleConfirmOpen("supplierID")}
                sx={{ textTransform: "capitalize" }}
              >
                Confirm
              </Button>
            </Grid>
          </Grid>
          <Typography variant="body1" gutterBottom>
            Choose the client ID :
          </Typography>
          <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid item xs>
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
                  />
                )}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => handleConfirmOpen("clientID")}
                sx={{ textTransform: "capitalize" }}
              >
                Confirm
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Dialog
        open={dialogOpen.userID}
        onClose={() => handleConfirmClose("userID")}
      >
        <DialogTitle id="alert-dialog-title">Confirm User ID</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure about your decision?
</DialogContentText>
</DialogContent>
<DialogActions>
<Button onClick={() => handleCancel("userID")}>Cancel</Button>
<Button onClick={() => handleConfirmAction("userID")} autoFocus>
Confirm
</Button>
</DialogActions>
</Dialog>
<Dialog
open={dialogOpen.supplierID}
onClose={() => handleConfirmClose("supplierID")}
>
<DialogTitle id="alert-dialog-title">Confirm Supplier ID</DialogTitle>
<DialogContent>
<DialogContentText id="alert-dialog-description">
Are you sure about your decision?
</DialogContentText>
</DialogContent>
<DialogActions>
<Button onClick={() => handleCancel("supplierID")}>Cancel</Button>
<Button onClick={() => handleConfirmAction("supplierID")} autoFocus>
Confirm
</Button>
</DialogActions>
</Dialog>
<Dialog
open={dialogOpen.clientID}
onClose={() => handleConfirmClose("clientID")}
>
<DialogTitle id="alert-dialog-title">Confirm Client ID</DialogTitle>
<DialogContent>
<DialogContentText id="alert-dialog-description">
Are you sure about your decision?
</DialogContentText>
</DialogContent>
<DialogActions>
<Button onClick={() => handleCancel("clientID")}>Cancel</Button>
<Button onClick={() => handleConfirmAction("clientID")} autoFocus>
Confirm
</Button>
</DialogActions>
</Dialog>
</Box>
);
};

export default PermissionUser;
