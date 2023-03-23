import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { MockedSessionContext } from "../common/testing/MockedSessionProvider";
import { CurrentUser, UserRole } from "../gql/graphql";
import { Users } from "./Users";
import { GET_FULL_USERS, GET_USERS } from "./useUserData";

const mockUserData = [
{
  request: {
    query: GET_USERS,
  },
  result: {
    data: {
      getUsers: [
        {
          id:"idU1",
          first_name:"user1",
          last_name:"user1",
          email:"user1@example.com",
          role:"viewer",
        },
        {
          id:"idU2",
          first_name:"user2",
          last_name:"user2",
          email:"user2@example.com",
          role:"viewer",
        },
        {
          id:"idU3",
          first_name:"user3",
          last_name:"user3",
          email:"user3@example.com",
          role:"viewer",
        },
      ],
    },
  },
},
{
  request: {
    query: GET_FULL_USERS,
  },
  result: {
    data: {
      getFullUsers: [
        {
          id:"idU1",
          first_name:"user1",
          last_name:"user1",
          email:"user1@example.com",
          password: "user1pass",
          role:"viewer",
        },
        {
          id:"idU2",
          first_name:"user2",
          last_name:"user2",
          email:"user2@example.com",
          password: "user2pass",
          role:"viewer",
        },
        {
          id:"idU3",
          first_name:"user3",
          last_name:"user3",
          email:"user3@example.com",
          password: "user2pass",
          role:"viewer",
        },
      ],
    },
  },
}
];

const adminUser: CurrentUser = {
  id: "idU1",
  first_name: "admin",
  last_name: "admin",
  email: "admin@example.com",
  role: UserRole["Admin"],
  token: "token1",
};

function renderUsers(currUser?: CurrentUser) {
  return render(
    <MemoryRouter>
      <MockedProvider addTypename={false} mocks={mockUserData}>
        <MockedSessionContext value={{user:currUser}}>
          <Users />
        </MockedSessionContext>
      </MockedProvider>
    </MemoryRouter>
  );
}

test("LoadingComponent renders first, after loading user page renders",async() => {
  const {queryByTestId} = renderUsers(adminUser)
  const loader = queryByTestId("loader");
  expect(loader).toBeInTheDocument()
  await waitFor(() => {
    expect(loader).not.toBeInTheDocument()
  })
})

test("Should show correct amount of cards", async() => {
  const {findAllByTestId} = renderUsers(adminUser);
  const cards = await findAllByTestId("user-card");
  expect(cards).toHaveLength(3);
});

test("user edit modal opens and shows correctly", async() => {
  renderUsers(adminUser);

  const cardEditButtons = await screen.findAllByRole("button", { name: "Edit" });
  userEvent.click(cardEditButtons[0]);
  const cardEditModal = screen.getByTestId("user-edit-modal");
  const cardEditModalButton = screen.getByRole("button", { name: "Edit" }); // not tested
  const userFirstName = screen.getByTestId("user-edit-modal-first_name");
  const userLastName = screen.getByTestId("user-edit-modal-last_name");
  const userEmail = screen.getByTestId("user-edit-modal-email");
  const userPassword = screen.getByTestId("user-edit-modal-password");
  const userRole = screen.getByTestId("user-edit-modal-role");

  expect(cardEditModal).not.toHaveAttribute("aria-hidden", "true");
  expect(cardEditModalButton).toBeInTheDocument();
  expect(userFirstName).toBeInTheDocument();
  expect(userLastName).toBeInTheDocument();
  expect(userEmail).toBeInTheDocument();
  expect(userPassword).toBeInTheDocument();
  expect(userRole).toBeInTheDocument();
});

test("user delete dialog opens and shows correctly", async() => {
  renderUsers(adminUser);

  const cardDeleteButtons = await screen.findAllByRole("button", { name: "Delete" });
  userEvent.click(cardDeleteButtons[0]);
  const cardDeleteDialog = screen.getByTestId("user-delete-dialog");
  const cardDeleteDialogAccept = screen.getByRole("button", { name: "Accept" });
  const cardDeleteDialogQuit = screen.getByRole("button", { name: "Quit" });
  expect(cardDeleteDialog).not.toHaveAttribute("aria-hidden", "true");
  expect(cardDeleteDialogAccept).toBeInTheDocument();
  expect(cardDeleteDialogQuit).toBeInTheDocument();
});
