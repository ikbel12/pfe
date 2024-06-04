// @ts-nocheck
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
  useTheme,
  Grid,
  Tooltip,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import SyncIcon from "@mui/icons-material/Sync";
import {
  DeleteOutlineOutlined,
  EditOutlined,
  CloseOutlined,
} from "@mui/icons-material";
import Header from "../../components/Header";
import toast, { Toaster } from "react-hot-toast";
import { userRequest } from "../../requestMethod";

const ReclamationForm = () => {
  const theme = useTheme();
  const [reclamations, setReclamations] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [services, setServices] = useState([]);
  const [supplierID, setSupplierID] = useState(null);
  const [serviceID, setServiceID] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteReclamationId, setDeleteReclamationId] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [userDataToUpdate, setUserDataToUpdate] = useState({});
  const [newReclamationData, setNewReclamationData] = useState({
    supplierName: "",
    subject: "",
    body: "",
    category: "",
    product: "",
    serviceName: "",
    subcategory: "",
    type: "",
    urgency: "",
    watchers: "",
    fournisseurId: "",
  });

  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  const products = [
    { label: "ADSL", value: "adsl" },
    { label: "CDN", value: "cdn" },
    { label: "Dedicated", value: "dedicated" },
    { label: "Dedicated Billing", value: "dedicated-billing" },
    { label: "Dedicated Other", value: "dedicated-other" },
    { label: "Dedicated Cloud", value: "dedicatedcloud" },
    { label: "Domain", value: "domain" },
    { label: "Exchange", value: "exchange" },
    { label: "Fax", value: "fax" },
    { label: "Hosting", value: "hosting" },
    { label: "Housing", value: "housing" },
    { label: "IAAS", value: "iaas" },
    { label: "Mail", value: "mail" },
    { label: "Network", value: "network" },
    { label: "Public Cloud", value: "publiccloud" },
    { label: "SMS", value: "sms" },
    { label: "SSL", value: "ssl" },
    { label: "Storage", value: "storage" },
    { label: "Telecom Billing", value: "telecom-billing" },
    { label: "Telecom Other", value: "telecom-other" },
    { label: "VOIP", value: "voip" },
    { label: "VPS", value: "vps" },
    { label: "Web Billing", value: "web-billing" },
    { label: "Web Other", value: "web-other" },
    { label: "XDSL", value: "xdsl" },
  ];

  const categories = [
    { label: "Assistance", value: "assistance" },
    { label: "Billing", value: "billing" },
    { label: "Incident", value: "incident" },
  ];

  const subcategories = [
    { label: "Alerts", value: "alerts" },
    { label: "Autorenew", value: "autorenew" },
    { label: "Bill", value: "bill" },
    { label: "Down", value: "down" },
    { label: "In Progress", value: "inProgress" },
    { label: "New", value: "new" },
    { label: "Other", value: "other" },
    { label: "Perfs", value: "perfs" },
    { label: "Start", value: "start" },
    { label: "Usage", value: "usage" },
  ];

  const types = [
    { label: "Critical Intervention", value: "criticalIntervention" },
    { label: "Generic Request", value: "genericRequest" },
  ];

  const urgencies = [
    { label: "High", value: "high" },
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reclamationsRes, suppliersRes] = await Promise.all([
          userRequest.get("/reclamation/getall"),
          userRequest.get("/fournisseur"),
        ]);

        setReclamations(
          reclamationsRes.data.map((reclamation) => ({
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

        setSuppliers(
          suppliersRes.data.map((supplier) => ({
            value: supplier._id,
            label: supplier.nom,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleEditClick = (user) => {
    setUserDataToUpdate(user);
    setOpenUpdateDialog(true);
  };

  const handleCloseClick = async (id) => {
    try {
      await userRequest.post("reclamation/123/close");
      toast.success("Reclamation closed successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to close reclamation", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const fetchServicesBySupplier = async (supplierId) => {
    try {
      const response = await userRequest.get(
        `/fournisseur/${supplierId}/services`
      );
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
  const handleAddReclamation = async () => {
    setOpenDialog(false);
    try {
      const payload = {
        ...newReclamationData,
        fournisseurId: supplierID ? supplierID.value : "",
        serviceName: serviceID.map((service) => service.label).join(", "),
      };

      if (!showAdvancedFields) {
        delete payload.subcategory;
        delete payload.type;
        delete payload.urgency;
        delete payload.watchers;
      }

      await userRequest.post("/reclamation/create", payload);
      toast.success("Reclamation created successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
      await userRequest.delete(`/reclamation/${deleteReclamationId}`);
      setReclamations(
        reclamations.filter(
          (reclamation) => reclamation.id !== deleteReclamationId
        )
      );
      setOpenConfirmDialog(false);
      toast.success("Reclamation deleted successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
    } catch (error) {
      toast.error("Failed to delete reclamation", {
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

  const handleSelectServices = (event, newValue) => {
    setServiceID(newValue);
  };

  const handleSupplierChange = async (event, newValue) => {
    setSupplierID(newValue);
    setNewReclamationData({
      ...newReclamationData,
      fournisseurId: newValue ? newValue.value : "",
    });
    if (newValue) {
      await fetchServicesBySupplier(newValue.value);
      setShowAdvancedFields(newValue.label.toLowerCase().includes("ovhcloud"));
    } else {
      setServices([]);
      setShowAdvancedFields(false);
    }
  };

  const isFormValid = () => {
    const requiredFields = ["subject", "body"];
    return (
      requiredFields.every((field) => newReclamationData[field]) &&
      supplierID &&
      serviceID.length > 0
    );
  };

  const columns = [
    { field: "id", headerName: "ID reclamation", flex: 1 },
    { field: "serviceName", headerName: "Service Name", flex: 1 },
    { field: "subject", headerName: "Subject", flex: 1 },
    { field: "body", headerName: "Body", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "product", headerName: "Product", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <Tooltip title="Delete Reclamation" arrow>
            <IconButton
              onClick={() => handleDeleteClick(params.row.id)}
              style={{ color: "red" }}
            >
              <DeleteOutlineOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Reclamation" arrow>
            <IconButton
              onClick={() => handleEditClick(params.row)}
              sx={{ color: theme.palette.primary.main }}
            >
              <EditOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close Reclamation" arrow>
            <IconButton
              onClick={() => handleCloseClick(params.row.id)}
              style={{ color: "black" }}
            >
              <CloseOutlined />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleSyncClick = async () => {
    try {
      await userRequest.get("/sync/sync-reclamations");
      toast.success("Reclamations synchronized successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to synchronize reclamations", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };
  const handleUpdateReclamation = async () => {
    try {
      await userRequest.patch("/reclamation/123", userDataToUpdate);
      toast.success("Reclamation updated successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update reclamation", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };
  console.log(userDataToUpdate);
  return (
    <Box>
      <Toaster />
      <Header title="Reclamations" subTitle="List of CLOUD Reclamations" />{" "}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 2,
          px: 2,
          gap: 2, // Adds spacing between the buttons
        }}
      >
        <Tooltip title="Synchronize">
          <IconButton onClick={handleSyncClick} color="primary">
            <SyncIcon />
          </IconButton>
        </Tooltip>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutline />}
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
          columns={columns}
        />
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Reclamation</DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            gap="16px"
            width="500px"
            mt="10px"
          >
            <Autocomplete
              options={suppliers}
              getOptionLabel={(option) => option.label}
              onChange={handleSupplierChange}
              renderInput={(params) => (
                <TextField {...params} label="Select Supplier" required />
              )}
            />
            <Autocomplete
              multiple
              options={services}
              getOptionLabel={(option) => option.label}
              onChange={handleSelectServices}
              renderInput={(params) => (
                <TextField {...params} label="Select Service(s)" required />
              )}
            />
            <TextField
              label="Subject"
              required
              value={newReclamationData.subject}
              onChange={(e) =>
                setNewReclamationData({
                  ...newReclamationData,
                  subject: e.target.value,
                })
              }
            />
            <TextField
              label="Body"
              required
              multiline
              rows={4}
              value={newReclamationData.body}
              onChange={(e) =>
                setNewReclamationData({
                  ...newReclamationData,
                  body: e.target.value,
                })
              }
            />
            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.label}
              onChange={(event, newValue) =>
                setNewReclamationData({
                  ...newReclamationData,
                  category: newValue ? newValue.value : "",
                })
              }
              renderInput={(params) => (
                <TextField {...params} label="Category" />
              )}
            />
            <Autocomplete
              options={products}
              getOptionLabel={(option) => option.label}
              onChange={(event, newValue) =>
                setNewReclamationData({
                  ...newReclamationData,
                  product: newValue ? newValue.value : "",
                })
              }
              renderInput={(params) => (
                <TextField {...params} label="Product" />
              )}
            />
            {showAdvancedFields && (
              <>
                <Autocomplete
                  options={subcategories}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, newValue) =>
                    setNewReclamationData({
                      ...newReclamationData,
                      subcategory: newValue ? newValue.value : "",
                    })
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Subcategory" />
                  )}
                />
                <Autocomplete
                  options={types}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, newValue) =>
                    setNewReclamationData({
                      ...newReclamationData,
                      type: newValue ? newValue.value : "",
                    })
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Type" />
                  )}
                />
                <Autocomplete
                  options={urgencies}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, newValue) =>
                    setNewReclamationData({
                      ...newReclamationData,
                      urgency: newValue ? newValue.value : "",
                    })
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Urgency" />
                  )}
                />
                <TextField
                  label="Watchers"
                  value={newReclamationData.watchers}
                  onChange={(e) =>
                    setNewReclamationData({
                      ...newReclamationData,
                      watchers: e.target.value,
                    })
                  }
                  onFocus={() => setShowHint(true)}
                  onBlur={() => setShowHint(false)}
                  helperText={
                    showHint
                      ? "if you want to add more than one email the correct form is : ['email1',..,'email10']"
                      : ""
                  }
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleAddReclamation}
            color="primary"
            disabled={!isFormValid()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
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
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* ------------------------------------------------- UPDATE ---------------------------------------------- */}
      <Dialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
      >
        <DialogTitle>Edit Reclamation</DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            gap="16px"
            width="500px"
            mt="10px"
          >
            <TextField
              label="Subject"
              required
              value={userDataToUpdate?.subject}
              onChange={(e) =>
                setUserDataToUpdate({
                  ...userDataToUpdate,
                  subject: e.target.value,
                })
              }
            />
            <TextField
              label="Body"
              required
              multiline
              rows={4}
              value={userDataToUpdate?.body}
              onChange={(e) =>
                setUserDataToUpdate({
                  ...userDataToUpdate,
                  body: e.target.value,
                })
              }
            />
            <Autocomplete
              options={categories}
              defaultValue={userDataToUpdate?.category}
              defaultChecked={userDataToUpdate?.category}
              // getOptionLabel={(option) => option.label}
              onChange={(event, newValue) =>
                setUserDataToUpdate({
                  ...userDataToUpdate,
                  category: newValue ? newValue.value : "",
                })
              }
              renderInput={(params) => (
                <TextField {...params} label="Category" />
              )}
            />
            <Autocomplete
              options={products}
              // getOptionLabel={(option) => option.label}
              defaultValue={userDataToUpdate?.product}
              defaultChecked={userDataToUpdate?.product}
              onChange={(event, newValue) =>
                setUserDataToUpdate({
                  ...userDataToUpdate,
                  product: newValue ? newValue.value : "",
                })
              }
              renderInput={(params) => (
                <TextField {...params} label="Product" />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateReclamation} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReclamationForm;
