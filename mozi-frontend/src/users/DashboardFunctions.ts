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

export function getMovieYearChart(data:any[]){
  const chart = {
    chart: {
      backgroundColor: "transparent",
      type: "column",
      borderWidth: 1,
      borderColor: "white",
      borderRadius: 2,
    },
    title: {
      text: "Number of movies release by year from 2000",
      style: { color: "white" },
    },
    xAxis: {
      categories: [
        2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011,
        2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
      ],
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
        name: "Nr. of movies",
        type: "column",
        color: "#86cc35",
        data: data,
      },
    ],
  };
  return chart
}
export function getReviewNrChart(monthlist:string[],movie:string | null,nrList:any[]){
  const chart = {
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
        name: movie!,
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
  return chart
}
export function getReviewAvgChart(monthlist:string[],movie:string | null, avgList:any[]){
  const chart = {
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
      max: 5.0,
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
        name: movie!,
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

  return chart
}
export function getMovieNrChart(data:any[]){
  const chart = {
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
        data: data,
      },
    ],
  };

  return chart
}