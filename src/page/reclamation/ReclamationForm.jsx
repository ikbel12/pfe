import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Sync from "@mui/icons-material/Sync"; // Import the Sync icon
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import toast, { Toaster } from "react-hot-toast";
import { userRequest } from "../../requestMethod";
import Header from "../../components/Header";

const ReclamationForm = () => {
  const [reclamations, setReclamations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteReclamationId, setDeleteReclamationId] = useState(null);
  const [newReclamationData, setNewReclamationData] = useState({
    supplierName: [],
    serviceName: "",
    subject: "",
    body: "",
    category: "",
    product: "",
    subcategory: "",
    type: "",
    urgency: "",
    watchers: "",
  });
  const [suppliers, setSuppliers] = useState([]);
  const [services, setServices] = useState([]);

  // Fetch all reclamations
  const fetchReclamations = async () => {
    try {
      const response = await userRequest.get("/reclamation/getall");
      setReclamations(
        response.data.map((reclamation) => ({
          id: reclamation._id,
          subject: reclamation.subject,
          body: reclamation.body,
          category: reclamation.category,
          product: reclamation.product,
          serviceName: reclamation.serviceName,
          subcategory: reclamation.subcategory,
          type: reclamation.type,
          urgency: reclamation.urgency,
          watchers: reclamation.watchers,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, []);

  // Fetch all suppliers
  const fetchSuppliers = async () => {
    try {
      const response = await userRequest.get("/fournisseur/");
      setSuppliers(
        response.data.map((supplier) => ({
          value: supplier._id,
          label: supplier.nom,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);
  console.log("hello",newReclamationData.supplierName)
  // Fetch services when supplier changes
  useEffect(() => {
    if (newReclamationData.supplierName) {
      const fetchServices = async () => {
        try {
          const response = await userRequest.get(`/fournisseur/${newReclamationData.supplierName}/services`);
          setServices(
            response.data.map((service) => ({
              value: service._id,
              label: service.nom,
            }))
          );
        } catch (error) {
          console.log(error);
        }
      };
      fetchServices();
    } else {
      setServices([]);
    }
  }, [newReclamationData.supplierName]);

  const handleAddReclamation = async () => {
    try {
      await userRequest.post("/reclamation/create", {
        fournisseurId: newReclamationData.supplierName,
        category: newReclamationData.category || "billing",
        impact: "High",
        product: newReclamationData.product || "adsl",
        serviceName: newReclamationData.serviceName,
        subcategory: newReclamationData.subcategory,
        subject: newReclamationData.subject,
        type: newReclamationData.type || "criticalIntervention",
        urgency: newReclamationData.urgency,
      });
      toast.success("Reclamation created successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
      setOpenAddDialog(false);
      setOpenDialog(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to add reclamation", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteReclamationId(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await userRequest.delete(
        `/reclamation/${deleteReclamationId}`
      );
      toast.success("Reclamation deleted successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
      setOpenConfirmDialog(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Error deleting reclamation", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteReclamationId(null);
    setOpenConfirmDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReclamationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSupplierChange = (event, value) => {
    setNewReclamationData((prevData) => ({
      ...prevData,
      supplierName: value,
    }));
  };

  const handleServiceChange = (event, value) => {
    setNewReclamationData((prevData) => ({
      ...prevData,
      serviceName: value ? value.label : "",
    }));
  };

  const isFormValid = () => {
    const {
      supplierName,
      serviceName,
      subject,
      body,
      category,
      product,
      subcategory,
      type,
      urgency,
      watchers,
    } = newReclamationData;
    return (
      supplierName &&
      serviceName &&
      subject &&
      body &&
      category &&
      product &&
      subcategory &&
      type &&
      urgency &&
      watchers
    );
  };
  const columns = [
    { field: "id", headerName: "Reclamation ID", width: 180, flex: 0.5 },
    { field: "subject", headerName: "Subject", width: 180, flex: 0.35 },
    { field: "category", headerName: "Category", width: 180, flex: 0.35 },
    { field: "product", headerName: "Product", width: 180 },
    { field: "serviceName", headerName: "Service Name", width: 180 },
    { field: "type", headerName: "Type", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Box
          sx={{
            mt: 1,
            px: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Tooltip title="Delete Reclamation">
            <IconButton
              color="error"
              size="small"
              onClick={() => handleDeleteClick(row.id)}
            >
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Toaster />
      <Header title="Reclamations" subTitle="List of Reclamations" />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 2,
          px: 2,
        }}
      >
        <Tooltip title="Synchronize">
          <IconButton
            color="primary"
            onClick={fetchReclamations} // Call fetchReclamations to synchronize data
          >
            <Sync />
          </IconButton>
        </Tooltip>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          sx={{ ml: 2 }} // Added margin-left for spacing
        >
          Create OVH Reclamation
        </Button>
        <Button
          variant="contained"
          color="primary" // Changed from "secondary" to "primary"
          onClick={() => setOpenAddDialog(true)}
          sx={{ ml: 2 }}
        >
          Add Reclamation
        </Button>
      </Box>
      <Box sx={{ height: 650, width: "99%", mx: "auto" }}>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={reclamations}
          // @ts-ignore
          columns={columns}
        />
      </Box>
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Reclamation</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={suppliers}
            onChange={(event, value) => {
              setNewReclamationData((prevData) => ({
                ...prevData,
                supplierName: value.value,
              }));
            }
            }
            getOptionLabel={(option) => option.label}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox style={{ marginRight: 8 }} checked={selected} />
                {option.label}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Supplier Name" />
            )}
          />
          <Autocomplete
            options={services}
            onChange={(event, value) => {
              setNewReclamationData((prevData) => ({
                ...prevData,
                serviceName: value ? value.label : "",
              }));
            }
            }
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => <li {...props}>{option.label}</li>}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Service Name" />
            )}
          />
          <TextField
            margin="dense"
            label="Subject"
            name="subject"
            fullWidth
            value={newReclamationData.subject}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Body"
            name="body"
            fullWidth
            value={newReclamationData.body}
            onChange={handleChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleAddReclamation}
            color="primary"
            // disabled={!isFormValid()}
          >
            Add Reclamation
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create Reclamation</DialogTitle>
        <DialogContent>
        <Autocomplete
            options={suppliers}
            onChange={(event, value) => {
              setNewReclamationData((prevData) => ({
                ...prevData,
                supplierName: value.value,
              }));
            }
            }
            getOptionLabel={(option) => option.label}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox style={{ marginRight: 8 }} checked={selected} />
                {option.label}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Supplier Name" />
            )}
          />
          <Autocomplete
            options={services}
            onChange={(event, value) => {
              setNewReclamationData((prevData) => ({
                ...prevData,
                serviceName: value ? value.label : "",
              }));
            }
            }
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => <li {...props}>{option.label}</li>}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Service Name" />
            )}
          />
          <TextField
            margin="dense"
            label="Subject"
            name="subject"
            fullWidth
            value={newReclamationData.subject}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Body"
            name="body"
            fullWidth
            value={newReclamationData.body}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Category"
            name="category"
            fullWidth
            value={newReclamationData.category}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Product"
            name="product"
            fullWidth
            value={newReclamationData.product}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Subcategory"
            name="subcategory"
            fullWidth
            value={newReclamationData.subcategory}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              name="type"
              value={newReclamationData.type}
              onChange={handleChange}
            >
              <MenuItem value="Type 1">Type 1</MenuItem>
              <MenuItem value="Type 2">Type 2</MenuItem>
              <MenuItem value="Type 3">Type 3</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Urgency"
            name="urgency"
            fullWidth
            value={newReclamationData.urgency}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Watchers"
            name="watchers"
            fullWidth
            value={newReclamationData.watchers}
            onChange={handleChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleAddReclamation}
            color="primary"
            // disabled={!isFormValid()}
          >
            Add Reclamation
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this reclamation?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReclamationForm;
