import { Container, Fab, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MyFooter from "../components/MyFooter";
import NavigationBar from "../components/NavigationBar";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ScrollTop from "../components/ScrollTop";
import UserCard from "../components/cards/UserCard";
import AlertComponent from "../components/AlertComponent";
import { AlertType, User } from "../api/types";
import { useTranslation } from "react-i18next";
import UserDeleteDialog from "../components/dialogs/UserDeleteDialog";
import UserEditModal from "../components/modals/UserEditModal";
import LoadingComponent from "../components/LoadingComponent";
import { useSessionContext } from "../api/SessionContext";
import { gql, useApolloClient, useQuery } from "@apollo/client";

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

function Account() {
  const { t } = useTranslation();
  const context = useSessionContext();
  const { data: usersData, loading:usersLoading } = useQuery(GET_USERS);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [deletingUser, setDeletingUser] = useState<User | undefined>(undefined);
  const client = useApolloClient()

  const [alert, setAlert] = useState<AlertType>({
    isOpen: false,
    message: "",
    type: undefined,
  });

  const [user, setUser] = useState<User>({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "viewer",
  });

  async function refetchData(){
    await client.refetchQueries({
      include: [GET_USERS],
    });
  }

  useEffect(() => {
    if(alert.isOpen){
      refetchData()
    }
  },[alert])

  useEffect(() => {
    if (context.user && !usersLoading) {
      const displayUser = usersData.getUsers.find((x:User) => x.id === context.user?.id);
      if (displayUser) {
        setUser(displayUser);
      }else context.logOut()
      
    }
    if(!context.user && usersLoading){
      context.logOut()
    }
  }, [usersData]);

  if (usersLoading) return LoadingComponent(usersLoading);

  return (
    <>
      <NavigationBar />
      <main style={{ position: "relative", minHeight: "100vh" }}>
        <AlertComponent alert={alert} setAlert={setAlert} />
        <UserDeleteDialog
          user={deletingUser}
          onClose={() => setDeletingUser(undefined)}
          setAlert={setAlert}
        />

        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(undefined)}
          setAlert={setAlert}
        />
        <div>
          <Container maxWidth="sm" sx={{ marginBottom: 3, marginTop: "56px" }}>
            <Typography
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              {t("navbar.myaccount")}
            </Typography>
          </Container>
        </div>
        <div>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              {usersData.getUsers.find((x:User) => x.id === context.user?.id) && (
                <UserCard
                  user={user}
                  onEdit={() => setEditingUser(user)}
                  onDelete={() => setDeletingUser(user)}
                />
              )}
            </Grid>
          </Grid>
        </div>
        <MyFooter />
      </main>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
}

export default Account;
