var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');
var pages = require('./routes/pages');
var calculators = require('./routes/calculators');
var googleApi = require('./measurementApi');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set a cookie (fc)
app.use(function (req, res, next) {
    // check if client sent cookie
    var cookie = req.cookies.fc;
    if (cookie === undefined)
    {
        // no: set a new cookie
        cookie = uuidv4()
        let options = {
            maxAge: 1000*3600*24*365*2} //expires after 2 years
        res.cookie('fc',cookie, options);
    }
    req.visitor = googleApi(cookie, req.connection.remoteAddress, req.headers['user-agent'], req.headers['referer'])
    next(); // <-- important!
});
app.use('/', pages);
app.use('/calculator', calculators);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
})

module.exports = app;
