const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
//@ route GET api/profile/me
//@desc Get current user's profile
//@acces Private 
router.get('/me', auth, async (req, res) => {
    
    try {
        
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({msg:"There is no profile for this user."})
        }

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server Error');
    }
});

//@ route POST api/profile/me
//@desc CREATE or Update a user profile
//@acces Private 

router.post('/', [auth,
    [check('status', 'status is required')
        .not()
        .isEmpty(),
        check('skills', 'skill is required')
            .not()
        .isEmpty()
    ]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }


        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        // build profile objcet
        const profileFields = {};
        profileFields.user = req.user.id;

        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }


        // build social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
         if (linkedin) profileFields.social.linkedin = linkedin;
         if (instagram) profileFields.social.instagram = instagram;



try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
        
        //update profile
        profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
        );

        return res.json(profile);
    }

    profile = new Profile(profileFields);

    await profile.save();
    return res.json(profile);
} catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
}
});



//@ route GET api/profile/
//@desc get all profiles
//@acces public

router.get('/', async(req, res) => {
    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        
        res.json(profiles);
    
    
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


//@ route GET api/profile/user/:userID
//@desc get profile by user id
//@acces public

router.get('/user/:user_id', async(req, res) => {
    try {
        const profiles = await Profile.findOne({user: req.params.user_id}).populate('user',['name','avatar']);
        
        if (!profiles) {
            return res.status(400).json({msg: 'Profile Not Found'})
        }

        res.json(profiles);
    
    
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
                        return res.status(400).json({msg: 'Profile Not Found'})

        }
        res.status(500).send('Server Error');
    }
});

//@ route DELETE api/profile
//@desc delete profile user and post
//@acces private

router.delete('/',auth, async(req, res) => {
    try {
        //todo remove users posts


        // remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        
        // remove user
        await User.findOneAndRemove({ _id: req.user.id});

        res.json({msg:"User Deleted"});
    
    
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//@ route PUT api/profile/experience
//@desc add profile experience
//@acces private


router.put('/experience', [auth, [
    check('title', 'Title is required')
        .not()
        .isEmpty(),
    check('company', 'company is required')
        .not()
        .isEmpty(),
    check('from', 'Date is required')
        .not()
        .isEmpty()
]], async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });

    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
        
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error')
    }
});

//@ route DELETE api/profile/experience/exp_id
//@desc delete experience from profile
//@acces private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    
    try {
        const profile = await Profile.findOne({user: req.user.id})
// get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});



//@ route PUT api/profile/education
//@desc add profile education
//@acces private


router.put('/education', [auth, [
    check('school', 'School is required')
        .not()
        .isEmpty(),
    check('degree', 'Degree is required')
        .not()
        .isEmpty(),
    check('from', 'Date is required')
        .not()
        .isEmpty(),
    check('fieldOfStudy', 'Field of Study is required')
        .not()
        .isEmpty(),
]], async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });

    }

    const {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
        
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.education.unshift(newEdu);

        await profile.save();

        res.json(profile);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error')
    }
});

//@ route DELETE api/profile/education/exp_id
//@desc delete education from profile
//@acces private

router.delete('/education/:edu_id', auth, async (req, res) => {
    
    try {
        const profile = await Profile.findOne({user: req.user.id})
// get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});




module.exports = router;