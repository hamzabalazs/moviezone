import { Container, Fab, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MyFooter from "../common/components/MyFooter";
import NavigationBar from "../common/components/NavigationBar";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ScrollTop from "../common/components/ScrollTop";
import { useTranslation } from "react-i18next";
import { useUserData } from "./useUserData";
import { FullUser } from "../gql/graphql";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import CardSkeletonComponent from "../common/components/CardSkeletonComponent";
import UserCard from "./UserCard";
import UserDeleteDialog from "./UserDeleteDialog";
import UserEditModal from "./UserEditModal";

export function Users() {
  const { t } = useTranslation();
  const [editingUser, setEditingUser] = useState<FullUser | undefined>(
    undefined
  );
  const [deletingUser, setDeletingUser] = useState<FullUser | undefined>(
    undefined
  );
  let currentLength = 0;
  const { fullUsers, fullUsersLoading, totalCount,usersError,fullUsersError,fetchMore } = useUserData();

  useBottomScrollListener(() => { 
    currentLength += fullUsers.length
    console.log("totalcount",totalCount)
    console.log("currentlength",currentLength)
    if(currentLength >= totalCount) return;
    fetchMore({
      variables:{
        input:{
          limit:3,
          offset: currentLength
        }
      }
    })
  });

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
            >
              {t("navbar.Users")}
            </Typography>
          </Container>
        </div>
        <div>
          <Grid container spacing={4}>
            {fullUsers.map((user: FullUser) => (
              <Grid item key={user.id} xs={12}>
                <UserCard
                  user={user}
                  onEdit={() => setEditingUser(user)}
                  onDelete={() => setDeletingUser(user)}
                />
              </Grid>
            ))}
          </Grid>
          {fullUsersLoading && (
            <Grid container spacing={4} sx={{marginTop:0}}>
              <CardSkeletonComponent />
              <CardSkeletonComponent />
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
