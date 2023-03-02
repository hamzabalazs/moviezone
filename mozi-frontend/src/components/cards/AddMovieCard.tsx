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
  TextField,
  Typography,
} from "@mui/material";
import { FormikErrors, useFormik } from "formik";
import { isString } from "lodash";
import { Dispatch, SetStateAction, useState } from "react";
import { resizeFile } from "../../api/movie/MovieApi";
import { useTranslation } from "react-i18next";
import { useApiContext } from "../../api/ApiContext";

interface Props {
  setIsOpenAdd: Dispatch<SetStateAction<boolean>>;
  setIsOpenAlert: Dispatch<SetStateAction<boolean>>;
  setAlertMessage: Dispatch<SetStateAction<string>>;
  setAlertType: Dispatch<SetStateAction<string>>;
}

interface Values {
  title: string;
  description: string;
  releaseDate: string;
}

export default function AddMovieCard(props: Props) {
  const { t } = useTranslation();
  const context = useApiContext();
  const [categoryId, setCategoryId] = useState("");
  const [poster, setPoster] = useState("");
  const { addMovie } = useApiContext();
  const setIsOpenAdd = props.setIsOpenAdd;
  const setIsOpenAlert = props.setIsOpenAlert;
  const setAlertMessage = props.setAlertMessage;
  const setAlertType = props.setAlertType;
  const handleAddMovie = async (
    title: string,
    description: string,
    releaseDate: string
  ) => {
    const result = await addMovie({
      title,
      description,
      releaseDate,
      categoryId,
      poster,
    });
    if (!result) return;

    const msg = t("successMessages.movieAdd");
    setIsOpenAdd(false);
    setIsOpenAlert(true);
    setAlertMessage(msg);
    setAlertType("success");
  };

  const datevalidator =
    /(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/;

  const handleSelect = (event: SelectChangeEvent) => {
    setCategoryId(event.target.value as string);
  };
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      releaseDate: "",
    },
    onSubmit: (values) => {
      const title = values.title;
      const description = values.description;
      const releaseDate = values.releaseDate;
      handleAddMovie(title, description, releaseDate);
    },
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
            inputProps={{ "data-testid": "movie-add-modal-title" }}
          ></TextField>
          {formik.errors.title ? (
            <Typography variant="subtitle2" sx={{ color: "red" }}>
              {formik.errors.title}
            </Typography>
          ) : null}
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
            inputProps={{ "data-testid": "movie-add-modal-description" }}
          ></TextField>
          {formik.errors.description ? (
            <Typography variant="subtitle2" sx={{ color: "red" }}>
              {formik.errors.description}
            </Typography>
          ) : null}
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
            inputProps={{ "data-testid": "movie-add-modal-releaseDate" }}
          ></TextField>
          {formik.errors.releaseDate ? (
            <Typography variant="subtitle2" sx={{ color: "red" }}>
              {formik.errors.releaseDate}
            </Typography>
          ) : null}
          <InputLabel id="category-select">{t("movie.category")}</InputLabel>
          <Select
            labelId="category-select"
            label="Category"
            value={categoryId}
            onChange={handleSelect}
            sx={{ border: 1, borderRadius: 1 }}
            inputProps={{ "data-testid": "movie-add-modal-category" }}
          >
            {context.categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
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
              onChange={async (e) => {
                const file = e.target.files?.[0];
                console.log(file);
                if (!file) return;
                const image = await resizeFile(file);
                if (isString(image)) setPoster(image);
              }}
              data-testid="movie-add-modal-poster"
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
          >
            {t("buttons.add")}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
