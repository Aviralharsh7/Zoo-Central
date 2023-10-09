const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const getProfile = asyncHandler(async (req, res) => {
    const {username} = req.params;
    const loggedin = req.loggedin;

    const user = await User.findOne({username}).exec();
    if (!user){
        return res.status(404).json({
            message: "User not found"
        });
    }

    if (!loggedin){
        return res.status(200).json({
            profile: user.toProfileJSON(false)
        });
    } else { 
        const loginUser = await User.findOne({email: req.userEmail });
        return res.status(200).json({
            profile: user.toProfileJSON(loginUser)
        })
    }
});

const followUser = asyncHandler(async (req, res) => {
    const {username} = req.params;
    const loginUser = await User.findOne({email: req.userEmail}).exec();
    const user = await User.findOne({username}).exec();

    if (!user || !loginUser){
        return res.status(404).json({
            message: "User not found"
        })
    }
    await loginUser.follow(user._id);

    return res.status(200).json({
        profile: user.toProfileJSON(loginUser)
    });
});


const unFollowUser = asyncHandler( async (req, res) =>{
    const {username} = req.params;
    const loginUser = await User.findOne({ email: req.userEmail}).exec();
    const user = await User.findOne({username}).exec();

    if(!user || !loginUser){
        return res.status(404).json({
            message: "User not found"
        })
    }

    await loginUser.unfollow(user._id);
    return res.status(200).json({
        profile: user.toProfileJSON(loginUser)
    });
});

module.exports = {
    getProfile,
    followUser,
    unFollowUser
}