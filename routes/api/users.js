const express = require('express');
const router = express.Router();

const gravatar = require('gravatar');
const { check, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const User = require('../../models/User');

//@ route POST api/users
//@desc Register User
//@acces Public 
router.post('/', [
    
    check('name', 'Name is Required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with minimum of 6 characters').isLength({min:6})

],
    
    async(req, res) => {


    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});

    }


        const { name, email, password } = req.body;
        
        try {

// see if the user exists
            let user = await User.findOne({ email });

            if (user) {
                
                res.status(400).json({ errors: [{ msg: "user already exists" }] });
            }
    
// get users gravatar
            
            const avatar = gravatar.url(email, {
                
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            user = new User({
                name,
                email,
                avatar,
                password
            });
    
// encrypt password
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();
            

//return jwt token
            
        res.send('User Registered');

            
        } catch (error) {
            console.error(error.message);
            res.status(500).send('server error');
        }






});

module.exports = router;