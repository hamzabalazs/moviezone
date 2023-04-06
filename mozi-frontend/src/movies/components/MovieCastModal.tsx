import { useTranslation } from "react-i18next";
import { Cast, Movie } from "../../gql/graphql";
import { useSnackbar } from "notistack";
import { useSessionContext } from "../../auth/context/SessionContext";
import { useState } from "react";
import { useAddCastSchema } from "../../common/validationFunctions";
import { useFormik } from "formik";
import { useCast } from "../hooks/useCast";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grow,
  IconButton,
  Modal,
  TextField as MuiTextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { resizeFile } from "../../common/utils/resizeFile";
import { isString } from "lodash";
import { PhotoCamera } from "@mui/icons-material";

interface Props {
  movie?: Movie;
  onClose?: () => void;
}

export default function MovieCastModal({ movie, onClose }: Props) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { logOut } = useSessionContext();
  const [photo, setPhoto] = useState<string>("");
  const { addCast: AddCastAPI } = useCast(movie?.id || "");

  const handleAddCast = async (addedCast: Omit<Cast, "id" | "photo">) => {
    try {
      const result = await AddCastAPI(addedCast.name, photo);
      if (result) {
        setPhoto("")
        const msg = "Cast add success";
        enqueueSnackbar(msg, { variant: "success" });
        onClose?.();
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const formikValues: Omit<Cast, "id" | "photo"> = {
    name: "",
  };

  const schema = useAddCastSchema();
  const formik = useFormik({
    initialValues: formikValues,
    onSubmit: handleAddCast,
    enableReinitialize: true,
    validationSchema: schema,
  });

  return (
    <Modal
      open={Boolean(movie)}
      onClose={() => onClose?.()}
      data-testid="movie-cast-add-modal"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grow in={Boolean(movie)}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "18%",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
          component="form"
          onSubmit={formik.handleSubmit}
        >
          <Card
            variant="outlined"
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            data-testid="movie-cast-add-card"
          >
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Add cast member to movie
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: "auto" }}>
                Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                sx={{ border: 1, borderRadius: 1 }}
                inputProps={{ "data-testid": "movie-add-cast-name" }}
                error={formik.errors.name}
              ></TextField>
              <Typography variant="subtitle1" sx={{ mt: "auto", marginTop: 1 }}>
                Photo
              </Typography>

              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                defaultValue={photo}
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  name="poster"
                  id="poster"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const image = await resizeFile(file);
                    if (isString(image)) setPhoto(image);
                  }}
                  data-testid="movie-add-cast-photo"
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
                  src={photo}
                />
              </IconButton>
            </CardContent>
            <CardActions disableSpacing sx={{ mt: "auto" }}>
              <Button
                size="small"
                sx={{ color: "text.secondary", border: 1, borderRadius: 1 }}
                type="submit"
                data-testid="movie-add-cast"
              >
                Add
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Grow>
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
          data-testid="movie-add-errors"
        >
          {error}
        </Typography>
      ) : null}
    </>
  );
}
