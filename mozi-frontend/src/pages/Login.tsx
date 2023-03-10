import React, { KeyboardEvent, useEffect, useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import {
  Avatar,
  Button,
  TextField as MuiTextField,
  Grid,
  Box,
  Container,
  Typography,
  Link,
  TextFieldProps,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../components/AlertComponent";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { AlertType } from "../api/types";
import * as Yup from "yup";
import { useSessionContext } from "../api/SessionContext";
import { isString } from "lodash";


function Login() {
  const navigate = useNavigate();
  const context = useSessionContext();
  const [alert,setAlert] = useState<AlertType>({isOpen:false,message:"",type:undefined})
  const { t } = useTranslation();

  const schema = useEditUserSchema()

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      const email = values.email;
      const password = values.password;
      const loggedUser =  await context.logIn(email, password);
      if(isString(loggedUser)){
        const msg = loggedUser;
        setAlert({isOpen:true,message:msg,type:"error"})
      }
      else navigate("/");
    },
    validationSchema:schema
  });

  useEffect(() => {
    if (localStorage.getItem("user-info")) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <AlertComponent
        alert={alert}
        setAlert={setAlert}
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
                error={formik.errors.email}
              />
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
                error={formik.errors.password}
              />
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

function TextField({
  error,
  ...props
}: Omit<TextFieldProps, "error"> & { error?: string }): JSX.Element {
  return (
    <>
      <MuiTextField {...props} />
      {error ? (
        <Typography
          variant="subtitle2"
          sx={{ color: "red" }}
          data-testid="login-errors"
        >
          {error}
        </Typography>
      ) : null}
    </>
  );
}

function useEditUserSchema() {
  const { t } = useTranslation();

  return Yup.object({
    email: Yup.string()
      .required(t("formikErrors.emailReq") || "")
      .email(t("formikErrors.emailFormat") || ""),
    password: Yup.string()
      .required(t("formikErrors.passwordReq") || "")
      .test(
        "len",
        t("formikErrors.passwordLength") || "",
        (val) => val.length >= 5
      ),
  });
}