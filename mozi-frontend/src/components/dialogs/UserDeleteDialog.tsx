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
import { AlertType, User } from "../../api/types";
import { gql, useMutation} from "@apollo/client";

interface Props {
  user?: User;
  onClose?: () => void;
  setAlert?: Dispatch<SetStateAction<AlertType>>;
}

const DELETE_USER = gql`
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      id
      first_name
      last_name
      role
      email
    }
  }
`;

export default function UserDeleteDialog({ user, onClose, setAlert }: Props) {
  const { t } = useTranslation();
  const [DeleteUserAPI,{data}] = useMutation(DELETE_USER);

  const handleDeletion = async () => {
    if (user === undefined) return;
    const result = await DeleteUserAPI({variables:{input:{id:user.id}}});
    if (result) {
      const msg = t("successMessages.userDelete");
      setAlert?.({ isOpen: true, message: msg, type: "success" });
    }

    onClose?.();
  };

  if(data) return <p style={{visibility:"hidden",height:"0px",margin:"0px"}}>Success</p>


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
