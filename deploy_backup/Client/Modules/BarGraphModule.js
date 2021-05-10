function BarGraphModule(displayDiv, graphId, catData)
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
    
    function createAmountArray(dateRange)
    {
        var categoryArray = catData.getCategories();
        
        var numCat = categoryArray.length;        
        var amountArray = new Array();
        
        //Create AmountArray        
        for(var x=0; x<numCat; x++)
        {            
            var category = categoryArray[x];
            
            amountArray[x] = new Object();
            amountArray[x].Name = category.Name;
            amountArray[x].Amount = 0;
            amountArray[x].CategoryAmount = 0;
            amountArray[x].Color = category.Color;
            
                        
            if(dateRange == "This Year")
            {   
                if(category.yearAmount)
                {
                    amountArray[x].Amount = category.yearAmount / catData.getTotalYearAmount();
                    amountArray[x].CategoryAmount = category.yearAmount;
                }
            }
            else if(dateRange == "Last Month")
            {
                if(category.priorMonthAmount)
                {
                    amountArray[x].Amount = category.priorMonthAmount / catData.getTotalPriorMonthAmount();
                    amountArray[x].CategoryAmount = category.priorMonthAmount;
                }
            }
            else if(dateRange == "This Month")
            {
                if(category.monthAmount)
                {
                    amountArray[x].Amount = category.monthAmount / catData.getTotalMonthAmount();
                    amountArray[x].CategoryAmount = category.monthAmount;
                }            
            }
            else if(dateRange == "Last Week")
            {
                if(category.priorWeekAmount)
                {
                    amountArray[x].Amount = category.priorWeekAmount / catData.getTotalPriorWeekAmount();
                    amountArray[x].CategoryAmount = category.priorWeekAmount;
                }            
            }
            else if(dateRange == "This Week")
            {
                if(category.weekAmount)
                {
                    amountArray[x].Amount = category.weekAmount / catData.getTotalWeekAmount();
                    amountArray[x].CategoryAmount = category.weekAmount;
                }            
            }
            else if(dateRange == "Custom Date")
            {
                if(category.CustomDateAmount)
                {
                    amountArray[x].Amount = ((category.CustomDateAmount * 1) / catData.getTotalCustomDateAmount());
                    amountArray[x].CategoryAmount = category.CustomDateAmount;                       
                }                        
            }

            if(amountArray[x].Amount != 0)
            {
                amountArray[x].Amount  = roundAmount(amountArray[x].Amount * 100);
                amountArray[x].CategoryAmount = roundAmount(amountArray[x].CategoryAmount);
            }            
        }        
        
        //Sort Amount Array        
        for (var y=0; y<(numCat-1); y++)
        {
            for (var z=y+1; z<numCat; z++)
            {
                if ((amountArray[z].Amount * 1) > (amountArray[y].Amount * 1)) 
                {
                    var dummy = amountArray[y];
                    amountArray[y] = amountArray[z];
                    amountArray[z] = dummy;
                }
            }
        }
        
        return amountArray;
    }        

    this.drawEmpty = function()
    {
        document.getElementById(displayDiv).innerHTML = "";    
    };
    
    this.drawLoading = function()
    {
        document.getElementById(displayDiv).innerHTML = "loading...<img src='images/loading.gif' />";    
    };
    
    this.drawChart = function(dateRange)
    {
        var movieHeight = catData.getCategories().length * 22;
        if(movieHeight < 400) 
        { 
            movieHeight = 400;    
        }

        
        var sb = new StringBuffer();
                
        sb.append("<div style='z-index:2;'>");
        sb.append("<object id='" + graphId +"' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' width='700' height='" + movieHeight + "'>");
        sb.append("<param name='movie' value='fcp/swf/fcp-pie-chart.swf' />");
        sb.append("<param name='bgcolor' value='#ffffff' />");
        sb.append("<param name='quality' value='high' />");
        sb.append("<param name='valign' value='top' />");  
        sb.append("<param name='wmode' value='transparent' />");      
        sb.append("<param name='flashvars' value=\"xml_string=" + createGraphData(dateRange) + "\" />");
        sb.append("<embed type='application/x-shockwave-flash' src='fcp/swf/fcp-pie-chart.swf' width='700' height='" + movieHeight + "' name='" + graphId +"' bgcolor='#ffffff' quality='high' flashvars=\"xml_string=" + createGraphData(dateRange) + "\" />");
        sb.append("</object></div>");    
        
        document.getElementById(displayDiv).innerHTML = sb.toString();
    };    
}
