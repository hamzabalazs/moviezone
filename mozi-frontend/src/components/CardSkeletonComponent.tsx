import { Grid, Skeleton } from "@mui/material";

export default function CardSkeletonComponent() {
  return (
    <Grid item xs={12}>
      <Skeleton
        variant="rectangular"
        sx={{
          marginTop:2,
          height: "288px",
          display: "flex",
          flexDirection: "column",
          borderColor: "text.secondary",
          border: 3,
          borderRadius: 3,
          marginLeft: 5,
          marginRight: 5,
        }}
      />
    </Grid>
  );
}
