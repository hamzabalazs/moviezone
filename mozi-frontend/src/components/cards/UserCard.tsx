import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { User } from "../../api/types";
import { useTranslation } from "react-i18next";

interface Props {
  user: User;
  setIsOpenEdit: Dispatch<SetStateAction<boolean>>;
  setIsOpenDelete: Dispatch<SetStateAction<boolean>>;
  setFirstName: Dispatch<SetStateAction<string>>;
  setLastName: Dispatch<SetStateAction<string>>;
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
  setRole: Dispatch<SetStateAction<"admin" | "editor" | "viewer">>;
  setUserId: Dispatch<SetStateAction<string>>;
  selectedUser: User;
  setSelectedUser: Dispatch<SetStateAction<User>>;
}

export default function UserCard(props: Props) {
  const { t } = useTranslation();
  const handleEditPopup = () => {
    handleSelectedUser();
    props.setIsOpenEdit(true);
  };

  const handleDeletePopup = () => {
    handleSelectedUser();
    props.setIsOpenDelete(true);
  };

  const handleSelectedUser = () => {
    props.setFirstName(props.selectedUser.firstName);
    props.setLastName(props.selectedUser.lastName);
    props.setEmail(props.selectedUser.email);
    props.setPassword(props.selectedUser.password);
    props.setRole(props.selectedUser.role);
    props.setUserId(props.selectedUser.id);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderColor: "text.secondary",
        border: 3,
        borderRadius: 3,
        marginLeft: 5,
        marginRight: 5,
      }}
      data-testid="user-card"
    >
      <CardContent>
        <Typography variant="inherit" gutterBottom sx={{ mt: "auto" }}>
          {t("user.userCard.fullName")} :
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          marginLeft={3}
          sx={{ mt: "auto" }}
        >
          {props.user.firstName} {props.user.lastName}
        </Typography>
        <Typography variant="inherit" gutterBottom sx={{ mt: "auto" }}>
          {t("user.userCard.email")} :
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          marginLeft={3}
          sx={{ mt: "auto" }}
          data-testid="user-card-email"
        >
          {props.user.email}
        </Typography>
        <Typography variant="inherit" gutterBottom sx={{ mt: "auto" }}>
          {t("user.userCard.role")} :
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          marginLeft={3}
          sx={{ mt: "auto" }}
          data-testid="user-card-role"
        >
          {props.user.role}
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ mt: "auto" }}>
        <Button
          size="small"
          sx={{ color: "text.secondary" }}
          onClick={handleEditPopup}
          onMouseEnter={() => {
            props.setSelectedUser(props.user);
            handleSelectedUser();
          }}
          data-testid="user-card-edit-button"
        >
          {t("buttons.edit")}
        </Button>
        <Button
          size="small"
          sx={{ color: "text.secondary" }}
          onClick={handleDeletePopup}
          onMouseEnter={() => {
            props.setSelectedUser(props.user);
            handleSelectedUser();
          }}
          data-testid="user-card-delete-button"
        >
          {t("buttons.delete")}
        </Button>
      </CardActions>
    </Card>
  );
}
