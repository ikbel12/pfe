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

// Composant pour la gestion des permissions des utilisateurs
const UserPermissionCard = ({ users, suppliers, fetchServicesBySuppliers }) => {
  const [userID, setUserID] = useState([]);
  const [supplierID, setSupplierID] = useState("");
  const [services, setServices] = useState([]);
  const [serviceID, setServiceID] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSelectAll = (type, options, setValue, fetchServices) => {
    return (event, newValue) => {
      if (newValue.some((option) => option.value === "all")) {
        setValue(options.filter((option) => option.value !== "all"));
        if (type === "suppliers") {
          fetchServices(suppliers.map((supplier) => supplier.value));
        }
      } else {
        setValue(newValue);
        if (type === "suppliers") {
          fetchServices(newValue.map((supplier) => supplier.value));
        }
      }
    };
  };

  const handleSelectAllServices = (options, setValue) => {
    return (event, newValue) => {
      if (newValue.some((option) => option.value === "all")) {
        setValue(options.filter((option) => option.value !== "all"));
      } else {
        setValue(newValue);
      }
    };
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
                  onChange={handleSelectAll(
                    "users",
                    users,
                    setUserID,
                    () => {}
                  )}
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
                    fetchServicesBySuppliers([newValue.value], setServices);
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
                  disabled={supplierID.length === 0}
                  id="serviceID"
                  options={services}
                  value={serviceID}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  onChange={handleSelectAllServices(services, setServiceID)}
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
                      disabled={supplierID.length === 0}
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
                userID.length === 0 ||
                supplierID.length === 0 ||
                serviceID.length === 0
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

// Composant pour la gestion des permissions des clients
const ClientPermissionCard = ({
  clients,
  suppliers,
  fetchServicesBySuppliers,
}) => {
  const [clientID, setClientID] = useState([]);
  const [supplierID2, setSupplierID2] = useState("");
  const [services2, setServices2] = useState([]);
  const [serviceID2, setServiceID2] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSelectAll = (type, options, setValue, fetchServices) => {
    return (event, newValue) => {
      if (newValue.some((option) => option.value === "all")) {
        setValue(options.filter((option) => option.value !== "all"));
        if (type === "suppliers") {
          fetchServices(suppliers.map((supplier) => supplier.value));
        }
      } else {
        setValue(newValue);
        if (type === "suppliers") {
          fetchServices(newValue.map((supplier) => supplier.value));
        }
      }
    };
  };

  const handleSelectAllServices = (options, setValue) => {
    return (event, newValue) => {
      if (newValue.some((option) => option.value === "all")) {
        setValue(options.filter((option) => option.value !== "all"));
      } else {
        setValue(newValue);
      }
    };
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
                  onChange={handleSelectAll(
                    "clients",
                    clients,
                    setClientID,
                    () => {}
                  )}
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
                  
                  options={suppliers}
                  
                  onChange={(event, newValue) => {
                    setSupplierID2(newValue);
                    fetchServicesBySuppliers([newValue.value], setServices2);
                  }
                  }
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
                  id="serviceID2" // Unique ID for second card
                  options={services2} // Utilisation du deuxième état pour les services
                  value={serviceID2}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  onChange={handleSelectAllServices(services2, setServiceID2)}
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
                      disabled={supplierID2.length === 0}
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
                clientID.length === 0 ||
                supplierID2.length === 0 ||
                serviceID2.length === 0
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

const PermissionUser = () => {
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
            label: user.nom,
            value: user._id,
          }))
        );

        setClients(
          [{ label: "Select All", value: "all" }].concat(
            clientRes.data.map((client) => ({
              label: client.nom,
              value: client._id,
            }))
          )
        );

        setSuppliers(
          [{ label: "Select All", value: "all" }].concat(
            supplierRes.data.map((supplier) => ({
              label: supplier.nom,
              value: supplier._id,
            }))
          )
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
        `/fournisseur/${supplierIds}/services`,
      );
      setServicesState(
        [{ label: "Select All", value: "all" }].concat(
          response.data.map((service) => ({
            label: service.nom,
            value: service._id,
          }))
        )
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

export default PermissionUser;
