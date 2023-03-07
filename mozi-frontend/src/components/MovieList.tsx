import { Autocomplete, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useApiContext } from "../api/ApiContext";
import { Movie } from "../api/types";
import MovieListCard from "./cards/MovieListCard";
import { useTranslation } from "react-i18next";

function MovieList() {
  const context = useApiContext();
  const { t } = useTranslation();

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string[] | undefined
  >([]);
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const movieListForAutocomplete: string[] = [];
  const categoryListForAutocomplete: string[] = [];
  const [movieOptions, setMovieOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [selectedMovieTitle, setSelectedMovieTitle] = useState<
    string[] | undefined
  >([]);
  const [inputValueMovie, setInputValueMovie] = useState("");
  const [inputValueCategory, setInputValueCategory] = useState("");

  function filtering(
    categoryId: string[] | undefined,
    title: string[] | undefined
  ) {
    if (
      (categoryId?.length === 0 || categoryId === undefined) &&
      (title?.length === 0 || title === undefined)
    ) {
      setMovieList(context.movies);
    } else if (
      (categoryId?.length !== 0 || categoryId !== undefined) &&
      (title?.length === 0 || title === undefined)
    ) {
      const newCategories = context.categories.filter((x) =>
        categoryId?.includes(x.name)
      );
      const categoryList: string[] = [];
      newCategories.forEach((category) => {
        categoryList.push(category.id);
      });
      const newMovies = context.movies.filter((x) =>
        categoryList?.includes(x.category.id)
      );
      setMovieList(newMovies);
    } else if (
      (categoryId?.length === 0 || categoryId === undefined) &&
      (title?.length !== 0 || title !== undefined)
    ) {
      const newMovies = context.movies.filter((x) => title?.includes(x.title));
      setMovieList(newMovies);
    } else {
      const newCategories = context.categories.filter((x) =>
        categoryId?.includes(x.name)
      );
      const categoryList: string[] = [];
      newCategories.forEach((category) => {
        categoryList.push(category.id);
      });
      const newMovies = context.movies.filter(
        (x) => title?.includes(x.title) && categoryList?.includes(x.category.id)
      );
      setMovieList(newMovies);
    }
  }

  useEffect(() => {
    const filteredMovieList: string[] = [];
    movieList.forEach((movie) => {
      filteredMovieList.push(movie.title);
    });
    setMovieOptions(filteredMovieList);
  }, [movieList]);

  useEffect(() => {
    filtering(selectedCategoryId, selectedMovieTitle);
  }, [selectedMovieTitle, selectedCategoryId]);

  useEffect(() => {
    if (movieListForAutocomplete.length === 0) {
      context.movies.forEach((movie) => {
        movieListForAutocomplete.push(movie.title);
      });
      setMovieOptions(movieListForAutocomplete);
    }
    if (categoryListForAutocomplete.length === 0) {
      context.categories.forEach((category) => {
        categoryListForAutocomplete.push(category.name);
      });
      setCategoryOptions(categoryListForAutocomplete);
    }
    filtering(selectedCategoryId, selectedMovieTitle);
  }, [context.movies, context.categories]);
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Grid container spacing={2}>
          <Grid item key={1} xs={12} sm={12} md={12}>
            <Autocomplete
              multiple
              disablePortal
              id="combo-box"
              fullWidth
              options={movieOptions}
              value={selectedMovieTitle}
              onChange={(event: any, newValue: string[] | undefined) => {
                setSelectedMovieTitle(newValue);
                console.log(newValue);
              }}
              inputValue={inputValueMovie}
              onInputChange={(event, newInputValue) => {
                setInputValueMovie(newInputValue);
              }}
              sx={{ width: "100%", border: 1, borderRadius: 1 }}
              renderInput={(params) => (
                <TextField {...params} label={t("navbar.Movies")} />
              )}
              data-testid="movie-autocomplete"
            />
          </Grid>
          <Grid item key={2} xs={12} sm={12} md={12}>
            <Autocomplete
              multiple
              disablePortal
              id="combo-box"
              fullWidth
              options={categoryOptions}
              value={selectedCategoryId}
              onChange={(event: any, newValue: string[] | undefined) => {
                setSelectedCategoryId(newValue);
                console.log(newValue);
              }}
              inputValue={inputValueCategory}
              onInputChange={(event, newInputValue) => {
                setInputValueCategory(newInputValue);
              }}
              sx={{
                width: "100%",
                border: 1,
                borderRadius: 1,
                marginBottom: 3,
              }}
              renderInput={(params) => (
                <TextField {...params} label={t("navbar.Categories")} />
              )}
              data-testid="category-autocomplete"
            />
          </Grid>
        </Grid>
      </div>
      <Grid container spacing={2}>
        {movieList.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4}>
            <MovieListCard
              movie={movie}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default MovieList;
