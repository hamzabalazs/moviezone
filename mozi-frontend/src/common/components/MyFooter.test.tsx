import { render, screen } from "@testing-library/react";
import MyFooter from "./MyFooter";

test("footer renders correctly", () => {
  render(<MyFooter />);
  const footerdiv = screen.getByTestId("footer");
  expect(footerdiv).toBeVisible();
  const footerContent = screen.getByTestId("footerContent");
  expect(footerContent).toHaveTextContent("footer");
});
