const User = require('../models/User');
const Role = require('../models/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pdfjsLib = require('pdfjs-dist');
const pdfParse = require('pdf-parse'); // Import the pdf-parse library
const skillsKeywords = ['languges'];
const mongoose = require("mongoose");

exports.register = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const pdfBuffer = req.file.buffer; // Assuming req.file contains the PDF file buffer

    // Use pdf-parse to extract text content from PDF buffer
    const pdfText = await pdfParse(pdfBuffer);
    const textContent = pdfText.text;

    const skillsKeywords = ['Compétences', 'Skills'];
    const skillsSectionStart = skillsKeywords.find(keyword => textContent.includes(keyword));
    let skillsArray = [];

    if (skillsSectionStart) {
      // Extract the first 200 words from the CV text
      const maxWords = 200;
      const cvText = textContent.split(/\s+/).slice(0, maxWords).join(' ');

      const startIndex = cvText.indexOf(skillsSectionStart);
      const endIndex = cvText.indexOf('Langues', startIndex); // Assuming 'Langues' indicates the end of skills section
      const skillsText = cvText.slice(startIndex, endIndex);

      // Split skillsText into lines
      const lines = skillsText.split('\n');

      // Filter out empty lines and keywords
      skillsArray = lines
        .map(line => line.trim())
        .filter(line => line && !skillsKeywords.includes(line))
        .map(skillLine => {
          const [name, status] = skillLine.split('('); // Split by '(' to get name and status
          const skillName = name.trim();
          const skillStatus = status ? status.replace(')', '').trim() : 'Beginner'; // Default to 'Beginner' if no status
          return { name: skillName, status: skillStatus };
        });
    }

    console.log(skillsArray);

    
 
    const extractedExperiences = [];


    // Define keywords that indicate experience or project sections
    const experienceKeywords = ['Stage', 'Projet', 'Experience', 'Project', 'Intership'];

    const experiencesSectionIndex = textContent.search(new RegExp(experienceKeywords.join('|'), 'i'));
    if (experiencesSectionIndex !== -1) {
      const experiencesText = textContent.slice(experiencesSectionIndex);
      const lines = experiencesText.split('\n');

      let currentExperience = '';

      lines.forEach(line => {
        // Check if the line starts with any of the experience keywords
        if (experienceKeywords.some(keyword => line.trim().startsWith(keyword))) {
          if (currentExperience.trim() !== '') {
            extractedExperiences.push(currentExperience.trim());
          }
          currentExperience = line.trim();
        } else {
          currentExperience += ' ' + line.trim();
        }
      });

      if (currentExperience.trim() !== '') {
        extractedExperiences.push(currentExperience.trim());
      }

      // extractedExperiences will contain an array of extracted experience lines
      console.log(extractedExperiences);
    }

    const roleId = req.body.roleId // Replace with the actual role ID
    const roleObjectId = new mongoose.Types.ObjectId(roleId);


    const role = await Role.findById(roleId); // Find the role by its ID

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    
    const newuser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password: hash,
      cv: req.file.path,
      skills: skillsArray, // Save the skills array
      profilePicture:req.body.profilePicture,
      experiences: extractedExperiences,
      Roles: [], // Initialize an empty array for roles

    });
    newuser.Roles.push(roleObjectId);


    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    await newuser.save();
    res.status(200).send('User has been created');
  } catch (error) {
    console.log(error);
    res.status(201).json({
      success: false,
      message: error.message,
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email in the database
    const user = await User.findOne({ email });

    // If the user with the given email does not exist, return an error
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the password is invalid, return an error
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    if (user.isBanned > new Date()) {
      return res.status(403).send({ success: false, error: "Your account has been banned" });
    }

    // If the email and password are valid, user has successfully signed in
    // Generate a token with the user's ID as the payload
    const token = jwt.sign({ id: user._id,}, 'your-secret-key', { expiresIn: '1h' });


    // Pass token to Header Session
    res.set("token", token);
    res.set("Access-Control-Expose-Headers", "token");

    // // Check if user.Roles is defined before accessing it
    // if (user.Roles && Array.isArray(user.Roles)) {
    //   for (let i = 0; i < user.Roles.length; i++) {
    //     authorities.push("ROLE_" + user.Roles[i].name.toUpperCase());
    //   }
    // }

   // Check if user.Roles is defined and an array before accessing it
   const authorities = user.Roles && Array.isArray(user.Roles)
   ? user.Roles.map(role => role.name ? "ROLE_" + role.name.toUpperCase() : null)
   : [];
 
 // Filter out any null values
 const filteredAuthorities = authorities.filter(authority => authority !== null);
 

    res.status(200).json({
      success: true,
      message: 'Sign in successful',
      token: token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin:user.isAdmin,
        success: true 
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


// SignOut
exports.signOut = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};