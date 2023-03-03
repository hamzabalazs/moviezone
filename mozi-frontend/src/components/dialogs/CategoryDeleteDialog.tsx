import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useApiContext } from "../../api/ApiContext";
import { useTranslation } from "react-i18next";
import { AlertType, Category } from "../../api/types";

interface Props {
  category?: Category;
  onClose?: () => void;
  setAlert?: Dispatch<SetStateAction<AlertType>>;
}

export default function CategoryDeleteDialog({
  category,
  onClose,
  setAlert,
}: Props) {
  const { t } = useTranslation();
  const { deleteCategory } = useApiContext();

  const handleDeletion = async () => {
    if (category === undefined) return;
    const categoryId = category.id;

    const result = await deleteCategory(categoryId);
    if (result){
      const msg = t("successMessages.categoryDelete");
      setAlert?.({ isOpen: true, message: msg, type: "success" });

    }
    onClose?.()

  };

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
        <Button onClick={handleDeletion} autoFocus data-testid="category-delete-dialog-accept">
          {t("buttons.accept")}
        </Button>
        <Button onClick={() => onClose?.()} data-testid="category-delete-dialog-quit">
          {t("buttons.quit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
