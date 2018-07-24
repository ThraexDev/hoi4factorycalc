var express = require('express');
var unitCost = require("../data/unitCosts.json");
var equipmentCost = require("../data/equipmentCost.json");
var shipCost = require("../data/shipCost.json");
var planeCost = require("../data/planeCost.json");
var baseProduction = 5;
var baseProductionDockyards = 2.5;
var router = express.Router();

router.post('/airforceamount', function (req, res, next) {
    req.visitor.event("Calculator", "Airforce").send();
    var sendObject = req.body;
    var planetypes = sendObject.planetypes;
    var outputper = parseInt(sendObject.outputPer);
    var factoryEfficieny = parseInt(sendObject.factoryEfficiency)+100;
    var productionEfficiency = parseInt(sendObject.producationEfficiency);
    var productionEfficiencyCap = parseInt(sendObject.productionEfficiencyCap);
    var condesedPlaneTypes = {};
    for(var planetype of planetypes){
        if(condesedPlaneTypes[planetype.type]){
            condesedPlaneTypes[planetype.type].amount = parseInt(condesedPlaneTypes[planetype.type].amount) + parseInt(planetype.amount);
        }
        else {
            condesedPlaneTypes[planetype.type]={
                amount:planetype.amount,
                name:planetype.name
            };
        }
    }
    var factoriesPerPlane=[]
    for(var planetype in condesedPlaneTypes) {
        if (condesedPlaneTypes.hasOwnProperty(planetype)) {
                factorieObject = {
                    amount: Math.ceil((planeCost[planetype]*condesedPlaneTypes[planetype].amount)/(baseProduction*(getAveragePE(productionEfficiency, productionEfficiencyCap, outputper)/100)*(factoryEfficieny/100)*outputper)),
                    name:condesedPlaneTypes[planetype].name
                }
                factoriesPerPlane.push(factorieObject);
        }
    }
    res.status(200).send(factoriesPerPlane);
});

router.post('/navyamount', function (req, res, next) {
    req.visitor.event("Calculator", "Navy").send();
    var sendObject = req.body;
    var shiptypes = sendObject.shiptypes;
    var outputper = parseInt(sendObject.outputPer);
    var factoryEfficieny = parseInt(sendObject.factoryEfficiency)+100;
    var totalCost = 0;
    for(var shiptype of shiptypes){
        totalCost = totalCost + shipCost[shiptype.type]*shiptype.amount;
    }
    var factoriesNeeded = Math.ceil(totalCost/(baseProductionDockyards*(factoryEfficieny/100)*outputper));
    var sendObject={
        factoriesNeeded:factoriesNeeded
    }
    res.status(200).send(sendObject);
});

router.post('/divisionamount', function (req, res, next) {
    req.visitor.event("Calculator", "ArmyFromDivisionAmount").send();
    var sendObject = req.body;
    var checkedData = checkDivisionInput(sendObject, res);
    if(checkedData.error){
        res.status(400).send(checkedData.errorMsg);
        return;
    }
    var assignedFactories = calculateFactoriesFromTemplates(checkedData.divisions,checkedData.factoryEfficiency,checkedData.producationEfficiency, checkedData.producationEfficiencyCap,checkedData.amountOfDivisions,checkedData.outputPer, checkedData.level).assignedFactories;
    for(var i = 0; i < assignedFactories.length; i++){
        assignedFactories[i].percent=Math.round(assignedFactories[i].percent);
        assignedFactories[i].amountOfEquipment=Math.round(assignedFactories[i].amountOfEquipment);
        assignedFactories[i].amountOfFactories=Math.ceil(assignedFactories[i].amountOfFactories);
    }
    res.status(200).send(assignedFactories);
});

