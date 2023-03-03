import { Alert } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { AlertType } from "../api/types";

interface Props{
  alert:AlertType,
  setAlert:Dispatch<SetStateAction<AlertType>>
}

export default function AlertComponent({
  alert,
  setAlert
}:Props) {
  if (alert.isOpen === true) {
    setTimeout(() => {
      setAlert({ isOpen: false, message: "", type: undefined });
    }, 5000);
    if (alert.type === "success") {
      return (
        <Alert
          sx={{
            marginRight: 2,
            marginLeft: 2,
            marginTop: 3,
            marginBottom: 3,
            position: "sticky",
            top: 1,
          }}
          variant="filled"
          severity="success"
          data-testid="alert-success"
        >
          {alert.message}
        </Alert>
      );
    } else {
      return (
        <Alert
          sx={{
            marginRight: 2,
            marginLeft: 2,
            marginTop: 3,
            marginBottom: 3,
            position: "sticky",
            top: 1,
          }}
          variant="filled"
          severity="error"
          data-testid="alert-error"
        >
          {alert.message}
        </Alert>
      );
    }
  } else return <></>;
}
