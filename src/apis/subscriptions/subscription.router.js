const express = require('express');
const router = express.Router();

const subscriptionCtrl = require('./subscription.ctrl');

router.put('/constraint', subscriptionCtrl.updateSubscriptionCap );


module.exports = router;