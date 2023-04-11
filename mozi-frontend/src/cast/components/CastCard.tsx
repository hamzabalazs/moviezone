import {
  Card,
  CardContent,
  CardMedia,
  Link,
  Typography,
} from "@mui/material";
import { Cast } from "../../gql/graphql";
import { useSessionContext } from "../../auth/context/SessionContext";
import { useTranslation } from "react-i18next";
import { Link as ReactLink } from "react-router-dom";

interface Props {
  cast: Cast;
}

export default function CastCard({ cast }: Props) {
  const { user } = useSessionContext();
  const { t } = useTranslation();
  return (
    <Link
      component={ReactLink}
      to={"/cast/" + cast.id}
      underline="none"
      data-testid="cast-card-link"
    >
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
            sx={{ paddingTop: "144px", paddingLeft: "144px" }}
            image={cast.photo}
            title={cast.name}
          />
        )}
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            {cast.name}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
