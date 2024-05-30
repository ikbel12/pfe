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

const UserPermissions = () => {
  const [users, setUsers] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({
    userId: null,
    serviceId: null,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userRequest.get("/user/getAllUsersWithServices");
        setUsers(response.data);
        console.log(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteService = async () => {
    const { userId, serviceId } = deleteInfo;
    console.log(serviceId);
    try {
      await userRequest.post(`/user/removeServiceFromUser`, {
        userId,
        serviceId,
      });
      toast.success("Service deleted successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });

      // Update the user list to reflect the removed service
      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (user._id === userId) {
            return {
              ...user,
              services: user.services.filter(
                (service) => service._id !== serviceId
              ),
            };
          }
          return user;
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
    setDeleteInfo({ userId: null, serviceId: null });
    setOpenConfirmDialog(false);
  };


  const rows = users.map((user) => {
    return user.services.map((service) => ({
      id: `${user._id}-${service._id}`,
      userId: user._id,
      firstName: user.prenom,
      lastName: user.nom,
      serviceName: service.nom,
      serviceId: service._id,
    }));
  }).flat();

  const columns = [
    {
      field: "userId",
      headerName: "User ID",
      flex: 1,
      renderCell: (params) => {
        const { userSpan } = params.row;
        return params.value ? (
          <Box
            sx={{ display: "flex", alignItems: "center" }}
            style={{ gridRowEnd: `span ${userSpan}` }}
          >
            {params.value}
          </Box>
        ) : null;
      },
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      renderCell: (params) => {
        const { userSpan } = params.row;
        return params.value ? (
          <Box
            sx={{ display: "flex", alignItems: "center" }}
            style={{ gridRowEnd: `span ${userSpan}` }}
          >
            {params.value}
          </Box>
        ) : null;
      },
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      renderCell: (params) => {
        const { userSpan } = params.row;
        return params.value ? (
          <Box
            sx={{ display: "flex", alignItems: "center" }}
            style={{ gridRowEnd: `span ${userSpan}` }}
          >
            {params.value}
          </Box>
        ) : null;
      },
    },
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
                  userId: params.row.userId,
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
      <Header title="Users Permissions" subTitle="List of permissions" />

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
            Are you sure you want to delete this service from this user?
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

export default UserPermissions;
