import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Cast, Movie } from "../../gql/graphql";
import { useSessionContext } from "../../auth/context/SessionContext";
import { useEffect, useState } from "react";
import NavigationBar from "../../common/components/NavigationBar";
import CastEditModal from "../components/CastEditModal";
import CastDeleteDialog from "../components/CastDeleteDialog";
import { useCastPageData } from "../hooks/useCastPageData";
import CastPageCard from "../components/CastPageCard";
import { useMoviePageData } from "../../movies/hooks/useMoviePageData";
import { Grid, Typography } from "@mui/material";
import MovieListCard from "../../movies/components/MovieListCard";

export default function CastPage() {
  const { currcast_id, currmovie_id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user: currUser } = useSessionContext();
  const { cast, movies, error, loading } = useCastPageData(currcast_id!);
  const { movie } = useMoviePageData(currmovie_id!);

  const [editingCast, setEditingCast] = useState<Cast | undefined>(undefined);
  const [deletingCast, setDeletingCast] = useState<Cast | undefined>(undefined);

  useEffect(() => {
    if (!currUser) navigate("/login");
    window.scrollTo(0,0)
  }, []);

  return (
    <>
      <NavigationBar />
      <main style={{ position: "relative", minHeight: "100vh" }}>
        <div style={{ paddingBottom: "2.5rem" }}>
          <CastEditModal
            cast={editingCast}
            movie={null}
            onClose={() => setEditingCast(undefined)}
          />
          <CastDeleteDialog
            cast={deletingCast}
            movie={movie}
            onClose={() => setDeletingCast(undefined)}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          {cast && (
            <CastPageCard
              cast={cast}
              onEdit={() => setEditingCast(cast)}
              onDelete={() => setDeletingCast(cast)}
            />
          )}
        </div>
        <Typography
          variant="h4"
          sx={{ marginTop: "3%", marginBottom: "2%", marginLeft: "5%" }}
        >
          Featured in
        </Typography>
        <Grid container spacing={4} sx={{marginLeft:"5%",marginRight:"5%",width:"90%"}}>
          {movies.map((movie: Movie) => (
            <Grid item key={movie.id} xs={3}>
              <MovieListCard movie={movie}/>
            </Grid>
          ))}
        </Grid>
      </main>
    </>
  );
}
