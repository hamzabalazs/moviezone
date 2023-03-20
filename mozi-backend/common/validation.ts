import { number, object, string } from "yup";
import { MyContext } from "../server";
import { getToken } from "../utils/auth";
import { getMovieById } from "../utils/movie";
import { getReviewsOfUserForMovie } from "../utils/review";
import { getUserById, getUserByToken } from "../utils/user";
import { EXPIRED_TOKEN_MESSAGE, NO_MOVIE_MESSAGE, NO_TOKEN_MESSAGE, NO_USER_MESSAGE, REVIEW_EXISTS_MESSAGE, REVIEW_INVALID_RATING_MESSAGE, UNAUTHORIZED_MESSAGE } from "./errorMessages";

export const datevalidator =
  /(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/;

export const userSchema = object({
  first_name: string().required("First Name is required!"),
  last_name: string().required("Last Name is required!"),
  email: string().required("Email is required!").email("Invalid Email format"),
  password: string()
    .required("Password is required!")
    .min(5, "Password must be 5 of more characters"),
});

export const categorySchema = object({
  name: string().required("Category name is required!"),
});

export const reviewSchema = object({
  description: string().required("Description is required!"),
  rating: string()
    .required("Rating is required")
    .test("correct rating", REVIEW_INVALID_RATING_MESSAGE, (value) => {
      if (parseInt(value) < 1 || parseInt(value) > 5) return false;
      return true;
    }),
});

export const movieSchema = object({
  title: string().required("Title is required!"),
  description: string().required("Description is required!"),
  poster: string().required("Poster is required!"),
  release_date: string()
    .required("Release Date is required!")
    .matches(datevalidator, "Invalid date format!"),
  category_id: string().required("Category is required!"),
});

export async function tokenChecker(context: MyContext) {
  const user = await getUserByToken(context);
  if (!user) throw new Error(NO_TOKEN_MESSAGE);
  context.user = user
  const isExpired = await getToken(context);
  if (isExpired.expired === 1) throw new Error(EXPIRED_TOKEN_MESSAGE);
  return user;
}

export async function createReviewErrorHandling(newReview:any,context:MyContext){
    const isUser = await getUserById(newReview.user_id, context);
      if (isUser === undefined) throw new Error(NO_USER_MESSAGE);
      const isMovie = await getMovieById(newReview.movie_id, context);
      if (isMovie === undefined) throw new Error(NO_MOVIE_MESSAGE);
      const hasReview = await getReviewsOfUserForMovie(
        newReview.user_id,
        newReview.movie_id,
        context
      );
      if (hasReview.length !== 0) throw new Error(REVIEW_EXISTS_MESSAGE);
}
