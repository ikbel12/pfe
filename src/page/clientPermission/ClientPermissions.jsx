import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Header from "../../components/Header";
import toast, { Toaster } from "react-hot-toast";
import { userRequest } from "../../requestMethod";

const ClientPermissions = () => {
  const [clients, setClients] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({
    clientId: null,
    serviceId: null,
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await userRequest.get("/client/getallclient");
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const handleDeleteService = async () => {
    const { clientId, serviceId } = deleteInfo;
    try {
      await userRequest.post(`/client/remove-service-from-client`, {
        clientId,
        serviceId,
      });
      toast.success("Service deleted successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });

      // Update the client list to reflect the removed service
      setClients((prevClients) => {
        return prevClients.map((client) => {
          if (client._id === clientId) {
            return {
              ...client,
              services: client.services.filter(
                (service) => service._id !== serviceId
              ),
            };
          }
          return client;
        });
      });

      setOpenConfirmDialog(false);
    } catch (error) {
      console.log(error);
      toast.error("Error deleting service", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteInfo({ clientId: null, serviceId: null });
    setOpenConfirmDialog(false);
  };

  const preprocessedRows = (clients) => {
    const processedRows = [];
    clients.forEach((client) => {
      client.services.forEach((service) => {
        processedRows.push({
          id: `${client._id}-${service._id}`,
          clientId: client._id,
          clientName: client.nom,
          serviceId: service._id,
          serviceName: service.nom,
        });
      });
    });
    return processedRows;
  };

  const rows = preprocessedRows(clients);

  const columns = [
    { field: "clientId", headerName: "Client ID", flex: 1 },
    { field: "clientName", headerName: "Client Name", flex: 1 },
    { field: "serviceName", headerName: "Service Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <Tooltip title="Delete Service">
            <IconButton
              onClick={() => {
                setDeleteInfo({
                  clientId: params.row.clientId,
                  serviceId: params.row.serviceId,
                });
                setOpenConfirmDialog(true);
              }}
              sx={{ color: "error.main" }}
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
      <Header title="Clients permissions" subTitle="List of permissions" />

      <Box sx={{ height: 650, width: "99%", mx: "auto" }}>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={rows}
          // @ts-ignore
          columns={columns}
          getRowId={(row) => row.id}
        />
      </Box>
      <Toaster />

      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this service from this client?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleDeleteService} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientPermissions;
