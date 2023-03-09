import { Container, Fab, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import UserDeleteDialog from "../components/dialogs/UserDeleteDialog";
import UserEditModal from "../components/modals/UserEditModal";
import MyFooter from "../components/MyFooter";
import NavigationBar from "../components/NavigationBar";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ScrollTop from "../components/ScrollTop";
import UserCard from "../components/cards/UserCard";
import AlertComponent from "../components/AlertComponent";
import { useApiContext } from "../api/ApiContext";
import { AlertType, User } from "../api/types";
import { useTranslation } from "react-i18next";
import LoadingComponent from "../components/LoadingComponent";
import { gql, useQuery, useApolloClient } from "@apollo/client";

export const GET_USERS = gql`
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

export function Users() {
  const { data: usersData, loading:usersLoading } = useQuery(GET_USERS);
  const { t } = useTranslation();
  const client = useApolloClient()

  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [deletingUser, setDeletingUser] = useState<User | undefined>(undefined);

  const [alert,setAlert] = useState<AlertType>({isOpen:false,message:"",type:undefined})
  
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

  if(usersLoading) return LoadingComponent(usersLoading)

  return (
    <>
      <NavigationBar />
      <main style={{ position: "relative", minHeight: "100vh" }}>
        <AlertComponent
          alert={alert}
          setAlert={setAlert}
        />
        <UserDeleteDialog
          user={deletingUser}
          onClose={() => setDeletingUser(undefined)}
          setAlert={setAlert}
        />
        
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(undefined)}
          allowEditRole
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
              {t("navbar.Users")}
            </Typography>
          </Container>
        </div>
        <div>
          <Grid container spacing={4}>
            {usersData.getUsers.map((user:User) => (
              <Grid item key={user.id} xs={12}>
                <UserCard
                  user={user}
                  onEdit={() => setEditingUser(user)}
                  onDelete={() => setDeletingUser(user)}
                />
              </Grid>
            ))}
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
