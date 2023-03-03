import {
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { FormikErrors, useFormik } from "formik";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useApiContext } from "../../api/ApiContext";
import { AlertType } from "../../api/types";

interface Props {
  isOpenEdit: boolean;
  setIsOpenEdit: Dispatch<SetStateAction<boolean>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  categoryId: string;
  setAlert: Dispatch<SetStateAction<AlertType>>;
  
}

export default function CategoryEditModal(props: Props) {
  const { t } = useTranslation();
  const { editCategory } = useApiContext();
  const updateCategory = async (name:string) => {
    const categoryId = props.categoryId;
    console.log(categoryId);
    console.log(name);
    const setIsOpenEdit = props.setIsOpenEdit;
    const setAlert = props.setAlert

    const result = await editCategory({ id: categoryId, name });
    if (!result) return;

    const msg = t("successMessages.categoryEdit");
    setIsOpenEdit(false);
    setAlert({isOpen:true,message:msg,type:"success"})
  };

  interface Values {
    name: string;
  }

  const formik = useFormik({
    initialValues: {
      name: props.name,
    },
    onSubmit: async (values) => {
      updateCategory(values.name);
    },
    validate: (values) => {
      let errors: FormikErrors<Values> = {};
      if (!values.name) {
        const msg = t("formikErrors.nameReq");
        errors.name = msg;
      }

      return errors;
    },
  });

  return (
    <Modal
      open={props.isOpenEdit}
      onClose={() => props.setIsOpenEdit(false)}
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
              defaultValue={props.name}
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
        >
          {t("buttons.edit")}
        </Button>
      </Box>
    </Modal>
  );
}
