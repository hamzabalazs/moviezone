import { GraphQLError } from "graphql";
import { object, string } from "yup";
import { MyContext } from "../server";
import { getToken } from "../utils/auth";
import { getMovieById } from "../utils/movie";
import { getReviews } from "../utils/review";
import { getUserById, getUserByToken } from "../utils/user";
import { EXPIRED_TOKEN_MESSAGE, NO_MOVIE_MESSAGE, NO_TOKEN_MESSAGE, NO_USER_MESSAGE, REVIEW_EXISTS_MESSAGE, REVIEW_INVALID_RATING_MESSAGE } from "../../mozi-frontend/src/common/errorMessages";

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

export const createMovieSchema = object({
  title: string().required("Title is required!"),
  description: string().required("Description is required!"),
  poster: string().required("Poster is required!"),
  release_date: string()
    .required("Release Date is required!")
    .matches(datevalidator, "Invalid date format!"),
})

export async function tokenChecker(context: MyContext) {
  const user = await getUserByToken(context);
  if (!user) throw new GraphQLError(NO_TOKEN_MESSAGE,{extensions:{code:'UNAUTHENTICATED'}})
  context.user = user
  const isExpired = await getToken(context);
  if (isExpired.expired === 1) throw new GraphQLError(EXPIRED_TOKEN_MESSAGE,{extensions:{code:'SESSION_EXPIRED'}})
  return user;
}

export async function createReviewErrorHandling(newReview:any,context:MyContext){
    const isUser = await getUserById(newReview.user_id, context);
      if (isUser === null) throw new GraphQLError(NO_USER_MESSAGE,{extensions:{code:'NOT_FOUND'}})
      const isMovie = await getMovieById(newReview.movie_id, context);
      if (isMovie === null) throw new GraphQLError(NO_MOVIE_MESSAGE,{extensions:{code:'NOT_FOUND'}})
      const reviews = await getReviews(context)
      const hasReview = reviews.filter((x:any) => x.movie_id === newReview.movie_id && x.user_id === newReview.user_id)
      if (hasReview.length !== 0) throw new GraphQLError(REVIEW_EXISTS_MESSAGE,{extensions:{code:'ALREADY_EXISTS'}})
}
