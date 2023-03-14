import { Fab } from "@mui/material";
import { render, screen, waitFor } from "@testing-library/react";
import ScrollTop from "./ScrollTop";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import userEvent from "@testing-library/user-event";

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
  userEvent.click(elementToClick);

  await waitFor(() => {
    expect(scrollIntoViewMock).toBeCalled();
  });
});
