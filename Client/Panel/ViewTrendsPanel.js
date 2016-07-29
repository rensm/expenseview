function ViewTrendsPanel(panelName, transType)
{
    var headerName;
    var chartDivName;
    var settingsFilePath;
    var flashObjectName;

    //set Div and Settings based on if this is for expenses or income
    if (transType == "Expense")
    {
        headerName = "Expense Trends"
        chartDivName = "expTrendsDiv";
        settingsFilePath = "/Service/TrendChartSettings.ashx?transType=Expense";
        flashObjectName = "expTrendsChart";
    }
    else
    {
        headerName = "Income Trends"
        chartDivName = "incomeTrendsDiv";
        settingsFilePath = "/Service/TrendChartSettings.ashx?transType=Income";
        flashObjectName = "incomeTrendsChart";
    }

    //Defines initial HTML sructure for panel (e.g. Header name, Div element for flash content)
    document.getElementById(panelName).innerHTML = createInitialHTML();

    //Create the Flash object
    var flashvars = {};
    flashvars.path = "";
    flashvars.settings_file = encodeURIComponent(settingsFilePath);
    flashvars.chart_id = flashObjectName;

    var params = {};
    var attributes = { id: flashObjectName }

    swfobject.embedSWF("Flash/amstock.swf", chartDivName, "900", "450", "8", "expressInstall.swf", flashvars, params, attributes);

    this.setFlashChartObject = function (flashObject)
    {
        this.flashChartObject = flashObject;
    }

    //redraws the Panel contents
    //For this Panel, there is nothing to reload
    //The flash chart reloads automatically when it's made visible
    this.redrawPanel = function ()
    {
    };

    //Returns the HTML string to dispaly this panel  
    function createInitialHTML()
    {
        var sb = new StringBuffer();
        sb.append("<span class='panelHeader'>");
        sb.append(headerName);
        sb.append("</span><br />");
        sb.append("<div id='" + chartDivName + "'></div>");

        return sb.toString();
    }

}

