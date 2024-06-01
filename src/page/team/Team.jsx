import React, { useMemo, useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import {
  AdminPanelSettingsOutlined,
  LockOpenOutlined,
  DeleteOutline,
  EditOutlined,
  UpdateOutlined,
} from "@mui/icons-material";
import Header from "../../components/Header";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { userRequest } from "../../requestMethod";

const Team = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [modifyRoleDialog, setModifyRoleDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToModifyRole, setUserToModifyRole] = useState("");
  const [newUserData, setNewUserData] = useState({
    prenom: "",
    nom: "",
    email: "",
    num: "",
    password: "",
    isAdmin: false,
  });
  const [newRole, setNewRole] = useState("User");

  const columns = useMemo(
    () => [
      {
        field: "_id",
        headerName: "Login ID",
        width: 100,
        align: "left",
        headerAlign: "left",
        flex: 0.7,
      },
      {
        field: "prenom",
        headerName: "First Name",
        flex: 0.25,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "nom",
        headerName: "Last Name",
        flex: 0.25,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "email",
        headerName: "Email",
        flex: 0.6,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "num",
        headerName: "Phone",
        flex: 0.4,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "isAdmin",
        headerName: "Access",
        flex: 0.25,
        align: "left",
        headerAlign: "left",
        renderCell: ({ row }) => {
          let icon;
          let backgroundColor;
          if (row.isAdmin) {
            icon = (
              <AdminPanelSettingsOutlined
                sx={{ color: "#fff" }}
                fontSize="small"
              />
            );
            backgroundColor = theme.palette.primary.dark;
          } else {
            icon = <LockOpenOutlined sx={{ color: "#fff" }} fontSize="small" />;
            backgroundColor = "#3da58a";
          }

          return (
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
                backgroundColor,
              }}
            >
              {icon}
              <Typography sx={{ fontSize: "13px", color: "#fff" }}>
                {row.isAdmin && row.isSuperAdmin ? "Super Admin" : row.isAdmin ? "Admin" : "User"}
              </Typography>
            </Box>
          );
        },
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
              display: `${row.isSuperAdmin ? "none" : "flex"}`,
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              
            }}
          >
             <Tooltip title="Delete">
            <IconButton
              color="error"
              size="small"
              onClick={() => handleDeleteUserClick(row._id)}
            >
              <DeleteOutline />
            </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleEditUserClick(row)}
            >
              <EditOutlined />
            </IconButton>
            </Tooltip>
            <Tooltip title="Modify Role">
            <IconButton
              size="small"
              onClick={() => handleModifyRoleClick(row._id)}
              sx={{ color: theme.palette.warning.main }}
            >
              <UpdateOutlined />
            </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [theme.palette.primary.dark]
  );

  const handleDeleteUserClick = (id) => {
    setUserToDelete(id);
    setConfirmDeleteDialog(true);
  };

  const handleDeleteUser = async () => {
    try {
      await userRequest.delete(`/user/${userToDelete}`);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userToDelete)
      );
      setConfirmDeleteDialog(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUserClick = (user) => {
    setUserToEdit(user);
    setEditUserDialog(true);
  };

  const handleEditUser = async () => {
    try {
      await userRequest.patch(`/user/update?id=${userToEdit._id}`, {
        prenom: userToEdit.prenom,
        nom: userToEdit.nom,
        email: userToEdit.email,
        num: userToEdit.num,
      });

      setEditUserDialog(false);
      setUserToEdit(null);
      fetchUsers();
    } catch (error) {
      console.error("Error editing user:", error);
      toast.error("Failed to edit user.", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const handleModifyRoleClick = (id) => {
    setUserToModifyRole(id);
    setModifyRoleDialog(true);
  };

  const handleModifyRole = async () => {
    try {
      console.log(newRole);
      await userRequest.patch(`/user/update-role/${userToModifyRole}`, {
        isAdmin: newRole === "User" ? false : true,
      });

      setModifyRoleDialog(false);
      setUserToModifyRole("");
      fetchUsers();
    } catch (error) {
      console.error("Error modifying user role:", error);
      toast.error("Failed to modify user role.", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/allUsers"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      await userRequest.post("/auth/register", newUserData);

      setOpenDialog(false);
      setNewUserData({
        prenom: "",
        nom: "",
        email: "",
        num: "",
        password: "",
        isAdmin: false,
      });

      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error(error.response.data, {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  return (
    <Box>
      <Toaster />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          px: 2,
        }}
      >
        <Header title={"TEAM"} subTitle={"Managing the Team Members"} />
        <Box sx={{ marginLeft: "auto" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            Create User
          </Button>
        </Box>
      </Box>
     
      <Box sx={{ height: 600, mx: "auto", overflowY: "auto" }}>
        <DataGrid
        slots={{
          toolbar: GridToolbar,
        }}
          rows={users}
          // @ts-ignore
          columns={columns}
          rowHeight={38}
          autoHeight
          getRowId={(row) => row._id}
        />
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            fullWidth
            value={newUserData.prenom}
            onChange={(e) =>
              setNewUserData({ ...newUserData, prenom: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={newUserData.nom}
            onChange={(e) =>
              setNewUserData({ ...newUserData, nom: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUserData.email}
            onChange={(e) =>
              setNewUserData({ ...newUserData, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            value={newUserData.num}
            onChange={(e) =>
              setNewUserData({ ...newUserData, num: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newUserData.password}
            onChange={(e) =>
              setNewUserData({ ...newUserData, password: e.target.value })
            }
          />
          <TextField
            select
            margin="dense"
            label="Access"
            fullWidth
            value={newUserData.isAdmin ? "Admin" : "User"}
            onChange={(e) =>
              setNewUserData({
                ...newUserData,
                isAdmin: e.target.value === "Admin",
              })
            }
            sx={{ marginBottom: "15px" }}
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddUser}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmDeleteDialog}
        onClose={() => setConfirmDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialog(false)}>Cancel</Button>
          <Button
            sx={{
              backgroundColor: "#fff",
              color: "red",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            onClick={handleDeleteUser}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editUserDialog} onClose={() => setEditUserDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            fullWidth
            value={userToEdit?.prenom}
            onChange={(e) =>
              setUserToEdit({ ...userToEdit, prenom: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={userToEdit?.nom}
            onChange={(e) =>
              setUserToEdit({ ...userToEdit, nom: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={userToEdit?.email}
            onChange={(e) =>
              setUserToEdit({ ...userToEdit, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            value={userToEdit?.num}
            onChange={(e) =>
              setUserToEdit({ ...userToEdit, num: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUserDialog(false)}>Cancel</Button>
          <Button onClick={handleEditUser}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={modifyRoleDialog}
        onClose={() => setModifyRoleDialog(false)}
      >
        <DialogTitle>Modify User Role</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="User ID"
            fullWidth
            value={userToModifyRole}
            onChange={(e) => setUserToModifyRole(e.target.value)}
          />
          <TextField
            select
            margin="dense"
            label="Role"
            fullWidth
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            sx={{ marginBottom: "15px" }}
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModifyRoleDialog(false)}>Cancel</Button>
          <Button onClick={handleModifyRole}>Modify</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Team;
