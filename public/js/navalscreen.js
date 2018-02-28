var numberOfTypes = 1;
function addShipField() {
    numberOfTypes++;
  $('#group'+(numberOfTypes-1)).after("<div class=\"pure-control-group\" id=\"group"+numberOfTypes+"\"><label>Naval Unit "+numberOfTypes+"</label><input id=\"amount"+numberOfTypes+"\" type=\"number\" min=\"0\" max=\"1000\" step=\"1\" value=\"1\"><select id=\"type"+numberOfTypes+"\"><option value=\"dd1\">Destroyer I</option><option value=\"dd2\">Destroyer II</option><option value=\"dd3\">Destroyer III</option><option value=\"dd4\">Destroyer IV</option><option value=\"lc1\">Light Cruiser I</option><option value=\"lc2\">Light Cruiser II</option><option value=\"lc3\">Light Cruiser III</option><option value=\"lc4\">Light Cruiser IV</option><option value=\"hc1\">Heavy Cruiser I</option><option value=\"hc2\">Heavy Cruiser II</option><option value=\"hc3\">Heavy Cruiser III</option><option value=\"hc4\">Heavy Cruiser IV</option><option value=\"bc1\">Battlecruiser I</option><option value=\"bc2\">Battlecruiser II</option><option value=\"bb1\">Battleship I</option><option value=\"bb2\">Battleship II</option><option value=\"bb3\">Battleship III</option><option value=\"bb4\">Battleship IV</option><option value=\"sh1\">SH Battleship I</option><option value=\"sh2\">SH Battleship II</option><option value=\"cv1\">Carrier I</option><option value=\"cv2\">Carrier II</option><option value=\"cv3\">Carrier III</option><option value=\"cv4\">Carrier IV</option><option value=\"ss1\">Submarine I</option><option value=\"ss2\">Submarine II</option><option value=\"ss3\">Submarine III</option><option value=\"ss4\">Submarine IV</option></select></div>");
};

function sendCalcRequest() {
    var outputperField = document.getElementById("outputper");
    var sendObject = {
        shiptypes : [],
        factoryEfficiency: document.getElementById("fe").value,
        outputPer: parseInt(outputperField.options[outputperField.selectedIndex].value)*document.getElementById("time").value
    };
    for (var i = 1; i < numberOfTypes+1; i++){
        var typeField = document.getElementById("type"+i.toString());
        var shiptype = {
            amount:document.getElementById("amount"+i.toString()).value,
            type:typeField.options[typeField.selectedIndex].value
        };
        sendObject.shiptypes.push(shiptype);
    }
    $.ajax({url: "/calculator/navyamount",contentType: 'application/json', type: 'POST', data: JSON.stringify(sendObject), dataType: 'json',
        success: function(data, textStatus, xhr){
            if(xhr.status==200){
                document.getElementById('result').innerHTML = "You will need "+data.factoriesNeeded+" dockyards to produce the given amount of ships in the given time. Because you can only assign 15 dockyards to one ship at a time, you wont always have your fleet ready at the given time span. This value just represents the number of dockyards that you need to have a constant output of the given ships in the given time span, seen over a longer period.";
            }
        }});
}