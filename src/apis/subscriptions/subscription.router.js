const express = require('express');
const router = express.Router();

const subscriptionCtrl = require('./subscription.ctrl');

router.put('/threshold', subscriptionCtrl.updateSubscriptionCap );
router.put('/premiumSubscription', subscriptionCtrl.updateAuthorSubscription );


module.exports = router;