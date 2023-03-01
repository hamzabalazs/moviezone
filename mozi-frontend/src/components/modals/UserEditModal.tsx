import {
  Box,
  Button,
  Card,
  CardContent,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useApiContext } from "../../api/ApiContext";

interface Props {
  isOpenEdit: boolean;
  setIsOpenEdit: Dispatch<SetStateAction<boolean>>;
  firstName: string;
  setFirstName: Dispatch<SetStateAction<string>>;
  lastName: string;
  setLastName: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  role: "admin" | "editor" | "viewer";
  setRole: Dispatch<SetStateAction<"admin" | "editor" | "viewer">>;
  userId: string;
  setIsOpenAlert: Dispatch<SetStateAction<boolean>>;
  setAlertMessage: Dispatch<SetStateAction<string>>;
  setAlertType: Dispatch<SetStateAction<string>>;
}

export default function UserEditModal(props: Props) {
  const { t } = useTranslation();
  const { editUser } = useApiContext();
  const handleRoleSelect = (event: SelectChangeEvent) => {
    props.setRole(event.target.value as "admin" | "editor" | "viewer");
  };
  const updateUser = async () => {
    const userId = props.userId;
    const firstName = props.firstName;
    const lastName = props.lastName;
    const email = props.email;
    const password = props.password;
    const role = props.role;
    const setIsOpenEdit = props.setIsOpenEdit;
    const setIsOpenAlert = props.setIsOpenAlert;
    const setAlertMessage = props.setAlertMessage;
    const setAlertType = props.setAlertType;
    const result = await editUser({
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

  return (
    <Modal
      open={props.isOpenEdit}
      onClose={() => props.setIsOpenEdit(false)}
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
              defaultValue={props.firstName}
              onChange={(e) => props.setFirstName(e.target.value)}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "user-edit-modal-firstName" }}
            ></TextField>
            <Typography variant="subtitle1">{t("user.lastName")}: </Typography>
            <TextField
              defaultValue={props.lastName}
              onChange={(e) => props.setLastName(e.target.value)}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "user-edit-modal-lastName" }}
            ></TextField>
            <Typography variant="subtitle1">{t("user.email")}: </Typography>
            <TextField
              defaultValue={props.email}
              onChange={(e) => props.setEmail(e.target.value)}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "user-edit-modal-email" }}
            ></TextField>
            <Typography variant="subtitle1">{t("user.password")}: </Typography>
            <TextField
              defaultValue={props.password}
              onChange={(e) => props.setPassword(e.target.value)}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "user-edit-modal-password" }}
            ></TextField>
            <InputLabel id="role-select">{t("user.role")}</InputLabel>
            <Select
              labelId="role-select"
              label="Role"
              defaultValue={props.role}
              onChange={handleRoleSelect}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "user-edit-modal-role" }}
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
          </CardContent>
        </Card>
        <Button
          variant="contained"
          onClick={updateUser}
          sx={{ border: 1, borderRadius: 1 }}
        >
          {t("buttons.edit")}
        </Button>
      </Box>
    </Modal>
  );
}
