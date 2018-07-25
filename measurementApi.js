var request = require('request');
var unwantedUserAgents = require("./data/unwantedUserAgents.json");

module.exports=function (cid, ip, useragent, referer) {
    //if unwanted UserAgent - return blank object
    if(unwantedUserAgents.indexOf(useragent)!=-1){
        return {
            pageView:function (page) {

            },
            event:function (category, action) {

            }
        }
    }
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