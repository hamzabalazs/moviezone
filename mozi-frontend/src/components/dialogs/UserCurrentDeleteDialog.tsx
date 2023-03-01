import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApiContext } from "../../api/ApiContext";

interface Props {
  isOpenDelete: boolean;
  setIsOpenDelete: Dispatch<SetStateAction<boolean>>;
  userId: string;
}

export default function UserCurrentDeleteDialog(props: Props) {
  const navigate = useNavigate();
  const { deleteUser, logOut } = useApiContext();
  const { t } = useTranslation();
  const handleDeletion = async () => {
    const userId = props.userId;
    const result = await deleteUser(userId);
    if (!result) return;

    logOut();
    navigate("/login");
  };

  return (
    <Dialog
      open={props.isOpenDelete}
      onClose={() => props.setIsOpenDelete(false)}
      aria-labelledby="alert-delete-title"
      aria-describedby="alert-delete-description"
      data-testid="user-current-delete-dialog"
    >
      <DialogTitle id="alert-delete-title">
        {t("deleteMessages.deleteCurrentUserTitle")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-delete-description">
          {t("deleteMessages.deleteCurrentUserContent")}
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
