const express = require('express');
const router = express.Router();

const userCtrl = require('./user.ctrl');


router.post('/author', userCtrl.addAuthor); 
router.get('/author/:id', userCtrl.getAuthorById); 


module.exports = router;