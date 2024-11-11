// routes/feedbackRoutes.js
const express = require('express');
const feedbackController = require('../Controller/FeedbackController');

const router = express.Router();

// Route to create feedback
router.post('/create', feedbackController.createFeedback);

// Route to get feedback by product ID
router.get('/get/:product_id', feedbackController.getFeedbackByProduct);

// Route to update feedback by feedback ID
router.put('/update/:id', feedbackController.updateFeedback);

// Route to delete feedback by feedback ID
router.delete('/delete/:id', feedbackController.deleteFeedback);

module.exports = router;
