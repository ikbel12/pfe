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
} from "@mui/material";
import Header from "../../components/Header";
import toast, { Toaster } from "react-hot-toast";
import { userRequest } from "../../requestMethod";

const PermissionUser = () => {
  const [services, setServices] = useState([]);
  const [serviceID, setServiceID] = useState([]);
  const [userID, setUserID] = useState([]);
  const [supplierID, setSupplierID] = useState([]);
  const [clientID, setClientID] = useState([]);
  const [dialogOpen, setDialogOpen] = useState({
    userID: false,
    supplierID: false,
    clientID: false,
  });
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userRequest.get("/service/getallservices");
        setServices(
          response.data.map((service) => ({
            label: service.nom,
            value: service._id,
          }))
        );
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await userRequest.get("/user/allUsers");
        setUsers(
          response.data.map((user) => ({
            label: user.nom,
            value: user._id,
          }))
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    const fetchClients = async () => {
      try {
        const response = await userRequest.get("/client/getallclient");
        setClients(
          response.data.map((client) => ({
            label: client.nom,
            value: client._id,
          }))
        );
      }
      catch (error) {
        console.error("Error fetching clients:", error);
      }
    }
    const fetchSuppliers = async () => {
      try {
        const response = await userRequest.get("/fournisseur");
        setSuppliers(
          response.data.map((supplier) => ({
            label: supplier.nom,
            value: supplier._id,
          }))
        );
      }
      catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    }
    fetchUsers();
    fetchClients();
    fetchSuppliers();
    fetchData();
  }, []);

  const handleConfirmClose = async(type) => {
    try {
      if(type === "userID") {
        for(const user of userID) {
          await userRequest.patch("/user/assignServicesToUser",{userId:user.value,serviceIds:serviceID.map(service => service.value)});
          toast.success("User permissions updated successfully");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else if(type === "supplierID") {
        for(const supplier of supplierID) {
          await userRequest.patch("/fournisseur/assignServicesToFournisseur",{fournisseurId:supplier.value,serviceIds:serviceID.map(service => service.value)});
          toast.success("Supplier permissions updated successfully");
          window.location.reload();
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else if(type === "clientID") {
        for(const client of clientID) {
          await userRequest.patch("/client/assignServicesToClient",{clientId:client.value,serviceIds:serviceID.map(service => service.value)});
          toast.success("Client permissions updated successfully");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleCancel = (type) => {
    setDialogOpen({ ...dialogOpen, [type]: false });
  };
  console.log(serviceID.map(service => service.value))
  const handleConfirmOpen = async(type) => {
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
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            onChange={(event, newValue) => setServiceID(newValue)}
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

          
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            Choose the User ID :
          </Typography>
          <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid item xs>
              <Autocomplete
                multiple
                id="userID"
                options={users}
                value={userID}
                onChange={(event, newValue) => setUserID(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="User Name"
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
                options={suppliers}
                value={supplierID}
                onChange={(event, newValue) => setSupplierID(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Supplier Name"
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
                options={clients}
                value={clientID}
                onChange={(event, newValue) => setClientID(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Client Name"
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
