import {
  Autocomplete,
  Button,
  Container,
  Grid,
  TextField,
} from "@mui/material";
import MyFooter from "../common/components/MyFooter";
import NavigationBar from "../common/components/NavigationBar";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_DATA } from "./userQueries";
import Highcharts from "highcharts";
import {
  getMonthList,
  getMovieYearChart,
  getMovieNrChart,
  getMovieDataCat,
  getMovieDataYear,
  getReviewAvgChart,
  getReviewNrChart,
} from "./DashboardFunctions";
import HighChartsReact from "highcharts-react-official";

export default function Dashboard() {
  enum Tab {
    review = "review",
    category = "category",
    movie = "movie",
  }
  const [pageTab, setPageTab] = useState<Tab>(Tab["movie"]);
  const [selectedMovie, setSelectedMovie] = useState<string | null>("");
  const [selectedMovieId, setSelectedMovieId] = useState<string>("");
  const [movieOptions, setMovieOptions] = useState<string[]>([]);
  const [inputValueMovie, setInputValueMovie] = useState("");
  const { data, loading } = useQuery(GET_DASHBOARD_DATA, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        movie_id: selectedMovieId,
      },
    },
  });
  const d = new Date();
  const month = d.getMonth();
  const monthlist = getMonthList(month);
  const nrList = [];
  const avgList = [];
  const nameList: string[] = [];
  const countCatList: number[] = [];
  const yearList: string[] = [];
  const countYearList: number[] = [];
  if (!loading && data) {
    for (let i = 0; i < 6; i++) {
      if (data.getNumberOfReviewsOfMoviePerMonth[i]) {
        nrList.push(
          data.getNumberOfReviewsOfMoviePerMonth[i].totalCount
        );
      } else nrList.push(0);
      if (data.getAverageOfReviewsOfMoviePerMonth[i]) {
        avgList.push(
          data.getAverageOfReviewsOfMoviePerMonth[i].average
        );
      } else avgList.push(0.0);
    }
    data.getNumberOfMoviesPerCategory.map((x: any) => {
      nameList.push(x.name);
      countCatList.push(x.totalCount);
    });
    data.getNumberOfMoviesPerYear.map((x: any) => {
      yearList.push(x.year);
      countYearList.push(x.totalCount);
    });
  }
  const catChartData = getMovieDataCat(nameList, countCatList);
  const yearChartData = getMovieDataYear(yearList, countYearList);
  const mChartNrYear = getMovieYearChart(yearChartData)
  const chartNr = getReviewNrChart(monthlist,selectedMovie,nrList)
  const chartAvg = getReviewAvgChart(monthlist,selectedMovie,avgList)
  const mChartNrCat = getMovieNrChart(catChartData)

  const handleReviewTab = () => {
    setPageTab(Tab["review"]);
  };

  const handleCategoryTab = () => {
    setPageTab(Tab["category"]);
  };

  const handleMovieTab = () => {
    setPageTab(Tab["movie"]);
  };

  useEffect(() => {
    if (!loading) {
      if (data) {
        const movieList: string[] = [];
        data.getAllMovies.map((x: any) => {
          movieList.push(x.title);
        });
        setMovieOptions(movieList);
      }
    }
  }, [loading]);

  useEffect(() => {
    if (selectedMovie) {
      const movie = data.getAllMovies.filter(
        (x: any) => x.title === selectedMovie
      );
      setSelectedMovieId(movie[0].id);
    }
  }, [selectedMovie]);

  return (
    <>
      <NavigationBar />
      <main style={{ position: "relative", minHeight: "100vh" }}>
        <Grid
          container
          sx={{
            display: "flex",
            height: "10vh",
            width: "30%",
            marginLeft: "5%",
            marginRight: "5%",
            marginTop: "2%",
          }}
        >
          <Grid
            item
            sx={{
              display: "flex",
              justifyContent: "center",
              height: "10vh",
              width: "33.333%",
              backgroundColor:
                pageTab === Tab["movie"] ? "primary.main" : "primary.dark",
            }}
          >
            <Button onClick={handleMovieTab} sx={{ color: "text.primary" }}>
              Movie Tab
            </Button>
          </Grid>
          <Grid
            item
            sx={{
              display: "flex",
              height: "10vh",
              justifyContent: "center",
              width: "33.333%",
              backgroundColor:
                pageTab === Tab["review"] ? "primary.main" : "primary.dark",
            }}
          >
            <Button onClick={handleReviewTab} sx={{ color: "text.primary" }}>
              Review Tab
            </Button>
          </Grid>
          <Grid
            item
            sx={{
              display: "flex",
              height: "10vh",
              justifyContent: "center",
              width: "33.334%",
              backgroundColor:
                pageTab === Tab["category"] ? "primary.main" : "primary.dark",
            }}
          >
            <Button onClick={handleCategoryTab} sx={{ color: "text.primary" }}>
              Category Tab
            </Button>
          </Grid>
        </Grid>
        {pageTab === Tab["review"] && (
          <Container
            maxWidth={false}
            sx={{
              height: "140vh",
              width: "90%",
              backgroundColor: "primary.dark",
              marginLeft: "5%",
              marginRight: "5%",
            }}
            id="container"
          >
            <Autocomplete
              disablePortal
              id="combo-box"
              options={movieOptions}
              value={selectedMovie}
              sx={{
                marginLeft: "5%",
                marginRight: "5%",
                paddingTop: 3,
                paddingBottom: 3,
              }}
              onChange={(event: any, newValue: string | null) => {
                setSelectedMovie(newValue);
              }}
              inputValue={inputValueMovie}
              onInputChange={(event, newInputValue) => {
                setInputValueMovie(newInputValue);
              }}
              renderInput={(params) => <TextField {...params} label="Movies" />}
              data-testid="movie-autocomplete"
            />
            {selectedMovie !== "" && (
              <>
                <div
                  style={{
                    height: "50vh",
                    width: "90%",
                    marginLeft: "5%",
                    marginRight: "5%",
                  }}
                  id="chartNr"
                >
                  <HighChartsReact highcharts={Highcharts} options={chartNr} />
                </div>
                <div
                  style={{
                    height: "50vh",
                    width: "90%",
                    marginLeft: "5%",
                    marginRight: "5%",
                    marginTop: "5%",
                  }}
                  id="chartAvg"
                >
                  <HighChartsReact highcharts={Highcharts} options={chartAvg} />
                </div>
              </>
            )}
          </Container>
        )}
        {pageTab === Tab["movie"] && (
          <Container
            maxWidth={false}
            sx={{
              display: "flex",
              height: "90vh",
              width: "90%",
              backgroundColor: "primary.dark",
              marginLeft: "5%",
              marginRight: "5%",
            }}
          >
            <div
              style={{
                height: "50vh",
                width: "90%",
                marginLeft: "5%",
                marginRight: "5%",
                marginTop: "5%",
              }}
              id="mChartNr"
            >
              <HighChartsReact highcharts={Highcharts} options={mChartNrYear} />
            </div>
          </Container>
        )}
        {pageTab === Tab["category"] && (
          <Container
            maxWidth={false}
            sx={{
              display: "flex",
              height: "90vh",
              width: "90%",
              backgroundColor: "primary.dark",
              marginLeft: "5%",
              marginRight: "5%",
            }}
          >
            <div
              style={{
                height: "50vh",
                width: "90%",
                marginLeft: "5%",
                marginRight: "5%",
                marginTop: "5%",
              }}
              id="mChartNr"
            >
              <HighChartsReact highcharts={Highcharts} options={mChartNrCat} />
            </div>
          </Container>
        )}
        <MyFooter />
      </main>
    </>
  );
}
