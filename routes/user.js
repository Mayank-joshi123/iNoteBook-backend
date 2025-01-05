const express = require('express');
const router = express.Router();
const User = require("../models/User")
const featuser = require("../middleware/featuser")
const bcrypt = require('bcryptjs');
const multer = require('multer');
const upload = multer();

// Route 1 : Changin image on database

router.post('/updateimg', upload.single("file"),featuser, async (req, res) => {
    try {
        console.log('Buffer received:', req.file.buffer);
        const user = await User.findById(req.user.id);  // finding user by id          
        user.img = req.file.buffer;  // changing image     
        await user.save();  // saving user
        res.json({ sucess: true, user: user })  // sending response
        console.log('Image updated successfully');
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Some internal server error")
    }
}
)

////Route 2 : Updat password

router.post('/updatepassword', featuser, async (req, res) => {
    try {
        const newpassword  = req.body.password;
        console.log(newpassword)
        const user  = await User.findById(req.user.id);  // finding user by id

        /// Hashing the password and adding salt
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newpassword, salt);
        user.password = hash;  // changing password
        await user.save();  // saving user
        res.json({ sucess: true, user: user })  // sending response
        console.log('Password updated successfully');
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Some internal server error")
    }
}
)

module.exports = router