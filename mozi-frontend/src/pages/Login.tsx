import React, { KeyboardEvent, useEffect, useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Container,
  Typography,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../components/AlertComponent";
import { useTranslation } from "react-i18next";
import { useApiContext } from "../api/ApiContext";
import { FormikErrors, useFormik } from "formik";

interface Values {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const context = useApiContext();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      const email = values.email;
      const password = values.password;
      const logedIn = await context.logIn(email, password);
      if (logedIn) navigate("/");
      else {
        setAlertType("error");
        const msg = t("login.invalidLogin");
        setAlertMessage(msg);
        setIsOpenAlert(true);
      }
    },
    validate: (values) => {
      let errors: FormikErrors<Values> = {};
      if (!values.email) {
        const msg = t("formikErrors.emailReq");
        errors.email = msg;
      }
      if (!values.password) {
        const msg = t("formikErrors.passwordReq");
        errors.password = msg;
      }
      return errors;
    },
  });

  useEffect(() => {
    if (localStorage.getItem("user-info")) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <AlertComponent
        isOpenAlert={isOpenAlert}
        setIsOpenAlert={setIsOpenAlert}
        alertMessage={alertMessage}
        alertType={alertType}
        setAlertType={setAlertType}
      />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{ m: 1, bgcolor: "secondary.main", color: "text.secondary" }}
          >
            <LockIcon />
          </Avatar>
          <Typography variant="h5" color="text.primary">
            {t("login.login")}
          </Typography>

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <div>
              <TextField
                sx={{ border: 1, borderRadius: 1, width: 400 }}
                margin="normal"
                fullWidth
                required
                label={t("login.email")}
                id="email"
                onChange={formik.handleChange}
                inputProps={{ "data-testid": "login-email" }}
              />
              {formik.errors.email ? (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "red" }}
                  data-testid="login-error-email"
                >
                  {formik.errors.email}
                </Typography>
              ) : null}
              <TextField
                sx={{ border: 1, borderRadius: 1 }}
                margin="normal"
                fullWidth
                required
                label={t("login.password")}
                id="password"
                type="password"
                onChange={formik.handleChange}
                inputProps={{ "data-testid": "login-password" }}
              />
              {formik.errors.password ? (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "red" }}
                  data-testid="login-error-password"
                >
                  {formik.errors.password}
                </Typography>
              ) : null}
            </div>
            <Button
              type="submit"
              sx={{
                borderRadius: 4,
                marginTop: 1,
                marginBottom: 1,
                backgroundColor: "secondary.main",
                color: "#fff",
              }}
              variant="contained"
              fullWidth
            >
              {t("login.login")}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forgotpass" variant="body2" color="text.secondary">
                  {t("login.forgotPass")}
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2" color="text.secondary">
                  {t("login.noAccount")}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
export default Login;
