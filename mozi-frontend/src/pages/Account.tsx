import { Container, Fab, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MyFooter from "../components/MyFooter";
import NavigationBar from "../components/NavigationBar";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ScrollTop from "../components/ScrollTop";
import UserCard from "../components/cards/UserCard";
import AlertComponent from "../components/AlertComponent";
import UserCurrentEditModal from "../components/modals/UserCurrentEditModal";
import UserCurrentDeleteDialog from "../components/dialogs/UserCurrentDeleteDialog";
import { CurrUser, User } from "../api/types";
import { useTranslation } from "react-i18next";
import { getPersistedUser } from "../api/auth/useLogIn";

function Account() {
  const { t } = useTranslation();
  const [isOpenEditCurrent, setIsOpenEditCurrent] = useState(false);
  const [isOpenDeleteCurrent, setIsOpenDeleteCurrent] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "viewer" | "editor">("viewer");
  const [user, setUser] = useState<User>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "viewer",
  });

  function currUserToUser(user: CurrUser): User {
    const id = user.id;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const email = user.email;
    const password = user.password;
    const role = user.role;
    return { id, firstName, lastName, email, password, role };
  }

  useEffect(() => {
    const user = getPersistedUser();
    if (user) {
      const newUser = currUserToUser(user);
      setUser(newUser);
    }
  }, []);

  useEffect(() => {
    if (isOpenEditCurrent === false && alertType === "success") {
      const user = getPersistedUser();
      if (user) {
        const newUser = currUserToUser(user);
        setUser(newUser);
      }
    }
  }, [isOpenEditCurrent]);

  return (
    <>
      <NavigationBar />
      <main style={{ position: "relative", minHeight: "100vh" }}>
        <AlertComponent
          isOpenAlert={isOpenAlert}
          setIsOpenAlert={setIsOpenAlert}
          alertMessage={alertMessage}
          alertType={alertType}
          setAlertType={setAlertType}
        />
        <UserCurrentDeleteDialog
          isOpenDelete={isOpenDeleteCurrent}
          setIsOpenDelete={setIsOpenDeleteCurrent}
          userId={userId}
        />
        <UserCurrentEditModal
          isOpenEdit={isOpenEditCurrent}
          setIsOpenEdit={setIsOpenEditCurrent}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          role={role}
          userId={userId}
          setIsOpenAlert={setIsOpenAlert}
          setAlertMessage={setAlertMessage}
          setAlertType={setAlertType}
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
              <UserCard
                user={user}
                // setIsOpenEdit={setIsOpenEditCurrent}
                // setIsOpenDelete={setIsOpenDeleteCurrent}
                // setFirstName={setFirstName}
                // setLastName={setLastName}
                // setEmail={setEmail}
                // setPassword={setPassword}
                // setRole={setRole}
                // setUserId={setUserId}
                // selectedUser={user}
                // setSelectedUser={setUser}
              />
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
