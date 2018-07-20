var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    if (req.method == "GET") {
        req.visitor.pageview(req.originalUrl).send();
    }
    next(); // <-- important!
});
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

router.get('/aircraftcalculator', function(req, res, next) {
    res.render('aircraftscreen');
});

router.get('/legalnotice', function(req, res, next) {
    res.render('legalnotice');
});

module.exports = router;