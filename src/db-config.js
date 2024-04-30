const mysql = require('mysql');
const { CREATE_USERS_TABLE} =require('./queries/user.queries')
const { CREATE_REVIEWS_TABLE} =require('./queries/reviews.queries')
const query = require('./utils/query');
//const queries = require('./queries/tasks.queries');

// Get the Host from Environment or use default
const host = process.env.DB_HOST || 'localhost';

// Get the User for DB from Environment or use default
const user = process.env.DB_USER || 'root';

// Get the Password for DB from Environment or use default
const password = process.env.DB_PASS || 'password'; // Change the password

// Get the Database from Environment or use default
const database = process.env.DB_DATABASE || 'tododb';

// Get the Port from Environment or use default
const port = process.env.DB_PORT || '3306';

// Create the connection with required details
module.exports = async (params) => {
  return new Promise (async (resolve, reject) => {
    
 const con = mysql.createConnection({
    host,
    user,
    password,
    port,
  database
});
 
const userTableCreated = await query(con, CREATE_USERS_TABLE).catch((err) => {
  reject(err);
});
const reviewsTableCreated = await query(con, CREATE_REVIEWS_TABLE).catch((err) => {
  reject(err);
});
if(!!userTableCreated && !!reviewsTableCreated) {
  resolve(con);
}
});
};



