const express = require('express');
const router = express.Router();

const articleCtrl = require('./article.ctrl');

router.post('/', articleCtrl.addArticle );


module.exports = router;