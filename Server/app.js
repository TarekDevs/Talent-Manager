const bodyParser = require('body-parser')
const express = require('express')
const  mongoose  = require('mongoose')
const app = express()
require('dotenv').config()  
const cors = require('cors')
const passport = require("passport");
const morgan = require('morgan')



// import routes
const authroute = require('./routes/auth');


const connect = async () => {
    try {
      await mongoose.connect(process.env.DATABASE);
      console.log("Connected to mongoDB.");
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

// ROUTES MIDDELWARE
app.use("/api/auth",authroute);

const port = process.env.PORT || 7000; 

app.listen(port,()=>{
    connect();
    console.log("running");
});
