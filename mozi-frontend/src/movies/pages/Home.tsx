import { Suspense, useEffect, useState } from "react";
import {
  Typography,
  Container,
  IconButton,
  Fab,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../common/components/NavigationBar";
import MyFooter from "../../common/components/MyFooter";
import ScrollTop from "../../common/components/ScrollTop";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useSessionContext } from "../../auth/context/SessionContext";
import MovieAddModal from "../components/MovieAddModal";
import MovieList from "./MovieList";

export default function Home() {
  const context = useSessionContext();
  const currUser = context.user;
  const navigate = useNavigate();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const handleAddMovie = () => {
    setIsOpenAdd(true);
  };

  useEffect(() => {
    if (!currUser) navigate("/login");
  }, []);

  return (
    <>
      <NavigationBar />
      {currUser && (
        <main style={{ position: "relative", minHeight: "100vh" }}>
          <div style={{ paddingBottom: "2.5rem" }}>
            {(currUser.role === "admin" || currUser.role === "editor") && (
              <>
                <MovieAddModal
                  isOpenAdd={isOpenAdd}
                  setIsOpenAdd={setIsOpenAdd}
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
            {currUser.role === "viewer" && (
              <Container maxWidth="sm" sx={{ marginTop: "56px" }}>
                <Typography variant="h2" align="center" color="textPrimary">
                  MovieZone
                </Typography>
              </Container>
            )}
          </div>
          <Container maxWidth="md" sx={{ marginBottom: 3 }}>
              <MovieList/>
          </Container>
          <MyFooter />
        </main>
      )}
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
}
