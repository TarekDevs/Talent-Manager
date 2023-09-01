const Formation = require('../models/Formation');
const User = require('../models/User');

exports.addFormationsToUser = async (req, res) => {
  try {
    const { formationIds } = req.body; 
    const userId = req.params.id;

    const formationObjects = formationIds.map(formationId => ({
      formation: formationId,
      valid: false, // Set the 'valid' field to false initially
    }));

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { formations: { $each: formationObjects } } },
      { new: true }
    ).populate('formations.formation'); // Populate the 'formations' field with Formation documents
    await Formation.updateMany(
      { _id: { $in: formationIds } },
      { $addToSet: { authors: userId } }
    );


    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Formations added to user successfully', user });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};





  exports.createFormation = async (req, res) => {
    try {
      const { label, title, desc, description, authors } = req.body;
  
      const newFormation = new Formation({
        label,
        title,
        desc,
        description,
        link:req.file.path,
        authors,
      });
  
      const savedFormation = await newFormation.save();
  
      return res.status(201).json(savedFormation);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  };


  
exports.getformation = async (req, res ) =>{
    try{
        const formations = await Formation.find().populate('authors')
        res.status(200).json(formations);
    }catch(err){
      
            res.status(404).json({error:err.message});
    }
  }


  
exports.getformationrating = async (req, res ) =>{
  try {
    const formations = await Formation.find();
    let bestRatedFormation = formations[0]; 

    formations.forEach((formation) => {
      if (formation.averageRating > bestRatedFormation.averageRating) {
        bestRatedFormation = formation;
      }
    });

    res.json(bestRatedFormation);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
};
