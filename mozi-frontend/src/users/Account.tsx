import { Container, Fab, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MyFooter from "../common/components/MyFooter";
import NavigationBar from "../common/components/NavigationBar";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ScrollTop from "../common/components/ScrollTop";
import { useTranslation } from "react-i18next";
import { useSessionContext } from "../auth/SessionContext";
import { useUserData } from "./useUserData";
import { FullUser, UserRole } from "../gql/graphql";
import UserDeleteDialog from "./UserDeleteDialog";
import UserEditModal from "./UserEditModal";
import UserCard from "./UserCard";
import CardSkeletonComponent from "../common/components/CardSkeletonComponent";


function Account() {
  const { t } = useTranslation();
  const context = useSessionContext();
  const {users,loading} = useUserData()
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
    if (context.user && !loading) {
      const displayUser = users.find((x:FullUser) => x.id === context.user?.id);
      if (displayUser) {
        setUser(displayUser);
      }else context.logOut()
      
    }
    if(!context.user && loading){
      context.logOut()
    }
  }, [users]);  

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
              {users.find((x:FullUser) => x.id === context.user?.id) && (
                <UserCard
                  user={user}
                  onEdit={() => setEditingUser(user)}
                  onDelete={() => setDeletingUser(user)}
                />
              )}
            </Grid>
          </Grid>
          {loading && (
            <Grid container spacing={4} sx={{marginTop:0}}>
              <CardSkeletonComponent />
            </Grid>
          )}
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
