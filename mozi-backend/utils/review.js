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
  const sql = `SELECT * FROM review WHERE review.id = "${id}"`;
  return new Promise((resolve, reject) => {
    context.db.get(sql, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

function getReviewsOfUserForMovie(user_id, movie_id, context) {
  const sql = `SELECT * FROM review WHERE review.user_id = "${user_id}" AND review.movie_id = "${movie_id}"`;
  return new Promise((resolve, reject) => {
    context.db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

function createReview(review, context) {
  const sql = `INSERT INTO review (id,rating,description,movie_id,user_id)
    VALUES ("${review.id}","${review.rating}","${review.description}","${review.movie_id}","${review.user_id}")`;
  return new Promise((resolve, reject) => {
    context.db.run(sql, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(review);
    });
  });
}

async function updateReview(review, context) {
  const updatedReview = await getReviewById(review.id, context);
  const returnReview = {
    ...review,
    movie_id: updatedReview.movie_id,
    user_id: updatedReview.user_id,
  };
  const sql = `UPDATE review SET rating="${review.rating}", description="${review.description}" WHERE review.id = "${review.id}"`;
  return new Promise((resolve, reject) => {
    context.db.run(sql, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(returnReview);
    });
  });
}

function deleteReview(id, context) {
  const review = Promise.resolve(getReviewById(id, context));
  const sql = `DELETE FROM review WHERE review.id = "${id}"`;
  return new Promise((resolve, reject) => {
    context.db.run(sql, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(review);
    });
  });
}

module.exports = {
  getReviews,
  getReviewById,
  getReviewsOfUserForMovie,
  deleteReview,
  updateReview,
  createReview,
};
