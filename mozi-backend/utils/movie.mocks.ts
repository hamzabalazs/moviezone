import { Movie } from "./types"

export const testMovie:Movie = {
    id:"idM1",
    title:"title1",
    description:"description1",
    poster:"poster1",
    release_date:"2020-12-20",
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
    release_date:"2012-12-20",
    category_id:"idC3"
}

export const editResponseMovie:Movie = {
    id:"idM1",
    title:"title1EDITED",
    description:"description1ED",
    poster:"poster1ED",
    release_date:"2012-12-20",
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
    release_date:"2000-09-25",
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
    release_date:"2023-03-13",
    category_id:"idC3"
}