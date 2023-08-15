const User = require('../models/User');
const Role = require('../models/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pdfjsLib = require('pdfjs-dist');
const pdfParse = require('pdf-parse'); // Import the pdf-parse library
const skillsKeywords = ['languges'];


exports.register = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const pdfBuffer = req.file.buffer; // Assuming req.file contains the PDF file buffer

    // Use pdf-parse to extract text content from PDF buffer
    const pdfText = await pdfParse(pdfBuffer);
    const textContent = pdfText.text;

    const skillsKeywords = ['Compétences', 'Skills','données'];
    const skillsSectionStart = skillsKeywords.find(keyword => textContent.includes(keyword));
    let skillsLines = []; // Define the variable outside of the if block

    if (skillsSectionStart) {
      const startIndex = textContent.indexOf(skillsSectionStart);
      const endIndex = textContent.indexOf(skillsSectionStart)+400; // Assuming 'Langues' indicates the end of skills section
  const skillsText = textContent.slice(startIndex, endIndex);

      // Split skillsText into lines
      const lines = skillsText.split('\n');

      // Filter out empty lines and keywords
      skillsLines = lines
        .map(line => line.trim())
        .filter(line => line && !skillsKeywords.includes(line));
    }

 console.log(skillsLines);
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
    const newuser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password: hash,
      cv: req.file.path,
      skills: skillsLines,
      experiences: extractedExperiences,
    });

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

    // If the email and password are valid, user has successfully signed in
    // Generate a token with the user's ID as the payload
    const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '1h' });

    var authorities = [];

    // Pass token to Header Session
    res.set("token", token);
    res.set("Access-Control-Expose-Headers", "token");
    for (let i = 0; i < user.Roles.length; i++) {
      authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }

    res.status(200).json({
      success: true,
      message: 'Sign in successful',
      token: token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        // Add other user information that you want to return after sign-in
      }
    });
  } catch (error) {
    console.log(error);
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