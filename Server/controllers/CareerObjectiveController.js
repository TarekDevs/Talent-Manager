const CareerObjective = require('../models/CareerObjective');

// POST - Create a new career objective
exports.createCareerObjective = async (req, res) => {
  try {
    const newObjective = req.body; // Objective data sent from the client

    // Save the data to the database
    const CareerObjective= new CareerObjective(newObjective);
    await CareerObjective.save();

    res.status(201).json({ message: 'Career objective created successfully', objective: CareerObjective });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating career objective' });
  }
};

// GET - Get career objectives of a specific user
exports.CareerObjectives = async (req, res) => {
  try {
    // Fetch career objectives of the user from the database
    const userId = req.params.userId; // Assuming you pass the user ID in the URL parameters
    const CareerObjectives = await CareerObjective.find({ userId });

    res.status(200).json(CareerObjectives);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching career objectives' });
  }
};

// PUT - Update an existing career objective
exports.updateCareerObjective = async (req, res) => {
  try {
    const objectiveId = req.params.id; // Objective ID sent in the URL parameters
    const updatedObjective = req.body; // Updated objective data sent from the client

    // Update the data in the database based on the ID
    const CareerObjective = await CareerObjective.findByIdAndUpdate(objectiveId, updatedObjective, { new: true });

    if (!CareerObjective) {
      return res.status(404).json({ error: 'Career objective not found' });
    }

    res.status(200).json({ message: 'Career objective updated successfully', objective: CareerObjective });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating career objective' });
  }
};
exports.updateProgress = async (req, res) => {
  try {
    const objectiveId = req.params.id; // Objective ID sent in the URL parameters
    const newProgress = req.body.progress; // New progress value sent in the request body

    // Find the career objective by its ID
    const careerObjective = await CareerObjective.findById(objectiveId);

    if (!careerObjective) {
      return res.status(404).json({ error: 'Career objective not found' });
    }

    // Update the progress of the career objective
    careerObjective.progress = newProgress;
    await careerObjective.save();

    res.status(200).json({ message: 'Career objective progress updated successfully', objective: careerObjective });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating career objective progress' });
  }
};

