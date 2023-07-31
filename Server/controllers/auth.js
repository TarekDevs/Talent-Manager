const User = require('../models/User');
const bcrypt = require('bcrypt');




exports.register = async (req, res) => {
  try {
   
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password,salt);

    const newuser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password:hash,
      cv: req.file.path, 
    });


    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    await newuser.save();
    res.status(200).send('User has been created');
  } catch (error) {
    console.log(error);
    res.status(201).json({
      success: false,
      message: error.message
    });
  }
};
