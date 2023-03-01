import { Box, Modal } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import AddCategoryCard from "../cards/AddCategoryCard";

interface Props {
  isOpenAdd: boolean;
  setIsOpenAdd: Dispatch<SetStateAction<boolean>>;
  setIsOpenAlert: Dispatch<SetStateAction<boolean>>;
  setAlertMessage: Dispatch<SetStateAction<string>>;
  setAlertType: Dispatch<SetStateAction<string>>;
}

export default function CategoryAddModal(props: Props) {
  const setIsOpenAdd = props.setIsOpenAdd;
  const setIsOpenAlert = props.setIsOpenAlert;
  const setAlertMessage = props.setAlertMessage;
  const setAlertType = props.setAlertType;
  return (
    <Modal
      open={props.isOpenAdd}
      onClose={() => props.setIsOpenAdd(false)}
      data-testid="category-add-modal"
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
        <AddCategoryCard
          setIsOpenAdd={setIsOpenAdd}
          setIsOpenAlert={setIsOpenAlert}
          setAlertMessage={setAlertMessage}
          setAlertType={setAlertType}
        />
      </Box>
    </Modal>
  );
}
