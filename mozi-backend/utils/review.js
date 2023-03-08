const tokenModule = require("./token")

function getReviews(_, context) {
  const sql = "SELECT * FROM review";
  return new Promise((resolve, reject) => {
    context.db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

function getReviewById(id, context) {
  const sql = `SELECT * FROM review WHERE review.id = ?`;
  return new Promise((resolve, reject) => {
    context.db.get(sql,[id], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

function getReviewsOfUserForMovie(user_id, movie_id, context) {
  const sql = `SELECT * FROM review WHERE review.user_id = ? AND review.movie_id = ?`;
  return new Promise((resolve, reject) => {
    context.db.all(sql, [user_id,movie_id], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

function getReviewsOfMovie(movie_id, context) {
  const sql = `SELECT * FROM review WHERE review.movie_id = ?`;
  return new Promise((resolve, reject) => {
    context.db.all(sql,[movie_id], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

function createReview(review, context) {
  const sql = `INSERT INTO review (id,rating,description,movie_id,user_id)
    VALUES (?,?,?,?,?)`;
  return new Promise((resolve, reject) => {
    context.db.run(sql,[review.id,review.rating,review.description,review.movie_id,review.user_id], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(review);
    });
  });
}

async function updateReview(review, context) {
  const token = await tokenModule.getToken(user, context);
  if (!token) throw new Error("No Token");
  if (token.token === context.req.headers["auth-token"]) {
    const updatedReview = await getReviewById(review.id, context);
    const returnReview = {
      ...review,
      movie_id: updatedReview.movie_id,
      user_id: updatedReview.user_id,
    };
    const sql = `UPDATE review SET rating=?, description=? WHERE review.id = ?`;
    return new Promise((resolve, reject) => {
      context.db.run(
        sql,
        [review.rating, review.description, review.id],
        (err) => {
          if (err) {
            reject(err);
          }
          resolve(returnReview);
        }
      );
    });
  }throw new Error("Unauthorized!");
}

async function deleteReview(id, context) {
  const token = await tokenModule.getToken(user, context);
  if (!token) throw new Error("No Token");
  const role = await tokenModule.determineRole(context);
  if (
    token.token === context.req.headers["auth-token"] ||
    role.role === "admin"
  ) {
    const review = await getReviewById(id, context);
    const sql = `DELETE FROM review WHERE review.id = ?`;
    return new Promise((resolve, reject) => {
      context.db.run(sql,[review.id], (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(review);
      });
    });
  }
  throw new Error("Unauthorized!");
}

module.exports = {
  getReviews,
  getReviewById,
  getReviewsOfUserForMovie,
  getReviewsOfMovie,
  deleteReview,
  updateReview,
  createReview,
};
