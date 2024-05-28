import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  IconButton,
  Autocomplete,
} from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import SyncIcon from "@mui/icons-material/Sync";
import Header from "../../components/Header";
import { userRequest } from "../../requestMethod";
import toast, { Toaster } from "react-hot-toast";

const Services = () => {
  const theme = useTheme();
  const [subscriptions, setSubscriptions] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [deleteSubscriptionId, setDeleteSubscriptionId] = useState(null);
  const [updateSubscriptionId, setUpdateSubscriptionId] = useState(null);
  const [editSubscriptionId, setEditSubscriptionId] = useState(null);
  const [newSubscriptionData, setNewSubscriptionData] = useState({
    nom: "",
    fournisseur: "",
    date_debut: new Date().toISOString().split("T")[0], // Initialisation au jour actuel ( 3awneny feha chat belhy zid shouf maaya)
    date_fin: "",
    type: "",
  });
  const [editSubscriptionData, setEditSubscriptionData] = useState({
    nom: "",
    fournisseur: "",
    date_debut: "",
    type: "",
  });
  const [expiryDate, setExpiryDate] = useState("");
  const [isAutocompleteSelected, setIsAutocompleteSelected] = useState(false);
  console.log(subscriptions);
  // Get the current date
  const today = new Date(newSubscriptionData.date_debut);
  today.setDate(today.getDate() + 1);
  // Format the date as YYYY-MM-DD
  const minDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await userRequest.get("/service/getAllServices");
        setSubscriptions(
          response.data.map((subscription) => ({
            id: subscription._id,
            nom: subscription.nom,
            fournisseur: subscription?.fournisseur?.nom,
            date_debut: subscription.date_debut,
            date_fin: subscription.date_fin,
            statut: subscription.statut,
            type: subscription.type,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await userRequest.get("/fournisseur");
        const filteredSuppliers = response.data
          .filter((supplier) => !supplier.nom.includes("OVHcloud"))
          .map((supplier) => ({
            value: supplier._id,
            label: supplier.nom,
          }));
        setSuppliers(filteredSuppliers);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSubscriptions();
    fetchSuppliers();
  }, []);
  console.log(newSubscriptionData);
  const columns = [
    { field: "id", headerName: "ID", width: 100, flex: 0.7 },
    {
      field: "nom",
      headerName: "Service Name",
      flex: 0.7,
    },
    {
      field: "type",
      headerName: "Service Type",
      flex: 0.5,
    },
    {
      field: "fournisseur",
      headerName: "Supplier Name",
      flex: 0.5,
    },
    {
      field: "date_debut",
      headerName: "Start Date",
      headerAlign: "left",
      align: "left",
      flex: 0.7,
      width: 120,
    },
    {
      field: "date_fin",
      headerName: "Expiry Date",
      headerAlign: "left",
      flex: 0.7,
      align: "left",
      width: 120,
    },
    {
      field: "statut",
      headerName: "Status",
      flex: 0.45,
      renderCell: ({ row: { statut } }) => (
        <Box
          sx={{
            p: "5px",
            width: "99px",
            borderRadius: "3px",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 1,
            backgroundColor:
              statut === "Expired"
                ? theme.palette.error.main
                : statut === "Active"
                ? theme.palette.success.main
                : "#3da58a",
          }}
        >
          {statut === "Expired" && (
            <WarningAmberOutlinedIcon sx={{ color: "#fff" }} fontSize="small" />
          )}
          {statut === "Active" && (
            <GppGoodOutlinedIcon sx={{ color: "#fff" }} fontSize="small" />
          )}
          <Typography sx={{ fontSize: "13px", color: "#fff" }}>
            {statut}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDeleteClick(row.id)}
              sx={{ color: theme.palette.error.main }}
            >
              <DeleteOutline />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => handleEditClick(row.id)}
              sx={{ color: theme.palette.primary.main }}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Update Expiry Date">
            <IconButton
              onClick={() => handleUpdateClick(row.id)}
              sx={{ color: theme.palette.warning.main }}
            >
              <UpdateOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleAddSubscription = async () => {
    const currentDate = new Date();
    const startDate = new Date(newSubscriptionData.date_debut);
    const endDate = newSubscriptionData.date_fin
      ? new Date(newSubscriptionData.date_fin)
      : null;

    let status = "Active";
    if (endDate && endDate < currentDate) {
      status = "Expired";
    }

    try {
      await userRequest.post("/service/create", {
        ...newSubscriptionData,
        fournisseurId: newSubscriptionData.fournisseur,
        statut: status,
      });

      setOpenDialog(false);
      toast.success("Service added successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add service", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteSubscriptionId(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await userRequest.delete(
        `/service/deleteService/${deleteSubscriptionId}`
      );
      setOpenConfirmDialog(false);
      toast.success("Service deleted successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
      setSubscriptions(
        subscriptions.filter(
          (subscription) => subscription.id !== deleteSubscriptionId
        )
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete service", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteSubscriptionId(null);
    setOpenConfirmDialog(false);
  };

  const handleEditClick = (id) => {
    const subscriptionToEdit = subscriptions.find((sub) => sub.id === id);
    setEditSubscriptionData({
      nom: subscriptionToEdit.nom,
      fournisseur: subscriptionToEdit.fournisseur,
      date_debut: subscriptionToEdit.date_debut,
      type: subscriptionToEdit.type,
    });
    setEditSubscriptionId(id);
    setOpenEditDialog(true);
  };

  const handleUpdateClick = (id) => {
    setUpdateSubscriptionId(id);
    setOpenUpdateDialog(true);
  };

  const handleConfirmUpdate = async () => {
    try {
      await userRequest.patch(`/service/renewService`, {
        numberOfMonths: expiryDate,
        serviceId: updateSubscriptionId,
      });
      setOpenUpdateDialog(false);
      toast.success("Service updated successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update service", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const handleCancelUpdate = () => {
    setUpdateSubscriptionId(null);
    setOpenUpdateDialog(false);
  };

  const handleConfirmEdit = async () => {
    try {
      await userRequest.patch(
        `/service/updateservice/${editSubscriptionId}`,
        editSubscriptionData
      );
      setOpenEditDialog(false);
      toast.success("Service edited successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
      setSubscriptions((prevSubscriptions) =>
        prevSubscriptions.map((subscription) =>
          subscription.id === editSubscriptionId
            ? { ...subscription, ...editSubscriptionData }
            : subscription
        )
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to edit service", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const handleCancelEdit = () => {
    setEditSubscriptionId(null);
    setOpenEditDialog(false);
  };

  const handleSyncClick = async () => {
    try {
      await userRequest.get("/service/import-ovh-services");
      toast.success("Services synchronized successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to synchronize services", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubscriptionData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAutocompleteChange = (event, newValue) => {
    if (newValue) {
      setNewSubscriptionData((prevData) => ({
        ...prevData,
        fournisseur: newValue.value,
      }));
      setIsAutocompleteSelected(true);
    } else {
      setNewSubscriptionData((prevData) => ({
        ...prevData,
        fournisseur: "",
      }));
      setIsAutocompleteSelected(false);
    }
  };

  return (
    <Box>
      <Toaster />
      <Header title="Services" subTitle="List of services" />
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Tooltip title="Synchronize">
          <IconButton onClick={handleSyncClick} color="primary">
            <SyncIcon />
          </IconButton>
        </Tooltip>
        <Button
          onClick={() => setOpenDialog(true)}
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
        >
          Add Service
        </Button>
      </Box>
      <Box sx={{ height: 650, width: "99%", mx: "auto" }}>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={subscriptions}
          // @ts-ignore
          columns={columns}
        />
      </Box>
      <Toaster />
      {/* Add Service Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Service</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={suppliers}
            getOptionLabel={(option) => option.label}
            onChange={handleAutocompleteChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Supplier Name"
                margin="dense"
                fullWidth
              />
            )}
          />
          <TextField
            margin="dense"
            label="Service Name"
            type="text"
            fullWidth
            value={newSubscriptionData.nom}
            onChange={(e) =>
              setNewSubscriptionData({
                ...newSubscriptionData,
                nom: e.target.value,
              })
            }
            disabled={!isAutocompleteSelected}
          />
          <TextField
            margin="dense"
            label="Service Type"
            type="text"
            fullWidth
            value={newSubscriptionData.type}
            onChange={(e) =>
              setNewSubscriptionData({
                ...newSubscriptionData,
                type: e.target.value,
              })
            }
            disabled={!isAutocompleteSelected}
          />
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={newSubscriptionData.date_debut}
            onChange={(e) =>
              setNewSubscriptionData({
                ...newSubscriptionData,
                date_debut: e.target.value,
              })
            }
            disabled={!isAutocompleteSelected}
          />
          <TextField
            margin="dense"
            label="Expiry Date"
            type="date"
            inputProps={{
              min: minDate,
            }}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={newSubscriptionData.date_fin}
            onChange={(e) =>
              setNewSubscriptionData({
                ...newSubscriptionData,
                date_fin: e.target.value,
              })
            }
            disabled={!isAutocompleteSelected}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddSubscription} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this subscription?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
      >
        <DialogTitle>Update Expiry Date</DialogTitle>
        <DialogContent>
          <TextField
            label="New Expiry Date"
            type="number"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Service</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Service Name"
            type="text"
            fullWidth
            value={editSubscriptionData.nom}
            onChange={(e) =>
              setEditSubscriptionData({
                ...editSubscriptionData,
                nom: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Service Type"
            type="text"
            fullWidth
            value={editSubscriptionData.type}
            onChange={(e) =>
              setEditSubscriptionData({
                ...editSubscriptionData,
                type: e.target.value,
              })
            }
          />
          {/*
          <TextField
            margin="dense"
            label="Supplier"
            type="text"
            fullWidth
            value={editSubscriptionData.fournisseur}
            onChange={(e) =>
              setEditSubscriptionData({
                ...editSubscriptionData,
                fournisseur: e.target.value,
              })
            }
          />*/}
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={editSubscriptionData.date_debut}
            onChange={(e) =>
              setEditSubscriptionData({
                ...editSubscriptionData,
                date_debut: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Services;
