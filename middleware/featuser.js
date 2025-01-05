const jwt = require('jsonwebtoken');

const JWT_SECRET = "SECRET";

const feature = (req,res,next)=>{

    const token = req.header("user-token")

    if(!token){
        return res.status(401).send({error : "Please use a valid token"})
    }
    try {
        const data = jwt.verify(token,JWT_SECRET);

    req.user = data.user;

    next();
    } catch (error) {
      res.status(401).send({error : "Please use a valid token"})
    }
    
}

module.exports = feature