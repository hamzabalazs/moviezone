// import { Movie } from "../types";
// import { API_URL } from "../constants";
import React from 'react'

// // Movie DELETE by ID
// export async function DeleteMovieAPI(
//   id: string,
//   token: string
// ): Promise<boolean> {
//   try {
//     const response = await fetch(API_URL + "/movie/" + id, {
//       method: "DELETE",
//       headers: {
//         "auth-token": token,
//       },
//     });
//     return response.status === 200;
//   } catch (err) {}
//   return false;
// }

// // Movie GET ALL
// export async function getMovieList(): Promise<Movie[]> {
//   const res = await fetch(API_URL + "/movies", {
//     method: "GET",
//   });
//   if (res.status === 200) {
//     const data = await res.json();
//     return data.data;
//   } else return [];
// }

// // Movie GET by ID
// export const getMovieById = async (
//   movie_id: string
// ): Promise<Movie | undefined> => {
//   const testresponse = await fetch(API_URL + "/movie/" + movie_id, {
//     method: "GET",
//   });
//   if (testresponse.status === 200) {
//     const res = await fetch(API_URL + "/movie/" + movie_id, {
//       method: "GET",
//     });
//     const body = await res.json();

//     return body.data;
//   }
// };

// export async function getMovieByIdForReviews(movie_id: string) {
//   const res = await fetch(API_URL + "/movie/" + movie_id, {
//     method: "GET",
//   });
//   if (res.status === 200) {
//     const data = await res.json();
//     return data.data;
//   } else return;
// }

// // Movie PATCH by ID
// // export async function UpdateMovieAPI(
// //   movie: Omit<Movie, "rating">,
// //   token: string
// // ): Promise<boolean> {
// //   try {
// //     const response = await fetch(API_URL + "/movie/" + movie.id, {
// //       method: "PATCH",
// //       headers: {
// //         "Content-type": "application/json",
// //         "auth-token": token,
// //       },
// //       body: JSON.stringify({
// //         title: movie.title,
// //         description: movie.description,
// //         release_date: movie.release_date,
// //         poster: movie.poster,
// //         categoryId: movie.categoryId,
// //       }),
// //     });
// //     return response.status === 200;
// //   } catch (err) {}
// //   return false;
// // }

// // Movie POST
// export async function AddMovieAPI(
//   movie: Omit<Movie, "id" | "rating">,
//   token: string
// ): Promise<boolean> {
//   const response = await fetch(API_URL + "/movie", {
//     method: "POST",
//     headers: {
//       "Content-type": "application/json",
//       "auth-token": token,
//     },
//     body: JSON.stringify(movie),
//   });
//   console.log("resr", response);
//   return response.status === 200;
// }


