import { Container, Fab, Grid, Typography } from "@mui/material";
import { useState } from "react";
import UserDeleteDialog from "../components/dialogs/UserDeleteDialog";
import UserEditModal from "../components/modals/UserEditModal";
import MyFooter from "../components/MyFooter";
import NavigationBar from "../components/NavigationBar";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ScrollTop from "../components/ScrollTop";
import UserCard from "../components/cards/UserCard";
import { User } from "../api/types";
import { useTranslation } from "react-i18next";
import LoadingComponent from "../components/LoadingComponent";
import { gql, useQuery} from "@apollo/client";
import { useSessionContext } from "../api/SessionContext";
import { useUserData } from "./useUserData";

export function Users() {
  const { t } = useTranslation();
  const context = useSessionContext()
  const {users,loading} = useUserData()

  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [deletingUser, setDeletingUser] = useState<User | undefined>(undefined);
  
  if(loading) return LoadingComponent(loading)

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
          allowEditRole
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
            {users.map((user:User) => (
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
