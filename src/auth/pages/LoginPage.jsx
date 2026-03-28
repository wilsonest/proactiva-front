import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import * as React from "react";
import {
  Button,
  FormControl,
  Checkbox,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Link,
  Alert,
  IconButton,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";
import SignUp from "../components/SignUp";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const providers = [{ id: "credentials", name: "Email and Password" }];

function CustomEmailField() {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="Email"
      name="email"
      type="email"
      size="small"
      required
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle fontSize="inherit" />
            </InputAdornment>
          ),
        },
      }}
      variant="outlined"
    />
  );
}

function CustomPasswordField() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
      <InputLabel size="small" htmlFor="outlined-adornment-password">
        Password
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? "text" : "password"}
        name="password"
        size="small"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
            >
              {showPassword ? (
                <VisibilityOff fontSize="inherit" />
              ) : (
                <Visibility fontSize="inherit" />
              )}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  );
}

function CustomButton() {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2 }}
    >
      Log In
    </Button>
  );
}

function SignUpLink({ openModal }) {
  return (
    <Button variant="text" onClick={openModal}>
      Sign up
    </Button>
  );
}

function ForgotPasswordLink() {
  return (
    <Link href="/" variant="body2">
      Forgot password?
    </Link>
  );
}

function Title() {
  return <h2 style={{ marginBottom: 8 }}>Login</h2>;
}

function RememberMeCheckbox() {
  const theme = useTheme();
  return (
    <FormControlLabel
      label="Remember me"
      control={
        <Checkbox
          name="remember"
          value="true"
          color="primary"
          sx={{ padding: 0.5, "& .MuiSvgIcon-root": { fontSize: 20 } }}
        />
      }
      slotProps={{
        typography: {
          color: "textSecondary",
          fontSize: theme.typography.pxToRem(14),
        },
      }}
    />
  );
}

export function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const {login, userState: { errorMessage }, signUpWithEmail,} = useContext(UserContext);
  const [error, setErrorMessage] = useState("");
  const [openSignUpModal, setOpenSignUpModal] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);

  const providers = [{ id: "credentials", name: "Email and Password" }];

  async function crearUsuario(data) {
    console.log("data", data);
    try {
      const crearUsuario = await signUpWithEmail(data);
      console.log("responseSave", crearUsuario);
      setSuccessAlert(true); // <-- Mostrar alerta de éxito
      setOpenSignUpModal(false); // <-- Cerrar modal
    } catch (error) {
      console.error("Error al crear caso:", error);
    }
  }

  const onLoginUser = async (email, password, provider) => {
    setErrorMessage("");
    let isLogged = false;

    if (provider === "Email and Password") {
      isLogged = await login({ email, password });
    }

    if (!isLogged) {
      setErrorMessage("An error has occurred: " + (errorMessage || "Unknown"));
    } else {
      navigate("/", { replace: true });
    }
  };
  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={(provider, formData) =>
          onLoginUser(
            formData?.get("email"),
            formData?.get("password"),
            provider.name,
          )
        }
        slots={{
          title: Title,
          // subtitle: Subtitle,
          emailField: CustomEmailField,
          passwordField: CustomPasswordField,
          submitButton: CustomButton,
          signUpLink: SignUpLink,
          rememberMe: RememberMeCheckbox,
          forgotPasswordLink: ForgotPasswordLink,
        }}
        slotProps={{
          form: { noValidate: true },
          signUpLink: {
            openModal: () => setOpenSignUpModal(true),
          },
        }}
        providers={providers}
      />

      <SignUp
        open={openSignUpModal}
        onClose={() => setOpenSignUpModal(false)}
        onCreate={crearUsuario}
      />

      <Snackbar
        open={successAlert}
        autoHideDuration={4000}
        onClose={() => setSuccessAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessAlert(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Usuario creado satisfactoriamente
        </Alert>
      </Snackbar>
    </AppProvider>
  );
}
