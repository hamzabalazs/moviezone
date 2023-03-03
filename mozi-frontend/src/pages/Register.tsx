import { useEffect, useState } from "react";
import { FormikErrors, useFormik } from "formik";
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
import { AlertType } from "../api/types";

interface Values {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

function Register() {
  const { t } = useTranslation();
  const context = useApiContext();
  const navigate = useNavigate();
  const [alert,setAlert] = useState<AlertType>({isOpen:false,message:"",type:undefined})

  const emailvalidation =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  useEffect(() => {
    if (context.user) {
      navigate("/");
    }
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      const firstName = values.firstName;
      const lastName = values.lastName;
      const email = values.email;
      const password = values.password;
      const result = await context.registerUser({
        firstName,
        lastName,
        email,
        password,
      });
      if (!result) {
        const msg = t("register.accountExists");
        setAlert({isOpen:true,message:msg,type:"error"})
        return;
      }
      navigate("/login");
    },
    validate: (values) => {
      let errors: FormikErrors<Values> = {};
      if (!values.firstName) {
        const msg = t("formikErrors.firstNameReq");
        errors.firstName = msg;
      }
      if (!values.lastName) {
        const msg = t("formikErrors.lastNameReq");
        errors.lastName = msg;
      }
      if (!values.email) {
        const msg = t("formikErrors.emailReq");
        errors.email = msg;
      } else if (!emailvalidation.test(values.email)) {
        const msg = t("formikErrors.emailFormat");
        errors.email = msg;
      }
      if (!values.password) {
        const msg = t("formikErrors.passwordReq");
        errors.password = msg;
      } else if (values.password.length < 5) {
        const msg = t("formikErrors.passwordLength");
        errors.password = msg;
      }
      return errors;
    },
  });

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
            flexDirection: "column",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Avatar sx={{ bgcolor: "secondary.main", color: "text.secondary" }}>
            <LockIcon />
          </Avatar>
          <Typography variant="h5" color="text.primary">
            {t("register.register")}
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <div>
              <TextField
                sx={{
                  border: 1,
                  borderRadius: 1,
                  width: 400,
                }}
                id="firstName"
                name="firstName"
                margin="normal"
                multiline
                required
                label={t("register.firstName")}
                onChange={formik.handleChange}
                value={formik.values.firstName}
                inputProps={{ "data-testid": "register-firstName" }}
              />
              {formik.errors.firstName ? (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "red" }}
                  data-testid="register-error-firstName"
                >
                  {formik.errors.firstName}
                </Typography>
              ) : null}
              <TextField
                sx={{
                  border: 1,
                  borderRadius: 1,
                }}
                id="lastName"
                name="lastName"
                margin="normal"
                multiline
                fullWidth
                required
                label={t("register.lastName")}
                onChange={formik.handleChange}
                value={formik.values.lastName}
                inputProps={{ "data-testid": "register-lastName" }}
              />
              {formik.errors.lastName ? (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "red" }}
                  data-testid="register-error-lastName"
                >
                  {formik.errors.lastName}
                </Typography>
              ) : null}
              <TextField
                margin="normal"
                fullWidth
                required
                label={t("register.email")}
                id="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                sx={{ border: 1, borderRadius: 1 }}
                inputProps={{ "data-testid": "register-email" }}
              />
              {formik.errors.email ? (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "red" }}
                  data-testid="register-error-email"
                >
                  {formik.errors.email}
                </Typography>
              ) : null}
              <TextField
                margin="normal"
                fullWidth
                required
                label={t("register.password")}
                type="password"
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                sx={{ border: 1, borderRadius: 1 }}
                inputProps={{ "data-testid": "register-password" }}
              />
              {formik.errors.password ? (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "red" }}
                  data-testid="register-error-password"
                >
                  {formik.errors.password}
                </Typography>
              ) : null}
            </div>
            <Button
              sx={{
                borderRadius: 4,
                marginTop: 1,
                marginBottom: 1,
                backgroundColor: "secondary.main",
                color: "#fff",
              }}
              variant="contained"
              fullWidth
              type="submit"
            >
              {t("register.register")}
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/login" variant="body2" color="text.secondary">
                  {t("register.hasAccount")}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
export default Register;
