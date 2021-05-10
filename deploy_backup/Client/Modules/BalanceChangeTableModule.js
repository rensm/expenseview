function BalanceChangeTable(displayDivName, expCatData, incomeCatData)
{    
    this.drawModule = function()
    {        
        var sb = new StringBuffer();        
        
        //ALTER Table Headers
        sb.append("<table class='fixedTable' width='915px' cellspacing='0' border='0' cellpadding='0'>");
        sb.append("<tr class='blueTableHeaderRow'>");
        sb.append("<td width='10px' class='blueTableTopLeftCorner'>&nbsp;</td>");
        sb.append("<td width='210px' align='left'>&nbsp;</td>");

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
        sb.append("<td width='110px' align='center' class='blueTableTopRightCorner'>This Week</td></tr>");

        //Income Data
        sb.append("<tr class='blueTableOddRow'>");
        sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");
        sb.append("<td align='left'>Income</td>");
        sb.append("<td align='center'>" + getRoundedAmount(incomeCatData.getTotalUserDateAmount()) + "</td>");
        sb.append("<td align='center'>" + getRoundedAmount(incomeCatData.getTotalYearAmount()) + "</td>");
        sb.append("<td align='center'>" + getRoundedAmount(incomeCatData.getTotalPriorMonthAmount()) + "</td>");
        sb.append("<td align='center'>" + getRoundedAmount(incomeCatData.getTotalMonthAmount()) + "</td>");
        sb.append("<td align='center'>" + getRoundedAmount(incomeCatData.getTotalPriorWeekAmount()) + "</td>");
        sb.append("<td align='center' class='blueTableLastColumn'>" + getRoundedAmount(incomeCatData.getTotalWeekAmount()) + "</td>");
        sb.append("</tr>");				

        //Expense Data
        sb.append("<tr class='blueTableEvenRow'>");
        sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");                        
        sb.append("<td align='left'>Expenses</td>");
        sb.append("<td align='center'>" + getRoundedAmount(expCatData.getTotalUserDateAmount()) + "</td>");
        sb.append("<td align='center'>" + getRoundedAmount(expCatData.getTotalYearAmount()) + "</td>");
        sb.append("<td align='center'>" + getRoundedAmount(expCatData.getTotalPriorMonthAmount()) + "</td>");
        sb.append("<td align='center'>" + getRoundedAmount(expCatData.getTotalMonthAmount()) + "</td>");
        sb.append("<td align='center'>" + getRoundedAmount(expCatData.getTotalPriorWeekAmount()) + "</td>");
        sb.append("<td align='center' class='blueTableLastColumn'>" + getRoundedAmount(expCatData.getTotalWeekAmount()) + "</td>");
        sb.append("</tr>");

        var totalUserDateSavings = (incomeCatData.getTotalUserDateAmount() * 1) - (expCatData.getTotalUserDateAmount() * 1);
        var totalUserDateStyle = (totalYearSavings < (incomeCatData.getTotalUserDateBudget() - expCatData.getTotalUserDateBudget())) ? 'negativeAmount' : 'possitiveAmount';        

        var totalYearSavings = (incomeCatData.getTotalYearAmount() * 1) - (expCatData.getTotalYearAmount() * 1);        
        var totalYearStyle = (totalYearSavings < (incomeCatData.getTotalYearBudget() - expCatData.getTotalYearBudget())) ? 'negativeAmount' : 'possitiveAmount';        

        var totalPriorMonthSavings = (incomeCatData.getTotalPriorMonthAmount() * 1) - (expCatData.getTotalPriorMonthAmount() * 1);        
        var totalPriorMonthStyle = (totalPriorMonthSavings < (incomeCatData.getTotalMonthBudget() - expCatData.getTotalMonthBudget())) ? 'negativeAmount' : 'possitiveAmount';        

        var totalMonthSavings = (incomeCatData.getTotalMonthAmount() * 1) - (expCatData.getTotalMonthAmount() * 1);        
        var totalMonthStyle = (totalMonthSavings < (incomeCatData.getTotalMonthBudget() - expCatData.getTotalMonthBudget())) ? 'negativeAmount' : 'possitiveAmount';        

        var totalPriorWeekSavings = (incomeCatData.getTotalPriorWeekAmount() * 1) - (expCatData.getTotalPriorWeekAmount() * 1);        
        var totalPriorWeekStyle = (totalPriorWeekSavings < (incomeCatData.getTotalWeekBudget() - expCatData.getTotalWeekBudget())) ? 'negativeAmount' : 'possitiveAmount';        

        var totalWeekSavings = (incomeCatData.getTotalWeekAmount() * 1) - (expCatData.getTotalWeekAmount() * 1);        
        var totalWeekStyle = (totalWeekSavings < (incomeCatData.getTotalWeekBudget() - expCatData.getTotalWeekBudget())) ? 'negativeAmount' : 'possitiveAmount';        

                
        sb.append("<tr class='blueTableFooterRow'>");
        sb.append("<td class='blueTableBotLeftCorner'></td>");
        sb.append("<td align='left'><b>Balance Change</b></td>");
        sb.append("<td align='center' class='" + totalUserDateStyle + "'>" + getRoundedAmount(totalUserDateSavings) + "</td>");
        sb.append("<td align='center' class='" + totalYearStyle + "'>" + getRoundedAmount(totalYearSavings) + "</td>");
        sb.append("<td align='center' class='" + totalPriorMonthStyle + "'>" + getRoundedAmount(totalPriorMonthSavings) + "</td>");
        sb.append("<td align='center' class='" + totalMonthStyle + "'>" + getRoundedAmount(totalMonthSavings) + "</td>");
        sb.append("<td align='center' class='" + totalPriorWeekStyle + "'>" + getRoundedAmount(totalPriorWeekSavings) + "</td>");
        sb.append("<td  align='center' class='blueTableBotRightCorner " + totalWeekStyle +"'>" + getRoundedAmount(totalWeekSavings) + "</td></tr>");        
        sb.append("</table>");
        
        document.getElementById(displayDivName).innerHTML = sb.toString();
    };
}