import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { login } from "../../redux/apiCalls";
import { Toaster } from "react-hot-toast";
import ResetDialog from "../../components/ResetDialog";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976D2",
    },
    secondary: {
      main: "#1976D2",
    },
    background: {
      default: "#f4f6f8",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "#1976D2",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "#1976D2",
          },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#1976D2",
            },
          },
        },
      },
    },
  },
});

function SignInSide() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [countSignIn, setCountSignIn] = useState(0);
  // @ts-ignore
  const user = useSelector((state) => state?.user?.userInfo);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const logined = await login(dispatch, { email, password });
      // @ts-ignore
      if(!logined) setCountSignIn(countSignIn + 1);
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setError(
        "Une erreur inattendue s'est produite. Veuillez réessayer plus tard."
      );
    }
  };

  const handleResetPasswordFormClick = () => {
    setOpenDialog(true);
  };

  const handleSignUpClick = () => {
    navigate("/SignUp");
  };

  useEffect(() => {
    if(countSignIn === 3) {
      setOpenDialog(true);
      setCountSignIn(0);
    }
  },[countSignIn])

  return (
    <ThemeProvider theme={theme}>
      <ResetDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(http://localhost:5173/assets/cloud.png)",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 13, // Adjusted margin to move the box lower
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: 3,
              padding: 4,
              borderRadius: 2,
              backgroundColor: "background.paper",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "8px",
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "8px",
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  padding: "10px 0",
                  backgroundColor: "secondary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "secondary.dark",
                  },
                  borderRadius: "8px",
                }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Button
                    onClick={handleResetPasswordFormClick}
                    sx={{ textTransform: "none" }}
                  >
                    Forgot password?
                  </Button>
                </Grid>
                <Grid item>
                  <Link
                    onClick={handleSignUpClick}
                    variant="body2"
                    sx={{ cursor: "pointer" }}
                  >
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Toaster />
    </ThemeProvider>
  );
}

export default SignInSide;
