import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { User } from "../../api/types";
import { useTranslation } from "react-i18next";

interface Props {
  user: User;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function UserCard({ onEdit, onDelete, ...props }: Props) {
  const { t } = useTranslation();

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
        {onEdit && (
          <Button
            size="small"
            sx={{ color: "text.secondary" }}
            onClick={() => onEdit()}
            data-testid="user-card-edit-button"
          >
            {t("buttons.edit")}
          </Button>
        )}
        {onDelete && (
          <Button
            size="small"
            sx={{ color: "text.secondary" }}
            onClick={() => onDelete()}
            data-testid="user-card-delete-button"
          >
            {t("buttons.delete")}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
