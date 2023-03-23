import { gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MockedSessionContext } from "../common/testing/MockedSessionProvider";
import { CurrentUser, UserRole } from "../gql/graphql";
import Account from "./Account";
import { GET_FULL_USERS, GET_USERS } from "./useUserData";


const mockUsersData = [
{
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
          role:UserRole["Admin"]
        },
        {
          id:"idU2",
          first_name:"editor",
          last_name:"editor",
          email:"editor@example.com",
          role:UserRole["Editor"]
        },
        {
          id:"idU3",
          first_name:"viewer",
          last_name:"viewer",
          email:"viewer@example.com",
          role:UserRole["Viewer"]
        }
      ]
    }
  }
},
{
  request:{
    query: GET_FULL_USERS
  },
  result:{
    data:{
      getFullUsers:[
        {
          id:"idU1",
          first_name:"admin",
          last_name:"admin",
          email:"admin@example.com",
          password:"admin",
          role:UserRole["Admin"]
        },
        {
          id:"idU2",
          first_name:"editor",
          last_name:"editor",
          email:"editor@example.com",
          password:"editor",
          role:UserRole["Editor"]
        },
        {
          id:"idU3",
          first_name:"viewer",
          last_name:"viewer",
          email:"viewer@example.com",
          password:"viewer",
          role:UserRole["Viewer"]
        }
      ]
    }
  }
}
]

const editorUser:CurrentUser = {
  id:"idU2",
  first_name:"editor",
  last_name:"editor",
  email:"editor@example.com",
  role:UserRole["Editor"],
  token:"token1"
}

function renderAccount(currUser?:CurrentUser) {
  return render(
    <MemoryRouter>
      <MockedProvider addTypename={false} mocks={mockUsersData}>
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
