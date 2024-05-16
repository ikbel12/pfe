import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Alert, Button, Snackbar } from "@mui/material";
import { useForm } from "react-hook-form";
import Header from "../../components/Header";

const SettingAlert = () => {
  const { handleSubmit } = useForm();

  const [open, setOpen] = React.useState(false);

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

  return (
    <Box>
      <Header
        title="Customize Your Alert"
        subTitle="Adjust your alert settings here"
      />

      <Box
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
        noValidate
        autoComplete="off"
      >
        <p>
          Choose your date to receive an alert to remind you about the
          expiration of all your subscriptions .
        </p>
        <TextField label="Exp: 15 Days " variant="filled" />
        <TextField label="Address 2" variant="filled" />

        <Box sx={{ textAlign: "right" }}>
          <Button
            type="submit"
            sx={{ textTransform: "capitalize" }}
            variant="contained"
          >
            Save Changes
          </Button>

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
              Changes saved successfully
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingAlert;
