import React, { useState } from "react";
import {
  Button,
  TextField,
  Avatar,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { update } from "../../redux/apiCalls";
import { userRequest } from "../../requestMethod";
import toast, { Toaster } from "react-hot-toast";

const ProfilePageContainer = styled("div")({
  flexGrow: 1,
});

const AvatarImage = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  marginBottom: theme.spacing(2),
  marginLeft: "auto",
  marginRight: "auto",
  display: "block",
}));

const ProfileDialog = ({ open, handleClose }) => {
  // @ts-ignore
  const user = useSelector((state) => state?.user?.userInfo);
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(user?.image);
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updated, setUpdated] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State for the password dialog

  const [profileData, setProfileData] = useState({
    nom: user?.nom,
    prenom: user?.prenom,
    email: user?.email,
    num: user?.num,
    image: user?.image,
    isAdmin: user?.isAdmin,
    dateOfBirth: user?.dateOfBirth,
    password: user?.password,
    address: user?.address,
  });

  const handleEditPassword = async () => {
    try {
      await userRequest.patch("/user/change-password", {
        oldPassword,
        newPassword,
        repeatNewPassword: newPassword,
      });
      toast.success("Password updated successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
      handleCloseDialog();
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.log(error);
      setOldPassword("");
      setNewPassword("");
      toast.error("Error updating password", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const handleProfileDataChange = (event) => {
    const { name, value } = event.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleImageChange = (event) => {
    setUpdated(true);
    const image = event.target.files[0];
    const imageUrl = URL.createObjectURL(image);
    setProfileData({ ...profileData, image: image });
    setProfileImage(imageUrl);
  };

  const handleEditProfile = async () => {
    try {
      await update(dispatch, profileData);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Profile Page</DialogTitle>
      <DialogContent>
        <ProfilePageContainer>
          <AvatarImage
            src={updated ? profileImage : `http://localhost:3000/${profileImage}`}
            alt="Profile"
          />
          <Box display="flex" justifyContent="center" marginBottom={2}>
            <label htmlFor="upload-button">
              <Button variant="contained" component="span">
                Choose Picture
              </Button>
              <input
                id="upload-button"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </Box>
          <form>
            <TextField
              fullWidth
              label="Last Name"
              name="nom"
              value={profileData.nom}
              onChange={handleProfileDataChange}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="First Name"
              name="prenom"
              value={profileData.prenom}
              onChange={handleProfileDataChange}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="num"
              value={profileData.num}
              onChange={handleProfileDataChange}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleProfileDataChange}
              variant="outlined"
              margin="normal"
            />
            <Button onClick={handleOpenDialog}>Change Password</Button>

            <Box display="flex" justifyContent="center">
              <Button onClick={handleEditProfile} variant="contained" color="primary">
                Save
              </Button>
            </Box>
          </form>
        </ProfilePageContainer>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Old Password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEditPassword} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
      <Toaster />
    </Dialog>
  );
};

export default ProfileDialog;
