import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Header from "../../components/Header";
import toast, { Toaster } from "react-hot-toast";
import { userRequest } from "../../requestMethod";
import { useSelector } from "react-redux";

const Supplier = () => {
  // @ts-ignore
  const user = useSelector((state) => state.user?.userInfo);
  const [suppliers, setSuppliers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteSupplierId, setDeleteSupplierId] = useState(null);
  const [newSupplierData, setNewSupplierData] = useState({
    supplierName: "",
    phone: "",
    address: "",
    email: "",
    ovhApiKey: "",
    ovhSecret: "",
    ovhConsumerKey: "",
    isOvh:false
  });
  const [editMode, setEditMode] = useState(false);
  const [editSupplierId, setEditSupplierId] = useState(null);
  const [showKeys, setShowKeys] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await userRequest.get("/fournisseur");
        setSuppliers(
          response.data.map((supplier) => ({
            id: supplier._id,
            nom: supplier.nom,
            telephone: supplier.telephone,
            adresse: supplier.adresse,
            email: supplier.email,
            ovhApiKey: supplier.ovhApiKey || "",
            ovhSecret: supplier.ovhSecret || "",
            ovhConsumerKey: supplier.ovhConsumerKey || "",
            isOvh:supplier.isOvh,
          }))
        );
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteSupplierId(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await userRequest.delete(`/fournisseur/${deleteSupplierId}`);
      setSuppliers(
        suppliers.filter((supplier) => supplier.id !== deleteSupplierId)
      );
      setOpenConfirmDialog(false);
      toast.success("Supplier deleted successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
    } catch (error) {
      console.error(error);
      toast.error("Error deleting supplier", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteSupplierId(null);
    setOpenConfirmDialog(false);
  };

  const handleAddSupplier = async () => {
    if (
      showKeys &&
      (!newSupplierData.ovhApiKey ||
        !newSupplierData.ovhSecret ||
        !newSupplierData.ovhConsumerKey)
    ) {
      setError(
        "ovhApiKey, ovhSecret, and ovhConsumerKey are required if the supplier is an OVH Fournisseur"
      );
      return;
    }

    try {
      const response = await userRequest.post("/fournisseur/create", {
        isOvh:showKeys,
        nom: newSupplierData.supplierName,
        telephone: newSupplierData.phone,
        adresse: newSupplierData.address,
        email: newSupplierData.email,
        ovhApiKey: newSupplierData.ovhApiKey,
        ovhSecret: newSupplierData.ovhSecret,
        ovhConsumerKey: newSupplierData.ovhConsumerKey,
      });
      setSuppliers([
        ...suppliers,
        {
          id: response.data._id,
          nom: response.data.nom,
          telephone: response.data.telephone,
          adresse: response.data.adresse,
          email: response.data.email,
        },
      ]);
      setOpenDialog(false);
      setNewSupplierData({
        supplierName: "",
        phone: "",
        address: "",
        email: "",
        ovhApiKey: "",
        ovhSecret: "",
        ovhConsumerKey: "",
        isOvh:false
      });
      setShowKeys(false);
      toast.success("Supplier added successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
    } catch (error) {
      console.error(error);
      toast.error("Error adding supplier", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const handleEditClick = (id) => {
    const supplier = suppliers.find((supplier) => supplier.id === id);
    setEditSupplierId(id);
    console.log(supplier.isOvh)
    setNewSupplierData({
      supplierName: supplier.nom,
      phone: supplier.telephone,
      address: supplier.adresse,
      email: supplier.email,
      ovhApiKey: supplier.ovhApiKey,
      ovhSecret: supplier.ovhSecret,
      ovhConsumerKey: supplier.ovhConsumerKey,
      isOvh:supplier.isOvh
    });
    setEditMode(true);
    setOpenDialog(true);
    setShowKeys(supplier.nom.includes("OVHcloud"));
  };

  const handleUpdateSupplier = async () => {
    if (
      showKeys &&
      (!newSupplierData.ovhApiKey ||
        !newSupplierData.ovhSecret ||
        !newSupplierData.ovhConsumerKey)
    ) {
      setError(
        "ovh Api Key, ovh Secret, and ovh Consumer Key are required if the supplier is an OVH Fournisseur"
      );
      return;
    }

    try {
      const response = await userRequest.patch(
        `/fournisseur/update/${editSupplierId}`,
        {
          nom: newSupplierData.supplierName,
          telephone: newSupplierData.phone,
          adresse: newSupplierData.address,
          email: newSupplierData.email,
          ovhApiKey: newSupplierData.ovhApiKey,
          ovhSecret: newSupplierData.ovhSecret,
          ovhConsumerKey: newSupplierData.ovhConsumerKey,
        }
      );

      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === editSupplierId
            ? {
                ...supplier,
                nom: response.data.nom,
                telephone: response.data.telephone,
                adresse: response.data.adresse,
                email: response.data.email,
              }
            : supplier
        )
      );

      setOpenDialog(false);
      setNewSupplierData({
        supplierName: "",
        phone: "",
        address: "",
        email: "",
        ovhApiKey: "",
        ovhSecret: "",
        ovhConsumerKey: "",
        isOvh:false
      });
      setEditMode(false);
      setEditSupplierId(null);
      toast.success("Supplier updated successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
    } catch (error) {
      console.error(error);
      toast.error("Error updating supplier", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100, flex: 0.7 },
    { field: "nom", headerName: "Supplier Name", flex: 0.7 },
    { field: "telephone", headerName: "Phone Number", flex: 0.7 },
    { field: "adresse", headerName: "Address", flex: 0.7 },
    { field: "email", headerName: "Email", flex: 0.7 },
    {
      ...(user?.isAdmin && {
        field: "actions",
        headerName: "Actions",
        width: 150,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => handleDeleteClick(row.id)}
                sx={{ color: "error.main" }}
              >
                <DeleteOutline />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                onClick={() => handleEditClick(row.id)}
                sx={{ color: "primary.main" }}
              >
                <EditOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      }),
    },
  ];

  return (
    <Box>
      <Toaster />
      <Header title="Suppliers" subTitle="List of suppliers" />
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        mb={2}
        px={2}
      >
        {user?.isAdmin && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            Add Supplier
          </Button>
        )}
      </Box>
      <Box sx={{ height: 650, width: "99%", mx: "auto" }}>
        <DataGrid
          slots={{ toolbar: GridToolbar }}
          rows={suppliers}
          // @ts-ignore
          columns={columns}
        />
      </Box>
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setNewSupplierData({
            supplierName: "",
            phone: "",
            address: "",
            email: "",
            ovhApiKey: "",
            ovhSecret: "",
            ovhConsumerKey: "",
            isOvh:false
          });
          setShowKeys(false);
        }}
      >
        <DialogTitle>
          {editMode ? "Edit Supplier" : "Add New Supplier"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Supplier Name"
            fullWidth
            value={newSupplierData.supplierName}
            onChange={(e) =>
              setNewSupplierData({
                ...newSupplierData,
                supplierName: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Supplier Email"
            fullWidth
            value={newSupplierData.email}
            onChange={(e) =>
              setNewSupplierData({ ...newSupplierData, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            value={newSupplierData.phone}
            onChange={(e) =>
              setNewSupplierData({ ...newSupplierData, phone: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Supplier Address"
            fullWidth
            value={newSupplierData.address}
            onChange={(e) =>
              setNewSupplierData({
                ...newSupplierData,
                address: e.target.value,
              })
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editMode ? newSupplierData.isOvh : showKeys}
                onChange={(e) => setShowKeys(e.target.checked)}
              />
            }
            label="OVH Supplier"
          />
          {editMode ? newSupplierData.isOvh : showKeys && (
            <>
              <TextField
                margin="dense"
                label="ovh Api Key"
                fullWidth
                value={newSupplierData.ovhApiKey}
                onChange={(e) =>
                  setNewSupplierData({
                    ...newSupplierData,
                    ovhApiKey: e.target.value,
                  })
                }
                required
                error={showKeys && !newSupplierData.ovhApiKey}
                helperText={
                  showKeys && !newSupplierData.ovhApiKey
                    ? "ovh Api Key is required"
                    : ""
                }
              />
              <TextField
                margin="dense"
                label="ovh Secret"
                fullWidth
                value={newSupplierData.ovhSecret}
                onChange={(e) =>
                  setNewSupplierData({
                    ...newSupplierData,
                    ovhSecret: e.target.value,
                  })
                }
                required
                error={showKeys && !newSupplierData.ovhSecret}
                helperText={
                  showKeys && !newSupplierData.ovhSecret
                    ? "ovh Secret is required"
                    : ""
                }
              />
              <TextField
                margin="dense"
                label="ovh Consumer Key"
                fullWidth
                value={newSupplierData.ovhConsumerKey}
                onChange={(e) =>
                  setNewSupplierData({
                    ...newSupplierData,
                    ovhConsumerKey: e.target.value,
                  })
                }
                required
                error={showKeys && !newSupplierData.ovhConsumerKey}
                helperText={
                  showKeys && !newSupplierData.ovhConsumerKey
                    ? "ovh Consumer Key is required"
                    : ""
                }
              />
            </>
          )}
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setNewSupplierData({
                supplierName: "",
                phone: "",
                address: "",
                email: "",
                ovhApiKey: "",
                ovhSecret: "",
                ovhConsumerKey: "",
                isOvh:false
              });
              setShowKeys(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={editMode ? handleUpdateSupplier : handleAddSupplier}>
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this supplier?
          </Typography>
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

export default Supplier;
