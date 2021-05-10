function TransSummaryTableModule(panelName, catData, catType)
{
    var categoryArray;

    if (catData) 
    {
        categoryArray = catData.getCategories();
    }
        
    function getRoundedAmount(amount)
    {
        if(!amount || amount === "")
        {
            return "0";
        }
        else
        {
            return roundAmount(amount);
        }
    }

    this.toHTML = function ()
    {

        if (!catData)
        {
            return;
        }

        var sb = new StringBuffer();

        var numCategories;
        if (categoryArray)
        {
            numCategories = categoryArray.length;
        }
        else
        {
            numCategories = 0;
            return;
        }

        //ALTER Table Headers
        sb.append("<table class='fixedTable' width='935px' cellspacing='0' border='0' cellpadding='0'>");
        sb.append("<tr class='blueTableHeaderRow'>");
        sb.append("<td width='25px' class='blueTableTopLeftCorner'>&nbsp;</td>");
        sb.append("<td width='210px' align='left'>Category</td>");
        sb.append("<td width='125px' align='center'>");
        sb.append("<a class='headerLink' href='#' onmouseout='hideTooltip();' onmouseover='showTooltip(this, \"");
        sb.append("<b>" + getFormattedDateString(ExpViewGlobalData.userStartDate));
        sb.append(" to ");
        sb.append(getFormattedDateString(ExpViewGlobalData.userEndDate) + " </b><br />Edit settings to change custom date range.");
        sb.append("\", \"270px\", \"userDateBox\")'>");
        sb.append(getFormattedDateString(ExpViewGlobalData.userStartDate));
        sb.append("...</a></td>");
        sb.append("<td width='115px' align='center'>This Year</td>");
        sb.append("<td width='115px' align='center'>Last Month</td>");
        sb.append("<td width='115px' align='center'>This Month</td>");
        sb.append("<td width='115px' align='center'>Last Week</td>");
        sb.append("<td width='115px' align='center' class='blueTableTopRightCorner' >This Week</td></tr>");

        var textColorClass = '';
        if (catType == 'Expense')
        {
            textColorClass = 'overBudgetColumn'; 
        }
        else if(catType == 'Income')
        {
            textColorClass = 'overAmountColumn';
        }

        for (i = 0; i < numCategories; i++)
        {
            var style = (i % 2 === 0) ? 'blueTableEvenRow' : 'blueTableOddRow';
            var category = categoryArray[i];

            var yearColumnStyle = (category.YearBudget && (category.YearAmount * 1 > category.YearBudget * 1)) ? textColorClass : 'default';
            var priorMonthColumnStyle = (category.MonthBudget && (category.PriorMonthAmount * 1 > category.MonthBudget * 1)) ? textColorClass : 'default';
            var monthColumnStyle = (category.MonthBudget && (category.MonthAmount * 1 > category.MonthBudget * 1)) ? textColorClass : 'default';
            var priorWeekColumnStyle = (category.WeekBudget && (category.PriorWeekAmount * 1 > category.WeekBudget * 1)) ? textColorClass : 'default';
            var weekColumnStyle = (category.WeekBudget && (category.WeekAmount * 1 > category.WeekBudget * 1)) ? textColorClass : 'default';
            var userDateColumnStyle = (category.UserDateBudget && (category.UserDateAmount * 1 > category.UserDateBudget * 1)) ? textColorClass : 'default';

            sb.append("<tr class='" + style + "'>");

            if (category.SubCategories && category.SubCategories.length > 0)
            {
                if (category.SubCatDisplayed)
                {
                    sb.append("<td class='blueTableFirstColumn' align=\"center\" onclick=\"" + panelName + ".toggleSubCategories('" + panelName + "Row" + i + "','" + panelName + "ClickIcon" + i + "'," + category.CategoryID + ")\" id=\"" + panelName + "ClickIcon" + i + "\" style=\"cursor: pointer; cursor: hand;\"><img src='images/hide.png' /></td>");
                }
                else
                {
                    sb.append("<td class='blueTableFirstColumn' align=\"center\" onclick=\"" + panelName + ".toggleSubCategories('" + panelName + "Row" + i + "','" + panelName + "ClickIcon" + i + "'," + category.CategoryID + ")\" id=\"" + panelName + "ClickIcon" + i + "\" style=\"cursor: pointer; cursor: hand;\"><img src='images/show.png' /></td>");
                }
            }
            else
            {
                sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");
            }

            sb.append("<td align='left'>" + category.Name + "</td>");
            sb.append("<td align='center' class='" + userDateColumnStyle + "'>" + getRoundedAmount(category.UserDateAmount) + "</td>");
            sb.append("<td align='center' class='" + yearColumnStyle + "'>" + getRoundedAmount(category.YearAmount) + "</td>");
            sb.append("<td align='center' class='" + priorMonthColumnStyle + "'>" + getRoundedAmount(category.PriorMonthAmount) + "</td>");
            sb.append("<td align='center' class='" + monthColumnStyle + "'>" + getRoundedAmount(category.MonthAmount) + "</td>");
            sb.append("<td align='center' class='" + priorWeekColumnStyle + "'>" + getRoundedAmount(category.PriorWeekAmount) + "</td>");
            sb.append("<td align='center' class='blueTableLastColumn " + weekColumnStyle + "'>" + getRoundedAmount(category.WeekAmount) + "</td>");
            sb.append("</tr>");

            if (category.SubCategories && category.SubCategories.length > 0)
            {
                var numSubCategories = category.SubCategories.length;
                if (category.SubCatDisplayed)
                {
                    sb.append("<tbody id=\"" + panelName + "Row" + i + "\">");
                }
                else
                {
                    sb.append("<tbody id=\"" + panelName + "Row" + i + "\" style=\"display:none\">");
                }

                for (var j = 0; j < numSubCategories; j++)
                {
                    var subCategory = category.SubCategories[j];
                    sb.append("<tr class='" + style + "'><td class='blueTableFirstColumn'>&nbsp;&nbsp;</td>");
                    sb.append("<td align='left'>&nbsp;&nbsp;" + subCategory.Name + "</td>");
                    sb.append("<td align='center' >" + getRoundedAmount(subCategory.UserDateAmount) + "</td>");
                    sb.append("<td align='center'>" + getRoundedAmount(subCategory.YearAmount) + "</td>");
                    sb.append("<td align='center'>" + getRoundedAmount(subCategory.PriorMonthAmount) + "</td>");
                    sb.append("<td align='center'>" + getRoundedAmount(subCategory.MonthAmount) + "</td>");
                    sb.append("<td align='center'>" + getRoundedAmount(subCategory.PriorWeekAmount) + "</td>");
                    sb.append("<td align='center' class='blueTableLastColumn'>" + getRoundedAmount(subCategory.WeekAmount) + "</td>");
                }

                sb.append("</tr></tbody>");
            }
        }

        var totalUserDateStyle = (catData.getTotalUserDateBudget() && (catData.getTotalUserDateAmount() * 1 > catData.getTotalUserDateBudget() * 1)) ? textColorClass : 'default';
        var totalYearStyle = (catData.getTotalYearBudget() && (catData.getTotalYearAmount() * 1 > catData.getTotalYearBudget() * 1)) ? textColorClass : 'default';
        var totalPriorMonthStyle = (catData.getTotalMonthBudget() && (catData.getTotalPriorMonthAmount() * 1 > catData.getTotalMonthBudget() * 1)) ? textColorClass : 'default';
        var totalMonthStyle = (catData.getTotalMonthBudget() && (catData.getTotalMonthAmount() * 1 > catData.getTotalMonthBudget() * 1)) ? textColorClass : 'default';
        var totalPriorWeekStyle = (catData.getTotalWeekBudget() && (catData.getTotalPriorWeekAmount() * 1 > catData.getTotalWeekBudget() * 1)) ? textColorClass : 'default';
        var totalWeekStyle = (catData.getTotalWeekBudget() && (catData.getTotalWeekAmount() * 1 > catData.getTotalWeekBudget() * 1)) ? textColorClass : 'default';

        sb.append("<tr class='blueTableFooterRow'>");
        sb.append("<td class='blueTableBotLeftCorner'></td>");
        sb.append("<td align='left'>Total</td>");
        sb.append("<td  align='center' class='" + totalUserDateStyle + "'>" + getRoundedAmount(catData.getTotalUserDateAmount()) + "</td>");
        sb.append("<td align='center' class='" + totalYearStyle + "'>" + getRoundedAmount(catData.getTotalYearAmount()) + "</td>");
        sb.append("<td align='center' class='" + totalPriorMonthStyle + "'>" + getRoundedAmount(catData.getTotalPriorMonthAmount()) + "</td>");
        sb.append("<td align='center' class='" + totalMonthStyle + "'>" + getRoundedAmount(catData.getTotalMonthAmount()) + "</td>");
        sb.append("<td align='center' class='" + totalPriorWeekStyle + "'>" + getRoundedAmount(catData.getTotalPriorWeekAmount()) + "</td>");
        sb.append("<td align='center' class='blueTableBotRightCorner " + totalWeekStyle + "'>" + getRoundedAmount(catData.getTotalWeekAmount()) + "</td>");
        sb.append("</tr></table>");

        return sb.toString();
    };
    
    this.toggleSubCategories = function(tbodyID,clickIcon,categoryID) 
    {
        var category = catData.getCategoryByCategoryID(categoryID);
        
        if (document.getElementById(clickIcon).innerHTML.match("images/show.png"))
        {
            category.SubCatDisplayed = true;
            document.getElementById(tbodyID).style.display = "";
            document.getElementById(clickIcon).innerHTML = "<img src='images/hide.png' />";
        } 
        else 
        {
            category.SubCatDisplayed = false;
            document.getElementById(tbodyID).style.display = "none";
            document.getElementById(clickIcon).innerHTML = "<img src='images/show.png' />";
        }
    }
}