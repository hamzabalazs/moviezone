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
import { User } from "../../api/types";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { useSessionContext } from "../../api/SessionContext";
import { EXPIRED_TOKEN_MESSAGE } from "../../common/errorMessages";
import { useUser } from "../../api/user/useUser";

interface Props {
  user?: User;
  onClose?: () => void;
}

export default function UserDeleteDialog({ user, onClose }: Props) {
  const { t } = useTranslation();
  const { deleteUser: DeleteUserAPI } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const client = useApolloClient();
  const { logOut } = useSessionContext();

  const handleDeletion = async () => {
    if (user === undefined) return;
    try {
      const result = await DeleteUserAPI(user.id);
      if (result) {
        const msg = t("successMessages.userDelete");
        enqueueSnackbar(msg, { variant: "success" });
        onClose?.();
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
