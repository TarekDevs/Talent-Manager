const User = require('../models/User');


exports.getUser = async (req, res ) =>{
    try{
        const{id}=req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    }catch(err){
      
            res.status(404).json({error:err.message});
    }
  }
  

  exports.UpdateUser = async (req, res) => {
    try {
        const data = await User.findOneAndUpdate(
          { _id: req.params.id },
          req.body,
          { new: true }
        );
        res.status(201).json(data);
      
    } catch (error) {
      console.log(error.message);
    }
  };
