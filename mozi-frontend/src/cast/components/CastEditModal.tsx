import { useTranslation } from "react-i18next";
import { useSessionContext } from "../../auth/context/SessionContext";
import { Cast, Movie } from "../../gql/graphql";
import { useSnackbar } from "notistack";
import { useCast } from "../hooks/useCast";
import { useFormik } from "formik";
import { useEditCastSchema } from "../../common/validationFunctions";
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
import { EXPIRED_TOKEN_MESSAGE } from "../../common/errorMessages";

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
      const result = await UpdateCastAPI(cast.id,editedCast.name,editedCast.description);
      if (result) {
        const msg = "Cast edit success";
        enqueueSnackbar(msg, { variant: "success" });
        onClose?.();
      }
    } catch (error: any) {
      console.log(error.message);
      if( error.message === EXPIRED_TOKEN_MESSAGE){
        const msg = t("failMessages.expiredToken");
        enqueueSnackbar(msg, { variant: "error" });
        logOut();
      } else {
        const msg = t("someError");
        enqueueSnackbar(msg, { variant: "error" });
      }
    }
  };

  const formikValues: Omit<Cast, "id" | "photo"> = {
    name: cast?.name || "",
    description: cast?.description || "",
  };

  const schema = useEditCastSchema();
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
                {t('cast.selectedCast')}
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: "auto" }}>
                {t('cast.name')}
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
              <Typography variant="subtitle1" sx={{ mt: "auto" }}>
                {t('cast.description')}
              </Typography>
              <TextField
                fullWidth
                size="small"
                id="description"
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
                sx={{ border: 1, borderRadius: 1 }}
                inputProps={{ "data-testid": "movie-edit-cast-description" }}
                error={formik.errors.description}
              ></TextField>
            </CardContent>
            <CardActions disableSpacing sx={{ mt: "auto" }}>
              <Button
                size="small"
                sx={{ color: "text.secondary", border: 1, borderRadius: 1 }}
                type="submit"
                data-testid="movie-edit-cast"
              >
                {t('buttons.edit')}
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
