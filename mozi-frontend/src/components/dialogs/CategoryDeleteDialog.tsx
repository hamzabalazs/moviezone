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
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { useSnackbar } from "notistack";
import { GET_CATEGORIES } from "../../pages/Categories";
import { EXPIRED_TOKEN_MESSAGE } from "../../common/errorMessages";
import { useSessionContext } from "../../api/SessionContext";

interface Props {
  category?: Category;
  onClose?: () => void;
}

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($input: DeleteCategoryInput!) {
    deleteCategory(input: $input) {
      id
      name
    }
  }
`;

export default function CategoryDeleteDialog({ category, onClose }: Props) {
  const { t } = useTranslation();
  const [DeleteCategoryAPI] = useMutation(DELETE_CATEGORY);
  const { enqueueSnackbar } = useSnackbar();
  const client = useApolloClient();
  const { logOut } = useSessionContext()

  const handleDeletion = async () => {
    if (category === undefined) return;
    const categoryId = category.id;
    try{
      await DeleteCategoryAPI({
      variables: { input: { id: categoryId } },
        update:(cache,{data}) => {
          const categoriesData = client.readQuery({
            query:GET_CATEGORIES
          })
          if(!categoriesData) return;
          cache.writeQuery({
            query:GET_CATEGORIES,
            data:{
              getCategories:categoriesData.getCategories.filter((x:any) => x.id != data.deleteCategory.id)
            }
          })
        }
      });
      const msg = t("successMessages.categoryDelete");
      enqueueSnackbar(msg, { variant: "success" });
      onClose?.();
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
