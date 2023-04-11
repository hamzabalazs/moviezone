import { useTranslation } from "react-i18next";
import { Cast } from "../../gql/graphql";
import { useSessionContext } from "../../auth/context/SessionContext";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";

interface Props {
  cast: Cast;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function CastPageCard({ cast, onEdit, onDelete }: Props) {
  const { t } = useTranslation();
  const { user } = useSessionContext();

  return (
    <Card
        variant="outlined"
        sx={{
            height:"100%",
            width:"33%",
            display:"flex",
            flexDirection:"column",
            marginTop:3,
        }}
        data-testid="castpage-card"
    >
        {cast.photo && (
            <CardMedia
                sx={{ paddingTop:"100%" }}
                image={cast.photo}
                title={cast.name}
            />
        )}
        <CardContent>
            <Typography variant="h3" gutterBottom>
                {cast.name}
            </Typography>
            <Typography variant="h5" sx={{mt:"auto"}} gutterBottom data-testid="castpage-description">
            <span style={{ fontWeight: "bold" }}>{t("cast.description")}:</span>{" "}
                {cast.description}
            </Typography>
        </CardContent>
        {(user?.role === "admin" || user?.role === "editor") && (
        <CardActions disableSpacing sx={{ mt: "auto" }}>
          {onEdit && (
            <Button
              size="medium"
              sx={{
                color: "text.secondary",
                fontSize: 18,
              }}
              onClick={() => onEdit()}
              data-testid="castpage-edit-button"
            >
              {t("buttons.edit")}
            </Button>
          )}
          {onDelete && (
            <Button
              size="medium"
              sx={{
                color: "text.secondary",
                fontSize: 18,
              }}
              onClick={() => onDelete()}
              data-testid="castpage-delete-button"
            >
              {t("buttons.delete")}
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  )
}
