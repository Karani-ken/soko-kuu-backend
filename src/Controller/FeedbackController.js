// controllers/feedbackController.js
const feedbackDbHandler = require('../DbHandler/DbHandler'); // Assuming this is where your handler functions are

// Create Feedback
exports.createFeedback = async (req, res) => {
  const { product_id, user_id, rating, comment } = req.body;
  try {
    await feedbackDbHandler.createFeedback(product_id, user_id, rating, comment);
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback',error });
  }
};

// Get Feedback by Product ID
exports.getFeedbackByProduct = async (req, res) => {
  const { product_id } = req.params;
  try {
    const feedback = await feedbackDbHandler.getFeedbackByProduct(product_id);
    res.status(200).json( feedback );
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to retrieve feedback',error });
  }
};

// Update Feedback
exports.updateFeedback = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  try {
    await feedbackDbHandler.updateFeedback(id, rating, comment);
    res.status(200).json({ message: 'Feedback updated successfully' });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ error: 'Failed to update feedback' });
  }  
};

// Delete Feedback
exports.deleteFeedback = async (req, res) => {
  const { id } = req.params;
  try {
    await feedbackDbHandler.deleteFeedback(id);
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
};
