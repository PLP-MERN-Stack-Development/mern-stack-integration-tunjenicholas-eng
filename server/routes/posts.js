const express = require('express');
const router = express.Router();
const controller = require('../controllers/postController'); // Import as object
const { protect } = require('../middleware/authMiddleware');

// --- DEBUGGING LOGS ---
// This will print to your terminal so you know what is loaded
console.log('Loading Post Routes...');
console.log('getPosts is:', typeof controller.getPosts);
console.log('getPost is:', typeof controller.getPost);
console.log('protect is:', typeof protect);

// If any of these are 'undefined', the app will crash below.

// Public Routes
router.get('/', controller.getPosts);
router.get('/:id', controller.getPost);

// Protected Routes
// If protect is missing, comment it out temporarily: router.post('/', controller.createPost);
router.post('/', protect, controller.createPost);
router.put('/:id', protect, controller.updatePost);
router.delete('/:id', protect, controller.deletePost);
router.post('/:id/comments', protect, controller.addComment);

module.exports = router;