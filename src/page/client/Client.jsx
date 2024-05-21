import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Header from "../../components/Header";
import toast, { Toaster } from "react-hot-toast";
import { userRequest } from "../../requestMethod";
import { useSelector } from "react-redux";

const Client = () => {
  const theme = useTheme();
  // @ts-ignore
  const user = useSelector((state) => state.user?.userInfo);
  const [clients, setClients] = useState([
    {
      id: "",
      nom: "",
      adresse: "",
      telephone: "",
      email: "",
      services: [],
    }
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState(null);
  const [services, setServices] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [selectedService, setSelectedService] = useState([]);
  const [newClientData, setNewClientData] = useState({
    nom: "",
    adresse: "",
    telephone: "",
    email: "",
    services: [],
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userRequest.get(
          "/service/getallservices"
        );
        setServices(response.data);
        setServiceOptions(
          response.data.map((service) => ({
            label: service.nom,
            value: service._id,
          }))
        )
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await userRequest.get("/client/getallclient");
        setClients(
          response.data.map(
            (
              /** @type {{ _id: any; nom: any; telephone: any; adresse: any; email: any; services: any; }} */ supplier
            ) => ({
              id: supplier._id,
              nom: supplier.nom,
              telephone: supplier.telephone,
              adresse: supplier.adresse,
              email: supplier.email,
              services: supplier.services.map((service) => service.nom).join(", "),
            })
          )
        );
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchClients();

    fetchData();
  }, []);





  const handleDeleteClick = async(id) => {
    try {
      await userRequest.delete(`/client/deleteclient/${id}`);
      toast.success("Client deleted successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
      window.location.reload();      
    } catch (error) {
      console.log(error);
      toast.error("Error deleting client", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const handleConfirmDelete = () => {
    setClients(clients.filter((client) => client.id !== deleteClientId));
    setOpenConfirmDialog(false);
    toast.success("Client deleted successfully", {
      duration: 4000,
      position: "top-center",
      style: { background: "green", color: "white" },
    });
  };

  const handleCancelDelete = () => {
    setDeleteClientId(null);
    setOpenConfirmDialog(false);
  };

  const handleAddClient = async () => {
    try {
      await userRequest.post("/client/create", {
        nom: newClientData.nom,
        telephone: newClientData.telephone,
        adresse: newClientData.adresse,
        email: newClientData.email,
        services: selectedService.map((service) => service.value),
      });

      setOpenDialog(false);
      setNewClientData({
        nom: "",
        telephone: "",
        adresse: "",
        email: "",
        services: []
      });
      toast.success("Supplier added successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Error adding supplier", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  }
  const columns = [
    { field: "id", headerName: "ID", width: 100, flex: 0.7 },
    { field: "nom", headerName: "Name", flex: 0.7 },
    { field: "adresse", headerName: "Address", flex: 0.7 },
    { field: "telephone", headerName: "Phone Number", flex: 0.7 },
    { field: "email", headerName: "Email", flex: 0.7 },
    { field: "services", headerName: "Services", flex: 0.7 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Button
          variant="contained"
          disabled={!user?.isAdmin}
          sx={{
            backgroundColor: theme.palette.error.main,
            color: "#fff",
            "&:hover": {
              backgroundColor: theme.palette.error.main,
            },
          }}
          size="small"
          startIcon={<DeleteOutline />}
          onClick={() => handleDeleteClick(row.id)}
        >
          Delete
        </Button>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Box>
      <Toaster />
      <Header title="Clients" subTitle="List of Clients" />
      {
        user?.isAdmin && (
          <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 2,
          px: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Add Client
        </Button>
      </Box>
        )
      }
      <Box sx={{ height: 650, width: "99%", mx: "auto" }}>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={clients}
          // @ts-ignore
          columns={columns}
        />
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newClientData.nom}
            onChange={(e) =>
              setNewClientData({
                ...newClientData,
                nom: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            value={newClientData.adresse}
            onChange={(e) =>
              setNewClientData({
                ...newClientData,
                adresse: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            value={newClientData.telephone}
            onChange={(e) =>
              setNewClientData({
                ...newClientData,
                telephone: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={newClientData.email}
            onChange={(e) =>
              setNewClientData({
                ...newClientData,
                email: e.target.value,
              })
            }
          />
          <Autocomplete
            multiple
            freeSolo
            value={selectedService}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            options={services.map((service) => ({
              label: service.nom,
              value: service._id, // ou tout autre identifiant unique si nécessaire
            }))}
            onChange={(event, newValue) => {
              setSelectedService(newValue);
            }
            }
            // loading={loading}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddClient}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this client?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Client;
