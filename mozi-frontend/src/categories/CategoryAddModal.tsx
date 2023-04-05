import { Box, Grow, Modal } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import AddCategoryCard from "./AddCategoryCard";

interface Props {
  isOpenAdd: boolean;
  setIsOpenAdd?: Dispatch<SetStateAction<boolean>>;
}

export default function CategoryAddModal(props: Props) {
  const setIsOpenAdd = props.setIsOpenAdd;
  return (
    <Modal
      open={props.isOpenAdd}
      onClose={() => props.setIsOpenAdd?.(false)}
      data-testid="category-add-modal"
      style={{display:'flex',alignItems:'center',justifyContent:'center'}}
    >
      <Grow in={props.isOpenAdd}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "33%",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <AddCategoryCard setIsOpenAdd={setIsOpenAdd} />
        </Box>
      </Grow>
    </Modal>
  );
}
