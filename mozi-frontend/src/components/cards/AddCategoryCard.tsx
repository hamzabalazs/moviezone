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
import { AlertType } from "../../api/types";
import { gql, useMutation } from "@apollo/client";

interface Props {
  setIsOpenAdd?: Dispatch<SetStateAction<boolean>>;
  setAlert?: Dispatch<SetStateAction<AlertType>>;
}

const ADD_CATEGORY = gql`
  mutation CreateCategory($input: AddCategoryInput!) {
    createCategory(input: $input) {
      id
      name
    }
  }
`;

interface Values {
  name: string;
}

export default function AddCategoryCard(props: Props) {
  const { t } = useTranslation();
  const [AddCategoryAPI,{data}] = useMutation(ADD_CATEGORY);

  const setIsOpenAdd = props.setIsOpenAdd;
  const setAlert = props.setAlert;
  const handleAddCategory = async (name: string) => {
    const result = await AddCategoryAPI({variables:{input:{name:name}}});
    if (!result) return;

    const msg = t("successMessages.categoryAdd");
    setIsOpenAdd?.(false);
    setAlert?.({ isOpen: true, message: msg, type: "success" });
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

  if(data) return <p style={{visibility:"hidden",height:"0px",margin:"0px"}}>Success</p>

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
