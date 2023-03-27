import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { FormikErrors, useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { CATEGORY_EXISTS_MESSAGE, EXPIRED_TOKEN_MESSAGE, NOT_VALID_CATEGORY, UNAUTHORIZED_MESSAGE } from "../common/errorMessages"
import { useSessionContext } from "../auth/SessionContext";
import { useCategory } from "./useCategory";

interface Props {
  setIsOpenAdd?: Dispatch<SetStateAction<boolean>>;
}

interface Values {
  name: string;
}

export default function AddCategoryCard(props: Props) {
  const { t } = useTranslation();
  const {addCategory: AddCategoryAPI} = useCategory()
  const { enqueueSnackbar } = useSnackbar();
  const { logOut } = useSessionContext()

  const setIsOpenAdd = props.setIsOpenAdd;
  const handleAddCategory = async (name: string) => {
    try {
      const result = await AddCategoryAPI(name);
      if(result){
        const msg = t("successMessages.categoryAdd");
        setIsOpenAdd?.(false);
        enqueueSnackbar(msg, { variant: "success" });
      }
    } catch (error: any) {
      if(error.message === EXPIRED_TOKEN_MESSAGE){
        const msg = t("failMessages.expiredToken");
        enqueueSnackbar(msg, { variant: "error" });
        logOut();
      }
      else if(error.message === CATEGORY_EXISTS_MESSAGE){
        const msg = t("failMessages.addSameCategory");
        enqueueSnackbar(msg, { variant: "error" });
      }
      else if(error.message === NOT_VALID_CATEGORY){
        const msg = t("validityFailure.categoryNotValid")
        enqueueSnackbar(msg, { variant: "error" });
      }
      else{
        const msg = t("someError");
        enqueueSnackbar(msg, { variant: "error" });
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: (values) => {
      const name = values.name;
      handleAddCategory(name);
    },
    validate: (values) => {
      let errors: FormikErrors<Values> = {};

      if (!values.name) {
        const msg = t("formikErrors.categoryReq");
        errors.name = msg;

        return errors;
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          border: 2,
          borderColor: "primary.light",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {t("addTitle.category")}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: "auto" }}>
            {t("category.name")}:
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="name"
            onChange={formik.handleChange}
            value={formik.values.name}
            sx={{ border: 1, borderRadius: 1 }}
            inputProps={{ "data-testid": "category-add-name" }}
          ></TextField>
          {formik.errors.name ? (
            <Typography variant="subtitle2" sx={{ color: "red" }}>
              {formik.errors.name}
            </Typography>
          ) : null}
        </CardContent>
        <CardActions disableSpacing sx={{ mt: "auto" }}>
          <Button
            size="small"
            sx={{ color: "text.secondary", border: 1, borderRadius: 1 }}
            type="submit"
            data-testid="category-add-button"
          >
            {t("buttons.add")}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
