import {
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { FormikErrors, useFormik } from "formik";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useApiContext } from "../../api/ApiContext";

interface Props {
  isOpenEdit: boolean;
  setIsOpenEdit: Dispatch<SetStateAction<boolean>>;
  setFirstName: Dispatch<SetStateAction<string>>;
  setLastName: Dispatch<SetStateAction<string>>;
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
  setIsOpenAlert: Dispatch<SetStateAction<boolean>>;
  setAlertMessage: Dispatch<SetStateAction<string>>;
  setAlertType: Dispatch<SetStateAction<string>>;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "viewer" | "editor";
}

export default function UserCurrentEditModal(props: Props) {
  const { editCurrentUser } = useApiContext();
  const { t } = useTranslation();
  const updateUser = async (firstName:string,lastName:string,email:string,password:string) => {
    const userId = props.userId;
    const role = props.role;

    const setIsOpenEdit = props.setIsOpenEdit;
    const setIsOpenAlert = props.setIsOpenAlert;
    const setAlertMessage = props.setAlertMessage;
    const setAlertType = props.setAlertType;
    const result = await editCurrentUser({
      id: userId,
      firstName,
      lastName,
      email,
      password,
      role,
    });
    if (!result) return;

    const msg = t("successMessages.userEdit");
    setIsOpenEdit(false);
    setIsOpenAlert(true);
    setAlertMessage(msg);
    setAlertType("success");
  };

  const emailvalidation =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    interface Values {
      firstName: string;
      lastName: string;
      email: string;
      password:string
    }

  const formikValues = {
    firstName:props.firstName,
    lastName: props.lastName,
    email: props.email,
    password: props.password
  }

  const formik = useFormik({
    initialValues: formikValues,
    onSubmit: (values) => {
      const firstName = values.firstName;
      const lastName = values.lastName;
      const email = values.email;
      const password = values.password;
      updateUser(firstName, lastName, email,password);
    },
    enableReinitialize: true,
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
    <Modal
      open={props.isOpenEdit}
      onClose={() => props.setIsOpenEdit(false)}
      data-testid="user-current-edit-modal"
    >
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
        component="form"
        onSubmit={formik.handleSubmit}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {t("user.selectedUser")}
        </Typography>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent>
            <Typography variant="subtitle1">{t("user.firstName")}: </Typography>
            <TextField
              id="firstName"
              defaultValue={formik.values.firstName}
              onChange={formik.handleChange}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "user-edit-modal-firstName" }}
            ></TextField>
            {formik.errors.firstName ? (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "red" }}
                  data-testid="register-error-firstName"
                >
                  {formik.errors.firstName}
                </Typography>
              ) : null}
            <Typography variant="subtitle1">{t("user.lastName")}: </Typography>
            <TextField
              id="lastName"
              defaultValue={formik.values.lastName}
              onChange={formik.handleChange}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "user-edit-modal-lastName" }}
            ></TextField>
            {formik.errors.lastName ? (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "red" }}
                  data-testid="register-error-lastName"
                >
                  {formik.errors.lastName}
                </Typography>
              ) : null}
            <Typography variant="subtitle1">{t("user.email")}: </Typography>
            <TextField
              id="email"
              defaultValue={formik.values.email}
              onChange={formik.handleChange}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "user-edit-modal-email" }}
            ></TextField>
            {formik.errors.email ? (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "red" }}
                  data-testid="register-error-email"
                >
                  {formik.errors.email}
                </Typography>
              ) : null}
            <Typography variant="subtitle1">{t("user.password")}: </Typography>
            <TextField
              id="password"
              defaultValue={formik.values.password}
              onChange={formik.handleChange}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "user-edit-modal-password" }}
            ></TextField>
            {formik.errors.password ? (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "red" }}
                  data-testid="register-error-password"
                >
                  {formik.errors.password}
                </Typography>
              ) : null}
          </CardContent>
        </Card>
        <Button
          variant="contained"
          type="submit"
          sx={{ border: 1, borderRadius: 1 }}
        >
          {t("buttons.edit")}
        </Button>
      </Box>
    </Modal>
  );
}
