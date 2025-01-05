const express = require("express");
const router = express.Router();
const User = require("../models/User")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const featuser = require("../middleware/featuser")

const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET)

// Route 1 : Creates a user using POST: "api/auth/createuser" . No login required
router.post('/createuser', [
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', "Minimum length should be 8").isLength({ min: 8 })
], async (req, res) => {

    // if there is an error , returns bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

        // checking wether the user with same email adress alredy exist
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ sucess:false,error: "Sorry a user with same email adress already exist" })
        }

        // Hashing the password and adding salt
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        /// Create a new user
        user = await User.create({
            name: req.body.name,
            password: hash,
            email: req.body.email
        })
        
        const data = {
            user:{
                id: user.id
            }
        }
        const token = jwt.sign(data,JWT_SECRET);
        res.json({ sucess:true,token :token})
    }
    catch (err) {
        console.log(err)
        console.error(err.message);
        res.status(500).send("Some internal server error")
    }
})


// Route 2 : Login a user using POST: "api/auth/login" . No login required

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', "Password cannot be blanck").exists()
], async (req, res) => {

    // if there is an error , returns bad request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
   
    const {email,password} = req.body;

    try {

        let user = await User.findOne({email});

        if(!user){
            return res.status(400).json({sucess:false,error : "Invalid Credentials"})
        }

        const passwordCompare = await bcrypt.compare(password,user.password);

        if(!passwordCompare){
            return res.status(400).json({sucess:false,error : "Invalid Credentials"})
        }

const data = {
    user:{
        id: user.id
    }
}

const token = jwt.sign(data,JWT_SECRET);

res.json({sucess:true,token,user:user.name})

    } catch (err) {
        console.error(err.message);
        console.log(err)
        res.status(500).send("Some internal server error")
    }
})


// Route 3 : Get logeined user Detail using : {OST "/getuser"  . login required 
router.post("/getuser",featuser,async(req,res) =>{
   
   try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json(user)
    
   } catch (err) {
    console.error(err.message);
    console.log(err)
    res.status(500).send("Some internal server error")
   }
   
   
    })
module.exports = router
