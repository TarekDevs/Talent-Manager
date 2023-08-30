const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
  
      image: {
        type: String,
    
      }, 
      label: {
        type: String,
    
      },
      title: {
        type: String,
    
      },    desc: {
        type: String,
    
      },
      description: {
        type: String,
    
      }, 
      link: {
        type: String,
    
      },

      valid: {
        type: Boolean,
        default:false,
    
      },
    
    
  authors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ]
});

module.exports = mongoose.model("Formation", formationSchema);
