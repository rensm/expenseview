function BreakdownPieGraphPanel(panelName, transType)
{
    var graphData = "";
    
    //Displays all the modules in the panel
    this.drawPanel = function() 
    {
        document.getElementById("div_" + panelName).innerHTML = toHTML();

        //initialize calendar for Start and End Custom Date Textboxes
        var startGraphDateTextBox = "#" + panelName + "_pieStartDate";
        $(startGraphDateTextBox).datepicker();

        var endGraphDateTextBox = "#" + panelName + "_pieEndDate";
        $(endGraphDateTextBox).datepicker();


        this.drawPieChart();
    };
     
    //Returns the HTML string to dispaly this panel  
    function toHTML()
    {
        var sb = new StringBuffer();
        sb.append("<table cellspacing='2'>");

        var transTypeDescription;
        if (transType == "E")
        {
            transTypeDescription = "Expenses";
        }
        else if (transType == "I")
        {
            transTypeDescription = "Income";
        }

        sb.append("<tr><td class='panelHeader'>");
        sb.append(transTypeDescription);
        sb.append(" for: <select id='" + panelName + "_pieChartDefaultDateList' onchange='" + panelName + ".drawPieChart()'>");
        sb.append("<option selected value='All Time'>All Time</option>");
        sb.append("<option value='This Year'>This Year</option>");
        sb.append("<option value='Last Month'>Last Month</option>");
        sb.append("<option value='This Month'>This Month</option>");
        sb.append("<option value='Last Week'>Last Week</option>");
        sb.append("<option value='This Week'>This Week</option>");
        sb.append("<option value='Custom Date'>Custom Date</option>");                                    
        sb.append("</select></td><td>&nbsp;&nbsp;</td>");
        sb.append("<td id='" + panelName + "_pieOtherSelColumn' style='display: none'><table><tr>");
        sb.append("<td>Start Date</td>");
        sb.append("<td><input type='text' size='9' id='" + panelName + "_pieStartDate' class='defaultText' tabIndex='1' value='" + getFormattedDateString(ExpViewGlobalData.userStartDate) + "' /></td>");
        sb.append("<td>End Date</td>");
        sb.append("<td><input type='text' size='9' id='" + panelName + "_pieEndDate' class='defaultText' tabIndex='2' value='" + getFormattedDateString(ExpViewGlobalData.userEndDate) + "' /></td>");
        sb.append("<td><input type='button' id='" + panelName + "_pieSearchOtherButton' class='addButton' value='View Chart' onclick='" + panelName + ".drawOtherDatePieChart()'/></td>");
        sb.append("</tr></table></td></tr></table> <br />");

        sb.append("<div id='" + panelName + "_pieChartMsg'></div>");

        return sb.toString();
    };

    this.drawOtherDatePieChart = function()
    {
        var startDate = getDateFromFormattedDateString(getFieldValue(panelName + "_pieStartDate"));
        var endDate = getDateFromFormattedDateString(getFieldValue(panelName + "_pieEndDate"));

        //Display Loading Image
        document.getElementById(panelName + "_pieChartMsg").innerHTML = "Retrieving Data...<img src='images/loading.gif' />";

        jsonService.GetTransPieGraphForCustomDateRange(transType, startDate, endDate, function(response)
        {
            drawPieChart_CallBack(response);
        });

    };
    
    this.drawPieChart = function()
    {
        var defaultDateList = document.getElementById(panelName + "_pieChartDefaultDateList");
        if (defaultDateList)
        {
            var selectedDefaultDate = defaultDateList.options[defaultDateList.selectedIndex].value

            if (selectedDefaultDate == "Custom Date")
            {
                document.getElementById(panelName + "_pieChartMsg").innerHTML = "";
                document.getElementById(panelName + "_pieOtherSelColumn").style.display = "block";
            }
            else
            {
                document.getElementById(panelName + "_pieOtherSelColumn").style.display = "none";

                var userDate = new Date();

                //Display Loading Image
                document.getElementById(panelName + "_pieChartMsg").innerHTML = "Retrieving Data...<img src='images/loading.gif' />";

                jsonService.GetTransPieGraphForDefaultDateRange(selectedDefaultDate, transType, userDate, function(response)
                {
                    drawPieChart_CallBack(response);
                });
            }
        }
    };


    function drawPieChart_CallBack(response)
    {
    
        if (response.result == -1) 
        {
            document.getElementById(panelName + "_pieChartMsg").innerHTML = "<h2>Error ocurred while retrieving graph data.</h2>";
        }
        else if (response.result == 0) 
        {
            document.getElementById(panelName + "_pieChartMsg").innerHTML = "<h2>No Data found for Date Range</h2>";
        }
        else 
        {
            setGraphData(panelName, response.result);
            document.getElementById(panelName + "_pieChartMsg").innerHTML = "<div id='" + panelName + "_pieChart'></div>";
            swfobject.embedSWF("Flash/open-flash-chart.swf", panelName + "_pieChart", "650", "300", "9.0.0", "expressInstall.swf", { "get-data": "getGraphData", "id": panelName }, {"wmode":"transparent"});
        }
    };    
}