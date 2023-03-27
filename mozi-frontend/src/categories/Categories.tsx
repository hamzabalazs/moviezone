import { Container, Fab, Grid, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import NavigationBar from "../common/components/NavigationBar";
import MyFooter from "../common/components/MyFooter";
import ScrollTop from "../common/components/ScrollTop";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useTranslation } from "react-i18next";
import LoadingComponent from "../common/components/LoadingComponent";
import { useCategoriesData } from "./useCategoriesData";
import { Category } from "../gql/graphql";
import CategoryEditModal from "./CategoryEditModal";
import CategoryDeleteDialog from "./CategoryDeleteDialog";
import CategoryAddModal from "./CategoryAddModal";
import CategoryCard from "./CategoryCard";

function Categories() {
  const { t } = useTranslation();
  const { categories, loading } = useCategoriesData();

  const [editingCategory, setEditingCategory] = useState<Category | undefined>(
    undefined
  );
  const [deletingCategory, setDeletingCategory] = useState<
    Category | undefined
  >(undefined);

  const [isOpenAdd, setIsOpenAdd] = useState(false);

  const handleAddCategory = () => {
    setIsOpenAdd(true);
  };

  if (loading) return LoadingComponent(loading);

  return (
    <>
      <NavigationBar />
      <main style={{ position: "relative", minHeight: "100vh" }}>
        <CategoryEditModal
          category={editingCategory}
          onClose={() => {
            setEditingCategory(undefined);
          }}
        />
        <CategoryDeleteDialog
          category={deletingCategory}
          onClose={() => setDeletingCategory(undefined)}
        />
        <div>
          <CategoryAddModal isOpenAdd={isOpenAdd} setIsOpenAdd={setIsOpenAdd} />
          <IconButton
            sx={{
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
            onClick={handleAddCategory}
            data-testid="category-add-button"
          >
            <AddCircleIcon sx={{ fontSize: 40 }} color="primary" />
          </IconButton>
          <Container maxWidth="sm" sx={{ marginBottom: 3 }}>
            <Typography
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              {t("navbar.Categories")}
            </Typography>
          </Container>
        </div>
        <div>
          <Grid container spacing={4}>
            {categories.map((category: Category) => (
              <Grid item key={category.id} xs={12}>
                <CategoryCard
                  category={category}
                  onEdit={() => setEditingCategory(category)}
                  onDelete={() => setDeletingCategory(category)}
                />
              </Grid>
            ))}
          </Grid>
          {}
        </div>
        <MyFooter />
      </main>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
}

export default Categories;
