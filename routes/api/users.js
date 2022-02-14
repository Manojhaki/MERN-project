const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check')

//@ route POST api/users
//@desc Register User
//@acces Public 
router.post('/', [
    
    check('name', 'Name is Required').not().isEmpty()
], (req, res) => {

    console.log(req.body);
    res.send('User Route');
});

module.exports = router;