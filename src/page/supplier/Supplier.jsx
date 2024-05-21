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

const Supplier = () => {
  const theme = useTheme();
  // @ts-ignore
  const user = useSelector((state) => state.user?.userInfo);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState([]);
  const [suppliers, setSuppliers] = useState([
    {
      id: "",
      nom: "",
      telephone: "",
      adresse: "",
      email: "",
      services: [],
    },

  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteSupplierId, setDeleteSupplierId] = useState(null);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [newSupplierData, setNewSupplierData] = useState({
    supplierName: "",
    phone: "",
    adress:"",
    email:"",
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

    const fetchSuppliers = async () => {
      try {
        const response = await userRequest.get("/fournisseur");
        setSuppliers(
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

    fetchSuppliers();
    fetchData();
  }, []);

  const handleDeleteClick = async(id) => {
    try {
      await userRequest.delete(`/fournisseur/${id}`);
      toast.success("Supplier deleted successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
      window.location.reload();      
    } catch (error) {
      console.log(error);
      toast.error("Error deleting supplier", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const handleConfirmDelete = () => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== deleteSupplierId));
    setOpenConfirmDialog(false);
    toast.success("Supplier deleted successfully", {
      duration: 4000,
      position: "top-center",
      style: { background: "green", color: "white" },
    });
  };

  const handleCancelDelete = () => {
    setDeleteSupplierId(null);
    setOpenConfirmDialog(false);
  };
  const handleAddSupplier = async () => {
    try {
      const response = await userRequest.post("/fournisseur/create", {
        nom: newSupplierData.supplierName,
        telephone: newSupplierData.phone,
        adresse: newSupplierData.adress,
        email: newSupplierData.email,
        services: selectedService.map((service) => service.value),
      });
      setSuppliers([
        ...suppliers,
        {
          id: response.data._id,
          nom: response.data.nom,
          telephone: response.data.telephone,
          adresse: response.data.adresse,
          email: response.data.email,
          services: response.data.services.map((service) => service.nom).join(", "),
        },
      ]);

      setOpenDialog(false);
      setNewSupplierData({
        supplierName: "",
        phone: "",
        adress:"",
        email:"",
        services: [],
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
    { field: "nom", headerName: "Supplier Name", flex: 0.7 },
    { field: "telephone", headerName: "Phone Number", flex: 0.7 },
    { field: "adresse", headerName: "Adress", flex: 0.7 },
    { field: "email", headerName: "Email", flex: 0.7 },
    { field: "services", headerName: "Service Name", flex: 0.7 },
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
      <Header title="Suppliers" subTitle="List of Suppliers" />
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
          Add Supplier
        </Button>
      </Box>
      )
     }
      <Box sx={{ height: 650, width: "99%", mx: "auto" }}>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={suppliers}
          // @ts-ignore
          columns={columns}
        />
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Supplier</DialogTitle>
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
              setNewSupplierData({
                ...newSupplierData,
                email: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            value={newSupplierData.phone}
            onChange={(e) =>
              setNewSupplierData({
                ...newSupplierData,
                phone: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Supplier Adress"
            fullWidth
            value={newSupplierData.adress}
            onChange={(e) =>
              setNewSupplierData({
                ...newSupplierData,
                adress: e.target.value,
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
          <Button onClick={handleAddSupplier}>Add</Button>
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
