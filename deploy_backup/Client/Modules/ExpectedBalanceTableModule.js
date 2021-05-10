/******************************* Expected Savings ****************************/

function ExpectedBalanceTableModule(displayDivName, expCatData, incomeCatData)
{    
    this.drawModule = function()
    {        
        var sb = new StringBuffer();        
        
        //ALTER Table Headers
        sb.append("<table class='fixedTable' width='695px' cellspacing='0' border='0' cellpadding='0'>");
        sb.append("<tr class='blueTableHeaderRow'>");
        sb.append("<td width='10px' class='blueTableTopLeftCorner'>&nbsp;</td>");            
        sb.append("<td width='215px' align='left'>&nbsp;&nbsp;</td>");
        sb.append("<td width='125px' align='center'>");
        sb.append("<a class='headerLink' href='#' onmouseout='hideTooltip();' onmouseover='showTooltip(this, \"");
        sb.append("<b>" + getFormattedDateString(ExpViewGlobalData.userStartDate));
        sb.append(" to ");
        sb.append(getFormattedDateString(ExpViewGlobalData.userEndDate) + " </b><br />Edit settings to change custom date range.");
        sb.append("\", \"270px\", \"userDateBox\")'>");
        sb.append(getFormattedDateString(ExpViewGlobalData.userStartDate));
        sb.append("...</a></td>");

        sb.append("<td width='115px' align='center'>Year</td>");
        sb.append("<td width='115px' align='center'>Month</td>");
        sb.append("<td width='115px' align='center' class='blueTableTopRightCorner'>Week</td></tr>");

        //Income Data
        sb.append("<tr class='blueTableOddRow'>");
        sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");                        
        sb.append("<td align='left'>Expected Income</td>");
        sb.append("<td align='center'>" + incomeCatData.getTotalUserDateBudget() + "</td>");
        sb.append("<td align='center'>" + incomeCatData.getTotalYearBudget() + "</td>");
        sb.append("<td align='center'>" + incomeCatData.getTotalMonthBudget() + "</td>");
        sb.append("<td align='center' class='blueTableLastColumn'>" + incomeCatData.getTotalWeekBudget() + "</td></tr>");

        //Expense Data
        sb.append("<tr class='blueTableEvenRow'>");
        sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");
        sb.append("<td align='left'>Budgeted Expense Amount</td>");
        sb.append("<td align='center'>" + expCatData.getTotalUserDateBudget() + "</d>");
        sb.append("<td align='center'>" + expCatData.getTotalYearBudget() + "</d>");
        sb.append("<td align='center'>" + expCatData.getTotalMonthBudget() + "</td>");
        sb.append("<td align='center' class='blueTableLastColumn'>" + expCatData.getTotalWeekBudget() + "</td></tr>");

        //Expected Savings
        sb.append("<tr class='blueTableFooterRow'>");
        sb.append("<td class='blueTableBotLeftCorner'></td>");
        sb.append("<td align='left'><b>Expected Balance Change</b></td>");
        sb.append("<td align='center'>" + roundAmount(incomeCatData.getTotalUserDateBudget() - expCatData.getTotalUserDateBudget()) + "</td>");
        sb.append("<td align='center'>" + roundAmount(incomeCatData.getTotalYearBudget() - expCatData.getTotalYearBudget()) + "</td>");
        sb.append("<td align='center'>" + roundAmount(incomeCatData.getTotalMonthBudget() - expCatData.getTotalMonthBudget()) + "</td>");
        sb.append("<td align='center' class='blueTableBotRightCorner'>" + roundAmount(incomeCatData.getTotalWeekBudget() - expCatData.getTotalWeekBudget()) + "</td></tr>");
        
        document.getElementById(displayDivName).innerHTML = sb.toString();
    };
}