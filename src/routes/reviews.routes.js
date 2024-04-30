const controllers = require('../controllers/reviews.controller');
const express = require('express');

const reviewsRoutes = express.Router();
/**
 * Express routes for Tasks.
 *
 * RESTful endpoints make for easily adding to existing API features.
 */

/**
 * Routes for all tasks. Evaluates to `/tasks/`.
 */
reviewsRoutes.get('/', controllers.getAllReviews).post('/', controllers.createReview);

/**
 * Routes for a task by id. Evalutes to `/tasks/:taskId`.
 */
reviewsRoutes
  .get('/getAllreview/:userId', controllers.getAllReviews) // GET http://locahost:3000/tasks/1
  .get('/getReview/:reviewId', controllers.getReview)
  .put('/updateReview/:reviewId', controllers.updateReview)
  .delete('/deleteReview/:userId/:reviewId', controllers.deleteReview)
  .post('/createReview/', controllers.createReview)
  .get('/getBlogReview', controllers.getBlogReview);
module.exports = reviewsRoutes;