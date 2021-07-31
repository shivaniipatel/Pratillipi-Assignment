const express = require('express')
const router = express.Router();

const articleRouter = require('../apis/articles/article.router');
const followerRouter = require('../apis/followers/follower.router');
const subscriptionRouter = require('../apis/subscriptions/subscription.router');
const userRouter = require('../apis/users/user.router');

router.get('/test', async (req, res, next) => {
    res.status(HttpStatus.OK).send({ success: true, data: 'this is a test endpoint'});
})

router.use('/article', articleRouter);
router.use('/follower', followerRouter);
router.use('/subscription', subscriptionRouter);
router.use('/user', userRouter);


module.exports = router;
