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

    console.log("data",data)
    return data;
}