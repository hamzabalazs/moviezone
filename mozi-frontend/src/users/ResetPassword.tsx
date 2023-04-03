import {
  Avatar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { FormikErrors, useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@apollo/client";
import {
  CHANGE_PASSWORD,
  GET_USER_FOR_PASS_CHANGE,
} from "./userQueries";
import { enqueueSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

interface Values {
  password: string;
  confirmPassword: string;
}

function ResetPassword() {
  const { t } = useTranslation();
  const { token } = useParams();
  const [changePasswordAPI] = useMutation(CHANGE_PASSWORD);
  const { data,error } = useQuery(GET_USER_FOR_PASS_CHANGE, {
    variables: { input: { token } },
  });
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      const result = await changePasswordAPI({
        variables: { input: { user_id:data.getUserForPassChange.id,password: values.password } },
      });
      if (result) {
        const msg = t("successMessages.passwordChanged");
        enqueueSnackbar(msg, { variant: "success" });
        navigate("/login");
      }
    },
    validate: (values) => {
      let errors: FormikErrors<Values> = {};
      if (!values.password) {
        const msg = t("formikErrors.passwordReq");
        errors.password = msg;
      }
      if (!values.confirmPassword) {
        const msg = t("formikErrors.confirmPasswordReq");
        errors.confirmPassword = msg;
      }
      if (values.password !== values.confirmPassword) {
        const msg = "Passwords do not match!";
        errors.confirmPassword = msg;
      }
      return errors;
    },
  });

  useEffect(() => {
    if(error){
      enqueueSnackbar("Time has run out for resetting your password! Request again!",{variant:"error"})
      navigate('../../login')
    }
  },[error])

  return (
    <>
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
            {t("resetPass.resetpassword")}
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ mt: 1, width: "396px" }}
          >
            <div>
              <TextField
                variant="outlined"
                type="password"
                margin="normal"
                fullWidth
                required
                placeholder={t("resetPass.password").toString()}
                id="password"
                onChange={formik.handleChange}
                sx={{ borderRadius: 1, border: 1 }}
                inputProps={{ "data-testid": "reset-pass-password" }}
              />
              {formik.errors.password ? (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "red" }}
                  data-testid="reset-pass-errors"
                >
                  {formik.errors.password}
                </Typography>
              ) : null}
              <TextField
                variant="outlined"
                type="password"
                margin="normal"
                fullWidth
                required
                placeholder={t("resetPass.confirmPassword").toString()}
                id="confirmPassword"
                onChange={formik.handleChange}
                sx={{ borderRadius: 1, border: 1 }}
                inputProps={{ "data-testid": "reset-pass-confirmPassword" }}
              />
              {formik.errors.confirmPassword ? (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "red" }}
                  data-testid="reset-pass-errors"
                >
                  {formik.errors.confirmPassword}
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
              data-testid="submit"
              type="submit"
            >
              {t("resetPass.resetpassword")}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default ResetPassword;
