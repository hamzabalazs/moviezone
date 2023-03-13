import {
  Box,
  Button,
  Card,
  CardContent,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField as MuiTextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { AlertType, User } from "../../api/types";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";

interface Props {
  user?: User;
  onClose?: () => void;
  allowEditRole?: boolean;
  setAlert: Dispatch<SetStateAction<AlertType>>;
}

const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      first_name
      last_name
      role
      email
    }
  }
`;
// function AlertProvider() {
//   const [alert, setAlert] = useSate();

// useEffect(() => {
// if(alert ){
//   const timer = setTimeout(3000, () => setAlert(undefined))
//   return ()=>clearTimeout(timer);
// }
// }, [alert])

//   function showMessage(alert){

//   }

//   return <context.provider value={{showMessage}}>
//     {alert && (
//       <Alert
//       sx={{
//         marginRight: 2,
//         marginLeft: 2,
//         marginTop: 3,
//         marginBottom: 3,
//         position: "sticky",
//         top: 1,
//       }}
//       variant="filled"
//       severity={alert.variant}
//       data-testid="alert-success"
//     >
//       {alert.message}
//     </Alert>
//     )}
//     {...}
//   </context.provider>
// }

// Usage
// const {showMessage} = useMyStack();
// showMessage({
//   message:  t("successMessages.userEdit"),
//   variant: "success"
// });

export default function UserEditModal({
  user,
  onClose,
  allowEditRole,
  setAlert,
}: Props) {
  const { t } = useTranslation();
  const [UpdateUserAPI,{data}] = useMutation(UPDATE_USER);

  const updateUser = async (editedUser: Omit<User, "id">) => {
    if (user === undefined) return;
    const result = await UpdateUserAPI({
      variables: {
        input: {
          id: user.id,
          first_name: editedUser.first_name,
          last_name: editedUser.last_name,
          email: editedUser.email,
          password: editedUser.password,
          role: allowEditRole ? editedUser.role : undefined
        },
      },
    });
    if (result) {
      const msg = t("successMessages.userEdit");
      setAlert({ isOpen: true, message: msg, type: "success" });
    }

    onClose?.();
  };

  const formikValues: Omit<User, "id"> = {
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    password: user?.password || "",
    role: user?.role || "viewer",
  };

  const schema = useEditUserSchema();

  const formik = useFormik({
    initialValues: formikValues,
    onSubmit: updateUser,
    enableReinitialize: true,
    validationSchema: schema,
  });

  if(data) return <p style={{visibility:"hidden",height:"0px",margin:"0px"}}>Success</p>

  return (
    <Modal
      open={Boolean(user)}
      onClose={() => onClose?.()}
      data-testid="user-edit-modal"
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
            <Typography variant="subtitle1">
              {t("user.first_name")}:{" "}
            </Typography>
            <TextField
              id="first_name"
              variant="outlined"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "user-edit-modal-first_name" }}
              error={formik.errors.first_name}
            />
            <Typography variant="subtitle1">{t("user.last_name")}: </Typography>
            <TextField
              id="last_name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "user-edit-modal-last_name" }}
              error={formik.errors.last_name}
            />
            <Typography variant="subtitle1">{t("user.email")}: </Typography>
            <TextField
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "user-edit-modal-email" }}
              error={formik.errors.email}
            />
            <Typography variant="subtitle1">{t("user.password")}: </Typography>
            <TextField
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "user-edit-modal-password" }}
              error={formik.errors.password}
            />
            {allowEditRole && (
              <>
                <InputLabel id="role-select">{t("user.role")}</InputLabel>
                <Select
                  labelId="role-select"
                  label="Role"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  sx={{ border: 1, borderRadius: 1 }}
                  data-testid="user-edit-modal-role"
                >
                  <MenuItem value="admin">
                    Admin {t("user.role").toLowerCase()}
                  </MenuItem>
                  <MenuItem value="editor">
                    Editor {t("user.role").toLowerCase()}
                  </MenuItem>
                  <MenuItem value="viewer">
                    Viewer {t("user.role").toLowerCase()}
                  </MenuItem>
                </Select>
              </>
            )}
          </CardContent>
        </Card>
        <Button
          type="submit"
          variant="contained"
          sx={{ border: 1, borderRadius: 1 }}
          data-testid="user-edit-modal-submit"
        >
          {t("buttons.edit")}
        </Button>
      </Box>
    </Modal>
  );
}

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
          data-testid="register-error-first_name"
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
    role: Yup.string().required(),
  });
}
