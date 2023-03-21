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
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Category } from "../../api/types";
import * as Yup from "yup";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { useSnackbar } from "notistack";
import { GET_CATEGORIES } from "../../pages/Categories";
import { CATEGORY_EXISTS_MESSAGE, EXPIRED_TOKEN_MESSAGE, NOT_VALID_CATEGORY } from "../../common/errorMessages";
import { useSessionContext } from "../../api/SessionContext";

interface Props {
  category?: Category;
  onClose?: () => void;
}

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      id
      name
    }
  }
`;

export default function CategoryEditModal({ category, onClose }: Props) {
  const { t } = useTranslation();
  const [UpdateCategoryAPI] = useMutation(UPDATE_CATEGORY);
  const { enqueueSnackbar } = useSnackbar();
  const client = useApolloClient()
  const { logOut } = useSessionContext()

  const updateCategory = async (editedCategory: Omit<Category, "id">) => {
    if (category === undefined) return;
    const categoryId = category.id;
    try {
      const result = await UpdateCategoryAPI({
        variables: { input: { id: categoryId, name: editedCategory.name } },
        update:(cache) => {
          const data = client.readQuery({
            query:GET_CATEGORIES
          })
          if(!data) return;
          cache.writeQuery({
            query:GET_CATEGORIES,
            data:{
              getCategories:[...data.getCategories]
            }
          })
        }
      });
      if (result) {
        const msg = t("successMessages.categoryEdit");
        enqueueSnackbar(msg, { variant: "success" });
        onClose?.();
      }
    } catch (e: any) {
      if(e.message === EXPIRED_TOKEN_MESSAGE){
        const msg = t("failMessages.expiredToken");
        enqueueSnackbar(msg,{variant:"error"})
        logOut()
      }
      else if(e.message === CATEGORY_EXISTS_MESSAGE){
        const msg = t('category.categoryExists');
        enqueueSnackbar(msg,{variant:"error"})
      }
      else if(e.message === NOT_VALID_CATEGORY){
        const msg = t("validityFailure.categoryNotValid")
        enqueueSnackbar(msg, { variant: "error" });
      }
      else{
        const msg = t("someError");
        enqueueSnackbar(msg, { variant: "error" });
      }
    }
  };

  interface Values {
    name: string;
  }

  const schema = useEditCategorySchema();

  const formik = useFormik({
    initialValues: {
      name: category?.name || "",
    },
    onSubmit: updateCategory,
    enableReinitialize: true,
    validationSchema: schema,
  });

  //if(data) return <p style={{visibility:"hidden",height:"0px",margin:"0px"}}>Success</p>

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
