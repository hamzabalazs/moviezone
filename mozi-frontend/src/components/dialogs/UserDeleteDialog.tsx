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

interface Props {
  isOpenDelete: boolean;
  setIsOpenDelete: Dispatch<SetStateAction<boolean>>;
  userId: string;
  setIsOpenAlert: Dispatch<SetStateAction<boolean>>;
  setAlertMessage: Dispatch<SetStateAction<string>>;
  setAlertType: Dispatch<SetStateAction<string>>;
}

export default function UserDeleteDialog(props: Props) {
  const { deleteUser } = useApiContext();
  const { t } = useTranslation();

  const handleDeletion = async () => {
    const userId = props.userId;
    const setIsOpenDelete = props.setIsOpenDelete;
    const setIsOpenAlert = props.setIsOpenAlert;
    const setAlertMessage = props.setAlertMessage;
    const setAlertType = props.setAlertType;
    const result = await deleteUser(userId);
    if (!result) return;

    const msg = t("successMessages.userDelete");
    setIsOpenDelete(false);
    setIsOpenAlert(true);
    setAlertMessage(msg);
    setAlertType("success");
  };

  return (
    <Dialog
      open={props.isOpenDelete}
      onClose={() => props.setIsOpenDelete(false)}
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
        <Button onClick={() => props.setIsOpenDelete(false)}>
          {t("buttons.quit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
