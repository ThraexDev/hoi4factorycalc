var request = require('request');

module.exports = function (cid, ip, useragent, referer) {
    // Set the headers
    var headers = {
        'User-Agent':       'FactoryCalc',
        'Content-Type':     'application/x-www-form-urlencoded'
    }

// Configure the request
    var options = {
        url: 'https://www.google-analytics.com/collect',
        method: 'POST',
        headers: headers,
        form: {'v': '1', 'tid': 'UA-114749288-1','cid':cid,'uip':ip,'ua':useragent, 'dr': referer}
    }
    return {
        pageView: function (page) {
            options.form['t'] = 'pageview';
            options.form['dl'] = page;
            // Start the request
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                }
            })
        },
        event:function (category, action) {
            options.form['t'] = 'event';
            options.form['ec'] = category;
            options.form['ea'] = action;
            // Start the request
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                }
            })
        }
    };
};