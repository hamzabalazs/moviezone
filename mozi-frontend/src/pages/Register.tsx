import { useEffect, useState } from "react";
import { useFormik } from "formik";
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
import { useSnackbar } from 'notistack'
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useSessionContext } from "../api/SessionContext";
import { gql, useMutation } from "@apollo/client";

const ADD_USER = gql`
  mutation CreateUser($input: AddUserInput!) {
    createUser(input: $input) {
      id
      first_name
      last_name
      role
      email
    }
  }
`;

function Register() {
  const { t } = useTranslation();
  const context = useSessionContext();
  const navigate = useNavigate();
  const [PostUserAPI] = useMutation(ADD_USER);
  const {enqueueSnackbar} = useSnackbar()
  
  useEffect(() => {
    if (context.user) {
      navigate("/");
    }
  });

  const schema = useEditUserSchema()

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      const first_name = values.first_name;
      const last_name = values.last_name;
      const email = values.email;
      const password = values.password;
      const result = await PostUserAPI({variables:{input:{first_name,last_name,email,password}}});
      if (!result) {
        const msg = t("register.accountExists");
        enqueueSnackbar(msg,{variant:"error"})
        return;
      }
      const msg = t("register.success")
      enqueueSnackbar(msg,{variant:"success"})
      navigate("/login");
    },
    validationSchema:schema
  });

  return (
    <>
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
                id="first_name"
                name="first_name"
                margin="normal"
                multiline
                required
                label={t("register.first_name")}
                onChange={formik.handleChange}
                value={formik.values.first_name}
                inputProps={{ "data-testid": "register-first_name" }}
                error={formik.errors.first_name}
              />
              <TextField
                sx={{
                  border: 1,
                  borderRadius: 1,
                }}
                id="last_name"
                name="last_name"
                margin="normal"
                multiline
                fullWidth
                required
                label={t("register.last_name")}
                onChange={formik.handleChange}
                value={formik.values.last_name}
                inputProps={{ "data-testid": "register-last_name" }}
                error={formik.errors.last_name}
              />
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
                error={formik.errors.email}
              />
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
                error={formik.errors.password}
              />
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
          data-testid="register-errors"
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
    first_name: Yup.string().required(t("formikErrors.firstNameReq") || ""),
    last_name: Yup.string().required(t("formikErrors.lastNameReq") || ""),
    email: Yup.string()
      .required(t("formikErrors.emailReq") || "")
      .email(t("formikErrors.emailFormat") || ""),
    password: Yup.string()
      .required(t("formikErrors.passwordReq") || "")
      .test(
        "len",
        t("formikErrors.passwordLength") || "",
        (val) => val.length > 5
      ),
  });
}
