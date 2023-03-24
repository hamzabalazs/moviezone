import { Autocomplete, debounce, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import MovieListCard from "./cards/MovieListCard";
import { useTranslation } from "react-i18next";
import { Category, Movie } from "../gql/graphql";
import { useHomePageData } from "../pages/useHomePageData";
import MovieListSkeletonComponent from "./MovieListSkeletonComponent";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

function MovieList() {
  const { t } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const categoryListForAutocomplete: string[] = [];
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [inputValueCategory, setInputValueCategory] = useState("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [offset, setOffset] = useState<number>(0);

  const { movies, categories, error, loading, totalCount } = useHomePageData(
    offset,
    categoryFilter,
    searchValue
  );
  
  useBottomScrollListener(() => {
    if (totalCount - offset > 9) setOffset(offset + 9);
    return;
  });

  useEffect(() => {
    if (categoryListForAutocomplete.length === 0) {
      categories.forEach((category: Category) => {
        categoryListForAutocomplete.push(category.name);
      });
      setCategoryOptions(categoryListForAutocomplete);
    }
  }, [categories]);

  useEffect(() => {
    let list: string[] = [];
    categories.forEach((category: Category) => {
      if (selectedCategoryId.includes(category.name)) list.push(category.id);
    });
    setCategoryFilter(list);
  }, [selectedCategoryId]);

  useEffect(() => {
    if (!loading) {
      let list:Movie[] = []
      list.push(...movies);
      setMovieList([...movieList,...list]);
    }
  }, [loading]);

  useEffect(() => {
    setMovieList([]);
    setOffset(0);
  }, [selectedCategoryId, searchValue]);

  const search = (value:string) => {
    setSearchValue(value);
  }

  let searchDebounce = debounce(search,1000)

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Grid container spacing={2}>
          <Grid item key={1} xs={12} sm={12} md={12}>
            <TextField
              id="searchValue"
              name="searchValue"
              sx={{ border: 2 }}
              fullWidth
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  searchDebounce.clear()
                  searchDebounce = debounce(search,500)
                  searchDebounce(event.target.value);
              }}
            ></TextField>
          </Grid>
          <Grid item key={2} xs={12} sm={12} md={12}>
            <Autocomplete
              multiple
              disablePortal
              id="combo-box"
              fullWidth
              options={categoryOptions}
              value={selectedCategoryId}
              onChange={(event: any, newValue: string[]) => {
                setSelectedCategoryId(newValue);
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
        {movieList.map((movie: Movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4}>
            <MovieListCard movie={movie} />
          </Grid>
        ))}
      </Grid>
      {loading && (
        <Grid container spacing={2}>
          <MovieListSkeletonComponent />
          <MovieListSkeletonComponent />
          <MovieListSkeletonComponent />
          <MovieListSkeletonComponent />
          <MovieListSkeletonComponent />
          <MovieListSkeletonComponent />
          <MovieListSkeletonComponent />
          <MovieListSkeletonComponent />
          <MovieListSkeletonComponent />
        </Grid>
      )}
    </>
  );
}

export default MovieList;
