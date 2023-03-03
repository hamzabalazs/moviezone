import { Container, Fab, Grid, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { AlertType, Category } from "../api/types";
import CategoryDeleteDialog from "../components/dialogs/CategoryDeleteDialog";
import CategoryAddModal from "../components/modals/CategoryAddModal";
import CategoryEditModal from "../components/modals/CategoryEditModal";
import NavigationBar from "../components/NavigationBar";
import MyFooter from "../components/MyFooter";
import ScrollTop from "../components/ScrollTop";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CategoryCard from "../components/cards/CategoryCard";
import AlertComponent from "../components/AlertComponent";
import { useApiContext } from "../api/ApiContext";
import { useTranslation } from "react-i18next";

function Categories() {
  const { t } = useTranslation();
  const context = useApiContext();
  const [alert,setAlert] = useState<AlertType>({isOpen:false,message:"",type:undefined})
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: "",
    name: "",
  });
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const handleAddCategory = () => {
    setIsOpenAdd(true);
  };

  return (
    <>
      <NavigationBar />
      <main style={{ position: "relative", minHeight: "100vh" }}>
        <AlertComponent
          alert={alert}
          setAlert={setAlert}
        />
        <CategoryEditModal
          isOpenEdit={isOpenEdit}
          setIsOpenEdit={setIsOpenEdit}
          name={name}
          setName={setName}
          categoryId={categoryId}
          setAlert={setAlert}
        />
        <CategoryDeleteDialog
          isOpenDelete={isOpenDelete}
          setIsOpenDelete={setIsOpenDelete}
          categoryId={categoryId}
          setAlert={setAlert}
        />
        <div>
          <CategoryAddModal
            isOpenAdd={isOpenAdd}
            setIsOpenAdd={setIsOpenAdd}
            setAlert={setAlert}
          />
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
          {context.categories.length !== 0 && (
            <Grid container spacing={4}>
              {context.categories.map((category) => (
                <Grid item key={category.id} xs={12}>
                  <CategoryCard
                    category={category}
                    setIsOpenEdit={setIsOpenEdit}
                    setIsOpenDelete={setIsOpenDelete}
                    setName={setName}
                    setCategoryId={setCategoryId}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />
                </Grid>
              ))}
            </Grid>
          )}
          {context.categories.length === 0 && (
            <Typography
              variant="h4"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              {t("category.noCategoryFound")}
            </Typography>
          )}
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
