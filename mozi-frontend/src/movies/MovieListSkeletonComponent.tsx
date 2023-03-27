import { Grid, Skeleton } from "@mui/material";

export default function MovieListSkeletonComponent(){
    return(
        <Grid item xs={12} sm={6} md={4}>
            <Skeleton
              variant="rectangular"
              sx={{
                marginTop:3,
                height: "430px",
                display: "flex",
                flexDirection: "column",
                borderColor: "text.secondary",
                border: 3,
                borderRadius: 2,
              }}
              data-testid="movie-skeleton-component"
            />
          </Grid>
    )
}