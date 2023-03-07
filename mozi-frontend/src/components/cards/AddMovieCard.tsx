import { PhotoCamera } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField as MuiTextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { FormikErrors, useFormik } from "formik";
import { isString } from "lodash";
import { Dispatch, SetStateAction, useState } from "react";
import { resizeFile } from "../../api/movie/MovieApi";
import { useTranslation } from "react-i18next";
import { useApiContext } from "../../api/ApiContext";
import { AlertType, Movie } from "../../api/types";
import * as Yup from "yup";
import { datevalidator } from "../../common/datevalidator";

interface Props {
  setIsOpenAdd?: Dispatch<SetStateAction<boolean>>;
  setAlert?: Dispatch<SetStateAction<AlertType>>;
}

export default function AddMovieCard(props: Props) {
  const { t } = useTranslation();
  const context = useApiContext();
  const [poster, setPoster] = useState("");
  const { addMovie } = useApiContext();
  const setIsOpenAdd = props.setIsOpenAdd;
  const setAlert = props.setAlert;
  const handleAddMovie = async (addedMovie: Omit<Movie, "id" | "rating" | "poster">) => {
    const result = await addMovie({ ...addedMovie,poster });
    if (result) {
      const msg = t("successMessages.movieAdd");
      setAlert?.({ isOpen: true, message: msg, type: "success" });
      setIsOpenAdd?.(false);
    }
  };

  const formikValues: Omit<Movie, "id" | "rating" | "poster"> = {
    title: "",
    description: "",
    releaseDate: "",
    categoryId: "",

  };

  const schema = useAddMovieSchema();
  const formik = useFormik({
    initialValues: formikValues,
    onSubmit:handleAddMovie,
    enableReinitialize:true,
    validationSchema: schema,
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent>
          <Typography variant="h3" gutterBottom>
            {t("addTitle.movie")}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: "auto" }}>
            {t("movie.title")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="title"
            name="title"
            onChange={formik.handleChange}
            value={formik.values.title}
            sx={{ border: 1, borderRadius: 1 }}
            inputProps={{ "data-testid": "movie-add-title" }}
            error={formik.errors.title}
          ></TextField>
          <Typography variant="subtitle1" sx={{ mt: "auto" }}>
            {t("movie.description")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="description"
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            sx={{ border: 1, borderRadius: 1 }}
            inputProps={{ "data-testid": "movie-add-description" }}
            error={formik.errors.description}
          ></TextField>
          <Typography variant="subtitle1" sx={{ mt: "auto" }}>
            {t("movie.releaseDate")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="releaseDate"
            name="releaseDate"
            sx={{ marginBottom: 1, border: 1, borderRadius: 1 }}
            value={formik.values.releaseDate}
            onChange={formik.handleChange}
            inputProps={{ "data-testid": "movie-add-releaseDate" }}
            error={formik.errors.releaseDate}
          ></TextField>
          <InputLabel id="category-select">{t("movie.category")}</InputLabel>
          <Select
            labelId="category-select"
            label="Category"
            value={formik.values.categoryId}
            name="categoryId"
            id="categoryId"
            onChange={formik.handleChange}
            sx={{ border: 1, borderRadius: 1 }}
            inputProps={{ "data-testid": "movie-add-category" }}
          >
            {context.categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          {formik.errors.categoryId ? (
            <Typography
              variant="subtitle2"
              sx={{ color: "red" }}
              data-testid="register-error-first_name"
            >
              {formik.errors.categoryId}
            </Typography>
          ) : null}
          <Typography variant="subtitle1" sx={{ mt: "auto", marginTop: 1 }}>
            {t("movie.poster")}
          </Typography>

          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            defaultValue={poster}
          >
            <input
              hidden
              accept="image/*"
              type="file"
              name="poster"
              id="poster"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                console.log(file);
                if (!file) return;
                const image = await resizeFile(file);
                if (isString(image)) setPoster(image)
              }}
              data-testid="movie-add-poster"
            />
            <PhotoCamera />
            <img
              alt=""
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "5px",
                width: "150px",
                marginLeft: 10,
              }}
              src={poster}
            />
          </IconButton>
        </CardContent>
        <CardActions disableSpacing sx={{ mt: "auto" }}>
          <Button
            size="small"
            sx={{ color: "text.secondary", border: 1, borderRadius: 1 }}
            type="submit"
            data-testid="movie-add-button"
          >
            {t("buttons.add")}
          </Button>
        </CardActions>
      </Card>
    </Box>
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

function useAddMovieSchema() {
  const { t } = useTranslation();

  return Yup.object({
    title: Yup.string().required(t("formikErrors.titleReq") || ""),
    description: Yup.string().required(t("formikErrors.descriptionReq") || ""),
    releaseDate: Yup.string().required(t("formikErrors.releaseDateReq") || "").matches(datevalidator,t("formikErrors.releaseDateFormat") || ""),
    categoryId: Yup.string().required(t("formikErrors.categoryReq") || ""),
  });
}
