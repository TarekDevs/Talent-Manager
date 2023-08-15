const bodyParser = require('body-parser')
const express = require('express')
const  mongoose  = require('mongoose')
const app = express()
require('dotenv').config()  
const cors = require('cors')
const passport = require("passport");
const morgan = require('morgan')
const path = require('path');
const { spawn } = require('child_process');

const Role = require("./models/role");

// import routes
const authroute = require('./routes/auth');
const userroute= require('./routes/user')
const connect = async () => {
    try {
      await mongoose.connect(process.env.DATABASE);
      console.log("Connected to mongoDB.");
      initialRole();
    } catch (error) {
      throw error;
    }
  };
  

  mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
  });

// MIDDELWARE
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('dev'))



app.use('/pdf', express.static(path.join(__dirname, 'pdf')));



// ROUTES MIDDELWARE
app.use("/api/auth",authroute);
app.use("/api/users",userroute);

app.get('/api/users/cv/:filename', (req, res) => {
  const cvPath = path.resolve(__dirname, '../pdf', decodeURIComponent(req.params.filename));
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.filename}"`);

  res.sendFile(cvPath);
});

const port = process.env.PORT || 7000; 

app.listen(port,()=>{
    connect();
    console.log("running");
});

// Define the path to the recommendation script
const scriptPath = path.join(__dirname, "simplyhired/careerPlan.py");

app.post("/careerPlanRecommendation", (req, res) => {
  // User input (company goals, user skills, and user ID)
  const { companyGoals, userSkills } = req.body;
  console.log(companyGoals,userSkills);
  // Construct the list of arguments for the Python script
  const args = [JSON.stringify(companyGoals), JSON.stringify(userSkills)];
console.log(args);
  // Path to the Python interpreter

const pythonInterpreter = path.join(
  __dirname,
 "simplyhired",
  "venv",
  "Scripts",
  "python.exe"
); 

  // Call the Python script with the provided arguments
  const pyProg = spawn(pythonInterpreter, [scriptPath, ...args]);

  // Handle the script's output
  pyProg.stdout.on("data", (data) => {
    const recommendations = JSON.parse(data.toString());
    res.status(200).json(recommendations);
  });

  // Handle errors
  pyProg.stderr.on("data", (data) => {
    console.error(`Error in Python script: ${data}`);
    res.status(500).send("An error occurred while processing the recommendation.");
  });
});


// Import Roles

function initialRole() {
  Role.estimatedDocumentCount()
    .then((count) => {
      if (count === 0) {
        return Promise.all([
          new Role({ name: "admin" }).save(),
          new Role({ name: "HR" }).save(),
          new Role({ name: "employee" }).save(),
        ]);
      }
    })
    .then(() => {
      console.log("Roles initialized successfully.");
    })
    .catch((err) => {
      console.error("Error initializing roles:", err);
    });
}