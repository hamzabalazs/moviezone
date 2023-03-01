import { Alert } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface Props {
  isOpenAlert: boolean;
  setIsOpenAlert: Dispatch<SetStateAction<boolean>>;
  alertType: string;
  setAlertType: Dispatch<SetStateAction<string>>;
  alertMessage: string;
}

export default function AlertComponent(props: Props) {
  if (props.isOpenAlert === true) {
    setTimeout(() => {
      props.setIsOpenAlert(false);
    }, 5000);
    if (props.alertType === "success") {
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
          {props.alertMessage}
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
          {props.alertMessage}
        </Alert>
      );
    }
  } else return <></>;
}
