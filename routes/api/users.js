const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

//@ route POST api/users
//@desc Register User
//@acces Public 
router.post('/', [
    
    check('name', 'Name is Required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with minimum of 6 characters').isLength({min:6})

], (req, res) => {


    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});

    }
    res.send('User Route');
});

module.exports = router;