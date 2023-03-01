import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Category } from "../../api/types";
import { useTranslation } from "react-i18next";

interface Props {
  category: Category;
  setIsOpenEdit: Dispatch<SetStateAction<boolean>>;
  setIsOpenDelete: Dispatch<SetStateAction<boolean>>;
  setName: Dispatch<SetStateAction<string>>;
  setCategoryId: Dispatch<SetStateAction<string>>;
  selectedCategory: Category;
  setSelectedCategory: Dispatch<SetStateAction<Category>>;
}

export default function CategoryCard(props: Props) {
  const { t } = useTranslation();
  const handleEditPopup = () => {
    handleSelectedCategory();
    props.setIsOpenEdit(true);
  };

  const handleDeletePopup = () => {
    handleSelectedCategory();
    props.setIsOpenDelete(true);
  };

  const handleSelectedCategory = () => {
    props.setName(props.selectedCategory.name);
    props.setCategoryId(props.selectedCategory.id);
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
          {props.category.name}
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ mt: "auto" }}>
        <Button
          size="small"
          sx={{ color: "text.secondary" }}
          onClick={handleEditPopup}
          onMouseEnter={() => {
            props.setSelectedCategory(props.category);
            handleSelectedCategory();
          }}
          data-testid="category-card-edit-button"
        >
          {t("buttons.edit")}
        </Button>
        <Button
          size="small"
          sx={{ color: "text.secondary" }}
          onClick={handleDeletePopup}
          onMouseEnter={() => {
            props.setSelectedCategory(props.category);
            handleSelectedCategory();
          }}
          data-testid="category-card-delete-button"
        >
          {t("buttons.delete")}
        </Button>
      </CardActions>
    </Card>
  );
}
