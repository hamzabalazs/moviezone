import { render, screen } from "@testing-library/react";
import { AlertType } from "../api/types";
import AlertComponent from "./AlertComponent";

function renderAlert(
  alert:AlertType,
  setAlert:jest.Mock<any,any>
  
) {
  render(
    <AlertComponent
      alert={alert}
      setAlert={setAlert}
    />
  );
}



test("alert success renders correctly", async () => {
  jest.useFakeTimers();
  const alertType:"error"|"success"|undefined = "success"
  const alert = {isOpen:true,message:"alertsuccessmessage",type:alertType}
  const setAlert = jest.fn();
  renderAlert(alert,setAlert);

  const alertdiv = screen.getByTestId("alert-success");
  expect(alertdiv).toBeInTheDocument();
  expect(alertdiv).toHaveTextContent("alertsuccessmessage");
  expect(screen.getByTestId("SuccessOutlinedIcon")).toBeInTheDocument();
  expect(setAlert).toHaveBeenCalledTimes(0);

  jest.runAllTimers();

  expect(setAlert).toHaveBeenCalledTimes(1);
});

test("alert error renders correctly", async () => {
  jest.useFakeTimers();
  const alertType:"error"|"success"|undefined = "error"
  const alert = {isOpen:true,message:"alerterrormessage",type:alertType}
  const setAlert = jest.fn();
  renderAlert(alert,setAlert);

  const alertdiv = screen.getByTestId("alert-error");
  expect(alertdiv).toBeInTheDocument();
  expect(alertdiv).toHaveTextContent("alerterrormessage");
  expect(screen.getByTestId("ErrorOutlineIcon")).toBeInTheDocument();
  expect(setAlert).toHaveBeenCalledTimes(0);

  jest.runAllTimers();

  expect(setAlert).toHaveBeenCalledTimes(1);
});
