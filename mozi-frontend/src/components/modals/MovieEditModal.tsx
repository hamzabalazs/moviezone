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
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { Category, Movie } from "../../api/types";
import * as Yup from "yup";
import { datevalidator } from "../../common/datevalidator";
import LoadingComponent from "../LoadingComponent";
import { GET_MOVIE_BY_ID } from "../../pages/MoviePage";
import { useSessionContext } from "../../api/SessionContext";
import { EXPIRED_TOKEN_MESSAGE } from "../../common/errorMessages";

interface Props {
  movie?: Movie;
  onClose?: () => void;
}

const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
    }
  }
`;
const UPDATE_MOVIE = gql`
  mutation UpdateMovie($input: UpdateMovieInput!) {
  updateMovie(input: $input) {
    id
    title
    description
    poster
    release_date
    category {
      id
      name
    }
    rating
  }
}
`;

export default function MovieEditModal({ movie, onClose }: Props) {
  const { t } = useTranslation();
  const [UpdateMovieAPI] = useMutation(UPDATE_MOVIE);
  const { data: categoriesData, loading: categoriesLoading } =
    useQuery(GET_CATEGORIES);
  const { enqueueSnackbar } = useSnackbar();
  const client = useApolloClient();
  const { logOut } = useSessionContext();

  const updateMovie = async (
    editedMovie: Omit<Movie, "id" | "rating" | "poster">
  ) => {
    const poster = movie?.poster;
    if (movie === undefined || poster === undefined) return;
    const id = movie.id;
    try {
      await UpdateMovieAPI({
        variables: {
          input: {
            id: movie.id,
            title: editedMovie.title,
            description: editedMovie.description,
            poster: poster,
            release_date: editedMovie.release_date,
            category_id: editedMovie.category.id,
          },
        },
        update: (cache,{data}) => {
          const movieData = client.readQuery({
            query: GET_MOVIE_BY_ID,
            variables: { input: { id } },
          });
          if (!movieData) return;
          cache.writeQuery({
            query: GET_MOVIE_BY_ID,
            variables: { input: { id } },
            data: {
              getMovieById: data.updateMovie,
            },
          });
        },
      });
      const msg = t("successMessages.movieEdit");
      enqueueSnackbar(msg, { variant: "success" });
      onClose?.();
    } catch (error: any) {
      console.log(error.message)
      if (error.message === EXPIRED_TOKEN_MESSAGE) {
        const msg = t("failMessages.expiredToken");
        enqueueSnackbar(msg, { variant: "error" });
        logOut();
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

  if (categoriesLoading) return LoadingComponent(categoriesLoading);
  //if(data) return <p style={{visibility:"hidden",height:"0px",margin:"0px"}}>Success</p>

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
              {categoriesData.getCategories.map((category: Category) => (
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
      .required(t("formikErrors.release_dateReq") || "")
      .matches(datevalidator, t("formikErrors.release_dateFormat") || ""),
  });
}