router.post('/divisionfactories', function (req, res, next) {
    req.visitor.event("Calculator", "ArmyFromFactoryAmount").send();
    var sendObject = req.body;
    var checkedData = checkDivisionInput(sendObject, res);
    if(checkedData.error){
        res.status(400).send(checkedData.errorMsg);
        return;
    }
    var factoryInfo = calculateFactoriesFromTemplates(checkedData.divisions,checkedData.factoryEfficiency,checkedData.producationEfficiency, checkedData.producationEfficiencyCap ,1000000,checkedData.outputPer,checkedData.level);
    var assignedFactories = factoryInfo.assignedFactories;
    var divisionoutput = Math.round((checkedData.amountOfFactories / factoryInfo.totalFactories)*1000000);
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

function calculateFactoriesFromTemplates(divisions, factoryEfficiency, productionEfficiency, productionEfficiencyCap, amountOfDivisions, outputPer, level) {
    var actualCost ={};
    for(var division of divisions){
        for(var battalion of division.battalions){
            for(var unit of battalion.units){
                for(equipmentItem of unitCost[unit.replace(/\s/g,'')]) {
                    if(actualCost[equipmentItem.name]){
                        actualCost[equipmentItem.name].amount=actualCost[equipmentItem.name].amount+(equipmentItem.amount*(division.percent/100));
                    }
                    else {
                        actualCost[equipmentItem.name]={
                            name:equipmentItem.name,
                            amount: equipmentItem.amount*(division.percent/100)
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
            var equipmentCostSingle = 0;
            if(level[equipmentItem]){
                equipmentCostSingle = equipmentCost[equipmentItem+" "+level[equipmentItem]];
            }
            else {
                equipmentCostSingle = equipmentCost[equipmentItem];
            }
            var factoryObject = {
                name: equipmentItem,
                amountOfFactories: ((actualCost[equipmentItem].amount*equipmentCostSingle*amountOfDivisions)/(baseProduction * (getAveragePE(productionEfficiency, productionEfficiencyCap, outputPer)/100)*(factoryEfficiency/100)))/outputPer,
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
    var error = false;
    var errorMsg = [];
    if(!sendObject){
        errorMsg.push("No Payload");
        error=true;
    }
    if(!sendObject.divisions){
        errorMsg.push("No Divisions");
        error=true;
    }
    var divisions = sendObject.divisions;
    if(!sendObject.factoryEfficiency){
        errorMsg.push("No Factory Efficency");
        error=true;
    }
    var factoryEfficiency = parseInt(sendObject.factoryEfficiency);
    if(isNaN(factoryEfficiency)){
        errorMsg.push("Factory Efficiency is not a number");
        error=true;
    }
    factoryEfficiency=factoryEfficiency+100;
    if(!sendObject.productionEfficiency){
        errorMsg.push("No Production Efficiency");
        error=true;
    }
    var producationEfficiency = parseInt(sendObject.productionEfficiency);
    if(isNaN(producationEfficiency)){
        errorMsg.push("Production Efficiency is not a number");
        error=true;
    }
    var producationEfficiencyCap = parseInt(sendObject.productionEfficiencyCap);
    if(isNaN(producationEfficiencyCap)){
        errorMsg.push("Production Efficiency Cap is not a number");
        error=true;
    }
    if(!sendObject.amountOfDivisions){
        errorMsg.push("No Division Amount");
        error=true;
    }
    var amountOfDivisions = parseInt(sendObject.amountOfDivisions);
    if(isNaN(amountOfDivisions)){
        errorMsg.push("Amount of Divisions is not a number");
        error=true;
    }
    if(!sendObject.outputPer){
        errorMsg.push("No Output Time defined");
        error=true;
    }
    var outputPer = parseInt(sendObject.outputPer);
    if(isNaN(outputPer)){
        errorMsg.push("Output per Time is not a number");
        error=true;
    }
    if(!sendObject.amountOfFactories){
        errorMsg.push("No Factories Amount");
        error=true;
    }
    var amountOfFactories = parseInt(sendObject.amountOfFactories);
    if(isNaN(amountOfDivisions)){
        errorMsg.push.send("Amount of Factories is not a number");
        error=true;
    }
    var level = sendObject.level;
    var checkedObject={
        divisions:divisions,
        factoryEfficiency:factoryEfficiency,
        producationEfficiency:producationEfficiency,
        producationEfficiencyCap:producationEfficiencyCap,
        amountOfDivisions:amountOfDivisions,
        outputPer:outputPer,
        amountOfFactories:amountOfFactories,
        level:level,
        error:error,
        errorMsg:errorMsg
    }
    return checkedObject;
}

function getAveragePE(peStart, peCap, time) {
    var timeToRise = 500*peCap*peCap - 500*peStart*peStart;
    if(timeToRise <=0) return peStart;
    var timeToPe =Math.pow((peStart/peCap),2)*500;
    if(timeToRise >= time){
        return AveragePeDuringRise(timeToPe, time, peCap);
    }
    else {
        var part = timeToRise/time;
        var risingPart = AveragePeDuringRise(timeToPe, timeToRise, peCap);
        return (risingPart*part)+(peCap*(1-part));
    }
}

function AveragePeDuringRise(startTime, endTime, peCap) {
    return (1/(endTime-startTime))*(((Math.pow(endTime, 1.5)* peCap)/ (15 *Math.sqrt(5)))-((Math.pow(startTime, 1.5)* peCap)/ (15 *Math.sqrt(5))));
}

module.exports = router;