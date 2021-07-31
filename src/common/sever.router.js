const express = require('express')
const router = express.Router();

router.get('/shivani', async (req, res, next) => {

    let temp = await db.from('public.temp').select(['*'])

    res.send(temp)
})


module.exports = router;
