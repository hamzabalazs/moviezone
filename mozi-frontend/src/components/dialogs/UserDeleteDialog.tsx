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
import { User } from "../../api/types";

interface Props {
  user?: User;
  onClose?: () => void;
  setIsOpenAlert?: Dispatch<SetStateAction<boolean>>;
  setAlertMessage?: Dispatch<SetStateAction<string>>;
  setAlertType?: Dispatch<SetStateAction<string>>;
}

export default function UserDeleteDialog({
  user,
  onClose,
  setIsOpenAlert,
  setAlertMessage,
  setAlertType,
}: Props) {
  const { deleteUser } = useApiContext();
  const { t } = useTranslation();

  const handleDeletion = async () => {
    if (user === undefined) return;
    const result = await deleteUser(user.id);
    if (result) {
      const msg = t("successMessages.userDelete");
      setIsOpenAlert?.(true);
      setAlertMessage?.(msg);
      setAlertType?.("success");
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
        <Button onClick={handleDeletion} autoFocus>
          {t("buttons.accept")}
        </Button>
        <Button onClick={() => onClose?.()}>
          {t("buttons.quit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
