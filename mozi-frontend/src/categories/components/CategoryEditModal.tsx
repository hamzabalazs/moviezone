import {
  Box,
  Button,
  Card,
  CardContent,
  Grow,
  Modal,
  TextField as MuiTextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import {
  CATEGORY_EXISTS_MESSAGE,
  EXPIRED_TOKEN_MESSAGE,
  NOT_VALID_CATEGORY,
} from "../../common/errorMessages";
import { Category } from "../../gql/graphql";
import { useCategory } from "../hooks/useCategory";
import { useSessionContext } from "../../auth/context/SessionContext";
import { useEditCategorySchema } from "../../common/validationFunctions";

interface Props {
  category?: Category;
  onClose?: () => void;
}

export default function CategoryEditModal({ category, onClose }: Props) {
  const { t } = useTranslation();
  const { updateCategory: UpdateCategoryAPI } = useCategory();
  const { enqueueSnackbar } = useSnackbar();
  const { logOut } = useSessionContext();

  const updateCategory = async (editedCategory: Omit<Category, "id">) => {
    if (category === undefined) return;
    const categoryId = category.id;
    try {
      const result = await UpdateCategoryAPI(categoryId, editedCategory.name);
      if (result) {
        const msg = t("successMessages.categoryEdit");
        enqueueSnackbar(msg, { variant: "success" });
        onClose?.();
      }
    } catch (e: any) {
      if (e.message === EXPIRED_TOKEN_MESSAGE) {
        const msg = t("failMessages.expiredToken");
        enqueueSnackbar(msg, { variant: "error" });
        logOut();
      } else if (e.message === CATEGORY_EXISTS_MESSAGE) {
        const msg = t("category.categoryExists");
        enqueueSnackbar(msg, { variant: "error" });
      } else if (e.message === NOT_VALID_CATEGORY) {
        const msg = t("validityFailure.categoryNotValid");
        enqueueSnackbar(msg, { variant: "error" });
      } else {
        const msg = t("someError");
        enqueueSnackbar(msg, { variant: "error" });
      }
    }
  };
  const schema = useEditCategorySchema();

  const formik = useFormik({
    initialValues: {
      name: category?.name || "",
    },
    onSubmit: updateCategory,
    enableReinitialize: true,
    validationSchema: schema,
  });

  return (
    <Modal
      open={Boolean(category)}
      onClose={() => onClose?.()}
      data-testid="category-edit-modal"
      style={{display:'flex',alignItems:'center',justifyContent:'center'}}
    >
      <Grow in={Boolean(category)}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "33%",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
          component="form"
          data-testid="category-edit-card"
          onSubmit={formik.handleSubmit}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {t("category.selectedCategory")}
          </Typography>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent>
              <Typography variant="subtitle1">
                {t("category.name")}:{" "}
              </Typography>
              <TextField
                id="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                sx={{ border: 1, borderRadius: 1 }}
                inputProps={{ "data-testid": "category-edit-modal-name" }}
              ></TextField>
              {formik.errors.name ? (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "red" }}
                  data-testid="category-edit-error-name"
                >
                  {formik.errors.name}
                </Typography>
              ) : null}
            </CardContent>
          </Card>
          <Button
            type="submit"
            variant="contained"
            sx={{ border: 1, borderRadius: 1 }}
            data-testid="category-edit-modal-edit"
          >
            {t("buttons.edit")}
          </Button>
        </Box>
      </Grow>
    </Modal>
  );
}

function TextField({
  error,
  ...props
}: Omit<TextFieldProps, "error"> & { error?: string }): JSX.Element {
  return (
    <>
      <MuiTextField {...props} />
      {error ? (
        <Typography
          variant="subtitle2"
          sx={{ color: "red" }}
          data-testid="register-error-first_name"
        >
          {error}
        </Typography>
      ) : null}
    </>
  );
}
