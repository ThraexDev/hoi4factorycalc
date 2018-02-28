var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home');
});

router.get('/divisioncalculator', function(req, res, next) {
    res.render('divisionscreen');
});

router.get('/navycalculator', function(req, res, next) {
    res.render('navyscreen');
});

module.exports = router;