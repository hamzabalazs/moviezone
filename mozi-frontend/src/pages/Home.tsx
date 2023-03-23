import { useEffect, useState } from "react";
import {
  Typography,
  Container,
  IconButton,
  Fab,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import MovieList from "../components/MovieList";
import NavigationBar from "../components/NavigationBar";
import MovieAddModal from "../components/modals/MovieAddModal";
import MyFooter from "../components/MyFooter";
import ScrollTop from "../components/ScrollTop";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LoadingComponent from "../components/LoadingComponent";
import { useSessionContext } from "../api/SessionContext";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useHomePageData } from "./useHomePageData";

export function Home() {
  const context = useSessionContext();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  

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
