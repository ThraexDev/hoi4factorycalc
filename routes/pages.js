var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home');
});
router.get('/divisioncalculator', function(req, res, next) {
    res.render('divisionscreen');
});

module.exports = router;