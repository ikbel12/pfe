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
  Checkbox,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import toast, { Toaster } from "react-hot-toast";
import { userRequest } from "../../requestMethod";
import Header from "../../components/Header";

const ReclamationForm = () => {
  const [reclamations, setReclamations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
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
  const [showOVHFields, setShowOVHFields] = useState(false);

  useEffect(() => {
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
    fetchReclamations();
  }, []);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await userRequest.get("/suppliers/getall");
        setSuppliers(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuppliers();
  }, []);

  const handleAddReclamation = async () => {
    try {
      const response = await userRequest.post("/reclamation/create", {
        ...newReclamationData,
        supplierName: newReclamationData.supplierName
          .map((supplier) => supplier.name)
          .join(", "),
      });
      toast.success("Reclamation created successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
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
        `/reclamation/delete-reclamation/${deleteReclamationId}`
      );
      toast.success("Reclamation deleted successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
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
    if (value.length > 0 && value[value.length - 1].name === "Select All") {
      const allSelected =
        newReclamationData.supplierName.length === suppliers.length;
      setNewReclamationData((prevData) => ({
        ...prevData,
        supplierName: allSelected ? [] : suppliers,
      }));
      setShowOVHFields(
        !allSelected &&
          suppliers.some((supplier) => supplier.name.includes("OVHcloud"))
      );
    } else {
      setNewReclamationData((prevData) => ({
        ...prevData,
        supplierName: value.filter(
          (supplier) => supplier.name !== "Select All"
        ),
      }));
    }
  };

  useEffect(() => {
    setShowOVHFields(
      newReclamationData.supplierName.some((supplier) =>
        supplier.name.includes("OVHcloud")
      )
    );
  }, [newReclamationData.supplierName]);

  const isFormValid = () => {
    const { supplierName, serviceName, subject, body } = newReclamationData;
    if (!supplierName.length || !serviceName || !subject || !body) {
      return false;
    }
    if (showOVHFields) {
      const { category, product, subcategory, type, urgency, watchers } =
        newReclamationData;
      return category && product && subcategory && type && urgency && watchers;
    }
    return true;
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Create Reclamation
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Reclamation</DialogTitle>
        <DialogContent>
          <Autocomplete
            multiple
            options={[{ name: "Select All" }, ...suppliers]}
            getOptionLabel={(option) => option.name}
            disableCloseOnSelect
            value={newReclamationData.supplierName}
            onChange={handleSupplierChange}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox style={{ marginRight: 8 }} checked={selected} />
                {option.name}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Supplier Name" />
            )}
          />
          <TextField
            margin="dense"
            label="Service Name"
            name="serviceName"
            fullWidth
            value={newReclamationData.serviceName}
            onChange={handleChange}
            required
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
          {showOVHFields && (
            <>
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
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={
              showOVHFields
                ? handleAddReclamation
                : () => {
                    // handle confirm reclamation
                  }
            }
            color="primary"
            disabled={!isFormValid()}
          >
            {showOVHFields ? "Add" : "Confirm Reclamation"}
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
