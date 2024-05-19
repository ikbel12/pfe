import React, { useState } from "react";
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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Header from "../../components/Header";
import toast, { Toaster } from "react-hot-toast";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
const ReclamationForm = () => {
  const theme = useTheme();
  const [reclamations, setReclamations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteReclamationId, setDeleteReclamationId] = useState(null);
  const [newReclamationData, setNewReclamationData] = useState({
    subject: "",
    body: "",
    category: "",
    product: "",
    serviceName: "",
    subcategory: "",
    type: "",
    urgency: "",
    watchers: "",
  });

  const handleAddReclamation = () => {
    const newReclamation = {
      ...newReclamationData,
      id: Math.random().toString(36).substr(2, 9), // Generate a random ID
    };
    setReclamations([...reclamations, newReclamation]);
    setOpenDialog(false);
    toast.success("Reclamation added successfully", {
      duration: 4000,
      position: "top-center",
      style: { background: "green", color: "white" },
    });
  };

  const handleDeleteClick = (id) => {
    setDeleteReclamationId(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
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
  };

  const handleCancelDelete = () => {
    setDeleteReclamationId(null);
    setOpenConfirmDialog(false);
  };

  const columns = [
    { field: "ticketId", headerName: "Ticket ID", width: 120 },
    { field: "accountId", headerName: "Account ID", width: 120 },
    { field: "canBeClosed", headerName: "Can Be Closed", width: 150 },
    { field: "category", headerName: "Category", width: 120 },
    { field: "creationDate", headerName: "Creation Date", width: 150 },
    { field: "lastMessageFrom", headerName: "Last Message From", width: 180 },
    { field: "product", headerName: "Product", width: 120 },
    { field: "score", headerName: "Score", width: 100 },
    { field: "serviceName", headerName: "Service Name", width: 150 },
    { field: "state", headerName: "State", width: 120 },
    { field: "subject", headerName: "Subject", width: 180 },
    { field: "ticketNumber", headerName: "Ticket Number", width: 150 },
    { field: "type", headerName: "Type", width: 120 },
    { field: "updateDate", headerName: "Update Date", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#fff",
            color: theme.palette.error.main,
            "&:hover": {
              backgroundColor: theme.palette.error.main,
              color: "#fff",
            },
          }}
          size="small"
          startIcon={<DeleteOutline />}
          onClick={() => handleDeleteClick(row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Toaster />
      <Header title="Reclamations" subTitle="List of CLOUD Reclamations" />
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
          <TextField
            margin="dense"
            label="Subject"
            fullWidth
            value={newReclamationData.subject}
            onChange={(e) =>
              setNewReclamationData({
                ...newReclamationData,
                subject: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Body"
            fullWidth
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
          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={newReclamationData.category}
              onChange={(e) =>
                setNewReclamationData({
                  ...newReclamationData,
                  category: e.target.value,
                })
              }
              label="Category"
            >
              <MenuItem value="assistance">Assistance</MenuItem>
              <MenuItem value="billing">Billing</MenuItem>
              <MenuItem value="incident">Incident</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="product-label">Product</InputLabel>
            <Select
              labelId="product-label"
              id="product"
              value={newReclamationData.product}
              onChange={(e) =>
                setNewReclamationData({
                  ...newReclamationData,
                  product: e.target.value,
                })
              }
              label="Product"
            >
              <MenuItem value="adsl">ADSL</MenuItem>
              <MenuItem value="cdn">CDN</MenuItem>
              <MenuItem value="dedicated">Dedicated</MenuItem>
              <MenuItem value="dedicated-billing">Dedicated Billing</MenuItem>
              <MenuItem value="dedicated-other">Dedicated Other</MenuItem>
              <MenuItem value="dedicatedcloud">Dedicated Cloud</MenuItem>
              <MenuItem value="domain">Domain</MenuItem>
              <MenuItem value="exchange">Exchange</MenuItem>
              <MenuItem value="fax">Fax</MenuItem>
              <MenuItem value="hosting">Hosting</MenuItem>
              <MenuItem value="housing">Housing</MenuItem>
              <MenuItem value="iaas">IAAS</MenuItem>
              <MenuItem value="mail">Mail</MenuItem>
              <MenuItem value="network">Network</MenuItem>
              <MenuItem value="publiccloud">Public Cloud</MenuItem>
              <MenuItem value="sms">SMS</MenuItem>
              <MenuItem value="ssl">SSL</MenuItem>
              <MenuItem value="storage">Storage</MenuItem>
              <MenuItem value="telecom-billing">Telecom Billing</MenuItem>
              <MenuItem value="telecom-other">Telecom Other</MenuItem>
              <MenuItem value="vac">VAC</MenuItem>
              <MenuItem value="voip">VOIP</MenuItem>
              <MenuItem value="vps">VPS</MenuItem>
              <MenuItem value="web-billing">Web Billing</MenuItem>
              <MenuItem value="web-other">Web Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Service Name"
            fullWidth
            value={newReclamationData.serviceName}
            onChange={(e) =>
              setNewReclamationData({
                ...newReclamationData,
                serviceName: e.target.value,
              })
            }
          />
          <FormControl fullWidth>
            <InputLabel id="subcategory-label">Subcategory</InputLabel>
            <Select
              labelId="subcategory-label"
              id="subcategory"
              value={newReclamationData.subcategory}
              onChange={(e) =>
                setNewReclamationData({
                  ...newReclamationData,
                  subcategory: e.target.value,
                })
              }
              label="Subcategory"
            >
              <MenuItem value="alerts">Alerts</MenuItem>
              <MenuItem value="autorenew">Autorenew</MenuItem>
              <MenuItem value="bill">Bill</MenuItem>
              <MenuItem value="down">Down</MenuItem>
              <MenuItem value="inProgress">In Progress</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="other">Other</MenuItem>
              <MenuItem value="perfs">Perfs</MenuItem>
              <MenuItem value="start">Start</MenuItem>
              <MenuItem value="usage">Usage</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              value={newReclamationData.type}
              onChange={(e) =>
                setNewReclamationData({
                  ...newReclamationData,
                  type: e.target.value,
                })
              }
              label="Type"
            >
              <MenuItem value="criticalIntervention">
                Critical Intervention
              </MenuItem>
              <MenuItem value="genericRequest">Generic Request</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="urgency-label">Urgency</InputLabel>
            <Select
              labelId="urgency-label"
              id="urgency"
              value={newReclamationData.urgency}
              onChange={(e) =>
                setNewReclamationData({
                  ...newReclamationData,
                  urgency: e.target.value,
                })
              }
              label="Urgency"
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Watchers"
            fullWidth
            value={newReclamationData.watchers}
            onChange={(e) =>
              setNewReclamationData({
                ...newReclamationData,
                watchers: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddReclamation}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this reclamation?
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

export default ReclamationForm;
