var express = require('express');
var unitCost = require("../data/unitCosts.json");
var equipmentCost = require("../data/equipmentCost.json");
var baseProduction = 5;
var router = express.Router();

router.post('/divisionamount', function (req, res, next) {
    var sendObject = req.body;
    var checkedData = checkDivisionInput(sendObject, res);
    var assignedFactories = calculateDivisionsFromAmount(checkedData.battalions,checkedData.factoryEfficiency,checkedData.producationEfficiency,checkedData.amountOfDivisions,checkedData.outputPer).assignedFactories;
    for(var i = 0; i < assignedFactories.length; i++){
        assignedFactories[i].percent=Math.round(assignedFactories[i].percent);
        assignedFactories[i].amountOfEquipment=Math.round(assignedFactories[i].amountOfEquipment);
        assignedFactories[i].amountOfFactories=Math.round(assignedFactories[i].amountOfFactories);
    }
    res.status(200).send(assignedFactories);
});

router.post('/divisionfactories', function (req, res, next) {
    var sendObject = req.body;
    var checkedData = checkDivisionInput(sendObject, res);
    var factoryInfo = calculateDivisionsFromAmount(checkedData.battalions,checkedData.factoryEfficiency,checkedData.producationEfficiency,1000000,1);
    var assignedFactories = factoryInfo.assignedFactories;
    var divisionoutput = Math.round((checkedData.amountOfFactories / factoryInfo.totalFactories)*1000000*checkedData.outputPer);
    for(var i = 0; i < assignedFactories.length; i++){
        assignedFactories[i].amountOfFactories = Math.round((assignedFactories[i].percent*checkedData.amountOfFactories)/100)
        assignedFactories[i].percent=Math.round(assignedFactories[i].percent);
        assignedFactories[i].amountOfEquipment=0;
    }
    var sendObject = {
        assignedFactories:assignedFactories,
        divisionoutput:divisionoutput
    }
    res.status(200).send(sendObject);
});

function calculateDivisionsFromAmount(battalions, factoryEfficiency, productionEfficiency, amountOfDivisions, outputPer) {
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
    var totalFactories=0;
    for(var equipmentItem in actualCost){
        if (actualCost.hasOwnProperty(equipmentItem)) {
            var factoryObject = {
                name: equipmentItem,
                amountOfFactories: ((actualCost[equipmentItem].amount*equipmentCost[equipmentItem]*amountOfDivisions)/(baseProduction * (productionEfficiency/100)*(factoryEfficiency/100)))/outputPer,
                amountOfEquipment: actualCost[equipmentItem].amount*amountOfDivisions
            }
            totalFactories=totalFactories+factoryObject.amountOfFactories;
            assignedFactories.push(factoryObject)
        }
    }
    if(totalFactories>0){
        for(var i = 0; i < assignedFactories.length;i++){
            assignedFactories[i].percent=(assignedFactories[i].amountOfFactories / totalFactories)*100;
        }
    }
    var returnObject = {
        assignedFactories:assignedFactories,
        totalFactories:totalFactories
    };
    return returnObject;
};

function checkDivisionInput(sendObject, res) {
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
    factoryEfficiency=factoryEfficiency+100;
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
    if(!sendObject.amountOfFactories){
        res.status(400).send("No Factories Amount");
        return;
    }
    var amountOfFactories = parseInt(sendObject.amountOfFactories);
    if(isNaN(amountOfDivisions)){
        res.status(400).send("Amount of Factories is not a number");
        return;
    }
    var checkedObject={
        battalions:battalions,
        factoryEfficiency:factoryEfficiency,
        producationEfficiency:producationEfficiency,
        amountOfDivisions:amountOfDivisions,
        outputPer:outputPer,
        amountOfFactories:amountOfFactories
    }
    return checkedObject;
}

module.exports = router;