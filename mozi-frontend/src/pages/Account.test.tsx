import { gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CurrUser } from "../api/types";
import { MockedSessionContext } from "../common/testing/MockedSessionProvider";
import Account from "./Account";

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      first_name
      last_name
      email
      role
    }
  }
`;

const mockUsersData = {
  request:{
    query:GET_USERS
  },
  result:{
    data:{
      getUsers:[
        {
          id:"idU1",
          first_name:"admin",
          last_name:"admin",
          email:"admin@example.com",
          role:"admin"
        },
        {
          id:"idU2",
          first_name:"editor",
          last_name:"editor",
          email:"editor@example.com",
          role:"editor"
        },
        {
          id:"idU3",
          first_name:"viewer",
          last_name:"viewer",
          email:"viewer@example.com",
          role:"viewer"
        }
      ]
    }
  }
}

const editorUser:CurrUser = {
  id:"idU2",
  first_name:"editor",
  last_name:"editor",
  email:"editor@example.com",
  password:"editor",
  role:"editor",
  token:"token1"
}

function renderAccount(currUser?:CurrUser) {
  return render(
    <MemoryRouter>
      <MockedProvider addTypename={false} mocks={[mockUsersData]}>
        <MockedSessionContext value={{user:currUser}}>
          <Account />
        </MockedSessionContext>
      </MockedProvider>
    </MemoryRouter>
  );
}

test("LoadingComponent should show while loading, after loading should not show",async() => {
  const {queryByTestId} = renderAccount()

  const loader = queryByTestId("loader")
  expect(loader).toBeInTheDocument()

  await waitFor(() => {
    expect(loader).not.toBeInTheDocument()
  })
})

test("only one user shows up", async() => {
  renderAccount(editorUser);

  const cards = await screen.findAllByTestId("user-card");
  expect(cards).toHaveLength(1);
  const cardEditButtons = screen.getAllByRole("button", { name: "Edit" });
  const cardDeleteButtons = screen.getAllByRole("button", { name: "Delete" });
  expect(cardEditButtons).toHaveLength(1);
  expect(cardDeleteButtons).toHaveLength(1);
});
