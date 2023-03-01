import { useContext, useEffect, useState } from "react";
import { Typography, Container, IconButton, Fab } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import MovieList from "../components/MovieList";
import NavigationBar from "../components/NavigationBar";
import MovieAddModal from "../components/modals/MovieAddModal";
import MyFooter from "../components/MyFooter";
import ScrollTop from "../components/ScrollTop";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AlertComponent from "../components/AlertComponent";
import { useApiContext } from "../api/ApiContext";

export function Home() {
  const context = useApiContext();
  const currUser = context.user;
  const navigate = useNavigate();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [role, setRole] = useState<"admin" | "editor" | "viewer">("viewer");
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleAddMovie = () => {
    setIsOpenAdd(true);
  };

  const handleRole = () => {
    if (currUser) {
      if (currUser.role === "admin") setRole("admin");
      else if (currUser.role === "editor") setRole("editor");
      else setRole("viewer");
    }
  };

  useEffect(() => {
    if (!currUser) navigate("/login");
    handleRole();
  }, []);

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
        <div style={{ paddingBottom: "2.5rem" }}>
          {(role === "admin" || role === "editor") && (
            <>
              <MovieAddModal
                isOpenAdd={isOpenAdd}
                setIsOpenAdd={setIsOpenAdd}
                setIsOpenAlert={setIsOpenAlert}
                setAlertMessage={setAlertMessage}
                setAlertType={setAlertType}
              />
              <IconButton
                sx={{
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
                onClick={handleAddMovie}
                data-testid="movie-add-button"
              >
                <AddCircleIcon sx={{ fontSize: 40 }} color="primary" />
              </IconButton>
              <Container maxWidth="sm">
                <Typography variant="h2" align="center" color="textPrimary">
                  MovieZone
                </Typography>
              </Container>
            </>
          )}
          {role === "viewer" && (
            <Container maxWidth="sm" sx={{ marginTop: "56px" }}>
              <Typography variant="h2" align="center" color="textPrimary">
                MovieZone
              </Typography>
            </Container>
          )}
        </div>
        <Container maxWidth="md" sx={{ marginBottom: 3 }}>
          <MovieList />
        </Container>
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
