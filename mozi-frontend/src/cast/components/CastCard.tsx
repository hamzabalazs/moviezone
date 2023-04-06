import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Cast } from "../../gql/graphql";
import { useSessionContext } from "../../auth/context/SessionContext";
import { useTranslation } from "react-i18next";

interface Props {
    cast: Cast;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function CastCard({cast,onEdit,onDelete}:Props) {
    const { user } = useSessionContext(); 
    const { t } = useTranslation();
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
      }}
    >
      {cast.photo && (
        <CardMedia
          sx={{ paddingTop: "144px", paddingLeft:"144px" }}
          image={cast.photo}
          title={cast.name}
        />
      )}
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
            {cast.name}
        </Typography>
      </CardContent>
      {(user?.role === "admin" || user?.role === "editor") && (
        <CardActions disableSpacing sx={{mt:"auto"}}>
            {onEdit && (
                <Button
                size="small"
                sx={{
                  color: "text.secondary",
                  fontSize: 12,
                }}
                onClick={() => onEdit()}
                data-testid="moviepage-edit-button"
              >
                {t("buttons.edit")}
              </Button>
            )}
            {onDelete && (
            <Button
              size="small"
              sx={{
                color: "text.secondary",
                fontSize: 12,
              }}
              onClick={() => onDelete()}
              data-testid="moviepage-delete-button"
            >
              {t("buttons.delete")}
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
}
