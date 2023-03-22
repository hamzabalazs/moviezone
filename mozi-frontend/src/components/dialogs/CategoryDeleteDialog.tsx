import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Category } from "../../api/types";
import { useSnackbar } from "notistack";
import { EXPIRED_TOKEN_MESSAGE } from "../../common/errorMessages";
import { useSessionContext } from "../../api/SessionContext";
import { useCategory } from "../../api/category/useCategory";

interface Props {
  category?: Category;
  onClose?: () => void;
}



export default function CategoryDeleteDialog({ category, onClose }: Props) {
  const { t } = useTranslation();
  const {deleteCategory:DeleteCategoryAPI} = useCategory()
  const { enqueueSnackbar } = useSnackbar();
  const { logOut } = useSessionContext()

  const handleDeletion = async () => {
    if (category === undefined) return;
    const categoryId = category.id;
    try{
      const result = await DeleteCategoryAPI(categoryId)
      console.log(result)
      if(result){
        const msg = t("successMessages.categoryDelete");
        enqueueSnackbar(msg, { variant: "success" });
        onClose?.();
      }
    }catch(error:any){
      if(error.message === EXPIRED_TOKEN_MESSAGE){
        const msg = t("failMessages.expiredToken");
        enqueueSnackbar(msg, { variant: "error" });
        logOut();
      }
    }
  }

  return (
    <Dialog
      open={Boolean(category)}
      onClose={() => onClose?.()}
      aria-labelledby="alert-delete-title"
      aria-describedby="alert-delete-description"
      data-testid="category-delete-dialog"
    >
      <DialogTitle id="alert-delete-title">
        {t("deleteMessages.deleteCategoryTitle")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-delete-description">
          {t("deleteMessages.deleteCategoryContent")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDeletion}
          autoFocus
          data-testid="category-delete-dialog-accept"
        >
          {t("buttons.accept")}
        </Button>
        <Button
          onClick={() => onClose?.()}
          data-testid="category-delete-dialog-quit"
        >
          {t("buttons.quit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
