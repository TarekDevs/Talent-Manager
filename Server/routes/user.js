const express = require('express')
const { getUser, UpdateUser,updateFormationStatus,getCountValidFormationsByMonth,calculateSkillPercentages, banUser, unbanUser ,getAllUsers,updateCareerPlan} = require('../controllers/User');
const router = express.Router()
const User=require ('../models/User')
const cron = require('node-cron');

let disabledButtons = {};

router.post('/disableButton', (req, res) => {
  const { formationId } = req.body;
  const currentTime = new Date().getTime();

  // Disable the button and set a timer
  disabledButtons[formationId] = {
    disabledUntil: currentTime + 60000, // 1 minute in milliseconds
  };

  res.sendStatus(200);
});

router.get('/checkButtonStatus/:formationId', (req, res) => {
  const { formationId } = req.params;
  const currentTime = new Date().getTime();
  const isDisabled = disabledButtons[formationId] && disabledButtons[formationId].disabledUntil > currentTime;

  res.json({ disabled: isDisabled });
});


router.get('/getCountValidFormationsByMonth', getCountValidFormationsByMonth)



router.get('/calculateSkillPercentages/:userId', calculateSkillPercentages);


router.put('/banuser', banUser);
router.put('/unbanuser', unbanUser);



router.get('/getuser/:id', getUser);
router.put('/updateuser/:id', UpdateUser);
router.put('/updatestatus/:id', updateFormationStatus);

router.put('/updateStatus/:userId/:skillId', async (req, res) => {
  const { userId, skillId } = req.params;
  const { newStatus } = req.body;

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const skillToUpdate = user.skills.find(skill => skill._id.toString() === skillId);
    if (!skillToUpdate) {
      return res.status(404).json({ message: 'Skill not found for this user' });
    }

    skillToUpdate.status = newStatus;

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error updating skill status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/getallusers',getAllUsers)


router.post('/add-course/:id', async (req, res) => {
    try {
      const { courseId, courseInfo } = req.body; // Include courseInfo with all course details
  
      const userId = req.params.id; // Extract the user ID from route parameters
  
      // Find the user by ID and update their formations array
      const user = await User.findByIdAndUpdate(
        userId,
        { $push: { formations: courseInfo } },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      return res.status(200).json({ message: 'Course added to user successfully' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  });


  router.put('/career-plan/:userId', updateCareerPlan);

  
module.exports = router;
