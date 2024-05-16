import React, { useState } from "react";
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
} from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Header from "../../components/Header";
import { rows } from "./data";

const Subscriptions = () => {
  const theme = useTheme();
  const [subscriptions, setSubscriptions] = useState(rows);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteSubscriptionId, setDeleteSubscriptionId] = useState(null);
  const [newSubscriptionData, setNewSubscriptionData] = useState({
    name: "",
    serviceName: "",
    supplierName: "",
    client: "",
    startDate: "",
    expiryDate: "",
    status: "Not expired",
  });

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "name",
      headerName: "Subscription Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "serviceName",
      headerName: "Service Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "supplierName",
      headerName: "Supplier Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "client",
      headerName: "Client",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "startDate",
      headerName: "Start date",
      headerAlign: "left",
      align: "left",
      width: 120,
    },
    {
      field: "expiryDate",
      headerName: "Expiry Date",
      headerAlign: "left",
      align: "left",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row: { status } }) => (
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
              status === "Expired"
                ? theme.palette.error.main // Red for Expired
                : status === "Not expired"
                ? theme.palette.success.main // Green for Not expired
                : "#3da58a",
          }}
        >
          {status === "Expired" && (
            <WarningAmberOutlinedIcon sx={{ color: "#fff" }} fontSize="small" />
          )}
          {status === "Not expired" && (
            <GppGoodOutlinedIcon sx={{ color: "#fff" }} fontSize="small" />
          )}
          <Typography sx={{ fontSize: "13px", color: "#fff" }}>
            {status}
          </Typography>
        </Box>
      ),
    },
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

  const handleAddSubscription = () => {
    const newSubscription = {
      id: subscriptions.length + 1,
      ...newSubscriptionData,
    };
    setSubscriptions([...subscriptions, newSubscription]);
    setOpenDialog(false);
    setNewSubscriptionData({
      name: "",
      serviceName: "",
      supplierName: "",
      client: "",
      startDate: "",
      expiryDate: "",
      status: "Not expired",
    });
  };

  const handleDeleteClick = (id) => {
    setDeleteSubscriptionId(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setSubscriptions(
      subscriptions.filter(
        (subscription) => subscription.id !== deleteSubscriptionId
      )
    );
    setOpenConfirmDialog(false);
  };

  const handleCancelDelete = () => {
    setDeleteSubscriptionId(null);
    setOpenConfirmDialog(false);
  };

  return (
    <Box>
      <Header title="Subscriptions" subTitle="List of CLOUD Subscriptions" />
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
          Create Subscription
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Subscription</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Subscription Name"
            fullWidth
            value={newSubscriptionData.name}
            onChange={(e) =>
              setNewSubscriptionData({
                ...newSubscriptionData,
                name: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Service Name"
            fullWidth
            value={newSubscriptionData.serviceName}
            onChange={(e) =>
              setNewSubscriptionData({
                ...newSubscriptionData,
                serviceName: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Supplier Name"
            fullWidth
            value={newSubscriptionData.supplierName}
            onChange={(e) =>
              setNewSubscriptionData({
                ...newSubscriptionData,
                supplierName: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Client"
            fullWidth
            value={newSubscriptionData.client}
            onChange={(e) =>
              setNewSubscriptionData({
                ...newSubscriptionData,
                client: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newSubscriptionData.startDate}
            onChange={(e) =>
              setNewSubscriptionData({
                ...newSubscriptionData,
                startDate: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Expiry Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newSubscriptionData.expiryDate}
            onChange={(e) =>
              setNewSubscriptionData({
                ...newSubscriptionData,
                expiryDate: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSubscription}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this subscription?
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

export default Subscriptions;
