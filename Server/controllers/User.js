const User = require('../models/User');
const Formation=require('../models/Formation')
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .populate('formations.formation')
      .populate({
        path: 'formations.formation',
        select: 'image label title desc link',
      })
      .populate({
        path: 'skills.formationId',
        select: 'image label title desc link valid',
      }); 
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}



  exports.UpdateUser = async (req, res) => {
    try {
        const data = await User.findOneAndUpdate(
          { _id: req.params.id },
          req.body,
          { new: true }
        );
        res.status(201).json(data);
      
    } catch (error) {
      console.log(error.message);
    }
  };



  exports.updateFormationStatus = async (req, res) => {
    try {
      const userId = req.body.userId;
      const formationId = req.params.id;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const formationToUpdate = user.formations.find(
        (formation) => formation.formation.toString() === formationId
      );
  
      if (!formationToUpdate) {
        return res.status(404).json({ error: 'Formation not found for this user' });
      }
  
      if (!formationToUpdate.valid) {
        formationToUpdate.valid = true;
        formationToUpdate.createdAt = new Date(); // Set the current timestamp
        await user.save();
  
        // Update the corresponding Formation document's valid field
        await Formation.findByIdAndUpdate(formationId, { valid: true });
  
        return res.status(200).json({ message: 'Formation status updated and timestamp added' });
      } else {
        return res.status(400).json({ error: 'Formation is already marked as valid' });
      }
    } catch (error) {
      console.error('Error updating formation status:', error.message);
      return res.status(500).json({ error: 'An error occurred while updating formation status' });
    }
  };
  
  

  exports.getCountValidFormationsByMonth = async (req, res) => {
    try {
      const validFormationsByMonth = await User.aggregate([
        {
          $unwind: '$formations',
        },
        {
          $match: {
            'formations.valid': true,
          },
        },
        {
          $group: {
            _id: { $month: '$formations.createdAt' },
            count: { $sum: 1 },
          },
        },
      ]);
  
      return res.status(200).json(validFormationsByMonth);
    } catch (error) {
      console.error('Error counting valid formations:', error.message);
      return res.status(500).json({ error: 'An error occurred while counting valid formations' });
    }
  };
  



  exports.calculateSkillPercentages = async (req, res) => {
    try {
      const userId = req.params.userId; 
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const totalSkills = user.skills.length;
      if (totalSkills === 0) {
        return res.json({
          beginnerPercentage: "0%",
          intermediatePercentage: "0%",
          advancedPercentage: "0%"
        });
      }
  
      const beginnerSkills = user.skills.filter(skill => skill.status === "Beginner");
      const intermediateSkills = user.skills.filter(skill => skill.status === "Intermediate");
      const advancedSkills = user.skills.filter(skill => skill.status === "Advanced");
  
      const beginnerPercentage = ((beginnerSkills.length / totalSkills) * 100).toFixed(2) + "%";
      const intermediatePercentage = ((intermediateSkills.length / totalSkills) * 100).toFixed(2) + "%";
      const advancedPercentage = ((advancedSkills.length / totalSkills) * 100).toFixed(2) + "%";
  
      return res.json({
        beginnerPercentage,
        intermediatePercentage,
        advancedPercentage
      });
    } catch (error) {
      return res.status(500).json({ message: "Error calculating skill percentages" });
    }
  };
  