import React from "react";
import { apiContext, ApiContextData } from "../../api/ApiContext";

export function MockedApiContext({
  children,
  value,
}: {
  children: React.ReactNode;
  value?: Partial<ApiContextData>;
}): JSX.Element {
  return (
    <apiContext.Provider
      //@ts-ignore
      value={{
        //ADMIN USER

        user: {
          id: "idU1",
          first_name: "admin",
          last_name: "admin",
          email: "admin@example.com",
          password: "admin",
          role: "admin",
          token: "token1",
        },

        movies: [
          {
            id: "idM1",
            title: "title1",
            description: "description1",
            release_date: "22/02/2023",
            poster: "poster1",
            category: {
              id:"idC1",
              name:"name1"
            },
            rating: 3.5,
          },
          {
            id: "idM2",
            title: "title2",
            description: "description2",
            release_date: "22/02/2023",
            poster: "poster2",
            category: {
              id:"idC2",
              name:"name2"
            },
            rating: 2,
          },
          {
            id: "idM3",
            title: "title3",
            description: "description3",
            release_date: "22/02/2023",
            poster: "poster3",
            category: {
              id:"idC3",
              name:"name3"
            },
            rating: 1,
          },
          {
            id: "idM4",
            title: "title4",
            description: "description4",
            release_date: "22/02/2023",
            poster: "poster4",
            category: {
              id:"idC1",
              name:"name1"
            },
            rating: 3,
          },
          {
            id: "idM5",
            title: "title5",
            description: "description5",
            release_date: "22/02/2023",
            poster: "poster5",
            category: {
              id:"idC2",
              name:"name2"
            },
            rating: 5,
          },
          {
            id: "idM6",
            title: "title6",
            description: "description6",
            release_date: "22/02/2023",
            poster: "poster6",
            category: {
              id:"idC2",
              name:"name2"
            },
            rating: 4.5,
          },
          {
            id: "idM7",
            title: "title7",
            description: "description7",
            release_date: "22/02/2023",
            poster: "poster7",
            category: {
              id:"idC3",
              name:"name3"
            },
            rating: 1.5,
          },
          {
            id: "idM8",
            title: "title8",
            description: "description8",
            release_date: "22/02/2023",
            poster: "poster8",
            category: {
              id:"idC3",
              name:"name3"
            },
            rating: 1,
          },
        ],
        categories: [
          { id: "idC1", name: "name1" },
          { id: "idC2", name: "name2" },
          { id: "idC3", name: "name3" },
        ],

        users: [
          {
            id: "idU1",
            first_name: "admin",
            last_name: "admin",
            email: "admin@example.com",
            password: "admin",
            role: "admin",
          },
          //EDITOR USER
          {
            id: "idU2",
            first_name: "editor",
            last_name: "editor",
            email: "editor@example.com",
            password: "editor",
            role: "editor",
          },
          //VIEWER USER

          {
            id: "idU3",
            first_name: "viewer",
            last_name: "viewer",
            email: "viewer@example.com",
            password: "viewer",
            role: "viewer",
          },
        ],

        reviews: [
          {
            id: "idR1",
            user:{
              id:"idU2",
              first_name:"first",
              last_name:"last",
              email:"email",
              role:"viewer",
              password:"vivu"
            } ,
            movie:{
              id:"idM2",
              title:"title",
              description:"WAAA",
              poster:"posterket",
              release_date:"awuuu",
              category:{
                id:"idC1",
                name:"name1"
              },
              rating:0
            } ,
            description: "description1EDITED",
            rating: 5,
          },
          {
            id: "idR2",
            user:{
              id:"idU2",
              first_name:"first",
              last_name:"last",
              email:"email",
              role:"viewer",
              password:"vivu"
            } ,
            movie:{
              id:"idM2",
              title:"title",
              description:"WAAA",
              poster:"posterket",
              release_date:"awuuu",
              category:{
                id:"idC1",
                name:"name1"
              },
              rating:0
            } ,
            description: "description1EDITED",
            rating: 5,
          },
          {
            id: "idR3",
            user:{
              id:"idU2",
              first_name:"first",
              last_name:"last",
              email:"email",
              role:"viewer",
              password:"vivu"
            } ,
            movie:{
              id:"idM2",
              title:"title",
              description:"WAAA",
              poster:"posterket",
              release_date:"awuuu",
              category:{
                id:"idC1",
                name:"name1"
              },
              rating:0
            } ,
            description: "description1EDITED",
            rating: 5,
          },
          {
            id: "idR4",
            user:{
              id:"idU2",
              first_name:"first",
              last_name:"last",
              email:"email",
              role:"viewer",
              password:"vivu"
            } ,
            movie:{
              id:"idM2",
              title:"title",
              description:"WAAA",
              poster:"posterket",
              release_date:"awuuu",
              category:{
                id:"idC1",
                name:"name1"
              },
              rating:0
            } ,
            description: "description1EDITED",
            rating: 5,
          },
          {
            id: "idR5",
            user:{
              id:"idU2",
              first_name:"first",
              last_name:"last",
              email:"email",
              role:"viewer",
              password:"vivu"
            } ,
            movie:{
              id:"idM2",
              title:"title",
              description:"WAAA",
              poster:"posterket",
              release_date:"awuuu",
              category:{
                id:"idC1",
                name:"name1"
              },
              rating:0
            } ,
            description: "description1EDITED",
            rating: 5,
          },
        ],
        usersLoading: false,
        moviesLoading: false,
        reviewsLoading: false,
        categoriesLoading: false,
        ...value,
      }}
    >
      {children}
    </apiContext.Provider>
  );
}
