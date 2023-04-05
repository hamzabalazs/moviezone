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
  Grow,
  Backdrop,
} from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useSessionContext } from "../auth/SessionContext";
import {
  EXPIRED_TOKEN_MESSAGE,
  NOT_VALID_USER,
  USER_EMAIL_USED_MESSAGE,
} from "../common/errorMessages";
import { useEditUserSchema } from "../common/validationFunctions";
import { FullUser, UserRole } from "../gql/graphql";
import { useUser } from "./useUser";

interface Props {
  user?: FullUser;
  onClose?: () => void;
  allowEditRole?: boolean;
}

export default function UserEditModal({ user, onClose, allowEditRole }: Props) {
  const { t } = useTranslation();
  const { updateUser: UpdateUserAPI } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const { logOut, logIn, user: currentuser } = useSessionContext();

  const updateUser = async (editedUser: Omit<FullUser, "id">) => {
    if (user === undefined) return;
    try {
      const result = await UpdateUserAPI(
        user.id,
        editedUser.first_name,
        editedUser.last_name,
        editedUser.email,
        editedUser.password,
        allowEditRole ? editedUser.role : undefined
      );
      if (result) {
        if (currentuser!.id === user.id)
          logIn(editedUser.email, editedUser.password);
        const msg = t("successMessages.userEdit");
        enqueueSnackbar(msg, { variant: "success" });
        onClose?.();
      }
    } catch (e: any) {
      if (e.message === EXPIRED_TOKEN_MESSAGE) {
        const msg = t("failMessages.expiredToken");
        enqueueSnackbar(msg, { variant: "error" });
        logOut();
      } else if (e.message === USER_EMAIL_USED_MESSAGE) {
        const msg = t("user.emailExists");
        enqueueSnackbar(msg, { variant: "error" });
      } else if (e.message === NOT_VALID_USER) {
        const msg = t("validityFailure.userNotValid");
        enqueueSnackbar(msg, { variant: "error" });
      } else {
        const msg = t("someError");
        enqueueSnackbar(msg, { variant: "error" });
      }
    }
  };

  const formikValues: Omit<FullUser, "id"> = {
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || UserRole["Viewer"],
  };

  const schema = useEditUserSchema();

  const formik = useFormik({
    initialValues: formikValues,
    onSubmit: updateUser,
    enableReinitialize: true,
    validationSchema: schema,
  });

  return (
    <Modal
      open={Boolean(user)}
      onClose={() => onClose?.()}
      data-testid="user-edit-modal"
      closeAfterTransition
      slots={{backdrop: Backdrop}}
      slotProps={{
        backdrop:{
          timeout:500
        }
      }}
      style={{display:'flex',alignItems:'center',justifyContent:'center'}}
    >
      <Grow in={Boolean(user)}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "16%",
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
              <Typography variant="subtitle1">
                {t("user.last_name")}:{" "}
              </Typography>
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
              <Typography variant="subtitle1">
                {t("user.password")}:{" "}
              </Typography>
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
      </Grow>
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
          data-testid="user-edit-errors"
        >
          {error}
        </Typography>
      ) : null}
    </>
  );
}
