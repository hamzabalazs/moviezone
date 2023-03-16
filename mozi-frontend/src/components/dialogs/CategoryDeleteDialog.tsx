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
  const [DeleteCategoryAPI, { data }] = useMutation(DELETE_CATEGORY);
  const { enqueueSnackbar } = useSnackbar();
  const client = useApolloClient();

  const handleDeletion = async () => {
    if (category === undefined) return;
    const categoryId = category.id;

    const result = await DeleteCategoryAPI({
      variables: { input: { id: categoryId } },
      update:(cache,{data}) => {
        const { getCategories } = client.readQuery({
          query:GET_CATEGORIES
        })
        cache.writeQuery({
          query:GET_CATEGORIES,
          data:{
            getCategories:getCategories.filter((x:any) => x.id != data.deleteCategory.id)
          }
        })
      }
    });
    if (result) {
      const msg = t("successMessages.categoryDelete");
      enqueueSnackbar(msg, { variant: "success" });
    }
    onClose?.();
  };

  //if(data) return <p style={{visibility:"hidden",height:"0px",margin:"0px"}}>Success</p>

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
