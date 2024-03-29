import { useTranslation } from "react-i18next";
import { Cast, Movie } from "../../gql/graphql";
import { useSnackbar } from "notistack";
import { useSessionContext } from "../../auth/context/SessionContext";
import { useCast } from "../hooks/useCast";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { EXPIRED_TOKEN_MESSAGE } from "../../common/errorMessages";
import { useNavigate } from "react-router-dom";

interface Props {
  cast?: Cast;
  movie: Movie | null;
  onClose?: () => void;
}

export default function CastDeleteDialog({ cast, movie, onClose }: Props) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { logOut } = useSessionContext();
  const navigate = useNavigate();
  const { deleteCast: DeleteCastAPI } = useCast(movie?.id || "");

  const handleDeletion = async () => {
    if (cast === undefined) return;
    try {
      const result = await DeleteCastAPI(cast.id);
      if (result) {
        const msg = t("successMessages.castDelete");
        enqueueSnackbar(msg, { variant: "success" });
        navigate(-1)
      }
    } catch (error: any) {
      console.log(error);
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

  return (
    <Dialog
      open={Boolean(cast)}
      onClose={() => onClose?.()}
      aria-labelledby="alert-delete-title"
      aria-describedby="alert-delete-description"
      data-testid="cast-delete-dialog"
    >
      <DialogTitle id="alert-delete-title">
        {t("deleteMessages.deleteCastTitle")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-delete-description">
          {t("deleteMessages.deleteCastContent")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDeletion}
          autoFocus
          data-testid="cast-delete-accept"
        >
          {t("buttons.accept")}
        </Button>
        <Button onClick={() => onClose?.()} data-testid="cast-delete-quit">
          {t("buttons.quit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
