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
import { AlertType, Movie } from "../../api/types";
import * as Yup from "yup";
import { datevalidator } from "../../common/datevalidator";

interface Props {
  movie?: Movie;
  onClose?: () => void;
  setAlert?: Dispatch<SetStateAction<AlertType>>;
  
}
export default function MovieEditModal({
  movie,
  onClose,
  setAlert
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
      setAlert?.({isOpen:true,message:msg,type:"success"})
    }

    onClose?.();
  };

  
  const formikValues: Omit<Movie, "id" | "rating" | "poster"> = {
    title: movie?.title || "",
    description: movie?.description || "",
    release_date: movie?.release_date || "",
    category: movie?.category || {id:"",name:""}
  };
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
              {t("movie.release_date")}:{" "}
            </Typography>
            <TextField
              id="release_date"
              value={formik.values.release_date}
              onChange={formik.handleChange}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "movie-edit-release_date" }}
              error={formik.errors.release_date}
            ></TextField>
            
            <InputLabel id="category-select">{t("movie.category")}</InputLabel>
            <Select
              labelId="category-select"
              label={t("movie.category")}
              name="category.id"
              value={formik.values.category.id}
              onChange={formik.handleChange}
              sx={{ border: 1, borderRadius: 1 }}
              data-testid="movie-edit-category"
              inputProps={{"data-testid":"movie-edit-categoryId"}}
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
          data-testid="movie-edit-button"
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

function useEditMovieSchema() {
  const { t } = useTranslation();

  return Yup.object({
    title: Yup.string().required(t("formikErrors.titleReq") || ""),
    description: Yup.string().required(t("formikErrors.descriptionReq") || ""),
    release_date: Yup.string()
      .required(t("formikErrors.release_dateReq") || "").matches(datevalidator,t("formikErrors.release_dateFormat") || ""),
    
  });
}