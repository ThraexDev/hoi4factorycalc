var empty={"battalions":[["+","+","+","+","+","+"],["+","+","+","+","+","+"],["+","+","+","+","+","+"],["+","+","+","+","+","+"],["+","+","+","+","+","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30}
var inf20w={"battalions":[["Engineers","Infantry","Infantry","Infantry","+","+"],["Support Artillery\n                    ","Infantry","Infantry","Artillery","+","+"],["Recon Company\n                    ","Infantry","Infantry","Artillery","+","+"],["+","+","+","+","+","+"],["+","+","+","+","+","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30};
var inf40w={"battalions":[["Engineers","Infantry","Infantry","Infantry","Infantry","+"],["Support Artillery\n                    ","Infantry","Infantry","Infantry","Infantry","+"],["Recon Company\n                    ","Infantry","Infantry","Infantry","Infantry","+"],["+","Infantry","Artillery","Artillery","+","+"],["+","Infantry","Artillery","Artillery","+","+"]],"factoryEfficiency":"60","productionEfficiency":"70","amountOfDivisions":"1","outputPer":30};
var t20={"battalions":[["Recon Company\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","Motorized Infantry","+"],["Engineers","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","Motorized Infantry","+"],["Support Artillery\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","+","+","+"],["Maintenance Company","+","+","+","+","+"],["+","+","+","+","+","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30};
var t40={"battalions":[["Recon Company\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","+"],["Engineers","Medium Tank\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","+"],["Support Artillery\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","+"],["Maintenance Company","Medium Tank\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","+"],["+","Medium Tank\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30};
var spacemarines={"battalions":[["Engineers","Infantry","Infantry","Infantry","Infantry","Heavy TD"],["Support Artillery\n                    ","Infantry","Infantry","Infantry","Infantry","+"],["Recon Company\n                    ","Infantry","Infantry","Infantry","+","+"],["+","Infantry","Artillery","Artillery","+","+"],["+","Infantry","Artillery","Artillery","+","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30};
var inf40wat={"battalions":[["Engineers","Infantry","Infantry","Infantry","Infantry","Anti Tank\n                    "],["Support Artillery\n                    ","Infantry","Infantry","Infantry","Infantry","Anti Tank\n                    "],["Recon Company\n                    ","Infantry","Infantry","Infantry","+","+"],["+","Infantry","Artillery","Artillery","+","+"],["+","Infantry","Artillery","Artillery","+","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30,"amountOfFactories":"5"};
var factoriesgiven=false;
sendCalcRequest= function () {
    var outputperField = document.getElementById("outputper");
    var sendObject = {
        battalions : [],
        factoryEfficiency: document.getElementById("fe").value,
        productionEfficiency: document.getElementById("pe").value,
        productionEfficiencyCap: document.getElementById("pec").value,
        amountOfDivisions: document.getElementById("aod").value,
        outputPer: parseInt(outputperField.options[outputperField.selectedIndex].value)*document.getElementById("time").value,
        amountOfFactories: document.getElementById("aof").value,
        level: {
            "Infantry Equipment":$("#infeql").val(),
            "Anti-Tank":$("#atl").val(),
            "Anti-Air":$("#aal").val(),
            "Artillery":$("#artl").val(),
            "Rocket Artillery":$("#ral").val(),
            "Mechanized":$("#ml").val(),
            "Light Tank":$("#ltl").val(),
            "Medium Tank":$("#mtl").val(),
            "Heavy Tank":$("#htl").val(),
            "Light TD":$("#ltdl").val(),
            "Medium TD":$("#mtdl").val(),
            "Heavy TD":$("#htdl").val(),
            "Light SP Artillery":$("#lspgl").val(),
            "Medium SP Artillery":$("#mspgl").val(),
            "Heavy SP Artillery":$("#hspgl").val(),
            "Light SP Anti Air":$("#laal").val(),
            "Medium SP Anti Air":$("#maal").val(),
            "Heavy SP Anti Air":$("#haal").val()
        }
    };
    var divisionTable = document.getElementById("divisionTable");
    if (divisionTable != null) {
        for (var i = 1; i < divisionTable.rows.length; i++) {
            var unitList = [];
            for (var j = 0; j < divisionTable.rows[i].cells.length; j++){
                unitList.push(divisionTable.rows[i].cells[j].innerHTML.toString());
            }
            sendObject.battalions.push(unitList);
        }
    }
    if(factoriesgiven){
        $.ajax({url: "/calculator/divisionfactories",contentType: 'application/json', type: 'POST', data: JSON.stringify(sendObject), dataType: 'json',
            success: function(data, textStatus, xhr){
                if(xhr.status==200){
                    var                     resultTable = "                <p>\n" +
                        "Output in "+document.getElementById("time").value+" "+outputperField.options[outputperField.selectedIndex].innerHTML+": "+data.divisionoutput+" Division(s) \n" +
                        "            </p>";
                    resultTable = resultTable.concat("<table class=\"pure-table pure-table-bordered\" id=\"typeTable\">\n" +
                        "<thead>"+
                        "<tr>"+
                        "<th>Equipment Type</th>"+
                        "<th>Number of Factories to assign</th>"+
                        "<th>Percent of Factories</th>"+
                        "</tr>"+
                        "</thead>"+
                        "                <tbody>\n");
                    if(Array.isArray(data.assignedFactories)){
                        for(factory of data.assignedFactories){
                            var insertData = "                <tr>\n" +
                                "                    <td>"+factory.name+"</td>\n" +
                                "                    <td>"+factory.amountOfFactories+"</td>\n" +
                                "                    <td>"+factory.percent+"%</td>\n" +
                                "                </tr>\n";
                            resultTable = resultTable.concat(insertData);
                        }
                    }
                    resultTable = resultTable.concat("                </tbody>\n" +
                        "            </table>");
                    document.getElementById('result').innerHTML = resultTable;
                }
            }});
    }
    else {
        $.ajax({url: "/calculator/divisionamount",contentType: 'application/json', type: 'POST', data: JSON.stringify(sendObject), dataType: 'json',
            success: function(data, textStatus, xhr){
                if(xhr.status==200){
                    var resultTable = "<table class=\"pure-table pure-table-bordered\" id=\"typeTable\">\n" +
                        "<thead>"+
                        "<tr>"+
                        "<th>Equipment Type</th>"+
                        "<th>Number of Factories needed</th>"+
                        "<th>Percent of Factories</th>"+
                        "<th>Total Amount of Equipment needed in "+document.getElementById("time").value+" "+outputperField.options[outputperField.selectedIndex].innerHTML+"</th>"+
                        "</tr>"+
                        "</thead>"+
                        "                <tbody>\n"
                    if(Array.isArray(data)){
                        for(factory of data){
                            var insertData = "                <tr>\n" +
                                "                    <td>"+factory.name+"</td>\n" +
                                "                    <td>"+factory.amountOfFactories+"</td>\n" +
                                "                    <td>"+factory.percent+"%</td>\n" +
                                "                    <td>"+factory.amountOfEquipment+"</td>\n" +
                                "                </tr>\n";
                            resultTable = resultTable.concat(insertData);
                        }
                    }
                    resultTable = resultTable.concat("                </tbody>\n" +
                        "            </table>");
                    document.getElementById('result').innerHTML = resultTable;
                    window.scrollTo(0,document.body.scrollHeight);
                }
            }});
    }
};

var setOnClickTable = function (id, callback, parameter, header, firstColumnSupport, callbackSupport) {
    var table = document.getElementById(id);
    var startRow = 0;
    if(header) startRow = 1;
    if (table != null) {
        for (var i = startRow; i < table.rows.length; i++) {
            for (var j = 0; j < table.rows[i].cells.length; j++)
                if(j==0){
                    if(firstColumnSupport){
                        table.rows[i].cells[j].onclick = function () {
                            parameter.push(this);
                            callbackSupport(parameter);
                        };
                    }
                    else{
                        table.rows[i].cells[j].onclick = function () {
                            parameter.push(this);
                            callback(parameter);
                        };
                    }
                }
                else {
                    table.rows[i].cells[j].onclick = function () {
                        parameter.push(this);
                        callback(parameter);
                    };
                }
        }
    }
};

var makeTypeTable = function (tableCells) {
    var newTableCell = [];
    newTableCell.push(tableCells[tableCells.length-1]);
    var unitTable = "<table class=\"pure-table pure-table-bordered\" id=\"typeTable\">\n" +
        "                <tbody>\n" +
        "                <tr>\n" +
        "                    <td class='add'>Infantry Battalion</td>\n" +
        "                    <td class='add'>Mobile Battalion</td>\n" +
        "                </tr>\n" +
        "\n" +
        "                <tr>\n" +
        "                    <td class='add'>Armored Battalion</td>\n" +
        "                    <td class='remove'>Remove</td>\n" +
        "                </tr>\n" +
        "                </tbody>\n" +
        "            </table>";
    document.getElementById('placeholder').innerHTML = unitTable;
    setOnClickTable("typeTable", makeUnitTable, newTableCell)
};

var makeSupportTable = function (tableCells) {
    var newTableCell = [];
    newTableCell.push(tableCells[tableCells.length-1]);
    var myTable = "<table class=\"pure-table pure-table-bordered\" id=\"supportTable\">\n" +
        "                <tbody>\n" +
        "                <tr>\n" +
        "                    <td class='add'>Engineers</td>\n" +
        "                    <td class='add'>Field Hospital</td>\n" +
        "                    <td class='add'>Support Rocket Artillery</td>\n" +
        "                </tr>\n" +
        "\n" +
        "                <tr>\n" +
        "                    <td class='add'>Military Police</tdclass>\n" +
        "                    <td class='add'>Logistic Company</td>\n" +
        "                    <td class='add'>Signal Company</td>\n" +
        "                </tr>\n" +
        "\n" +
        "                <tr>\n" +
        "                    <td class='add'>Recon Company</tdclass>\n" +
        "                    <td class='add'>Maintenance Company</td>\n" +
        "                    <td class='add'></td>\n" +
        "                </tr>\n" +
        "\n" +
        "                <tr>\n" +
        "                    <td class='add'>Support Artillery</tdclass>\n" +
        "                    <td class='add'>Support Anti Tank</td>\n" +
        "                    <td class='add'></td>\n" +
        "                </tr>\n" +
        "\n" +
        "                <tr>\n" +
        "                    <td class='add'>Support Anti Air</td>\n" +
        "                    <td class='remove'>Remove</td>\n" +
        "                    <td class='add'></td>\n" +
        "                </tr>\n" +
        "                </tbody>\n" +
        "            </table>";
    document.getElementById('placeholder').innerHTML = myTable;
    setOnClickTable("supportTable", selectUnit, newTableCell);
};

var makeUnitTable = function (tableCells) {
    if(tableCells[tableCells.length-1].innerHTML.toString()=="Infantry Battalion"){
        var myTable = "<table class=\"pure-table pure-table-bordered\" id=\"infanteryTable\">\n" +
            "                <tbody>\n" +
            "                <tr>\n" +
            "                    <td class='add'>Infantry</td>\n" +
            "                    <td class='add'>Artillery</td>\n" +
            "                </tr>\n" +
            "\n" +
            "                <tr>\n" +
            "                    <td class='add'>Anti Tank</tdclass>\n" +
            "                    <td class='add'>Anti Air</td>\n" +
            "                </tr>\n" +
            "\n" +
            "                <tr>\n" +
            "                    <td class='add'>Mountaineer</td>\n" +
            "                    <td class='add'>Marines</td>\n" +
            "                </tr>\n" +
            "\n" +
            "                <tr>\n" +
            "                    <td class='add'>Paratrooper</td>\n" +
            "                    <td class='add'>Rocket Artillery</td>\n" +
            "                </tr>\n" +
            "                </tbody>\n" +
            "            </table>";
        document.getElementById('placeholder').innerHTML = myTable;
        setOnClickTable("infanteryTable", selectUnit, tableCells);
    };
    if(tableCells[tableCells.length-1].innerHTML.toString()=="Mobile Battalion"){
        var myTable = "<table class=\"pure-table pure-table-bordered\" id=\"mobileTable\">\n" +
            "                <tbody>\n" +
            "                <tr>\n" +
            "                    <td class='add'>Cavalry</td>\n" +
            "                    <td class='add'>Motorized Infantry</td>\n" +
            "                </tr>\n" +
            "\n" +
            "                <tr>\n" +
            "                    <td class='add'>Mechanized Infantry</tdclass>\n" +
            "                    <td class='add'>Motorized Rocket Artillery</td>\n" +
            "                </tr>\n" +
            "                </tbody>\n" +
            "            </table>";
        document.getElementById('placeholder').innerHTML = myTable;
        setOnClickTable("mobileTable", selectUnit, tableCells);
    };
    if(tableCells[tableCells.length-1].innerHTML.toString()=="Armored Battalion"){
        var myTable = "<table class=\"pure-table pure-table-bordered\" id=\"armoredTable\">\n" +
            "                <tbody>\n" +
            "                <tr>\n" +
            "                    <td class='add'>Light Tank</td>\n" +
            "                    <td class='add'>Light TD</td>\n" +
            "                    <td class='add'>Light SP Artillery</td>\n" +
            "                    <td class='add'>Light SP Anti Air</td>\n" +
            "                </tr>\n" +
            "\n" +
            "                <tr>\n" +
            "                    <td class='add'>Medium Tank</tdclass>\n" +
            "                    <td class='add'>Medium TD</td>\n" +
            "                    <td class='add'>Medium SP Artillery</td>\n" +
            "                    <td class='add'>Medium SP Anti Air</td>\n" +
            "                </tr>\n" +
            "\n" +
            "                <tr>\n" +
            "                    <td class='add'>Heavy Tank</td>\n" +
            "                    <td class='add'>Heavy TD</td>\n" +
            "                    <td class='add'>Heavy SP Artillery</td>\n" +
            "                    <td class='add'>Heavy SP Anti Air</td>\n" +
            "                </tr>\n" +
            "\n" +
            "                <tr>\n" +
            "                    <td class='add'>Super Heavy Tank</td>\n" +
            "                    <td class='add'>Super Heavy TD</td>\n" +
            "                    <td class='add'>Super Heavy SP Artillery</td>\n" +
            "                    <td class='add'>Super Heavy SP Anti Air</td>\n" +
            "                </tr>\n" +
            "\n" +
            "                <tr>\n" +
            "                    <td class='add'>Modern Tank</td>\n" +
            "                    <td class='add'>Modern TD</td>\n" +
            "                    <td class='add'>Modern SP Artillery</td>\n" +
            "                    <td class='add'>Modern SP Anti Air</td>\n" +
            "                </tr>\n" +
            "                </tbody>\n" +
            "            </table>";
        document.getElementById('placeholder').innerHTML = myTable;
        setOnClickTable("armoredTable", selectUnit, tableCells);
    };
    if(tableCells[tableCells.length-1].innerHTML.toString()=="Remove"){
        tableCells[0].innerHTML="+";
        document.getElementById('placeholder').innerHTML = "";
    };
};



var selectUnit = function (tableCells) {
    if(tableCells[tableCells.length-1].innerHTML.toString()=="Remove"){
        tableCells[0].innerHTML="+";
    }
    else {
        tableCells[0].innerHTML=tableCells[tableCells.length-1].innerHTML;
    }
    document.getElementById('placeholder').innerHTML = "";
};

var enableAOF = function () {
    $('#aod').prop('disabled', true);
    $('#aofb').prop('disabled', true);
    $('#aodb').prop('disabled', false);
    $('#aof').prop('disabled', false)
    factoriesgiven=true;
};

var enableAOD = function () {
    $('#aod').prop('disabled', false);
    $('#aofb').prop('disabled', false);
    $('#aodb').prop('disabled', true);
    $('#aof').prop('disabled', true);
    factoriesgiven=false;
};

var setTemplate = function () {
    var templateSelect = document.getElementById("template");
    var templateID = templateSelect.options[templateSelect.selectedIndex].value;
    if(templateID=="empty"){
        templateToTable(empty);
    }
    if(templateID=="20i"){
        templateToTable(inf20w);
    }
    if(templateID=="40i"){
        templateToTable(inf40w);
    }
    if(templateID=="40iat"){
        templateToTable(inf40wat);
    }
    if(templateID=="20t"){
        templateToTable(t20);
    }
    if(templateID=="40t"){
        templateToTable(t40);
    }
    if(templateID=="spacemarines"){
        templateToTable(spacemarines);
    }
};

var templateToTable= function (template) {
    var battalions = template.battalions;
    var table = document.getElementById('divisionTable');
    for(var i = 0; i < battalions.length; i++){
        for(var j = 0; j < battalions[i].length;j++){
            table.rows[i+1].cells[j].innerHTML=battalions[i][j];
        }
    }
};

setOnClickTable("divisionTable", makeTypeTable, [], true, true, makeSupportTable);