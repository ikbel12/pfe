import { Box, Button, CircularProgress, LinearProgress, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { publicRequest } from "../../requestMethod";

export default function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [alert, setAlert] = useState({show: false, message: '', type: ''});
  const [password, setPassword] = useState({ value: "", showPass: false, isValid: true });
  const [confPassword, setConfPassword] = useState({ value: "", showPass: false, isValid: true });
  const { search } = useLocation();


  // helper function for clearing the alert message after ms milliseconds
  const resetAlert = (ms) => {
    setTimeout(() => {
      setAlert({show: false, message: '', type: ''});
    }, ms);
  }

  const querys = {};
  for (const query of search.slice(1).split('&')) {
    const [key, value] = query.split('=');
    querys[key] = value;
  }
  
  // email input changes handler function
  const handlePasswordInputChanges = (e) => {
    setPassword((prevState) => ({
      ...prevState,
      value: e.target?.value
    }));
  }
  const handleConfPasswordInputChanges = (e) => {
    setConfPassword((prevState) => ({
      ...prevState,
      value: e.target?.value
    }));
  }

  const handleConfPasswordValidation = () => {
    setConfPassword((prevState) => ({
      ...prevState,
      isValid: prevState.value === password.value
    }));
  }

  // send button handler
  const sendButtonHandler = () => {
    setIsLoading(true);
    publicRequest.put(`/auth/create-password/${querys.token}`, {
      newPassword: password.value
    }).then((response) => {
      console.log(response);
      setAlert({ show: true, message: "Réinitialisation de votre mot de passe avec succés. On va vous rediriger vers la page d'authentification dans quelques secondes...", type: 'success'});
      setTimeout(() => { navigate('/'); }, 10_000);
    }).catch((error) => {
      console.log(error);
      if (error.code === 'ERR_BAD_REQUEST') {
        setAlert({ show: true, message: 'jeton invalide', type: 'error'});
      } else if (error.code === 'ERR_NETWORK') {
        setAlert({ show: true, message: 'Problem coté server 500', type: 'error'});
      } else {
        setAlert({ show: true, message: error.message, type: 'error'});
      }
      resetAlert(10_000);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  let userEmail;
  try {
    // decode the token and then parse it...
    userEmail = JSON.parse(atob(querys.token?.split('.')[1])).userEmail;
  } catch (error) {
    // token in the query does not exist or invalid set an error alert
    throw error;
  }

  return (
  <>
      <Box component="form" role="form">
        <Box mb={2}>
          <TextField
          fullWidth
              type="email"
              // size="large"
              value= {userEmail}
              // icon = {{component: <EmailIcon color = "customized" />, direction: "right" }}
              id="token-encoded-user-email"
          />
        </Box>
        <Box mb={2} id="create-password-box">
          <TextField
          fullWidth
              // onBlur = {handlePasswordValidation}
              error = {!password.isValid}
              onChange={handlePasswordInputChanges}
              type={password.showPass ? "text" : "password"}
              placeholder="mot de passe"
              autoComplete = "current-password"
              id="set-password-input"
          />
        </Box>
        <Box mb={2} id="confirm-password-box">
          <TextField
          fullWidth
            onBlur = {handleConfPasswordValidation}
            error = {!confPassword.isValid}
            onChange={handleConfPasswordInputChanges}
            type={confPassword.showPass ? "text" : "password"}
            placeholder="confirmer votre mot de passe"
            autoComplete = "current-password"
            id="confirm-password-input"
          />
        </Box>
        <Box mt={4} mb={1} display="flex" justifyContent="center">
          {
            isLoading ? <CircularProgress />
            : <Button
            variant="outlined"
                disabled={password.value === confPassword.value && password.value.length > 0 && confPassword.value.length > 0 ? false : true}
                 size="large" fullWidth id="set-password-button" onClick={sendButtonHandler}
              >
                Créez
              </Button>
          }
        </Box>
        { alert.show && <Typography m={4} color={alert.type} id="error-alert" fontWeight="bold" fontSize={15} style={{ textAlign: 'center' }} >{ alert.message } </Typography> }
        { alert.type === 'success' && <LinearProgress color="success" id="set-password-sucess-progress-bar" /> }
      </Box>
      </>
  )
}
