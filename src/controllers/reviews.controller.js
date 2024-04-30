const mysql = require("mysql");
const connection = require("../db-config");
const {
  ALL_REVIEWS,
  SINGLE_REVIEWS,
  INSERT_REVIEW,
  UPDATE_REVIEW,
  DELETE_REVIEW,
} = require("../queries/reviews.queries");
const query = require("../utils/query");
const { serverError } = require("../utils/handlers");

/**
 * CRUD - Create, Read, Update, Delete
 * GET - Read
 * POST - Create
 * PUT - Update
 * DELETE - Delete
 */



exports.getBlogReview = async (req, res) => {
  console.log("Inside get all reviews...");
  
  try {
    // Establish connection
    const con = await connection();
    
    // Query all reviews
    const reviews = await query(con, 'SELECT * FROM reviews', []);
    
    // Check if there are any reviews
    if (reviews.length === 0) {
      return res.status(404).json({ msg: "No reviews available." });
    }
    
    // Send the reviews as a response
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ msg: "Internal server error." });
  }
};

// http://localhost:3000/reviews/1
exports.getReview = async (req, res) => {
  //establish connection
  const con = await connection().catch((err) => {
    throw err;
  });
  //query all reviews
  const review = await query(
    con,
    SINGLE_REVIEWS(req.user.id, req.params.reviewId)
  ).catch(serverError(res));

  if (!review.length) {
    res.status(400).json({ msg: "No reviews available for this user." });
  }
  res.json(review);
};

exports.getAllReviews = async (req, res) => {
  console.log("inside get all task..", req.params.userId);
  //establish connection
  const con = await connection().catch((err) => {
    throw err;
  });
  //query all reviews
  userId = req.params.userId;
  const review = await query(con, ALL_REVIEWS(userId), []).catch(
    serverError(res)
  );
  // [] === true, 0 === false
  console.log(review, "review list..........................");

  if (review.length <= 0) {
   return res.status(404).json({ msg: "No reviews available for this user." });
  }
  res.json(review);
};

// http://localhost:3000/reviews/1
exports.getReview = async (req, res) => {
  //establish connection
  const con = await connection().catch((err) => {
    throw err;
  });
  //query all reviews
  const review = await query(
    con,
    SINGLE_REVIEWS(req.user.id, req.params.reviewId)
  ).catch(serverError(res));

  if (!review.length) {
    res.status(400).json({ msg: "No reviews available for this user." });
  }
  res.json(review);
};

// http://localhost:3000/reviews/1
/**
 * POST request -
 * {
 *  name: 'A review name'
 * }
 */
exports.createReview = async (req, res) => {
  console.log("Create Review..", req.body);
  //verify valid token
  const user = { id: req.body.user_id }; // {id:1, iat:wlenfwekl, expiredIn:9174323}
 
  // take result of middleware check
  if (user.id) {
    //establish connection
    const con = await connection().catch((err) => {
      throw err;
    });
    //query add review
 
    // const userId = mysql.escape(req.body.user.id);
    const bookTitle = mysql.escape(req.body.book_title);
    const authorName = mysql.escape(req.body.author_name);
    const rating = mysql.escape(req.body.rating);
    const description = mysql.escape(req.body.description);
    const reviewedBy = mysql.escape(req.body.reviewed_by); 
    // const createdDate = ; 

    //query create a review
    const result = await query(con, INSERT_REVIEW(user.id, bookTitle, authorName, rating, description, reviewedBy)).catch(
      serverError(res)
    );

    if (result.affectedRows !== 1) {
      res
        .status(500)
        .json({ message: `Unable to add review: ${req.body.book_title}` });
    }
    res.json({ msg: "Added review successfully!" });
  }
};

/**
 *
 * Build up values string
 *
 * @example 'key1 =value1, key2 =value2,...
 */
const _buildValuesString = (req) => {
  const body = req.body;
  const values = Object.keys(body).map(
    (key) => `${key} = ${mysql.escape(body[key])}`
  );
  values.push(`created_date = Now()`); //update current date and time
  values.join(", "); // make into a string
  return values;
};
// http://localhost:3000/reviews/1
/**
 * PUT request -
 * {
 *  name: 'A review name',
 *
 * }
 */
exports.updateReview = async (req, res) => {
  //establish connection
  const con = await connection().catch((err) => {
    throw err;
  });
  const values = _builValuesString(req);
  //query to update a review
  const result = await query(
    con,
    UPDATE_REVIEW(req.user.id, req.params.reviewId, values)
  ).catch(serverError(res));

  if (result.affectedRows !== 1) {
    res
      .status(500)
      .json({ msg: `Unable to update review: '${req.body.book_title}'` });
  }
  res.json(result);
};

// http://localhost:3000/reviews/1

exports.deleteReview = async (req, res) => {
  //establish connection
  const con = await connection().catch((err) => {
    throw err;
  });
  //query to delete a review
  const result = await query(
    con,
    DELETE_REVIEW(req.user.id, req.params.reviewId, values)
  ).catch(serverError(res));

  if (result.affectedRows !== 1) {
    res
      .status(500)
      .json({ msg: `Unable to delete review at: '${req.params.taskId}'` });
  }
  res.json({ message: "Deleted successfully!" });
};
