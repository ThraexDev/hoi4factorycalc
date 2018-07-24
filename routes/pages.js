var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    req.visitor.pageView(req.protocol + '://' + req.get('host') + req.originalUrl);
    res.render('home');
});

router.get('/divisioncalculator', function(req, res, next) {
    req.visitor.pageView(req.protocol + '://' + req.get('host') + req.originalUrl);
    res.render('divisionscreen');
});

router.get('/navycalculator', function(req, res, next) {
    req.visitor.pageView(req.protocol + '://' + req.get('host') + req.originalUrl);
    res.render('navyscreen');
});

router.get('/aircraftcalculator', function(req, res, next) {
    req.visitor.pageView(req.protocol + '://' + req.get('host') + req.originalUrl);
    res.render('aircraftscreen');
});

router.get('/legalnotice', function(req, res, next) {
    req.visitor.pageView(req.protocol + '://' + req.get('host') + req.originalUrl);
    res.render('legalnotice');
});

module.exports = router;