const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('config');

//@ route GET api/auth
//@desc Test Route
//@acces Public 
router.get('/', auth, async(req, res) => {
    
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server Error');

    }
});




//@ route POST api/auth
//@desc authenticate user and get token
//@acces Public 
router.post('/', [
    
   
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()

],
    
    async(req, res) => {


    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});

    }


        const {  email, password } = req.body;
        
        try {

// see if the user exists
            let user = await User.findOne({ email });

            if (!user) {
                
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);

    
            if (!isMatch) {
                 return res
                    .status(400)
                    .json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            

//return json webtoken
            
            const payload = {
                user: {
                    
                id: user.id,
                
}
               
            }

            jwt.sign(
                payload,
                config.get('jwtToken'),
                { expiresIn: 360000 },
                (error, token) => {
                    if (error) throw error;
                    res.json({token});

            });
            
        }
        
        
        catch (error) {
            console.error(error.message);
            res.status(500).send('server error');
        }



});

module.exports = router;