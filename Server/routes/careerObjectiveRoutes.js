const express = require('express');
const router = express.Router();
const CareerObjective = require('../models/CareerObjective');
const CareerObjectiveController = require('../controllers/CareerObjectiveController');

// Route for creating a new career objective
router.post('/careerObjectives', CareerObjectiveController.createCareerObjective);

// Route for getting career objectives of a specific user
router.get('/careerObjectives/:userId', CareerObjectiveController.getCareerObjectives);

// Route for updating an existing career objective
router.put('/careerObjectives/:id', CareerObjectiveController.updateCareerObjective);

// Route to update the progress of a career objective
router.put('/careerObjectives/:id/progress', CareerObjectiveController.updateProgress);

module.exports = router;
