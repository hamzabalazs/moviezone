import { TFunction } from "i18next";

export function getMonthList(month:number){
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

    const monthlist = [];
    if (month >= 5) {
      monthlist.push(months[month - 5]);
      monthlist.push(months[month - 4]);
      monthlist.push(months[month - 3]);
      monthlist.push(months[month - 2]);
      monthlist.push(months[month - 1]);
      monthlist.push(months[month]);
    } else if (month === 4) {
      monthlist.push(months[month + 12 - 5]);
      monthlist.push(months[month - 4]);
      monthlist.push(months[month - 3]);
      monthlist.push(months[month - 2]);
      monthlist.push(months[month - 1]);
      monthlist.push(months[month]);
    } else if (month === 3) {
      monthlist.push(months[month + 12 - 5]);
      monthlist.push(months[month + 12 - 4]);
      monthlist.push(months[month - 3]);
      monthlist.push(months[month - 2]);
      monthlist.push(months[month - 1]);
      monthlist.push(months[month]);
    } else if (month === 2) {
      monthlist.push(months[month + 12 - 5]);
      monthlist.push(months[month + 12 - 4]);
      monthlist.push(months[month + 12 - 3]);
      monthlist.push(months[month - 2]);
      monthlist.push(months[month - 1]);
      monthlist.push(months[month]);
    } else if (month === 1) {
      monthlist.push(months[month + 12 - 5]);
      monthlist.push(months[month + 12 - 4]);
      monthlist.push(months[month + 12 - 3]);
      monthlist.push(months[month + 12 - 2]);
      monthlist.push(months[month - 1]);
      monthlist.push(months[month]);
    } else if (month === 0) {
      monthlist.push(months[month + 12 - 5]);
      monthlist.push(months[month + 12 - 4]);
      monthlist.push(months[month + 12 - 3]);
      monthlist.push(months[month + 12 - 2]);
      monthlist.push(months[month + 12 - 1]);
      monthlist.push(months[month]);
    }

    return monthlist
}
export function getMovieDataCat(nameList:string[],countList:number[]){
    const data = []
    while(nameList.length !== 0){
        data.push({
            name: nameList[nameList.length-1],
            y: countList[countList.length-1]
        })
        nameList.pop()
        countList.pop()
    }
    return data;
}
export function getMovieDataYear(yearList:string[],countList:number[]){
  const data = []
    for(let i = 0; i < 23; i++){
      const year = i+2000
        if(yearList.includes(year.toString())){
          data.push({
              name: yearList[yearList.findIndex((x:any) => x === year.toString())],
              y: countList[yearList.findIndex((x:any) => x === year.toString())]
          })
        }
        else data.push({
          name:year.toString(),
          y:0
        })
    }
    return data;
}
export function getMovieYearChart(data:any[],t:TFunction<"translation", undefined, "translation">,mode:string|null){
  const chart = {
    chart: {
      backgroundColor: "transparent",
      type: "column",
      borderWidth: 1,
      borderColor: (mode === 'light') ? "black" : "white",
      borderRadius: 2,
    },
    title: {
      text: t('dashboard.movieYearChartText'),
      style: { color: (mode === 'light') ? "black" : "white"},
    },
    xAxis: {
      categories: [
        2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011,
        2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
      ],
      crosshair: true,
      labels: {
        style: {
          color: (mode === 'light') ? "black" : "white",
        },
      },
    },
    yAxis: {
      title: {
        text: t('dashboard.nrOfMovies'),
        style: { color: (mode === 'light') ? "black" : "white" },
      },
      labels: {
        style: {
          color: (mode === 'light') ? "black" : "white",
        },
      },
    },
    legend: {
      itemStyle: {
        color: (mode === 'light') ? "black" : "white",
      },
    },
    series: [
      {
        name: t('dashboard.nrOfMovies'),
        type: "column",
        color: (mode === 'light') ? "#124116" :"#5d8e25",
        data: data,
      },
    ],
  };
  return chart
}
export function getReviewNrChart(monthlist:string[],movie:string | null,nrList:any[],t:TFunction<"translation", undefined, "translation">,mode:string|null){
  const chart = {
    chart: {
      type: "line",
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: (mode === 'light') ? "black" : "white",
      borderRadius: 2,
    },
    title: {
      text: t('dashboard.nrOfReviewsText'),
      style: { color: (mode === 'light') ? "black" : "white" },
    },
    xAxis: {
      categories: monthlist,
      crosshair: true,
      labels: {
        style: {
          color: (mode === 'light') ? "black" : "white",
        },
      },
    },
    yAxis: {
      title: {
        text: t('dashboard.nrOfReviews'),
        style: { color: (mode === 'light') ? "black" : "white" },
      },
      labels: {
        style: {
          color: (mode === 'light') ? "black" : "white",
        },
      },
    },
    legend: {
      itemStyle: {
        color: (mode === 'light') ? "black" : "white",
      },
    },
    series: [
      {
        name: movie!,
        type: "line",
        color: (mode === 'light') ? "#124116" :"#5d8e25",
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
  return chart
}
export function getReviewAvgChart(monthlist:string[],movie:string | null, avgList:any[],t:TFunction<"translation", undefined, "translation">,mode:string|null){
  const chart = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: (mode === 'light') ? "black" : "white",
      borderRadius: 2,
    },
    title: {
      text: t('dashboard.avgOfReviewsText'),
      style: { color: (mode === 'light') ? "black" : "white" },
    },
    xAxis: {
      categories: monthlist,
      crosshair: true,
      labels: {
        style: {
          color: (mode === 'light') ? "black" : "white",
        },
      },
    },
    yAxis: {
      min: 0.0,
      max: 5.0,
      title: {
        text: t('dashboard.avgOfReviews'),
        style: { color: (mode === 'light') ? "black" : "white" },
      },
      labels: {
        style: {
          color: (mode === 'light') ? "black" : "white",
        },
      },
    },
    legend: {
      itemStyle: {
        color: (mode === 'light') ? "black" : "white",
      },
    },
    series: [
      {
        name: movie!,
        type: "column",
        color: (mode === 'light') ? "#124116" :"#5d8e25",
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

  return chart
}
export function getMovieNrChart(data:any[],t:TFunction<"translation", undefined, "translation">,mode:string|null){
  const chart = {
    chart: {
      backgroundColor: "transparent",
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: t('dashboard.movieNrChartText'),
      style: { color: (mode === 'light') ? "black" : "white" },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}",
          style: {
            color: (mode === 'light') ? "black" : "white",
          },
        },
      },
    },
    series: [
      {
        name: t('dashboard.movies'),
        colorByPoint: true,
        data: data,
      },
    ],
  };

  return chart
}