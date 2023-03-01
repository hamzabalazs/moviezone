import { Fab } from "@mui/material";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ScrollTop from "./ScrollTop";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

test("scrolltop calls scrollIntoView", async () => {
  render(
    <>
      <div id="back-to-top-anchor">backhere</div>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
  let scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
  const elementToClick = screen.getByLabelText("scroll back to top");
  fireEvent.click(elementToClick);

  await waitFor(() => {
    expect(scrollIntoViewMock).toBeCalled();
  });
});
