const mongoose = require('mongoose');

// Define the schema for the career objective
const CareerObjectiveSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['in progress', 'achieved', 'pending', 'abandoned'], // Example possible values
    default: 'pending',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Replace 'User' with the name of your user model
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
}, { timestamps: true });

// Create the model from the schema
const CareerObjective = mongoose.model('CareerObjective', CareerObjectiveSchema);

module.exports = CareerObjective;
