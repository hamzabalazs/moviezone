import {
  Box,
  Button,
  Card,
  CardContent,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useApiContext } from "../../api/ApiContext";
import { useTranslation } from "react-i18next";
import { FormikErrors, useFormik } from "formik";

interface Props {
  isOpenEdit: boolean;
  setIsOpenEdit: Dispatch<SetStateAction<boolean>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setReleaseDate: Dispatch<SetStateAction<string>>;
  setCategoryId: Dispatch<SetStateAction<string>>;
  movieId: string;
  poster: string;
  title: string;
  description: string;
  categoryId: string;
  releaseDate: string;
  setIsOpenAlert: Dispatch<SetStateAction<boolean>>;
  setAlertMessage: Dispatch<SetStateAction<string>>;
  setAlertType: Dispatch<SetStateAction<string>>;
}

interface Values {
  title: string;
  description: string;
  releaseDate: string;
}

export default function MovieEditModal(props: Props) {
  const { t } = useTranslation();
  const context = useApiContext();
  const movieId = props.movieId;
  const poster = props.poster;
  const categoryId = props.categoryId;
  const setIsOpenEdit = props.setIsOpenEdit;
  const setIsOpenAlert = props.setIsOpenAlert;
  const setAlertMessage = props.setAlertMessage;
  const setAlertType = props.setAlertType;
  const handleCategorySelect = (event: SelectChangeEvent) => {
    props.setCategoryId(event.target.value as string);
  };
  const updateMovie = async (title:string,description:string,releaseDate:string) => {
    const result = await context.editMovie({
      id: movieId,
      title,
      description,
      poster,
      releaseDate,
      categoryId,
    });
    if (!result) return;

    const msg = t("successMessages.movieEdit");
    setIsOpenEdit(false);
    setIsOpenAlert(true);
    setAlertMessage(msg);
    setAlertType("success");
  };

  const formikValues = {
    title:props.title,
    description: props.description,
    releaseDate: props.releaseDate
  }

  const datevalidator =
    /(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/;


  const formik = useFormik({
    initialValues: formikValues,
    onSubmit: (values) => {
      const title = values.title;
      const description = values.description;
      const releaseDate = values.releaseDate;
      updateMovie(title, description, releaseDate);
    },
    enableReinitialize: true,
    validate: (values) => {
      let errors: FormikErrors<Values> = {};

      if (!values.title) {
        const msg = t("formikErrors.titleReq");
        errors.title = msg;
      }
      if (!values.description) {
        const msg = t("formikErrors.descriptionReq");
        errors.description = msg;
      }
      if (!values.releaseDate) {
        const msg = t("formikErrors.releaseDateReq");
        errors.releaseDate = msg;
      } else if (!datevalidator.test(values.releaseDate)) {
        const msg = t("formikErrors.releaseDateFormat");
        errors.releaseDate = msg;
      }

      return errors;
    },
  });

  return (
    <Modal
      open={props.isOpenEdit}
      onClose={() => props.setIsOpenEdit(false)}
      data-testid="movie-edit-modal"
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
          {t("movie.selectedMovie")}
        </Typography>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent>
            <Typography variant="subtitle1">{t("movie.title")}: </Typography>
            <TextField
              id="title"
              onChange={formik.handleChange}
              defaultValue={formik.values.title}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "movie-edit-title" }}
            ></TextField>
            {formik.errors.title ? (
            <Typography variant="subtitle2" sx={{ color: "red" }}>
              {formik.errors.title}
            </Typography>
          ) : null}
            <Typography variant="subtitle1">
              {t("movie.description")}:{" "}
            </Typography>
            <TextField
              id="description"
              defaultValue={formik.values.description}
              onChange={formik.handleChange}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "movie-edit-description" }}
            ></TextField>
            {formik.errors.description ? (
            <Typography variant="subtitle2" sx={{ color: "red" }}>
              {formik.errors.description}
            </Typography>
          ) : null}
            <Typography variant="subtitle1">
              {t("movie.releaseDate")}:{" "}
            </Typography>
            <TextField
              id="releaseDate"
              defaultValue={formik.values.releaseDate}
              onChange={formik.handleChange}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "movie-edit-releaseDate" }}
            ></TextField>
            {formik.errors.releaseDate ? (
            <Typography variant="subtitle2" sx={{ color: "red" }}>
              {formik.errors.releaseDate}
            </Typography>
          ) : null}
            <InputLabel id="category-select">{t("movie.category")}</InputLabel>
            <Select
              labelId="category-select"
              label={t("movie.category")}
              defaultValue={props.categoryId}
              value={props.categoryId}
              onChange={handleCategorySelect}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "movie-edit-category" }}
            >
              {context.categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
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
