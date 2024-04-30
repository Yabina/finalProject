/**
 * Tables follow syntax:
 * - CREATE TABLE <table_name>(<column_name> <data_type> <options>, ...)
 *
 * Create a table called `reviews` (case-insensitive), with
 * - id as an integer/number that can't have null values, auto-increment it
 * - name with a max of 255 characters, cannot have null values
 * - created_date set to date and time created
 * - status with a max of 10 characters, has a default of 'pending'
 *
 * NOTE: order is important.
 * - columns can have multiple options attached (take `id` column for example)
 * - id is always first (helps with inserting)
 * - defaults always specifed last (helps with inserting)
 */
exports.CREATE_REVIEWS_TABLE = `CREATE TABLE IF NOT EXISTS reviews (
  review_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  book_title VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  rating INT NOT NULL, -- Specify the data type for rating
  description TEXT NOT NULL,
  reviewed_by VARCHAR(255) NOT NULL,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (review_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
     ON UPDATE CASCADE
     ON DELETE CASCADE
)`;

  
  // Get every review
  exports.ALL_REVIEWS = (userId) => `SELECT * FROM reviews WHERE user_id = ${userId}`;
  
  // Get a single review by id
  exports.SINGLE_REVIEWS = (userId, reviewId) => `SELECT * FROM reviews WHERE user_id = ${userId} AND review_id = ${reviewId}`;
  
  /**
   * Insert follows syntax:
   * - INSERT INTO <table_name>(<col_name1>, <col_name3>, <col_name3>, ...)
   *    VALUES(<value1>, <value2>, <value3>, ...)
   *
   * Create a new review in `reviews` table where
   * - column names match the order the are in the table
   * - `?` allow us to use params in our controllers
   */
  // exports.INSERT_REVIEW = (userId, bookTitle) => `INSERT INTO reviews (user_id, book_title) VALUES (${userId}, ${bookTitle})`;
  exports.INSERT_REVIEW = (userId, bookTitle, authorName, rating, description, reviewedBy) => {
    return `INSERT INTO reviews (user_id, book_title, author_name, rating, description, reviewed_by) 
            VALUES (${userId}, ${bookTitle}, ${authorName}, ${rating}, ${description}, ${reviewedBy})`;
};
  /**
   * Update follows syntax:
   * - UPDATE <table_name> SET <colum_name> = '<new_value>' WHERE <colum_name> = '<old_value>'
   *
   * NOTE: omitting `WHERE` will result in updating every existing entry.
   */
  exports.UPDATE_REVIEW = (userId, reviewId, newValues) => `UPDATE reviews SET ${newValues} WHERE user_id = ${userId} AND review_id = ${reviewId}`;
  
  // Delete a review by id
  exports.DELETE_REVIEW = (userId, reviewId) => `DELETE FROM reviews WHERE user_id = ${userId} AND review_id = ${reviewId}`;
