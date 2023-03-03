import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useApiContext } from "../../api/ApiContext";
import { AlertType, User } from "../../api/types";

interface Props {
  user?: User;
  onClose?: () => void;
  setAlert?: Dispatch<SetStateAction<AlertType>>;
}

export default function UserDeleteDialog({ user, onClose, setAlert }: Props) {
  const { deleteUser } = useApiContext();
  const { t } = useTranslation();

  const handleDeletion = async () => {
    if (user === undefined) return;
    const result = await deleteUser(user.id);
    if (result) {
      const msg = t("successMessages.userDelete");
      setAlert?.({ isOpen: true, message: msg, type: "success" });
    }

    onClose?.();
  };

  return (
    <Dialog
      open={Boolean(user)}
      onClose={() => onClose?.()}
      aria-labelledby="alert-delete-title"
      aria-describedby="alert-delete-description"
      data-testid="user-delete-dialog"
    >
      <DialogTitle id="alert-delete-title">
        {t("deleteMessages.deleteUserTitle")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-delete-description">
          {t("deleteMessages.deleteUserContent")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDeletion}
          autoFocus
          data-testid="user-delete-dialog-accept"
        >
          {t("buttons.accept")}
        </Button>
        <Button onClick={() => onClose?.()} data-testid="user-delete-dialog-quit">{t("buttons.quit")}</Button>
      </DialogActions>
    </Dialog>
  );
}
