import { useEffect, useState } from "react";
import {
  Typography,
  Container,
  IconButton,
  Fab,
  Skeleton,
  Grid,
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
import { useQuery, gql, useApolloClient } from "@apollo/client";

const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
    }
  }
`;

const GET_MOVIES = gql`
  query GetMovies {
    getMovies {
      id
      title
      poster
      release_date
      category {
        id
      }
      rating
    }
  }
`;

export function Home() {
  const context = useSessionContext();
  const { data: categoryData, loading: categoryLoading } =
    useQuery(GET_CATEGORIES);
  const { data: movieData, loading: movieLoading } = useQuery(GET_MOVIES);
  const currUser = context.user;
  const navigate = useNavigate();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const handleAddMovie = () => {
    setIsOpenAdd(true);
  };
  const client = useApolloClient();

  useEffect(() => {
    if (!currUser) navigate("/login");
  }, []);

  async function refetchData() {
    await client.refetchQueries({
      include: [GET_MOVIES, GET_CATEGORIES],
    });
  }

  useEffect(() => {
    if(isOpenAdd === false){
      refetchData();
    }
  }, [isOpenAdd]);

  if (movieLoading) return LoadingComponent(movieLoading);
  if (categoryLoading) return LoadingComponent(categoryLoading);

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
            {movieData.getMovies.length !== 0 && (
              <MovieList
                movieList={movieData.getMovies}
                categoryList={categoryData.getCategories}
              />
            )}
            {movieData.getMovies.length === 0 && (
              <>
                <Skeleton
                  variant="rectangular"
                  sx={{ marginBottom: 3 }}
                  width={850.4}
                  height={56}
                />
                <Skeleton
                  variant="rectangular"
                  sx={{ marginBottom: 4 }}
                  width={850.4}
                  height={56}
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Skeleton
                      variant="rectangular"
                      width={273.33}
                      height={430.1}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Skeleton
                      variant="rectangular"
                      width={273.33}
                      height={430.1}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Skeleton
                      variant="rectangular"
                      width={273.33}
                      height={430.1}
                    />
                  </Grid>
                </Grid>
              </>
            )}
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
