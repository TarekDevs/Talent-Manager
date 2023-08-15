
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { ObjectId } = mongoose.Schema.Types


const userSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        trim: true,
  
      },

      
      lastName: {
        type: String,
        trim: true,
  
      },

      phone: { type: String },

      email: {
        type: String,
  
        validate: {
          validator: function (v) {
            return /\S+@\S+\.\S+/.test(v);
          },
          message: props => `${props.value} is not a valid email address!`
        }
      },
      password: { type: String },

     
      profilePicture: { type: String },

      ProfileInformation :{ type: String },

      location :{ type: String },

      cv: {
        type: String,
      },
     
      Roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role",
        },
      ],

      diplome: [{
        type: String,
  
      },
    ],

     preferences: { type: String },

  
   
    }, { timestamps: true });

    
  
 
  
  module.exports = mongoose.model("User", userSchema)
  
