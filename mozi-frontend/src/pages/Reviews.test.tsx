import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CurrUser } from "../api/types";
import { MockedApiContext } from "../common/testing/MockedApiProvider";
import Reviews from "./Reviews";

function renderReviews(currUser?: CurrUser) {
  return render(
    <MemoryRouter>
      <MockedApiContext value={{ user: currUser }}>
        <Reviews />
      </MockedApiContext>
    </MemoryRouter>
  );
}

const viewerUser: CurrUser = {
  id: "idU3",
  first_name: "viewer",
  last_name: "viewer",
  email: "viewer@example.com",
  password: "viewer",
  role: "viewer",
  token: "token1",
};

test("correct amount of reviews show up for user", () => {
  renderReviews(viewerUser);
  const cards = screen.getAllByTestId("review-card");
  expect(cards).toHaveLength(2);
});

test("review edit modal opens and shows correctly", () => {
  renderReviews(viewerUser);

  const cardEditButtons = screen.getAllByRole("button", { name: "Edit" });
  fireEvent.click(cardEditButtons[0]);
  const reviewEditModal = screen.getByTestId("review-edit-modal");
  const reviewEditModalButton = screen.getByRole("button", { name: "Edit" });
  const reviewEditModalDescription = screen.getByTestId(
    "review-edit-modal-description"
  );
  const reviewEditModalRating = screen.getByTestId("review-edit-modal-rating");
  expect(reviewEditModal).not.toHaveAttribute("aria-hidden", "true");
  expect(reviewEditModalDescription).toBeInTheDocument();
  expect(reviewEditModalRating).toBeInTheDocument();
  expect(reviewEditModalButton).toBeInTheDocument();
});

test("review delete dialog opens and shows correctly", () => {
  renderReviews(viewerUser);
  const cardDeleteButtons = screen.getAllByRole("button", { name: "Delete" });

  fireEvent.click(cardDeleteButtons[0]);
  const reviewDeleteModal = screen.getByTestId("review-delete-dialog");
  const reviewDeleteDialogAcceptButton = screen.getByRole("button", {
    name: "Accept",
  });
  const reviewDeleteDialogQuitButton = screen.getByRole("button", {
    name: "Quit",
  });
  expect(reviewDeleteModal).not.toHaveAttribute("aria-hidden", "true");
  expect(reviewDeleteDialogAcceptButton).toBeInTheDocument();
  expect(reviewDeleteDialogQuitButton).toBeInTheDocument();
});
