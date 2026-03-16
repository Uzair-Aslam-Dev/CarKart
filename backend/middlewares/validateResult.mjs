const {validateResult} = require('express-validate');



const validate = (req,res , next) => {

    const {error} = validateResult();
    
    if(!error.isEmpty()) {
        return res.status(400).send("Error");
    }

    next();
}


module.exports= validate;