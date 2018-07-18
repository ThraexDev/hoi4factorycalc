var divisionTemplates = [];
var empty={"battalions":[["+","+","+","+","+","+"],["+","+","+","+","+","+"],["+","+","+","+","+","+"],["+","+","+","+","+","+"],["+","+","+","+","+","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30}
var inf20w={"battalions":[["Engineers","Infantry","Infantry","Infantry","+","+"],["Support Artillery\n                    ","Infantry","Infantry","Artillery","+","+"],["Recon Company\n                    ","Infantry","Infantry","Artillery","+","+"],["+","+","+","+","+","+"],["+","+","+","+","+","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30};
var inf40w={"battalions":[["Engineers","Infantry","Infantry","Infantry","Infantry","+"],["Support Artillery\n                    ","Infantry","Infantry","Infantry","Infantry","+"],["Recon Company\n                    ","Infantry","Infantry","Infantry","Infantry","+"],["+","Infantry","Artillery","Artillery","+","+"],["+","Infantry","Artillery","Artillery","+","+"]],"factoryEfficiency":"60","productionEfficiency":"70","amountOfDivisions":"1","outputPer":30};
var t20={"battalions":[["Recon Company\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","Motorized Infantry","+"],["Engineers","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","Motorized Infantry","+"],["Support Artillery\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","+","+","+"],["Maintenance Company","+","+","+","+","+"],["+","+","+","+","+","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30};
var t40={"battalions":[["Recon Company\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","+"],["Engineers","Medium Tank\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","+"],["Support Artillery\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","+"],["Maintenance Company","Medium Tank\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","+"],["+","Medium Tank\n                    ","Medium Tank\n                    ","Medium Tank\n                    ","Motorized Infantry","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30};
var spacemarines={"battalions":[["Engineers","Infantry","Infantry","Infantry","Infantry","Heavy TD"],["Support Artillery\n                    ","Infantry","Infantry","Infantry","Infantry","+"],["Recon Company\n                    ","Infantry","Infantry","Infantry","+","+"],["+","Infantry","Artillery","Artillery","+","+"],["+","Infantry","Artillery","Artillery","+","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30};
var inf40wat={"battalions":[["Engineers","Infantry","Infantry","Infantry","Infantry","Anti Tank\n                    "],["Support Artillery\n                    ","Infantry","Infantry","Infantry","Infantry","Anti Tank\n                    "],["Recon Company\n                    ","Infantry","Infantry","Infantry","+","+"],["+","Infantry","Artillery","Artillery","+","+"],["+","Infantry","Artillery","Artillery","+","+"]],"factoryEfficiency":"0","productionEfficiency":"50","amountOfDivisions":"1","outputPer":30,"amountOfFactories":"5"};
var factoriesgiven=false;
let idTemplate = 0;
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
    for(let divisionTemplate of divisionTemplates){
        var division = {
            battalions:divisionTemplate.battalions,
            percent:document.getElementById("percent"+divisionTemplate.id).value
        };
        sendObject.divisions.push(division);
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

let makeDivisionDesigner = function () {
    idTemplate++;
    let divisionDesigner = "<div id=\"divisionTemplate"+idTemplate+"\">\n" +
        "   <h3 class=\"content-subhead\">"+idTemplate+". Division template</h3>\n" +
        "   <form class=\"pure-form pure-form-aligned\">\n" +
        "      <fieldset>\n" +
        "         <div class=\"pure-control-group\"><label>Click here to remove the division template</label><button type=\"button\" onclick=\"removeDivision("+idTemplate+")\" class=\"pure-button\">Remove</button></div>\n" +
        "         <div class=\"pure-control-group\">\n" +
        "            <label for=\"template"+idTemplate+"\">(Optional) You can select a premade division blueprint</label>\n" +
        "            <select id=\"template"+idTemplate+"\" onchange=\"setTemplate("+idTemplate+")\">\n" +
        "               <option value=\"empty\">Empty</option>\n" +
        "               <option value=\"20i\">20 Width Infantry</option>\n" +
        "               <option value=\"40i\">40 Width Infantry</option>\n" +
        "               <option value=\"40iat\">40 Width Infantry With Anti Tank</option>\n" +
        "               <option value=\"20t\">20 Width Tanks</option>\n" +
        "               <option value=\"40t\">40 Width Tanks</option>\n" +
        "               <option value=\"spacemarines\">Space Marines</option>\n" +
        "            </select>\n" +
        "         </div>\n" +
        "         <div class=\"pure-control-group\"><label for=\"percent"+idTemplate+"\">% of divisions that will be recruited with this template</label><input id=\"percent"+idTemplate+"\" type=\"number\" min=\"0\" max=\"100\" step=\"1\" value=\"100\"><span class=\"pure-form-message-inline\">%</span></div>\n" +
        "      </fieldset>\n" +
        "   </form>\n" +
        "   <strong>You can edit the table by clicking on the cells - use it like the division designer in the game.</strong>\n" +
        "   <div id=\"placeholder"+idTemplate+"\" style=\"position: relative; margin-bottom: 10px\"></div>" +
        "   <div id=\"divisionDesigner"+idTemplate+"\"> </div>"+
        "</div>";
    $("#divisionTemplates").append(divisionDesigner);
    let divisionTemplate = {
        id: idTemplate,
        table: $("#divisionTable"+idTemplate),
        battalions: [{type:"support",
                        units:[]}]
    };
    drawDivisionTemplate(divisionTemplate);
    divisionTemplates.push(divisionTemplate);
};
let handleDivisionDesignerClick = function (row, column, divisionTemplate) {
    return function () {
        if(column > 0 && row==0 && !divisionTemplate.battalions[column]){
            drawTypeTable(row, column, divisionTemplate);
        }
        else if (column > 0){
            drawUnitTable(row, column, divisionTemplate);
        }
        if(column == 0){
            drawSupportTable(row,column, divisionTemplate);
        }
    };
};
let drawDivisionTemplate = function (divisionTemplate) {
    var tableBody = "";
    for(let row = 0; row < 5; row++){
        tableBody+="<tr>";
        for(let column=0; column < 6; column++){
            if(divisionTemplate.battalions[column]){
                if(divisionTemplate.battalions[column].units[row]){
                    tableBody+="<td class='clickable'><img src=\"pictures/"+divisionTemplate.battalions[column].units[row]+".png\" alt=\""+divisionTemplate.battalions[column].units[row]+"\"></td>"
                } else if (divisionTemplate.battalions[column].units[row-1] || row < 1){
                    tableBody+="<td class='clickable'><img src=\"pictures/plus.png\" alt=\"add\"\"></td>"
                } else{
                    tableBody+="<td><img src=\"pictures/lock.png\" alt=\"locked\"></td>"
                }
            } else {
                if(divisionTemplate.battalions[column-1] && row == 0 || (row < 1 && column < 2)){
                    tableBody+="<td class='clickable'><img src=\"pictures/plus.png\" alt=\"add\"></td>"
                } else{
                    tableBody+="<td><img src=\"pictures/lock.png\" alt=\"locked\"></td>"
                }
            }
        }
        tableBody+="</tr>";
    }
    let divisionDesigner =  "   <table id=\"divisionTable"+divisionTemplate.id+"\" class=\"pure-table\">\n" +
        "      <thead>\n" +
        "         <tr>\n" +
        "            <th>Support</th>\n" +
        "            <th colspan=\"5\" style='text-align: center;'>Combat</th>\n" +
        "         </tr>\n" +
        "      </thead>\n" +
        "      <tbody>\n" +
        tableBody+
        "      </tbody>\n" +
        "   </table>\n" ;
    $("#divisionDesigner"+divisionTemplate.id).html(divisionDesigner);
    var table = document.getElementById("divisionTable"+divisionTemplate.id);
    for (var i = 1; i < table.rows.length; i++) {
        for (var j = 0; j < table.rows[i].cells.length; j++){
            if(table.rows[i].cells[j].classList.contains("clickable")){
                table.rows[i].cells[j].onclick = handleDivisionDesignerClick(i-1,j,divisionTemplate);
            }
        }
    }
    for(let i = 0; i < divisionTemplates.length; i++){
        if(divisionTemplates[i].id == divisionTemplate.id){
            divisionTemplates[i] = divisionTemplate;
        }
    }
};

let drawTypeTable = function (row, column, divisionTemplate){
    let unitTable = "<table class=\"pure-table pure-table-bordered\" id=\"typeTable"+divisionTemplate.id+"\">\n" +
        "                <tbody>\n" +
        "                <tr>\n" +
        "                    <td class='clickable'><img src=\"pictures/Infantry.png\" alt=\"Infantry\"></br>Infantry Battalion</td>\n" +
        "                    <td class='clickable'><img src=\"pictures/Motorized Infantry.png\" alt=\"Motorized\"></br>Mobile Battalion</td>\n" +
        "                </tr>\n" +
        "\n" +
        "                <tr>\n" +
        "                    <td class='clickable'><img src=\"pictures/Medium Tank.png\" alt=\"Medium Tank\"></br>Armored Battalion</td>\n" +
        "                    <td class='remove'></td>\n" +
        "                </tr>\n" +
        "                </tbody>\n" +
        "            </table>";
    document.getElementById('placeholder'+divisionTemplate.id).innerHTML = unitTable;
    var table = document.getElementById("typeTable"+divisionTemplate.id);
    for (var i = 0; i < table.rows.length; i++) {
        for (var j = 0; j < table.rows[i].cells.length; j++){
            if(table.rows[i].cells[j].classList.contains("clickable")){
                table.rows[i].cells[j].onclick = function () {
                    divisionTemplate.battalions[column]={
                        type:this.textContent,
                        units:[]
                    };
                    drawUnitTable(row, column, divisionTemplate);
                }
            }
        }
    }
};

var drawSupportTable = function (row, column, divisionTemplate) {
    let myTable = "<table class=\"pure-table pure-table-bordered\" id=\"supportTable"+divisionTemplate.id+"\">\n" +
        "                <tbody>\n" +
        "                <tr>\n" +
        "                    <td class='clickable'><img src=\"pictures/Engineers.png\" alt=\"Engineers\">Engineers</td>\n" +
        "                    <td class='clickable'><img src=\"pictures/Field Hospital.png\" alt=\"Field Hospital\">Field Hospital</td>\n" +
        "                    <td class='clickable'><img src=\"pictures/Support Rocket Artillery.png\" alt=\"Support Rocket Artillery\">Support Rocket Artillery</td>\n" +
        "                </tr>\n" +
        "\n" +
        "                <tr>\n" +
        "                    <td class='clickable'><img src=\"pictures/Military Police.png\" alt=\"Military Police\">Military Police</tdclass>\n" +
        "                    <td class='clickable'><img src=\"pictures/Logistic Company.png\" alt=\"Logistic Company\">Logistic Company</td>\n" +
        "                    <td class='clickable'><img src=\"pictures/Signal Company.png\" alt=\"Signal Company\">Signal Company</td>\n" +
        "                </tr>\n" +
        "\n" +
        "                <tr>\n" +
        "                    <td class='clickable'><img src=\"pictures/Recon Company.png\" alt=\"Recon Company\">Recon Company</tdclass>\n" +
        "                    <td class='clickable'><img src=\"pictures/Maintenance Company.png\" alt=\"Maintenance Company\">Maintenance Company</td>\n" +
        "                    <td></td>\n" +
        "                </tr>\n" +
        "\n" +
        "                <tr>\n" +
        "                    <td class='clickable'><img src=\"pictures/Support Artillery.png\" alt=\"Support Artillery\">Support Artillery</tdclass>\n" +
        "                    <td class='clickable'><img src=\"pictures/Support Anti Tank.png\" alt=\"Support Anti Tank\">Support Anti Tank</td>\n" +
        "                    <td></td>\n" +
        "                </tr>\n" +
        "\n" +
        "                <tr>\n" +
        "                    <td class='clickable'><img src=\"pictures/Support Anti Air.png\" alt=\"Support Anti Air\">Support Anti Air</td>\n" +
        "                    <td class='delete'><img src=\"pictures/Delete.png\" alt=\"Delete\">Remove</td>\n" +
        "                    <td></td>\n" +
        "                </tr>\n" +
        "                </tbody>\n" +
        "            </table>";
    document.getElementById('placeholder'+divisionTemplate.id).innerHTML = myTable;
    var table = document.getElementById("supportTable"+divisionTemplate.id);
    for (var i = 0; i < table.rows.length; i++) {
        for (var j = 0; j < table.rows[i].cells.length; j++){
            if(table.rows[i].cells[j].classList.contains("clickable")){
                table.rows[i].cells[j].onclick = function () {
                    divisionTemplate.battalions[column].units[row]=this.getElementsByTagName("img")[0].alt;
                    drawDivisionTemplate(divisionTemplate);
                    document.getElementById('placeholder'+divisionTemplate.id).innerHTML = "";
                }
            }
            if(table.rows[i].cells[j].classList.contains("delete")){
                table.rows[i].cells[j].onclick = function () {
                    divisionTemplate.battalions[column].units.splice(row,1);
                    drawDivisionTemplate(divisionTemplate);
                    document.getElementById('placeholder'+divisionTemplate.id).innerHTML = "";
                }
            }
        }
    }
};

var drawUnitTable = function (row, column, divisionTemplate) {
    let unitTable = "";
    if(divisionTemplate.battalions[column].type=="Infantry Battalion"){
        unitTable = "<table class=\"pure-table pure-table-bordered\" id=\"unitTable"+divisionTemplate.id+"\">\n" +
            "                <tbody>\n" +
            "                <tr>\n" +
            "                    <td class='clickable'><img src=\"pictures/Infantry.png\" alt=\"Infantry\">Infantry</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Artillery.png\" alt=\"Artillery\">Artillery</td>\n" +
            "                    <td></td>\n" +
            "                </tr>\n" +
            "\n" +
            "                <tr>\n" +
            "                    <td class='clickable'><img src=\"pictures/Anti Tank.png\" alt=\"Anti Tank\">Anti Tank</tdclass>\n" +
            "                    <td class='clickable'><img src=\"pictures/Anti Air.png\" alt=\"Anti Air\">Anti Air</td>\n" +
            "                    <td></td>\n" +
            "                </tr>\n" +
            "\n" +
            "                <tr>\n" +
            "                    <td class='clickable'><img src=\"pictures/Mountaineer.png\" alt=\"Mountaineer\">Mountaineer</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Marines.png\" alt=\"Marines\">Marines</td>\n" +
            "                    <td></td>\n" +
            "                </tr>\n" +
            "\n" +
            "                <tr>\n" +
            "                    <td class='clickable'><img src=\"pictures/Paratrooper.png\" alt=\"Paratrooper\">Paratrooper</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Rocket Artillery.png\" alt=\"Rocket Artillery\">Rocket Artillery</td>\n" +
            "                    <td class='delete'><img src=\"pictures/Delete.png\" alt=\"Delete\">Remove</td>\n" +
            "                </tr>\n" +
            "                </tbody>\n" +
            "            </table>";
    };
    if(divisionTemplate.battalions[column].type=="Mobile Battalion"){
        unitTable = "<table class=\"pure-table pure-table-bordered\" id=\"unitTable"+divisionTemplate.id+"\">\n" +
            "                <tbody>\n" +
            "                <tr>\n" +
            "                    <td class='clickable'><img src=\"pictures/Cavalry.png\" alt=\"Cavalry\">Cavalry</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Motorized Infantry.png\" alt=\"Motorized Infantry\">Motorized Infantry</td>\n" +
            "                    <td></td>\n" +
            "                </tr>\n" +
            "\n" +
            "                <tr>\n" +
            "                    <td class='clickable'><img src=\"pictures/Mechanized Infantry.png\" alt=\"Mechanized Infantry\">Mechanized Infantry</tdclass>\n" +
            "                    <td class='clickable'><img src=\"pictures/Motorized Rocket Artillery.png\" alt=\"Motorized Rocket Artillery\">Motorized Rocket Artillery</td>\n" +
            "                    <td class='delete'><img src=\"pictures/Delete.png\" alt=\"Delete\">Remove</td>\n" +
            "                </tr>\n" +
            "                </tbody>\n" +
            "            </table>";
    };
    if(divisionTemplate.battalions[column].type=="Armored Battalion"){
        unitTable = "<table class=\"pure-table pure-table-bordered\" id=\"unitTable"+divisionTemplate.id+"\">\n" +
            "                <tbody>\n" +
            "                <tr>\n" +
            "                    <td class='clickable'><img src=\"pictures/Light Tank.png\" alt=\"Light Tank\">Light Tank</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Light TD.png\" alt=\"Light TD\">Light TD</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Light SP Artillery.png\" alt=\"Light SP Artillery\">Light SP Artillery</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Light SP Anti Air.png\" alt=\"Light SP Anti Air\">Light SP Anti Air</td>\n" +
            "                    <td></td>\n" +
            "                </tr>\n" +
            "\n" +
            "                <tr>\n" +
            "                    <td class='clickable'><img src=\"pictures/Medium Tank.png\" alt=\"Medium Tank\">Medium Tank</tdclass>\n" +
            "                    <td class='clickable'><img src=\"pictures/Medium TD.png\" alt=\"Medium TD\">Medium TD</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Medium SP Artillery.png\" alt=\"Medium SP Artillery\">Medium SP Artillery</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Medium SP Anti Air.png\" alt=\"Medium SP Anti Air\">Medium SP Anti Air</td>\n" +
            "                    <td></td>\n" +
            "                </tr>\n" +
            "\n" +
            "                <tr>\n" +
            "                    <td class='clickable'><img src=\"pictures/Heavy Tank.png\" alt=\"Heavy Tank\">Heavy Tank</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Heavy TD.png\" alt=\"Heavy TD\">Heavy TD</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Heavy SP Artillery.png\" alt=\"Heavy SP Artillery\">Heavy SP Artillery</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Heavy SP Anti Air.png\" alt=\"Heavy SP Anti Air\">Heavy SP Anti Air</td>\n" +
            "                    <td></td>\n" +
            "                </tr>\n" +
            "\n" +
            "                <tr>\n" +
            "                    <td class='clickable'><img src=\"pictures/Super Heavy Tank.png\" alt=\"Super Heavy Tank\">Super Heavy Tank</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Super Heavy TD.png\" alt=\"Super Heavy TD\">Super Heavy TD</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Super Heavy SP Artillery.png\" alt=\"Super Heavy SP Artillery\">Super Heavy SP Artillery</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Super Heavy SP Anti Air.png\" alt=\"Super Heavy SP Anti Air\">Super Heavy SP Anti Air</td>\n" +
            "                    <td></td>\n" +
            "                </tr>\n" +
            "\n" +
            "                <tr>\n" +
            "                    <td class='clickable'><img src=\"pictures/Modern Tank.png\" alt=\"Modern Tank\">Modern Tank</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Modern TD.png\" alt=\"Modern TD\">Modern TD</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Modern SP Artillery.png\" alt=\"Modern SP Artillery\">Modern SP Artillery</td>\n" +
            "                    <td class='clickable'><img src=\"pictures/Modern SP Anti Air.png\" alt=\"Modern SP Anti Air\">Modern SP Anti Air</td>\n" +
            "                    <td class='delete'><img src=\"pictures/Delete.png\" alt=\"Delete\">Remove</td>\n" +
            "                </tr>\n" +
            "                </tbody>\n" +
            "            </table>";
    };
    document.getElementById('placeholder'+divisionTemplate.id).innerHTML = unitTable;
    var table = document.getElementById("unitTable"+divisionTemplate.id);
    for (var i = 0; i < table.rows.length; i++) {
        for (var j = 0; j < table.rows[i].cells.length; j++){
            if(table.rows[i].cells[j].classList.contains("clickable")){
                table.rows[i].cells[j].onclick = function () {
                    divisionTemplate.battalions[column].units[row]=this.getElementsByTagName("img")[0].alt;
                    drawDivisionTemplate(divisionTemplate);
                    document.getElementById('placeholder'+divisionTemplate.id).innerHTML = "";
                }
            }
            if(table.rows[i].cells[j].classList.contains("delete")){
                table.rows[i].cells[j].onclick = function () {
                    if(divisionTemplate.battalions[column].units.length == 1){
                        divisionTemplate.battalions.splice(column,1);
                    }
                    else{
                        divisionTemplate.battalions[column].units.splice(row,1);
                    }
                    drawDivisionTemplate(divisionTemplate);
                    document.getElementById('placeholder'+divisionTemplate.id).innerHTML = "";
                }
            }
        }
    }
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

var removeDivision = function (id) {
    $("#divisionTemplate"+id).remove();
    divisionTemplates.splice(divisionNumbers.indexOf(id), 1);
};

makeDivisionDesigner();