const express = require('express');
const router = express.Router();

router.get('/', (req, res, next)=>{
    res.render('pages/home/index');
})

module.exports = router;