import { Container, Fab, Grid, Typography } from "@mui/material";
import { useState } from "react";
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


export function Users() {
  const context = useApiContext();
  const { t } = useTranslation();

  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [deletingUser, setDeletingUser] = useState<User | undefined>(undefined);

  const [alert,setAlert] = useState<AlertType>({isOpen:false,message:"",type:undefined})
  
  if(context.usersLoading) return LoadingComponent(context.usersLoading)

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
            {context.users.map((user) => (
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
