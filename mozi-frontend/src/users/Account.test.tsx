import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MockedSessionContext } from "../common/testing/MockedSessionProvider";
import { CurrentUser, UserRole } from "../gql/graphql";
import Account from "./Account";
import { GET_FULL_USERS } from "./useUserData";


const mockUsersData = [
{
  request:{
    query: GET_FULL_USERS,
    variables:{
      input:{
        limit:3,
        offset:0
      }
    }
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
      ],
      getNumberOfUsers:{
        totalCount:3
      }
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

test("Loading skeleton appears as placeholder", async() => {
  renderAccount(editorUser)

  const skeleton = screen.getByTestId("skeleton-component")
  expect(skeleton).toBeTruthy()
  expect(skeleton).toBeInTheDocument()

  const cards = await screen.findAllByTestId("user-card")
  expect(skeleton).not.toBeInTheDocument()
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
