import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import { Button, Link } from "@mui/material";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useState } from "react";
import { Title } from "../components/CustomTitle";
import { TextField } from "@mui/material";
import { Alert } from "@mui/material";
import { AlertTitle } from "@mui/material";

const providers = [
  { id: "credentials", name: "Email and Password" },
];
export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, userState: {errorMessage}} = useContext(UserContext);
  const [error, setErrorMessage] = useState("");

  const onLoginUser = async (email, password, provider) => {
    setErrorMessage("");
    let isLogged = false;

    if (provider === "Email and Password") {
      isLogged = await login({ email, password });      
    }

    if (!isLogged) {
      setErrorMessage("An error has occurred: "+ errorMessage);
    } else {
      navigate("/", { replace: true });
    }
  };

  function SignUpLink() {
    return (
      <Link href="/SignUp" variant="body2">
        Sign up
      </Link>
    );
  }

  function PasswordField() {
    return (
      <>
        <TextField
          required
          type="password"
          name="password"
          label="Password"
          size="small"
          variant="standard"
          InputProps={{
            style: { fontSize: "0.9rem" },
          }}
          InputLabelProps={{
            style: { fontSize: "0.9rem" },
          }}
        />
        <ErrorAlert />
      </>
    );
  }

  function ErrorAlert() {
    return error != "" ? (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    ) : null;
  }

  return (
    <>
      
          <SignInPage
            signIn={(provider, formData) =>
              onLoginUser(
                formData?.get("email"),
                formData?.get("password"),
                provider.name
              )
            }
            slotProps={{
              emailField: { variant: "standard", autoFocus: false },
              rememberMe: {
                control: (
                  <Checkbox
                    name="tandc"
                    value="true"
                    color="primary"
                    sx={{
                      padding: 0.5,
                      "& .MuiSvgIcon-root": { fontSize: 20 },
                    }}
                  />
                ),
              },
            }}
            slots={{
              title: Title,
              signUpLink: SignUpLink,
              passwordField: PasswordField,
              submitButton: ({ onClick }) => (
                <Button
                  type="submit"
                  onClick={onClick}
                  variant="outlined"
                  fullWidth
                >
                  Sign In
                </Button>
              ),
            }}
            providers={providers}
          />
      
    </>
  );
};
