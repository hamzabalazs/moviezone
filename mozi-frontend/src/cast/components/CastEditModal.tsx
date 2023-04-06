import { useTranslation } from "react-i18next";
import { useSessionContext } from "../../auth/context/SessionContext";
import { Cast, Movie } from "../../gql/graphql";
import { useSnackbar } from "notistack";
import { useCast } from "../hooks/useCast";
import { useFormik } from "formik";
import { useAddCastSchema } from "../../common/validationFunctions";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grow,
  Modal,
  TextField as MuiTextField,
  TextFieldProps,
  Typography,
} from "@mui/material";

interface Props {
  cast?: Cast;
  movie: Movie | null;
  onClose?: () => void;
}

export default function CastEditModal({ cast,movie, onClose }: Props) {
  const { user, logOut } = useSessionContext();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { updateCast: UpdateCastAPI } = useCast(movie?.id || "");

  const handleUpdateCast = async (editedCast: Omit<Cast, "id" | "photo">) => {
    if(!cast) return;
    try {
      const result = await UpdateCastAPI(cast.id,editedCast.name);
      if (result) {
        const msg = "Cast edit success";
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

  const schema = useAddCastSchema(); // change this
  const formik = useFormik({
    initialValues: formikValues,
    onSubmit: handleUpdateCast,
    enableReinitialize: true,
    validationSchema: schema,
  });

  return (
    <Modal
      open={Boolean(cast)}
      onClose={() => onClose?.()}
      data-testid="movie-cast-edit-modal"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grow in={Boolean(cast)}>
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
            data-testid="movie-cast-edit-card"
          >
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Edit cast member
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
                inputProps={{ "data-testid": "movie-edit-cast-name" }}
                error={formik.errors.name}
              ></TextField>
            </CardContent>
            <CardActions disableSpacing sx={{ mt: "auto" }}>
              <Button
                size="small"
                sx={{ color: "text.secondary", border: 1, borderRadius: 1 }}
                type="submit"
                data-testid="movie-edit-cast"
              >
                Edit
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
          data-testid="movie-edit-cast-errors"
        >
          {error}
        </Typography>
      ) : null}
    </>
  );
}
