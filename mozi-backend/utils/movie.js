function getMovies(_, context) {
  const sql = "SELECT * FROM movie";
  return new Promise((resolve, reject) => {
    context.db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

function getMovieById(id, context) {
  const sql = `SELECT * FROM movie WHERE movie.id = ?`;
  return new Promise((resolve, reject) => {
    context.db.get(sql,[id], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

function createMovie(movie, context) {
  const sql = `INSERT INTO movie (id,title,description,poster,release_date,category_id) VALUES (?,?,?,?,?,?)`;
  return new Promise((resolve, reject) => {
    context.db.run(sql,[movie.id,movie.title,movie.description,movie.poster,movie.release_date,movie.category_id], err => {
      if (err) {
        reject(err);
      }
      resolve(movie);
    });
  });
}

function updateMovie(movie, context) {
  const sql = `UPDATE movie SET title = ?,
    description = ?,
    poster = ?, 
    release_date = ?, 
    category_id=? WHERE movie.id = ?`;
  return new Promise((resolve, reject) => {
    context.db.run(sql,[movie.title,movie.description,movie.poster,movie.release_date,movie.category_id,movie.id], err => {
      if (err) {
        reject(err);
      }
      resolve(movie);
    });
  });
}

function deleteMovie(id, context) {
  const movie = Promise.resolve(getMovieById(id, context));
  if(movie === undefined){
    throw new Error("Movie not found!")
  }
  const sql = `DELETE FROM movie WHERE movie.id = ?`;
  return new Promise((resolve, reject) => {
    context.db.run(sql,[id], err => {
      if (err) {
        reject(err);
      }
      resolve(movie);
    });
  });
}
module.exports = { getMovies, getMovieById,deleteMovie,updateMovie,createMovie };
