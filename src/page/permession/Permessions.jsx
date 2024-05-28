import React, { useState, useEffect } from "react";
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
  Checkbox,
  FormControl,
} from "@mui/material";
import Header from "../../components/Header";
import toast, { Toaster } from "react-hot-toast";
import { userRequest } from "../../requestMethod";

// Component for managing user permissions
const UserPermissionCard = ({ users, suppliers, fetchServicesBySuppliers }) => {
  const [userID, setUserID] = useState([]);
  const [supplierID, setSupplierID] = useState(null);
  const [services, setServices] = useState([]);
  const [serviceID, setServiceID] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSelectServices = (event, newValue) => {
    setServiceID(newValue);
  };

  const handleConfirmClose = async () => {
    try {
      for (const user of userID) {
        await userRequest.patch("/user/assignServicesToUser", {
          userId: user.value,
          serviceIds: serviceID.map((service) => service.value),
        });
      }
      toast.success("User permissions updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleConfirmOpen = () => {
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    handleConfirmClose();
    setDialogOpen(false);
  };

  return (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color={"#DAB30A"}>
          Add Permission for User
        </Typography>
        <Grid container spacing={2}>
          <Grid container item spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <Typography variant="body1" gutterBottom>
                  Enter the user name:
                </Typography>
                <Autocomplete
                  multiple
                  id="userID"
                  options={users}
                  value={userID}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  onChange={(event, newValue) => setUserID(newValue)}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox style={{ marginRight: 8 }} checked={selected} />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="User Name"
                      variant="filled"
                      fullWidth
                      required
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <Typography variant="body1" gutterBottom>
                  Enter the supplier name:
                </Typography>
                <Autocomplete
                  id="supplierID"
                  options={suppliers}
                  onChange={(event, newValue) => {
                    setSupplierID(newValue);
                    if (newValue) {
                      fetchServicesBySuppliers([newValue.value], setServices);
                    } else {
                      setServices([]);
                    }
                  }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox style={{ marginRight: 8 }} checked={selected} />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Supplier Name"
                      variant="filled"
                      fullWidth
                      required
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <Typography variant="body1" gutterBottom>
                  Enter the service name:
                </Typography>
                <Autocomplete
                  multiple
                  disabled={!supplierID}
                  id="serviceID"
                  options={services}
                  value={serviceID}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  onChange={handleSelectServices}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox style={{ marginRight: 8 }} checked={selected} />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Service Name"
                      variant="filled"
                      fullWidth
                      required
                      disabled={!supplierID}
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              onClick={handleConfirmOpen}
              variant="contained"
              color="primary"
              disabled={
                userID.length === 0 || !supplierID || serviceID.length === 0
              }
            >
              Confirm Permission For User
            </Button>
          </Grid>
        </Grid>
      </CardContent>

      <Dialog
        open={dialogOpen}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Permission Assignment
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to assign these services to the selected
            users?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

// Component for managing client permissions
const ClientPermissionCard = ({
  clients,
  suppliers,
  fetchServicesBySuppliers,
}) => {
  const [clientID, setClientID] = useState([]);
  const [supplierID2, setSupplierID2] = useState(null);
  const [services2, setServices2] = useState([]);
  const [serviceID2, setServiceID2] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSelectServices = (event, newValue) => {
    setServiceID2(newValue);
  };

  const handleConfirmClose = async () => {
    try {
      for (const client of clientID) {
        await userRequest.patch("/client/assignServicesToClient", {
          clientId: client.value,
          serviceIds: serviceID2.map((service) => service.value),
        });
      }
      toast.success("Client permissions updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleConfirmOpen = () => {
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    handleConfirmClose();
    setDialogOpen(false);
  };

  return (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color={"#DAB30A"}>
          Add Permission for Client
        </Typography>
        <Grid container spacing={2}>
          <Grid container item spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <Typography variant="body1" gutterBottom>
                  Enter the client name:
                </Typography>
                <Autocomplete
                  multiple
                  id="clientID"
                  options={clients}
                  value={clientID}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  onChange={(event, newValue) => setClientID(newValue)}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox style={{ marginRight: 8 }} checked={selected} />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Client Name"
                      variant="filled"
                      fullWidth
                      required
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <Typography variant="body1" gutterBottom>
                  Enter the supplier name:
                </Typography>
                <Autocomplete
                  id="supplierID2"
                  options={suppliers}
                  onChange={(event, newValue) => {
                    setSupplierID2(newValue);
                    if (newValue) {
                      fetchServicesBySuppliers([newValue.value], setServices2);
                    } else {
                      setServices2([]);
                    }
                  }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox style={{ marginRight: 8 }} checked={selected} />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Supplier Name"
                      variant="filled"
                      fullWidth
                      required
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <Typography variant="body1" gutterBottom>
                  Enter the service name:
                </Typography>
                <Autocomplete
                  multiple
                  disabled={!supplierID2}
                  id="serviceID2"
                  options={services2}
                  value={serviceID2}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  onChange={handleSelectServices}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox style={{ marginRight: 8 }} checked={selected} />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Service Name"
                      variant="filled"
                      fullWidth
                      required
                      disabled={!supplierID2}
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              onClick={handleConfirmOpen}
              variant="contained"
              color="primary"
              disabled={
                clientID.length === 0 || !supplierID2 || serviceID2.length === 0
              }
            >
              Confirm Permission For Client
            </Button>
          </Grid>
        </Grid>
      </CardContent>

      <Dialog
        open={dialogOpen}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Permission Assignment
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to assign these services to the selected
            clients?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

const Permessions = () => {
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, clientRes, supplierRes] = await Promise.all([
          userRequest.get("/user/allUsers"),
          userRequest.get("/client/getallclient"),
          userRequest.get("/fournisseur"),
        ]);
        console.log(userRes.data);
        setUsers(
          userRes.data.map((user) => ({
            label: user.nom + " " + user.prenom,
            value: user._id,
          }))
        );

        setClients(
          clientRes.data.map((client) => ({
            label: client.nom,
            value: client._id,
          }))
        );

        setSuppliers(
          supplierRes.data.map((supplier) => ({
            label: supplier.nom,
            value: supplier._id,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchServicesBySuppliers = async (supplierIds, setServicesState) => {
    try {
      const response = await userRequest.get(
        `/fournisseur/${supplierIds}/services`
      );
      setServicesState(
        response.data.map((service) => ({
          label: service.nom,
          value: service._id,
        }))
      );
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  return (
    <Box>
      <Toaster />
      <Header
        title="Customize Permissions"
        subTitle="Adjust permissions settings here"
      />
      <UserPermissionCard
        users={users}
        suppliers={suppliers}
        fetchServicesBySuppliers={fetchServicesBySuppliers}
      />
      <ClientPermissionCard
        clients={clients}
        suppliers={suppliers}
        fetchServicesBySuppliers={fetchServicesBySuppliers}
      />
    </Box>
  );
};

export default Permessions;
