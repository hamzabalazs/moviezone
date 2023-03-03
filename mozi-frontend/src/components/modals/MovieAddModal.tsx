import { Box, Modal } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { AlertType } from "../../api/types";
import AddMovieCard from "../cards/AddMovieCard";

interface Props {
  isOpenAdd: boolean;
  setIsOpenAdd?: Dispatch<SetStateAction<boolean>>;
  setAlert?: Dispatch<SetStateAction<AlertType>>;
  
}

export default function MovieAddModal(props: Props) {
  const setIsOpenAdd = props.setIsOpenAdd;
  const setAlert = props.setAlert
  return (
    <Modal
      open={props.isOpenAdd}
      onClose={() => props.setIsOpenAdd?.(false)}
      data-testid="movie-add-modal"
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
        <AddMovieCard
          setIsOpenAdd={setIsOpenAdd}
          setAlert={setAlert}
        />
      </Box>
    </Modal>
  );
}
