import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  Button,
  Snackbar,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Header from "../../components/Header";

const ReclamationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const onSubmit = () => {
    console.log("doneeeeeeeeeeee");
    handleClick();
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirm = () => {
    onSubmit();
    setOpenDialog(false);
  };

  // Sample data for reclamations
  const reclamations = [
    { id: 1, name: "Reclamation 1", date: "2024-05-17" },
    { id: 2, name: "Reclamation 2", date: "2024-05-16" },
    { id: 3, name: "Reclamation 3", date: "2024-05-15" },
    { id: 1, name: "Reclamation 1", date: "2024-05-17" },
    { id: 2, name: "Reclamation 2", date: "2024-05-16" },
    { id: 3, name: "Reclamation 3", date: "2024-05-15" },
    { id: 1, name: "Reclamation 1", date: "2024-05-17" },
    { id: 2, name: "Reclamation 2", date: "2024-05-16" },
    { id: 1, name: "Reclamation 1", date: "2024-05-17" },
  ];

  return (
    <Box>
      <Header title="CREATE RECLAMATION" subTitle="Create a new reclamation" />
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          {/* Affichage des réclamations */}
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: 2,
              maxHeight: 600,
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Your Previous Reclamations
            </Typography>
            <Box>
              {reclamations.map((reclamation) => (
                <Box key={reclamation.id} sx={{ marginBottom: 1 }}>
                  <Typography variant="subtitle1">
                    {reclamation.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {reclamation.date}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          {/* Formulaire de création de réclamation */}
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              margin: 0, // Supprimer la marge
              padding: 2,
              border: "1px solid #ccc",
              borderRadius: 4,
              height: "100%",
            }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
          >
            <TextField
              {...register("firstName", { required: true, minLength: 3 })}
              label="First Name"
              variant="outlined"
            />

            <TextField
              {...register("lastName", { required: true, minLength: 3 })}
              label="Last Name"
              variant="outlined"
            />

            <TextField
              label="Title"
              variant="outlined"
              sx={{ width: "100%" }}
            />

            <TextField
              multiline
              rows={4}
              label="Description"
              variant="outlined"
              sx={{ width: "100%" }}
            />

            <TextField
              id="date"
              label="Date of Creation"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              sx={{ width: "100%" }}
            />

            <Box sx={{ textAlign: "right" }}>
              <Button
                type="button"
                variant="contained"
                sx={{ textTransform: "capitalize", marginRight: 1 }}
                onClick={handleOpenDialog}
              >
                Create New Reclamation
              </Button>

              <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                  Are you sure about the content of reclamation?
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Click Confirm to submit the reclamation.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button onClick={handleConfirm} autoFocus>
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReclamationForm;
