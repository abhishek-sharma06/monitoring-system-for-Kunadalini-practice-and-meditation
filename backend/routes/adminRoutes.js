// Import Express, controllers, auth middlewares.
const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Apply auth verification and admin security guard to all endpoints.
router.use(authMiddleware);
router.use(adminMiddleware);

// Route to fetch and filter user list.
router.get('/users', adminController.getUsers);

// Route to fetch detailed profile information and history for a user.
router.get('/users/:id', adminController.getUserById);

// Route to delete a user account.
router.delete('/users/:id', adminController.deleteUser);

// Route to toggle role privilege settings for a user.
router.patch('/users/:id/role', adminController.toggleUserRole);

// Route to retrieve platform aggregates and analysis trends.
router.get('/analytics', adminController.getPlatformAnalytics);

// Route to add a new yoga pose or meditation exercise content.
router.post('/exercises', adminController.createExercise);

// Route to update an existing yoga pose or meditation exercise content.
router.patch('/exercises/:id', adminController.updateExercise);

// Route to delete an exercise content.
router.delete('/exercises/:id', adminController.deleteExercise);

// Export router.
module.exports = router;
