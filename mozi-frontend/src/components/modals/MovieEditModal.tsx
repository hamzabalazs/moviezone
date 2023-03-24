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
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import LoadingComponent from "../LoadingComponent";
import { useSessionContext } from "../../api/SessionContext";
import {
  EXPIRED_TOKEN_MESSAGE,
  NOT_VALID_MOVIE,
} from "../../common/errorMessages";
import { useMovie } from "../../api/movie/useMovie";
import { useEditMovieSchema } from "../../common/validationFunctions";
import { useCategoriesData } from "../../pages/useCategoriesData";
import { Category, Movie } from "../../gql/graphql";

interface Props {
  movie?: Movie;
  onClose?: () => void;
}

export default function MovieEditModal({ movie, onClose }: Props) {
  const { t } = useTranslation();
  const { updateMovie: UpdateMovieAPI } = useMovie();
  const { categories, loading } =
    useCategoriesData();
  const { enqueueSnackbar } = useSnackbar();
  const { logOut } = useSessionContext();

  const updateMovie = async (
    editedMovie: Omit<Movie, "id" | "rating" | "poster">
  ) => {
    const poster = movie?.poster;
    if (movie === undefined || poster === undefined) return;
    const id = movie.id;
    try {
      const result = await UpdateMovieAPI(
        id,
        editedMovie.title,
        editedMovie.description,
        poster,
        editedMovie.release_date,
        editedMovie.category.id
      );
      if(result){
        const msg = t("successMessages.movieEdit");
        enqueueSnackbar(msg, { variant: "success" });
        onClose?.();
      }
    } catch (error: any) {
      if (error.message === EXPIRED_TOKEN_MESSAGE) {
        const msg = t("failMessages.expiredToken");
        enqueueSnackbar(msg, { variant: "error" });
        logOut();
      } else if (error.message === NOT_VALID_MOVIE) {
        const msg = t("validityFailure.movieNotValid");
        enqueueSnackbar(msg, { variant: "error" });
      } else {
        const msg = t("someError");
        enqueueSnackbar(msg, { variant: "error" });
      }
    }
  };

  const formikValues: Omit<Movie, "id" | "rating" | "poster"> = {
    title: movie?.title || "",
    description: movie?.description || "",
    release_date: movie?.release_date || "",
    category: movie?.category || { id: "", name: "" },
  };
  const schema = useEditMovieSchema();

  const formik = useFormik({
    initialValues: formikValues,
    onSubmit: updateMovie,
    enableReinitialize: true,
    validationSchema: schema,
  });

  if (loading) return LoadingComponent(loading);

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
              inputProps={{ "data-testid": "movie-edit-categoryId" }}
            >
              {categories.map((category: Category) => (
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
