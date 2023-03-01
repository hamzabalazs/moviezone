import {
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useApiContext } from "../../api/ApiContext";

interface Props {
  isOpenEdit: boolean;
  setIsOpenEdit: Dispatch<SetStateAction<boolean>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  categoryId: string;
  setIsOpenAlert: Dispatch<SetStateAction<boolean>>;
  setAlertMessage: Dispatch<SetStateAction<string>>;
  setAlertType: Dispatch<SetStateAction<string>>;
}

export default function CategoryEditModal(props: Props) {
  const { t } = useTranslation();
  const { editCategory } = useApiContext();
  const updateCategory = async () => {
    const categoryId = props.categoryId;
    const name = props.name;
    console.log(categoryId);
    console.log(name);
    const setIsOpenEdit = props.setIsOpenEdit;
    const setIsOpenAlert = props.setIsOpenAlert;
    const setAlertMessage = props.setAlertMessage;
    const setAlertType = props.setAlertType;

    const result = await editCategory({ id: categoryId, name });
    if (!result) return;

    const msg = t("successMessages.categoryEdit");
    setIsOpenEdit(false);
    setIsOpenAlert(true);
    setAlertMessage(msg);
    setAlertType("success");
  };

  return (
    <Modal
      open={props.isOpenEdit}
      onClose={() => props.setIsOpenEdit(false)}
      data-testid="category-edit-modal"
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
          {t("category.selectedCategory")}
        </Typography>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent>
            <Typography variant="subtitle1">{t("category.name")}: </Typography>
            <TextField
              defaultValue={props.name}
              onChange={(e) => {
                props.setName(e.target.value);
              }}
              sx={{ border: 1, borderRadius: 1 }}
              inputProps={{ "data-testid": "category-edit-modal-name" }}
            ></TextField>
          </CardContent>
        </Card>
        <Button
          variant="contained"
          onClick={updateCategory}
          sx={{ border: 1, borderRadius: 1 }}
        >
          {t("buttons.edit")}
        </Button>
      </Box>
    </Modal>
  );
}
