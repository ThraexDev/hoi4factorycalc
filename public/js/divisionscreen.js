var empty={"battalions":[["+","+","+","+","+","+"],["+","+","+","+","+","+"],["+","+","+","+","+","+"],["+","+","+","+","+","+"],["+","+","+","+","+","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30}
var inf20w={"battalions":[["Engineers","Infantry","Infantry","Infantry","+","+"],["Support Artillery\n                    ","Infantry","Infantry","Artillery","+","+"],["Recon Company\n                    ","Infantry","Infantry","Artillery","+","+"],["+","+","+","+","+","+"],["+","+","+","+","+","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30};
var inf40w={"battalions":[["Engineers","Infantry","Infantry","Infantry","Infantry","+"],["Support Artillery\n                    ","Infantry","Infantry","Infantry","Infantry","+"],["Recon Company\n                    ","Infantry","Infantry","Infantry","Infantry","+"],["+","Infantry","Artillery","Artillery","+","+"],["+","Infantry","Artillery","Artillery","+","+"]],"factoryEfficiency":"60","productionEfficiency":"70","amountOfDivisions":"1","outputPer":30};
var t20={"battalions":[["Recon Company\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","Motorized Infantry","+"],["Engineers","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","Motorized Infantry","+"],["Support Artillery\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","+","+","+"],["Maintenance Company","+","+","+","+","+"],["+","+","+","+","+","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30};
var t40={"battalions":[["Recon Company\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","+"],["Engineers","Medium Tank\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","+"],["Support Artillery\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","+"],["Maintenance Company","Medium Tank\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","+"],["+","Medium Tank\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30};
var spacemarines={"battalions":[["Engineers","Infantry","Infantry","Infantry","Infantry","Heavy TD"],["Support Artillery\n                    ","Infantry","Infantry","Infantry","Infantry","+"],["Recon Company\n                    ","Infantry","Infantry","Infantry","+","+"],["+","Infantry","Artillery","Artillery","+","+"],["+","Infantry","Artillery","Artillery","+","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30};
var inf40wat={"battalions":[["Engineers","Infantry","Infantry","Infantry","Infantry","Anti Tank\n                    "],["Support Artillery\n                    ","Infantry","Infantry","Infantry","Infantry","Anti Tank\n                    "],["Recon Company\n                    ","Infantry","Infantry","Infantry","+","+"],["+","Infantry","Artillery","Artillery","+","+"],["+","Infantry","Artillery","Artillery","+","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30,"amountOfFactories":"5"};
var factoriesgiven=false;
var divisionNumbers = [];
sendCalcRequest= function () {
    var outputperField = document.getElementById("outputper");
    var sendObject = {
        divisions : [],
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
    for(var divisionNumber of divisionNumbers){
        var divisionTable = document.getElementById("divisionTable"+divisionNumber);
        if (divisionTable != null) {
            var division = {
                battalions:[],
                percent:document.getElementById("percent"+divisionNumber).value
            };
            for (var i = 1; i < divisionTable.rows.length; i++) {
                var unitList = [];
                for (var j = 0; j < divisionTable.rows[i].cells.length; j++){
                    unitList.push(divisionTable.rows[i].cells[j].innerHTML.toString());
                }
                division.battalions.push(unitList);
            }
            sendObject.divisions.push(division);
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

                }
            }});
    }
    window.scrollTo(0,document.body.scrollHeight);
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
                            callbackSupport(parameter,id);
                        };
                    }
                    else{
                        table.rows[i].cells[j].onclick = function () {
                            parameter.push(this);
                            callback(parameter,id);
                        };
                    }
                }
                else {
                    table.rows[i].cells[j].onclick = function () {
                        parameter.push(this);
                        callback(parameter,id);
                    };
                }
        }
    }
};

var makeDivisionDesigner = function () {
    var id = 1;
    if(divisionNumbers.length>0){
        id = Math.max(...divisionNumbers)+1;
    }
    divisionNumbers.push(parseInt(id));
    var divisionDesigner = "<div id=\"divisionTemplate"+id+"\">\n" +
        "   <h3 class=\"content-subhead\">"+id+". Division template</h3>\n" +
        "   <form class=\"pure-form pure-form-aligned\">\n" +
        "      <fieldset>\n" +
        "         <div class=\"pure-control-group\"><label>Click here to remove the division template</label><button type=\"button\" onclick=\"removeDivision("+id+")\" class=\"pure-button\">Remove</button></div>\n" +
        "         <div class=\"pure-control-group\">\n" +
        "            <label for=\"template"+id+"\">(Optional) You can select a premade division blueprint</label>\n" +
        "            <select id=\"template"+id+"\" onchange=\"setTemplate("+id+")\">\n" +
        "               <option value=\"empty\">Empty</option>\n" +
        "               <option value=\"20i\">20 Width Infantry</option>\n" +
        "               <option value=\"40i\">40 Width Infantry</option>\n" +
        "               <option value=\"40iat\">40 Width Infantry With Anti Tank</option>\n" +
        "               <option value=\"20t\">20 Width Tanks</option>\n" +
        "               <option value=\"40t\">40 Width Tanks</option>\n" +
        "               <option value=\"spacemarines\">Space Marines</option>\n" +
        "            </select>\n" +
        "         </div>\n" +
        "         <div class=\"pure-control-group\"><label for=\"percent"+id+"\">% of divisions that will be recruited with this template</label><input id=\"percent"+id+"\" type=\"number\" min=\"0\" max=\"100\" step=\"1\" value=\"100\"><span class=\"pure-form-message-inline\">%</span></div>\n" +
        "      </fieldset>\n" +
        "   </form>\n" +
        "   <strong>You can edit the table by clicking on the cells - use it like the division designer in the game.</strong>\n" +
        "   <div id=\"placeholder"+id+"\" style=\"position: relative; margin-bottom: 10px\"></div>\n" +
        "   <table id=\"divisionTable"+id+"\" class=\"pure-table pure-table-bordered\">\n" +
        "      <thead>\n" +
        "         <tr>\n" +
        "            <th>Support</th>\n" +
        "            <th>Battalion</th>\n" +
        "            <th>Battalion</th>\n" +
        "            <th>Battalion</th>\n" +
        "            <th>Battalion</th>\n" +
        "            <th>Battalion</th>\n" +
        "         </tr>\n" +
        "      </thead>\n" +
        "      <tbody>\n" +
        "         <tr>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "         </tr>\n" +
        "         <tr>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "         </tr>\n" +
        "         <tr>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "         </tr>\n" +
        "         <tr>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "         </tr>\n" +
        "         <tr>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "            <td>+</td>\n" +
        "         </tr>\n" +
        "      </tbody>\n" +
        "   </table>\n" +
        "</div>";
    $("#divisionTemplates").append(divisionDesigner);
    setOnClickTable("divisionTable"+id, makeTypeTable, [], true, true, makeSupportTable);
}

var removeDivision = function (id) {
    $("#divisionTemplate"+id).remove();
    divisionNumbers.splice(divisionNumbers.indexOf(id), 1);
}

var makeTypeTable = function (tableCells,id) {
    var newTableCell = [];
    var idNumber = id.replace("divisionTable","");
    newTableCell.push(tableCells[tableCells.length-1]);
    var unitTable = "<table class=\"pure-table pure-table-bordered\" id=\"typeTable"+idNumber+"\">\n" +
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
    document.getElementById('placeholder'+idNumber).innerHTML = unitTable;
    setOnClickTable("typeTable"+idNumber, makeUnitTable, newTableCell)
};

var makeSupportTable = function (tableCells, id) {
    var newTableCell = [];
    var idNumber = id.replace("divisionTable","");
    newTableCell.push(tableCells[tableCells.length-1]);
    var myTable = "<table class=\"pure-table pure-table-bordered\" id=\"supportTable"+idNumber+"\">\n" +
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
    document.getElementById('placeholder'+idNumber).innerHTML = myTable;
    setOnClickTable("supportTable"+idNumber, selectUnit, newTableCell);
};

var makeUnitTable = function (tableCells, id) {
    var idNumber = id.replace("typeTable","");
    if(tableCells[tableCells.length-1].innerHTML.toString()=="Infantry Battalion"){
        var myTable = "<table class=\"pure-table pure-table-bordered\" id=\"infanteryTable"+idNumber+"\">\n" +
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
        document.getElementById('placeholder'+idNumber).innerHTML = myTable;
        setOnClickTable("infanteryTable"+idNumber, selectUnit, tableCells);
    };
    if(tableCells[tableCells.length-1].innerHTML.toString()=="Mobile Battalion"){
        var myTable = "<table class=\"pure-table pure-table-bordered\" id=\"mobileTable"+idNumber+"\">\n" +
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
        document.getElementById('placeholder'+idNumber).innerHTML = myTable;
        setOnClickTable("mobileTable"+idNumber, selectUnit, tableCells);
    };
    if(tableCells[tableCells.length-1].innerHTML.toString()=="Armored Battalion"){
        var myTable = "<table class=\"pure-table pure-table-bordered\" id=\"armoredTable"+idNumber+"\">\n" +
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
        document.getElementById('placeholder'+idNumber).innerHTML = myTable;
        setOnClickTable("armoredTable"+idNumber, selectUnit, tableCells);
    };
    if(tableCells[tableCells.length-1].innerHTML.toString()=="Remove"){
        tableCells[0].innerHTML="+";
        document.getElementById('placeholder'+idNumber).innerHTML = "";
    };
};



var selectUnit = function (tableCells,id) {
    var idNumber;
    if(id.startsWith("supportTable")){
        idNumber=id.replace("supportTable","");
    }
    if(id.startsWith("infanteryTable")){
        idNumber=id.replace("infanteryTable","");
    }
    if(id.startsWith("mobileTable")){
        idNumber=id.replace("mobileTable","");
    }
    if(id.startsWith("armoredTable")){
        idNumber=id.replace("armoredTable","");
    }
    if(tableCells[tableCells.length-1].innerHTML.toString()=="Remove"){
        tableCells[0].innerHTML="+";
    }
    else {
        tableCells[0].innerHTML=tableCells[tableCells.length-1].innerHTML;
    }
    document.getElementById('placeholder'+idNumber).innerHTML = "";
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

var setTemplate = function (id) {
    var templateSelect = document.getElementById("template"+id);
    var templateID = templateSelect.options[templateSelect.selectedIndex].value;
    if(templateID=="empty"){
        templateToTable(empty,id);
    }
    if(templateID=="20i"){
        templateToTable(inf20w,id);
    }
    if(templateID=="40i"){
        templateToTable(inf40w,id);
    }
    if(templateID=="40iat"){
        templateToTable(inf40wat,id);
    }
    if(templateID=="20t"){
        templateToTable(t20,id);
    }
    if(templateID=="40t"){
        templateToTable(t40,id);
    }
    if(templateID=="spacemarines"){
        templateToTable(spacemarines,id);
    }
};

var templateToTable= function (template, id) {
    var battalions = template.battalions;
    var table = document.getElementById('divisionTable'+id);
    for(var i = 0; i < battalions.length; i++){
        for(var j = 0; j < battalions[i].length;j++){
            table.rows[i+1].cells[j].innerHTML=battalions[i][j];
        }
    }
};

makeDivisionDesigner();