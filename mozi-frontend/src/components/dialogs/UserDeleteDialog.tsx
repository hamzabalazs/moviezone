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
import { GET_USERS } from "../../pages/Account";

interface Props {
  user?: User;
  onClose?: () => void;
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

export default function UserDeleteDialog({ user, onClose }: Props) {
  const { t } = useTranslation();
  const [DeleteUserAPI, { data }] = useMutation(DELETE_USER);
  const { enqueueSnackbar } = useSnackbar();
  const client = useApolloClient()

  const handleDeletion = async () => {
    if (user === undefined) return;
    const result = await DeleteUserAPI({
      variables: { input: { id: user.id } },
      update:(cache,{data}) => {
        const { getUsers } = client.readQuery({
          query: GET_USERS,
        })
        cache.writeQuery({
          query: GET_USERS,
          data:{
            getUsers: getUsers.filter((x:any) => x.id != data.deleteUser.id)
          }
        })
      }
    });
    if (result) {
      const msg = t("successMessages.userDelete");
      enqueueSnackbar(msg, { variant: "success" });
    }

    onClose?.();
  };

  //if(data) return <p style={{visibility:"hidden",height:"0px",margin:"0px"}}>Success</p>

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
