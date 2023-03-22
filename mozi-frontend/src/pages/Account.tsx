import { Container, Fab, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MyFooter from "../components/MyFooter";
import NavigationBar from "../components/NavigationBar";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ScrollTop from "../components/ScrollTop";
import UserCard from "../components/cards/UserCard";
import { useTranslation } from "react-i18next";
import UserDeleteDialog from "../components/dialogs/UserDeleteDialog";
import UserEditModal from "../components/modals/UserEditModal";
import LoadingComponent from "../components/LoadingComponent";
import { useSessionContext } from "../api/SessionContext";
import { useUserData } from "./useUserData";
import { FullUser, UserRole } from "../gql/graphql";


function Account() {
  const { t } = useTranslation();
  const context = useSessionContext();
  const {fullUsers,fullUsersLoading} = useUserData()
  const [editingUser, setEditingUser] = useState<FullUser | undefined>(undefined);
  const [deletingUser, setDeletingUser] = useState<FullUser | undefined>(undefined);

  const [user, setUser] = useState<FullUser>({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: UserRole["Viewer"],
  });

  useEffect(() => {
    if (context.user && !fullUsersLoading) {
      const displayUser = fullUsers.find((x:FullUser) => x.id === context.user?.id);
      if (displayUser) {
        setUser(displayUser);
      }else context.logOut()
      
    }
    if(!context.user && fullUsersLoading){
      context.logOut()
    }
  }, [fullUsers]);

  if (fullUsersLoading) return LoadingComponent(fullUsersLoading);
  

  return (
    <>
      <NavigationBar />
      <main style={{ position: "relative", minHeight: "100vh" }}>
        <UserDeleteDialog
          user={deletingUser}
          onClose={() => setDeletingUser(undefined)}
        />

        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(undefined)}
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
              {fullUsers.find((x:FullUser) => x.id === context.user?.id) && (
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
