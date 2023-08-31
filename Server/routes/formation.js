const express = require('express')
const { getUser, UpdateUser } = require('../controllers/User');
const router = express.Router()
const Formation=require ('../models/Formation');
const { createFormation, getformation ,addFormationsToUser, getformationrating} = require('../controllers/formation');



const User = require('../models/User');



const multer = require('multer');
const path = require('path');

const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../pdf'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});


const uploadPDF = multer({ storage: pdfStorage, 
  limits: {
  fileSize: 5 * 1024 * 1024,
}, });

function pdfFileFilter(req, file, cb) {
  const filetypes = /pdf/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only PDF files are allowed.'));
}
const upload = multer();


router.post('/',upload.single("file"), createFormation);
router.put(`/postformation/:id`, addFormationsToUser);

router.get('/getallform', getformation);

router.put("/addFormationId/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { skillIndex, formationId } = req.body;

    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.skills[skillIndex].formationId = formationId; // Update formationId
    await user.save();
    console.log("Received formationId:", formationId);

    return res.status(200).json({ message: "Formation ID added to skill" });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Server error" });

  }
});


router.post('/rate/:formationId', async (req, res) => {
  try {
    const { formationId } = req.params;
    const { rating } = req.body;

    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation not found' });
    }

    formation.ratings.push(rating);
    formation.averageRating = formation.ratings.reduce((sum, value) => sum + value, 0) / formation.ratings.length;
    
    await formation.save();

    res.json({ message: 'Formation rated successfully', averageRating: formation.averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error rating formation' });
  }
});

router.get ('/api/best-rated-formation',getformationrating)





module.exports = router;
