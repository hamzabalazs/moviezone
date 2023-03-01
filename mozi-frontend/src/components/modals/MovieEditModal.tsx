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

export default function MovieEditModal(props: Props) {
  const { t } = useTranslation();
  const context = useApiContext();
  const movieId = props.movieId;
  const poster = props.poster;
  const title = props.title;
  const description = props.description;
  const categoryId = props.categoryId;
  const releaseDate = props.releaseDate;
  const setIsOpenEdit = props.setIsOpenEdit;
  const setIsOpenAlert = props.setIsOpenAlert;
  const setAlertMessage = props.setAlertMessage;
  const setAlertType = props.setAlertType;
  const handleCategorySelect = (event: SelectChangeEvent) => {
    props.setCategoryId(event.target.value as string);
  };
  const updateMovie = async () => {
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
              defaultValue={props.title}
              onChange={(e) => {
                if (e.target.value !== null) props.setTitle(e.target.value);
              }}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "movie-edit-title" }}
            ></TextField>
            <Typography variant="subtitle1">
              {t("movie.description")}:{" "}
            </Typography>
            <TextField
              defaultValue={props.description}
              onChange={(e) => {
                if (e.target.value !== null)
                  props.setDescription(e.target.value);
              }}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "movie-edit-description" }}
            ></TextField>
            <Typography variant="subtitle1">
              {t("movie.releaseDate")}:{" "}
            </Typography>
            <TextField
              defaultValue={props.releaseDate}
              onChange={(e) => {
                if (e.target.value !== null)
                  props.setReleaseDate(e.target.value);
              }}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "movie-edit-releaseDate" }}
            ></TextField>
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
          variant="contained"
          onClick={updateMovie}
          sx={{ border: 1, borderRadius: 1 }}
        >
          {t("buttons.edit")}
        </Button>
      </Box>
    </Modal>
  );
}
