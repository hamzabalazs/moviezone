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
import { AlertType } from "../../api/types";

interface Props {
  isOpenDelete: boolean;
  setIsOpenDelete: Dispatch<SetStateAction<boolean>>;
  categoryId: string;
  setAlert: Dispatch<SetStateAction<AlertType>>;
  
}

export default function CategoryDeleteDialog(props: Props) {
  const { t } = useTranslation();
  const { deleteCategory } = useApiContext();
  const handleDeletion = async () => {
    const categoryId = props.categoryId;
    const setIsOpenDelete = props.setIsOpenDelete;
    const setAlert = props.setAlert

    const result = await deleteCategory(categoryId);
    if (!result) return;

    const msg = t("successMessages.categoryDelete");
    setIsOpenDelete(false);
    setAlert({isOpen:true,message:msg,type:"success"})
  };

  return (
    <Dialog
      open={props.isOpenDelete}
      onClose={() => props.setIsOpenDelete(false)}
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
        <Button onClick={handleDeletion} autoFocus>
          {t("buttons.accept")}
        </Button>
        <Button onClick={() => props.setIsOpenDelete(false)}>
          {t("buttons.quit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
