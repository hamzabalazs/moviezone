import { render, screen } from "@testing-library/react";
import AlertComponent from "./AlertComponent";

function renderAlert(
  isOpenAlert: boolean,
  alertType: string,
  alertMessage: string,
  setIsOpenAlert: jest.Mock<any, any>
) {
  render(
    <AlertComponent
      isOpenAlert={isOpenAlert}
      setIsOpenAlert={setIsOpenAlert}
      alertType={alertType}
      setAlertType={jest.fn()}
      alertMessage={alertMessage}
    />
  );
}

test("alert success renders correctly", async () => {
  jest.useFakeTimers();
  const isOpenAlert = true;
  const alertType = "success";
  const alertMessage = "alertsuccessmessage";
  const setIsOpenAlert = jest.fn();
  renderAlert(isOpenAlert, alertType, alertMessage, setIsOpenAlert);

  const alertdiv = screen.getByTestId("alert-success");
  expect(alertdiv).toBeInTheDocument();
  expect(alertdiv).toHaveTextContent("alertsuccessmessage");
  expect(screen.getByTestId("SuccessOutlinedIcon")).toBeInTheDocument();
  expect(setIsOpenAlert).toHaveBeenCalledTimes(0);

  jest.runAllTimers();

  expect(setIsOpenAlert).toHaveBeenCalledTimes(1);
});

test("alert error renders correctly", async () => {
  jest.useFakeTimers();
  const isOpenAlert = true;
  const alertType = "error";
  const alertMessage = "alerterrormessage";
  const setIsOpenAlert = jest.fn();
  renderAlert(isOpenAlert, alertType, alertMessage, setIsOpenAlert);

  const alertdiv = screen.getByTestId("alert-error");
  expect(alertdiv).toBeInTheDocument();
  expect(alertdiv).toHaveTextContent("alerterrormessage");
  expect(screen.getByTestId("ErrorOutlineIcon")).toBeInTheDocument();
  expect(setIsOpenAlert).toHaveBeenCalledTimes(0);

  jest.runAllTimers();

  expect(setIsOpenAlert).toHaveBeenCalledTimes(1);
});
