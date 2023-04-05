import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useSessionContext } from "../../auth/context/SessionContext";
import { EXPIRED_TOKEN_MESSAGE } from "../../common/errorMessages";
import { FullUser} from "../../gql/graphql";
import { useUser } from "../hooks/useUser";

interface Props {
  user?: FullUser;
  onClose?: () => void;
}

export default function UserDeleteDialog({ user, onClose }: Props) {
  const { t } = useTranslation();
  const { deleteUser: DeleteUserAPI } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const { logOut,user:currentUser } = useSessionContext();

  const handleDeletion = async () => {
    if (user === undefined) return;
    try {
      const result = await DeleteUserAPI(user.id);
      if (result) {
        const msg = t("successMessages.userDelete");
        enqueueSnackbar(msg, { variant: "success" });
        if(currentUser!.id === user.id) logOut();
        onClose?.()
      }
    } catch (error: any) {
      if (error.message === EXPIRED_TOKEN_MESSAGE) {
        const msg = t("failMessages.expiredToken");
        enqueueSnackbar(msg, { variant: "error" });
        logOut();
      } else {
        const msg = t("someError");
        enqueueSnackbar(msg, { variant: "error" });
      }
    }
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
        <Button
          onClick={() => onClose?.()}
          data-testid="user-delete-dialog-quit"
        >
          {t("buttons.quit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
