function SearchTransModule(panelName, categoryType)
{
    this.getTransSearch = function()
    {
        var transSearch = new Object();
        transSearch.CategoryType = categoryType;
        transSearch.StartDate = document.getElementById(panelName + "searchStartDate").value;
        if (isValidFormattedDate(transSearch.StartDate))
        {
            transSearch.StartDate = getDateStringFromFormattedDateString(transSearch.StartDate);
        }

        transSearch.EndDate = document.getElementById(panelName + "searchEndDate").value;
        if (isValidFormattedDate(transSearch.EndDate))
        {
            transSearch.EndDate = getDateStringFromFormattedDateString(transSearch.EndDate);
        }


        var categoryList = document.getElementById(panelName + "searchTransCategory");
        transSearch.CategoryId = categoryList.options[categoryList.selectedIndex].value;

        var amountList = document.getElementById(panelName + "searchTransAmountList");
        transSearch.AmountOperator = amountList.options[amountList.selectedIndex].value;
        transSearch.Amount = document.getElementById(panelName + "txtSearchTransAmount").value;

        return transSearch;
    };

    this.toHTML = function(categoryArray) 
    {
        var sb = new StringBuffer();
        var srchBtnTitle;
        if (categoryType === "Expense") 
        {
            srchBtnTitle = "Get Expenses";
        }
        else if (categoryType === "Income") 
        {
            srchBtnTitle = "Get Income";
        }

        var today = new Date();
        var lastMonth = today.getFullYear() + "-" + (today.getPriorMonth() + 1) + "-" + today.getDate();
        
        

        
        //ALTER Table Headers
        sb.append("<table cellspacing='0' border='0' cellpadding='2' width='790px'>");
        sb.append("<tr class='blueTableHeaderRow'>");
        sb.append("<td width='600px' class='blueTableTopLeftCorner' colspan='2'>Parameters</td>");
        sb.append("<td width='190px' class='blueTableTopRightCorner'></td></tr>");

        sb.append("<tr style='background: #E7EFFF'>");
        sb.append("<td class='blueTableFirstColumn'>&nbsp;<b>Date Range</b></td>");
        sb.append("<td align='left'><table cellpadding='0' cellspacing='0'><tr><td>Start Date:&nbsp;</td><td><input type='text' size=9' class='defaultText' id='" + panelName + "searchStartDate' value='" + getFormattedDateString(lastMonth) + "'  /></td>");
        sb.append("<td>&nbsp;&nbsp;&nbsp;End Date:&nbsp;<input type='text' size=9' class='defaultText' id='" + panelName + "searchEndDate' value='" + getFormattedDateString() + "'/></td></tr></table></td>");
        sb.append("<td align='center' class='blueTableLastColumn' align='center'><input type='button' id='searchTransBtn' value='" + srchBtnTitle + "' onclick='javascript:" + panelName + ".searchTrans();void(0);' class='addButton' tabIndex='5'  style='width: 130px'></tr>");

        sb.append("<tr style='background: #E7EFFF'>");
        sb.append("<td align='left' class='blueTableFirstColumn'>&nbsp;<b>Category</b></td>");
        sb.append("<td align='left' class='blueTableLastColumn' colspan='2'>");

        sb.append("<select id='" + panelName + "searchTransCategory' class='defaultText' STYLE='width: 150px'>");
        sb.append("<option value='Any'>All Categories</option>");

        //Fill in Drop Down Option Values For Categories
        var numCategories = categoryArray.length;
        for (i = 0; i < numCategories; i++) {
            var category = categoryArray[i];
            sb.append("<option value='");
            sb.append(category.CategoryID);
            sb.append("'>");
            sb.append(category.Name);
            sb.append("</option>");
        }

        sb.append("</select></td></tr>");


        sb.append("<tr style='background: #E7EFFF'>");
        sb.append("<td align='left' class='blueTableFirstColumn'>&nbsp;<b>Amount</b></td>");
        sb.append("<td align='left' class='blueTableLastColumn' colspan='3'>");

        sb.append("<select id='" + panelName + "searchTransAmountList' class='defaultText' STYLE='width: 150px'>");
        sb.append("<option value='Any'>Any Amount</option>");
        sb.append("<option value='Equal'>Equal To</option>");
        sb.append("<option value='Greater'>Greater Than</option>");
        sb.append("<option value='Less'>Less Than</option>");
        sb.append("</select>&nbsp;");

        sb.append("<input type='text' id='" + panelName + "txtSearchTransAmount' class='defaultText' size='8' /></td></tr>");

        sb.append("<tr class='blueTableFooterRow'><td class='blueTableBotLeftCorner' colspan='1'></td><td class='blueTableBotRightCorner' colspan='3'></td>");
        sb.append("</tr></table>");

        return sb.toString();
    };
}