const express = require('express')
const router = express.Router();

router.get('/shivani', async (req, res, next) => {

    let temp = await db.from('public.temp').select(['*'])

    res.status(HttpStatus.OK).send({ success: true, data: temp});
})


module.exports = router;
