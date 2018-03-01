var numberOfTypes = 1;
function addAirwingField() {
    numberOfTypes++;
    $('#group' + (numberOfTypes - 1)).after("<div id=\"group" + numberOfTypes + "\" class=\"pure-control-group\"><label>Air Unit " + numberOfTypes + "</label><input id=\"amount" + numberOfTypes + "\" type=\"number\" min=\"0\" max=\"1000\" step=\"1\" value=\"1\"><select id=\"type" + numberOfTypes + "\"><option value=\"cas1\">CAS I</option><option value=\"cas2\">CAS II</option><option value=\"cas3\">CAS III</option><option value=\"fighter\">Interwar Fighter</option><option value=\"fighter1\">Fighter I</option><option value=\"fighter2\">Fighter II</option><option value=\"fighter3\">Fighter III</option><option value=\"nav1\">Naval Bomber I</option><option value=\"nav2\">Naval Bomber II</option><option value=\"nav3\">Naval Bomber III</option><option value=\"hv1\">Heavy Fighter I</option><option value=\"hv2\">Heavy Fighter II</option><option value=\"hv3\">Heavy Fighter III</option><option value=\"bomber\">Interwar Bomber</option><option value=\"tac1\">Tac Bomber I</option><option value=\"tac2\">Tac Bomber II</option><option value=\"tac3\">Tac Bomber III</option><option value=\"sb1\">Strat Bomber I</option><option value=\"sb2\">Strat Bomber II</option><option value=\"sb3\">Strat Bomber III</option><option value=\"trans\">Transport</option><option value=\"jf1\">Jet Fighter I</option><option value=\"jf2\">Jet Fighter II</option><option value=\"jtb1\">Jet Tac Bomber I</option><option value=\"jtb2\">Jet Tac Bomber II</option><option value=\"jsb1\">Jet Strat Bomber I</option></select></div>");
}
function sendCalcRequest() {
    var outputperField = document.getElementById("outputper");
    var sendObject = {
        planetypes : [],
        factoryEfficiency: document.getElementById("fe").value,
        producationEfficiency:document.getElementById("pe").value,
        outputPer: parseInt(outputperField.options[outputperField.selectedIndex].value)*document.getElementById("time").value
    };
    for (var i = 1; i < numberOfTypes+1; i++){
        var typeField = document.getElementById("type"+i.toString());
        var shiptype = {
            amount:document.getElementById("amount"+i.toString()).value,
            type:typeField.options[typeField.selectedIndex].value,
            name:typeField.options[typeField.selectedIndex].innerText
        };
        sendObject.planetypes.push(shiptype);
    }
    $.ajax({url: "/calculator/airforceamount",contentType: 'application/json', type: 'POST', data: JSON.stringify(sendObject), dataType: 'json',
        success: function(data, textStatus, xhr){
            if(xhr.status==200){
                var resultTable = "<table class=\"pure-table pure-table-bordered\" id=\"typeTable\">\n" +
                    "<thead>"+
                    "<tr>"+
                    "<th>Equipment Type</th>"+
                    "<th>Number of Factories to assign</th>"+
                    "</tr>"+
                    "</thead>"+
                    "                <tbody>\n";
                if(Array.isArray(data)){
                    for(factory of data){
                        var insertData = "                <tr>\n" +
                            "                    <td>"+factory.name+"</td>\n" +
                            "                    <td>"+factory.amount+"</td>\n" +
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