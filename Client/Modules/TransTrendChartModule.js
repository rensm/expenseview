function TransTrendChartModule(displayDiv, graphId, catData)
{
    function createGraphData(dateRange)
    {        
        var sb1 = new StringBuffer();

        sb1.append("<graph>");
	    sb1.append("<general_settings bg_color='FFFFFF' />");
	    sb1.append("<header text='' font='Verdana' color='000000' size='18' />");
	    sb1.append("<subheader text='' font='Verdana' color='000000' size='15' />");
	    sb1.append("<legend font='Verdana' font_color='000000' font_size='11' bgcolor='FFFFFF' alternate_bg_color='FFF9E1' border_color='BFBFBF' />");
	    sb1.append("<legend_popup font='Verdana' bgcolor='FFFFE3' font_size='10' />");
	    sb1.append("<pie_chart radius='120' height='35' angle_slope='45' alpha_sides='90' alpha_lines='20' />");
        
        var amountArray = createAmountArray(dateRange);
        var numAmounts = amountArray.length;
                
        for(x=0; x<numAmounts; x++)
        {                        
		    sb1.append("<data name='" + amountArray[x].Name + " (" + amountArray[x].CategoryAmount + ")' value='" + amountArray[x].Amount + "' color='" + amountArray[x].Color + "' />");
        }

        sb1.append("</graph>");
        
        return sb1.toString();
    }

}
