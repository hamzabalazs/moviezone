import {
  Box,
  Button,
  Card,
  CardContent,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField as MuiTextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useApiContext } from "../../api/ApiContext";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { Movie } from "../../api/types";
import * as Yup from "yup";

interface Props {
  movie?: Movie;
  onClose?: () => void;
  setIsOpenAlert: Dispatch<SetStateAction<boolean>>;
  setAlertMessage: Dispatch<SetStateAction<string>>;
  setAlertType: Dispatch<SetStateAction<string>>;
}

export default function MovieEditModal({
  movie,
  onClose,
  setIsOpenAlert,
  setAlertMessage,
  setAlertType,
}: Props) {
  const { t } = useTranslation();
  const context = useApiContext();

  const updateMovie = async (editedMovie: Omit<Movie, "id" | "rating" | "poster">) => {
    console.log(movie)
    const poster = movie?.poster
    if (movie === undefined || poster === undefined) return;

    const result = await context.editMovie({
      id: movie?.id,
      ...editedMovie,
      poster
    });
    if (result) {
      const msg = t("successMessages.movieEdit");
      setIsOpenAlert(true);
      setAlertMessage(msg);
      setAlertType("success");
    }

    onClose?.();
  };

  const formikValues: Omit<Movie, "id" | "rating" | "poster"> = {
    title: movie?.title || "",
    description: movie?.description || "",
    releaseDate: movie?.releaseDate || "",
    categoryId: movie?.categoryId || ""
  };

  // const datevalidator =
  //   /(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/;


  

  const schema = useEditMovieSchema();

  const formik = useFormik({
    initialValues: formikValues,
    onSubmit:updateMovie,
    enableReinitialize: true,
    validationSchema: schema
  });

  return (
    <Modal
      open={Boolean(movie)}
      onClose={() => onClose?.()}
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
              name="title"
              onChange={formik.handleChange}
              value={formik.values.title}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "movie-edit-title" }}
              error={formik.errors.title}
            ></TextField>
            
            <Typography variant="subtitle1">
              {t("movie.description")}:{" "}
            </Typography>
            <TextField
              id="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "movie-edit-description" }}
              error={formik.errors.description}
            ></TextField>
            
            <Typography variant="subtitle1">
              {t("movie.releaseDate")}:{" "}
            </Typography>
            <TextField
              id="releaseDate"
              value={formik.values.releaseDate}
              onChange={formik.handleChange}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "movie-edit-releaseDate" }}
              error={formik.errors.releaseDate}
            ></TextField>
            
            <InputLabel id="category-select">{t("movie.category")}</InputLabel>
            <Select
              labelId="category-select"
              label={t("movie.category")}
              value={formik.values.categoryId}
              onChange={formik.handleChange}
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
          data-testid="register-error-firstName"
        >
          {error}
        </Typography>
      ) : null}
    </>
  );
}

function useEditMovieSchema() {
  const { t } = useTranslation();

  return Yup.object({
    title: Yup.string().required(t("formikErrors.titleReq") || ""),
    description: Yup.string().required(t("formikErrors.descriptionReq") || ""),
    releaseDate: Yup.string()
      .required(t("formikErrors.releaseDateReq") || ""),
      // .test(
      //   "len",
      //   t("formikErrors.passwordLength") || "",
      //   (val) => val.length > 5
      // ),
    categoryId: Yup.string().required(),
  });
}