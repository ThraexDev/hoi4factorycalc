var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var unitCost = require("./data/unitCosts.json");
var equipmentCost = require("./data/equipmentCost.json");
var baseProduction = 5;

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/",function (req, res, next) {
    res.sendFile(path.join(__dirname+"/views/index.html"));
});

app.post('/getResult', function (req, res, next) {
  var sendObject = req.body;
  if(!sendObject){
    res.status(400).send("No Payload");
    return;
  }
  if(!sendObject.battalions){
    res.status(400).send("No Battalions");
    return;
  }
  var battalions = sendObject.battalions;
  if(!Array.isArray(battalions)){
    res.status(400).send("Battalions wrong Format");
    return;
  }
  if(battalions.length != 5){
    res.status(400).send("Battalions wrong Format");
    return;
  }
  for(var battalion of battalions){
      if(!Array.isArray(battalion)){
        res.status(400).send("Battalions wrong Format");
        return;
      }
      if(battalion.length != 6){
        res.status(400).send("Battalions wrong Format");
        return;
      }
  }
  if(!sendObject.factoryEfficiency){
    res.status(400).send("No Factory Efficency");
    return;
  }
  var factoryEfficiency = parseInt(sendObject.factoryEfficiency);
  if(isNaN(factoryEfficiency)){
    res.status(400).send("Factory Efficiency is not a number");
    return;
  }
  if(!sendObject.productionEfficiency){
    res.status(400).send("No Production Efficiency");
    return;
  }
  var producationEfficiency = parseInt(sendObject.productionEfficiency);
  if(isNaN(producationEfficiency)){
    res.status(400).send("Production Efficiency is not a number");
    return;
  }
  if(!sendObject.amountOfDivisions){
    res.status(400).send("No Division Amount");
    return;
  }
  var amountOfDivisions = parseInt(sendObject.amountOfDivisions);
  if(isNaN(amountOfDivisions)){
    res.status(400).send("Amount of Divisions is not a number");
    return;
  }
  if(!sendObject.outputPer){
    res.status(400).send("No Output Time defined");
    return;
  }
  var outputPer = parseInt(sendObject.outputPer);
  if(isNaN(outputPer)){
    res.status(400).send("Output per Time is not a number");
    return;
  }
    actualCost ={};
    for(var battalion of battalions){
        for(var unit of battalion){
          if(unit != "+"){
            for(equipmentItem of unitCost[unit.replace(/\s/g,'')]) {
              if(actualCost[equipmentItem.name]){
                  actualCost[equipmentItem.name].amount=actualCost[equipmentItem.name].amount+equipmentItem.amount;
              }
              else {
                  actualCost[equipmentItem.name]={
                      name:equipmentItem.name,
                      amount: equipmentItem.amount
                  };
              }
            }
          }
        }
    }
    var assignedFactories = [];
    for(var equipmentItem in actualCost){
        if (actualCost.hasOwnProperty(equipmentItem)) {
            var factoryObject = {
                name: equipmentItem,
                amount: Math.ceil(((actualCost[equipmentItem].amount*equipmentCost[equipmentItem]*amountOfDivisions)/(baseProduction * (producationEfficiency/100)*(factoryEfficiency/100)))/outputPer)
            }
            assignedFactories.push(factoryObject)
        }
    }
    res.status(200).send(assignedFactories);
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if(err.status == 404){
    res.sendFile(path.join(__dirname+"/views/404.html"));
  }
  else {
    res.sendFile(path.join(__dirname+"/views/error.html"));
  }
});

module.exports = app;
