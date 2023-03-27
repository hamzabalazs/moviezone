import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Category } from "../gql/graphql";

interface Props {
  category: Category;
  onEdit: () => void;
  onDelete: () => void
}

export default function CategoryCard({category,onEdit,onDelete}: Props) {
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
      data-testid="category-card"
    >
      <CardContent>
        <Typography variant="inherit" gutterBottom sx={{ mt: "auto" }}>
          {t("category.categoryName")} :
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          marginLeft={3}
          sx={{ mt: "auto" }}
          data-testid="category-card-name"
        >
          {category.name}
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ mt: "auto" }}>
        <Button
          size="small"
          sx={{ color: "text.secondary" }}
          onClick={() => onEdit()}
          
          data-testid="category-card-edit-button"
        >
          {t("buttons.edit")}
        </Button>
        <Button
          size="small"
          sx={{ color: "text.secondary" }}
          onClick={() => onDelete()}
          
          data-testid="category-card-delete-button"
        >
          {t("buttons.delete")}
        </Button>
      </CardActions>
    </Card>
  );
}
