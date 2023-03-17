export const movieData = [
    {
        id:"idM1",
        title:"title1",
        description:"description1",
        poster:"poster1",
        release_date:"20/12/2020",
        category_id:"idC2",
    },
    {
        id:"idM2",
        title:"title2",
        description:"description2",
        poster:"poster2",
        release_date:"30/06/2015",
        category_id:"idC1",
    },
    {
        id:"idM3",
        title:"title3",
        description:"description3",
        poster:"poster3",
        release_date:"25/09/2000",
        category_id:"idC1",
    },
    {
        id:"idM4",
        title:"title4",
        description:"description4",
        poster:"poster4",
        release_date:"02/01/2001",
        category_id:"idC2",
    },
    {
        id:"idM5",
        title:"title5",
        description:"description5",
        poster:"poster5",
        release_date:"01/11/1998",
        category_id:"idC3",
    },
    {
        id:"idM6",
        title:"title6",
        description:"description6",
        poster:"poster6",
        release_date:"11/03/2003",
        category_id:"idC1",
    },
]

export const userData = [
    {
        id:"idU1",
        first_name:"Test",
        last_name:"User1",
        email:"testuser1@gmail.com",
        password:"c23b2ed66eedb321c5bcfb5e3724b978",
        role:"viewer",
    },
    {
        id:"idU2",
        first_name:"Test",
        last_name:"User2",
        email:"testuser2@gmail.com",
        password:"3b46afa69314bf5a2f885a532cfab7c4",
        role:"editor",
    },
    {
        id:"idU3",
        first_name:"Test",
        last_name:"User3",
        email:"testuser3@gmail.com",
        password:"bb86c291743c3edcf6c76e4ff69f974f",
        role:"admin",
    },
    {
        id:"idU4",
        first_name:"Test",
        last_name:"User4",
        email:"testuser4@gmail.com",
        password:"5bd81d5fecc184e59cad0931fd66e95f",
        role:"viewer",
    },
]

export const categoryData = [
    {
        id:"idC1",
        name:"name1"
    },
    {
        id:"idC2",
        name:"name2"
    },
    {
        id:"idC3",
        name:"name3"
    },
    
]

export const reviewData = [
    {
        id:"idR1",
        rating:"5",
        description:"Looked good",
        movie_id:"idM1",
        user_id:"idU1"
    },
    {
        id:"idR2",
        rating:"3",
        description:"Was alright",
        movie_id:"idM3",
        user_id:"idU1"
    },
    {
        id:"idR3",
        rating:"1",
        description:"Didnt like",
        movie_id:"idM2",
        user_id:"idU2"
    },
    {
        id:"idR4",
        rating:"5",
        description:"Best",
        movie_id:"idM1",
        user_id:"idU2"
    },
    {
        id:"idR5",
        rating:"4",
        description:"I mean its alright",
        movie_id:"idM4",
        user_id:"idU2"
    },
    {
        id:"idR6",
        rating:"4",
        description:"IT WAS PERFECT",
        movie_id:"idM3",
        user_id:"idU4"
    },
    {
        id:"idR7",
        rating:"1",
        description:"badbad",
        movie_id:"idM2",
        user_id:"idU1"
    },
]

export const sessionData = [
    {
        id:1,
        token:"viewertoken1234",
        user_id:"idU1",
        expiry:"2023-05-16 18:20:05"
    },
    {
        id:2,
        token:"editortoken4321",
        user_id:"idU2",
        expiry:"2023-05-16 18:20:05"
    },
    {
        id:3,
        token:"admintoken1423",
        user_id:"idU3",
        expiry:"2023-05-16 18:20:05"
    },
    {
        id:4,
        token:"tokenviewer4321",
        user_id:"idU4",
        expiry:"2023-05-16 18:20:05"
    },
    {
        id:5,
        token:"tokenviewer12345",
        user_id:"idU5",
        expiry:"2023-03-16 18:20:05"
    }
]