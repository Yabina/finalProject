const express = require('express');
const cors = require('cors')
const logger = require('morgan');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const reviewsRoutes = require('./routes/reviews.routes');
const middleware = require('./middleware/errors.middleware');

const app = express();
const port = process.env.PORT || 3000;
const logLevel = process.env.LOG_LEVEL || 'dev';
const env = process.env.NODE_ENV;

// Middleware - logs server requests to console
if (env != 'test'){
  app.use(logger(logLevel));
}


// Middleware - parses incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Alow websites to talk to our API service.
app.use(cors());

// ************************************
// ROUTE-HANDLING MIDDLEWARE FUNCTIONS
// ************************************

// Partial API endpoints.
app.use('/api/auth', authRoutes); // http://localhost:3000/api/auth
app.use('/api/user', userRoutes); // http://localhost:3000/api/user
app.use('/api/reviews', reviewsRoutes); // http://localhost:3000/reviews

// app.use('/users', usersRoutes); // http://localhost:3000/users

// Handle 404 requests
function error404() {
    console.log("404 Not Found");
    // You can add more logic here if needed
}

app.use(error404); // http://loaclhost:3000/users

// Handle 500 requests - applies mostly to live services
function error500() {
  console.log("500 Not Found");
  // You can add more logic here if needed
}
app.use(error500);

app.post('/submit-review', (req, res) => {
  const { bookTitle, authorName, description, reviewedBy, rating } = req.body;
  
  const sql = `INSERT INTO reviews (book_title, author_name, description, reviewed_by, rating) VALUES (?, ?, ?, ?, ?)`;
  const values = [bookTitle, authorName, description, reviewedBy, rating];

  connection.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error('Error inserting review:', error);
      res.sendStatus(500);
    } else {
      console.log('Review inserted successfully');
      // Fetch all reviews from the database and send them back to the client
      connection.query('SELECT * FROM reviews', (error, results, fields) => {
        if (error) {
          console.error('Error fetching reviews:', error);
          res.sendStatus(500);
        } else {
          res.json(results);
        }
      });
    }
  });
});


// listen on server port
app.listen(port, function() {
  console.log(`Running on port: ${port}...`);
});



