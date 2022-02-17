const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@ route POST api/post
//@desc create a comment
//@acces Private 
router.post('/', [auth, [
    check('text','Text is required')
        .not()
        .isEmpty()


]], async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        
        const post = await newPost.save();
        res.json(post);
    
} catch (error) {
        console.error(error.message);
        res.status(500).send('server Error')
}
    
});


//@ route GET api/post
//@desc get all post
//@acces Private 

router.get('/',auth, async(req, res) => {
    
try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
} catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
}
});

//@ route GET api/post/:id
//@desc get post by id
//@acces Private 
router.get('/:id',auth, async(req, res) => {
    
try {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
} catch (error) {
    console.error(error.message);
     if (error.kind ==='ObjectId') {
        return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('server error');
}
});


//@ route DELETE api/post/:ID
//@desc delete a post
//@acces Private 

router.delete('/:id',auth, async(req, res) => {
    
try {
    const post = await Post.findById(req.params.id);

     if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
    }
    // check on the user
    if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'user not authorised' });
    }

    await post.remove();
    res.json({msg:'post is removed'});
} catch (error) {
    console.error(error.message);
     if (error.kind ==='ObjectId') {
        return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('server error');
}
});

module.exports = router;