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
import {
  GET_ALL_MOVIES,
  GET_MOVIE_DATA_NR_CATEGORY,
  GET_MOVIE_DATA_NR_YEAR,
  GET_REVIEW_DATA_AVG,
  GET_REVIEW_DATA_NR,
} from "./userQueries";
import Highcharts from "highcharts";
import { getMonthList, getMovieDataCat, getMovieDataYear } from "./DashboardFunctions";
import HighChartsReact from "highcharts-react-official";

<script src="https://code.highcharts.com/highcharts.js"></script>;

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
  const { data, loading } = useQuery(GET_ALL_MOVIES,{fetchPolicy:"network-only"});
  const { data: reviewNrData, loading: reviewNrLoading } = useQuery(
    GET_REVIEW_DATA_NR,
    { variables: { input: { movie_id: selectedMovieId } },fetchPolicy:"network-only" }
  );
  const { data: reviewAvgData, loading: reviewAvgLoading } = useQuery(
    GET_REVIEW_DATA_AVG,
    { variables: { input: { movie_id: selectedMovieId } },fetchPolicy:"network-only" }
  );
  const { data: movieNrCatData, loading: movieNrCatLoading } =
    useQuery(GET_MOVIE_DATA_NR_CATEGORY,{fetchPolicy:"network-only"});
  const {data: movieNrYearData, loading: movieNrYearLoading } = useQuery(GET_MOVIE_DATA_NR_YEAR,{fetchPolicy:"network-only"})
  const d = new Date();
  const month = d.getMonth();
  const monthlist = getMonthList(month);
  const nrList = [];
  const avgList = [];
  if (
    !reviewNrLoading &&
    reviewNrData &&
    !reviewAvgLoading &&
    reviewAvgData &&
    pageTab === Tab["review"]
  ) {
    for (let i = 0; i < 6; i++) {
      if (reviewNrData.getNumberOfReviewsOfMoviePerMonth[i]) {
        nrList.push(
          reviewNrData.getNumberOfReviewsOfMoviePerMonth[i].totalCount
        );
      } else nrList.push(0);
      if (reviewAvgData.getAverageOfReviewsOfMoviePerMonth[i]) {
        avgList.push(
          reviewAvgData.getAverageOfReviewsOfMoviePerMonth[i].average
        );
      } else avgList.push(0.0);
    }
  }

  const chartNr = {
    chart: {
      type: "line",
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: "white",
      borderRadius: 2,
    },
    title: {
      text: "Number of reviews of a movie over a period of the last six months",
      style: { color: "white" },
    },
    xAxis: {
      categories: monthlist,
      crosshair: true,
      labels: {
        style: {
          color: "white",
        },
      },
    },
    yAxis: {
      title: {
        text: "Nr. of reviews",
        style: { color: "white" },
      },
      labels: {
        style: {
          color: "white",
        },
      },
    },
    legend: {
      itemStyle: {
        color: "white",
      },
    },
    series: [
      {
        name: selectedMovie!,
        type: "line",
        color: "#86cc35",
        lineWidth: 4,
        data: [
          nrList[5],
          nrList[4],
          nrList[3],
          nrList[2],
          nrList[1],
          nrList[0],
        ],
      },
    ],
  };
  const chartAvg = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: "white",
      borderRadius: 2,
    },
    title: {
      text: "Average of reviews of a movie over a period of the last six months",
      style: { color: "white" },
    },
    xAxis: {
      categories: monthlist,
      crosshair: true,
      labels: {
        style: {
          color: "white",
        },
      },
    },
    yAxis: {
      min: 0.0,
      title: {
        text: "Avg. of reviews",
        style: { color: "white" },
      },
      labels: {
        style: {
          color: "white",
        },
      },
    },
    legend: {
      itemStyle: {
        color: "white",
      },
    },
    series: [
      {
        name: selectedMovie!,
        type: "column",
        color: "#86cc35",
        data: [
          avgList[5],
          avgList[4],
          avgList[3],
          avgList[2],
          avgList[1],
          avgList[0],
        ],
      },
    ],
  };
  const nameList: string[] = [];
  const countCatList: number[] = [];

  if (!movieNrCatLoading && movieNrCatData) {
    movieNrCatData.getNumberOfMoviesPerCategory.map((x: any) => {
      nameList.push(x.name);
      countCatList.push(x.totalCount);
    });
  }
  const yearList: string[] = [];
  const countYearList:number[] = [];
  if(!movieNrYearLoading && movieNrYearData){
    movieNrYearData.getNumberOfMoviesPerYear.map((x:any) => {
      yearList.push(x.year)
      countYearList.push(x.totalCount)
    })
  }
  const yearChartData = getMovieDataYear(yearList,countYearList);
  const mChartNrYear = {
    chart:{
      backgroundColor:"transparent",
      type:"column",
      borderWidth: 1,
      borderColor: "white",
      borderRadius: 2,
    },
    title: {
      text: "Number of movies release by year from 2000",
      style: { color: "white" },
    },
    xAxis: {
      categories: [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023],
      crosshair: true,
      labels: {
        style: {
          color: "white",
        },
      },
    },
    yAxis: {
      title: {
        text: "Nr. of movies",
        style: { color: "white" },
      },
      labels: {
        style: {
          color: "white",
        },
      },
    },
    legend: {
      itemStyle: {
        color: "white",
      },
    },
    series: [
      {
        name:"Nr. of movies",
        type: "column",
        color: "#86cc35",
        data: yearChartData
      },
    ],
  }

  const catChartData = getMovieDataCat(nameList, countCatList);
  const mChartNrCat = {
    chart: {
      backgroundColor: "transparent",
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: "Number of movies per category",
      style: { color: "white" },
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}",
          style: {
            color: "white",
          },
        },
      },
    },
    series: [
      {
        name: "Categories",
        colorByPoint: true,
        data: catChartData,
      },
    ],
  };



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
        console.log(data.getAllMovies);
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
