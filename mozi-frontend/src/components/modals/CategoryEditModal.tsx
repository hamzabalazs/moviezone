import {
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  TextField as MuiTextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { FormikErrors, useFormik } from "formik";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useApiContext } from "../../api/ApiContext";
import { AlertType, Category } from "../../api/types";
import * as Yup from "yup";

interface Props {
  category?: Category;
  onClose?: () => void;
  setAlert?: Dispatch<SetStateAction<AlertType>>;
}

export default function CategoryEditModal({
  category,
  onClose,
  setAlert,
}: Props) {
  const { t } = useTranslation();
  const { editCategory } = useApiContext();

  const updateCategory = async (editedCategory: Omit<Category,"id">) => {
    if(category === undefined) return;
    const categoryId = category.id
    const result = await editCategory({ id: categoryId, ...editedCategory });
    if (result){
      const msg = t("successMessages.categoryEdit");
      setAlert?.({ isOpen: true, message: msg, type: "success" });
    }

    onClose?.();
  };

  interface Values {
    name: string;
  }

  const schema = useEditCategorySchema();

  const formik = useFormik({
    initialValues: {
      name: category?.name || "",
    },
    onSubmit:updateCategory,
    enableReinitialize:true,
    validationSchema: schema
  });

  return (
    <Modal
      open={Boolean(category)}
      onClose={() => onClose?.()}
      data-testid="category-edit-modal"
    >
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
        component="form"
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
            <Typography variant="subtitle1">{t("category.name")}: </Typography>
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

function useEditCategorySchema() {
  const { t } = useTranslation();

  return Yup.object({
    name: Yup.string().required(t("formikErrors.nameReq") || ""),
    
  });
}