import { useEffect } from "react";
import LockIcon from "@mui/icons-material/Lock";
import {
  Avatar,
  Button,
  TextField,
  Box,
  Container,
  Typography,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FormikErrors, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useSessionContext } from "../auth/SessionContext";
import LoadingComponent from "../common/components/LoadingComponent";
import { useUserData } from "./useUserData";
import { useMutation } from "@apollo/client";
import { SEND_FORGOT_PASS } from "./userQueries";
import { SendForgotPassEmailMutation } from "../gql/graphql";

interface Values {
  email: string;
}

function Forgotpass() {
  const { t } = useTranslation();
  const context = useSessionContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { users, loading } = useUserData(0, 100);
  const [SendForgotPassMailAPI] = useMutation<SendForgotPassEmailMutation>(SEND_FORGOT_PASS);

  useEffect(() => {
    if (context.user) {
      navigate("/");
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      const email = values.email;
      try{
        const result = await SendForgotPassMailAPI({
          variables: { input: { email } },
        });
        const msg = t("forgotPass.isUser");
        enqueueSnackbar(msg, { variant: "success" });
        navigate("/login");
      }catch(e:any){
        const msg = t("forgotPass.noUser");
        enqueueSnackbar(msg,{variant:"error"})
      }
    },
    validate: (values) => {
      let errors: FormikErrors<Values> = {};
      if (!values.email) {
        const msg = t("formikErrors.emailReq");
        errors.email = msg;
      }
      return errors;
    },
  });

  if (loading) return LoadingComponent(loading);
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
            {t("forgotPass.passwordReset")}
          </Typography>
          <Typography variant="subtitle2" color="text.primary" align="center">
            {t("forgotPass.content")}
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
                margin="normal"
                fullWidth
                required
                label={t("forgotPass.email")}
                id="email"
                onChange={formik.handleChange}
                sx={{ borderRadius: 1, border: 1 }}
                inputProps={{ "data-testid": "forgot-email" }}
              />
              {formik.errors.email ? (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "red" }}
                  data-testid="forgot-error-email"
                >
                  {formik.errors.email}
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
              {t("forgotPass.passwordReset")}
            </Button>
            <Link href="/login" variant="body2" color="text.secondary">
              {t("forgotPass.hasAccount")}
            </Link>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Forgotpass;
