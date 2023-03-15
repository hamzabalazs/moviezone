import { Movie } from "./types"

export const testMovie:Movie = {
    id:"idM1",
    title:"title1",
    description:"description1",
    poster:"poster1",
    release_date:"20/12/2020",
    category:{
        id:"idC2",
        name:"name2"
    },
    rating:"5"
}

export const editMovie = {
    id:"idM1",
    title:"title1EDITED",
    description:"description1ED",
    poster:"poster1ED",
    release_date:"20/12/2012",
    category_id:"idC3"
}

export const editResponseMovie:Movie = {
    id:"idM1",
    title:"title1EDITED",
    description:"description1ED",
    poster:"poster1ED",
    release_date:"20/12/2012",
    category:{
        id:"idC3",
        name:"name3"
    },
    rating:"5"
}

export const deleteMovie:Movie = {
    id:"idM3",
    title:"title3",
    description:"description3",
    poster:"poster3",
    release_date:"25/09/2000",
    category:{
        id:"idC1",
        name:"name1"
    },
    rating:"0"
}

export const addMovie = {
    title:"newTitle",
    description:"newDescription",
    poster:"newPoster",
    release_date:"13/03/2023",
    category_id:"idC3"
}