import { TFunction } from "i18next";

export function getMonthList(month: number) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return [...months, ...months].slice(13 - month, 19 - month);
}
export function getMovieDataCat(
  nameList: string[],
  countList: number[]
): { name: string; y: number }[] {
  const data = [];
  while (nameList.length !== 0) {
    data.push({
      name: nameList[nameList.length - 1],
      y: countList[countList.length - 1],
    });
    nameList.pop();
    countList.pop();
  }
  return data;
}
export function getMovieDataYear(
  yearList: string[],
  countList: number[]
): { name: string; y: number }[] {
  const data = [];
  for (let i = 0; i < 24; i++) {
    const year = i + 2000;
    if (yearList.includes(year.toString())) {
      data.push({
        name: yearList[yearList.findIndex((x: any) => x === year.toString())],
        y: countList[yearList.findIndex((x: any) => x === year.toString())],
      });
    } else
      data.push({
        name: year.toString(),
        y: 0,
      });
  }
  return data;
}
export function getMovieYearChart(
  data: any[],
  t: TFunction<"translation", undefined, "translation">,
  mode: string | null
) {
  const chart = {
    chart: {
      backgroundColor: "transparent",
      type: "column",
      borderWidth: 1,
      borderColor: mode === "light" ? "black" : "#A8A8A8",
      borderRadius: 2,
    },
    title: {
      text: t("dashboard.movieYearChartText"),
      style: { color: mode === "light" ? "black" : "#A8A8A8" },
    },
    xAxis: {
      categories: [
        2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011,
        2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
      ],
      crosshair: true,
      labels: {
        style: {
          color: mode === "light" ? "black" : "#A8A8A8",
        },
      },
    },
    yAxis: {
      title: {
        text: t("dashboard.nrOfMovies"),
        style: { color: mode === "light" ? "black" : "#A8A8A8" },
      },
      labels: {
        style: {
          color: mode === "light" ? "black" : "#A8A8A8",
        },
      },
    },
    legend: {
      itemStyle: {
        color: mode === "light" ? "black" : "#A8A8A8",
      },
    },
    series: [
      {
        name: t("dashboard.nrOfMovies"),
        type: "column",
        color: mode === "light" ? "#124116" : "#5d8e25",
        data: data,
      },
    ],
  };
  return chart;
}
export function getReviewNrChart(
  monthlist: string[],
  movie: string | null,
  nrList: any[],
  t: TFunction<"translation", undefined, "translation">,
  mode: string | null
) {
  const chart = {
    chart: {
      type: "line",
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: mode === "light" ? "black" : "#A8A8A8",
      borderRadius: 2,
    },
    title: {
      text: t("dashboard.nrOfReviewsText"),
      style: { color: mode === "light" ? "black" : "#A8A8A8" },
    },
    xAxis: {
      categories: monthlist,
      crosshair: true,
      labels: {
        style: {
          color: mode === "light" ? "black" : "#A8A8A8",
        },
      },
    },
    yAxis: {
      title: {
        text: t("dashboard.nrOfReviews"),
        style: { color: mode === "light" ? "black" : "#A8A8A8" },
      },
      labels: {
        style: {
          color: mode === "light" ? "black" : "#A8A8A8",
        },
      },
    },
    legend: {
      itemStyle: {
        color: mode === "light" ? "black" : "#A8A8A8",
      },
    },
    series: [
      {
        name: movie!,
        type: "line",
        color: mode === "light" ? "#124116" : "#5d8e25",
        lineWidth: 4,
        data: [
          nrList[0],
          nrList[1],
          nrList[2],
          nrList[3],
          nrList[4],
          nrList[5],
        ],
      },
    ],
  };
  return chart;
}
export function getReviewAvgChart(
  monthlist: string[],
  movie: string | null,
  avgList: any[],
  t: TFunction<"translation", undefined, "translation">,
  mode: string | null
) {
  const chart = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: mode === "light" ? "black" : "#A8A8A8",
      borderRadius: 2,
    },
    title: {
      text: t("dashboard.avgOfReviewsText"),
      style: { color: mode === "light" ? "black" : "#A8A8A8" },
    },
    xAxis: {
      categories: monthlist,
      crosshair: true,
      labels: {
        style: {
          color: mode === "light" ? "black" : "#A8A8A8",
        },
      },
    },
    yAxis: {
      min: 0.0,
      max: 5.0,
      title: {
        text: t("dashboard.avgOfReviews"),
        style: { color: mode === "light" ? "black" : "#A8A8A8" },
      },
      labels: {
        style: {
          color: mode === "light" ? "black" : "#A8A8A8",
        },
      },
    },
    legend: {
      itemStyle: {
        color: mode === "light" ? "black" : "#A8A8A8",
      },
    },
    series: [
      {
        name: movie!,
        type: "column",
        color: mode === "light" ? "#124116" : "#5d8e25",
        data: [
          avgList[0],
          avgList[1],
          avgList[2],
          avgList[3],
          avgList[4],
          avgList[5],
        ],
      },
    ],
  };

  return chart;
}
export function getMovieNrChart(
  data: any[],
  t: TFunction<"translation", undefined, "translation">,
  mode: string | null
) {
  const chart = {
    chart: {
      backgroundColor: "transparent",
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: t("dashboard.movieNrChartText"),
      style: { color: mode === "light" ? "black" : "#A8A8A8" },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}",
          style: {
            color: mode === "light" ? "black" : "#A8A8A8",
            textOutline: "none",
          },
        },
      },
    },
    series: [
      {
        name: t("dashboard.movies"),
        colorByPoint: true,
        data: data,
      },
    ],
  };

  return chart;
}

export function getCategoryAvgChart(avgList:any[],categoryList:any[],mode:string|null,t:TFunction<"translation", undefined, "translation">) {
  const chart = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: mode === "light" ? "black" : "#A8A8A8",
      borderRadius: 2,
    },
    title: {
      text: t("dashboard.avgOfCategoriesText"),
      style: { color: mode === "light" ? "black" : "#A8A8A8" },
    },
    xAxis: {
      categories: categoryList,
      crosshair: true,
      labels: {
        style: {
          color: mode === "light" ? "black" : "#A8A8A8",
        },
      },
    },
    yAxis: {
      min: 0.0,
      title: {
        text: t("dashboard.avgOfReviews"),
        style: { color: mode === "light" ? "black" : "#A8A8A8" },
      },
      labels: {
        style: {
          color: mode === "light" ? "black" : "#A8A8A8",
        },
      },
    },
    legend: {
      itemStyle: {
        color: mode === "light" ? "black" : "#A8A8A8",
      },
    },
    series: [
      {
        name: t('dashboard.reviews'),
        type: "column",
        color: mode === "light" ? "#124116" : "#5d8e25",
        data: avgList
      },
    ],
  };
  return chart
}
