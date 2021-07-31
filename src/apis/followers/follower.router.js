const express = require('express');
const router = express.Router();

const followerCtrl = require('./follower.ctrl');

router.put('/follow', followerCtrl.followAuthor);
router.put('/unfollow', followerCtrl.unfollowAuthor);


module.exports = router;