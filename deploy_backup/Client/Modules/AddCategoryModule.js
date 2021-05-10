function AddCategoryModule(displayDiv, categoryType)
{
    var catFieldDesc = "";
    if(categoryType === "Expense") 
    { 
        catFieldDesc = "Budget"; 
    } 
    else 
    {
        catFieldDesc = "Amount";
    }

    this.drawModule = function()
    { 
        var sb = new StringBuffer();

        sb.append("<table class='fixedTable' border='0' cellpadding='0' cellspacing='0' width='760px'>");
        sb.append("<tr class='blueTableHeaderRow'>");
 
        sb.append("<td width='10px' class='blueTableTopLeftCorner'>&nbsp;</td>");        
        sb.append("<td width='140px' align='left'>Category Name</td>");
        sb.append("<td width='190px' align='left'>Description</td>");
        
        sb.append("<td width='100px' align='center'>Year " + catFieldDesc + "</td>");        
        sb.append("<td width='100px' align='center'>Month " + catFieldDesc + "</td>");
        sb.append("<td width='100px' align='center'>Week " + catFieldDesc + "</td>");
        
        sb.append("<td width='114px' class='blueTableTopRightCorner'>&nbsp;&nbsp;</td></tr>");
        sb.append("<tr align='left' valign='top' class='blueTableDataRow' id='addCategoryDataRow'>");
        sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");
        sb.append("<td><input type='text' id='" + displayDiv + "addCatName' class='defaultText' size='18' tabindex='1' /></td>");

        sb.append("<td><input type='text' id='" + displayDiv + "addCatDesc' class='defaultText' size='25' tabindex='3' /></td>");
        
        sb.append("<td align='center'><input type='text' id='" + displayDiv + "addCatYearBudget' class='defaultText' size='10' tabindex='3' /></td>");
        sb.append("<td align='center'><input type='text' id='" + displayDiv + "addCatMonthBudget' class='defaultText' size='10' tabindex='4' /></td>");
        sb.append("<td align='center'><input type='text' id='" + displayDiv + "addCatWeekBudget' class='defaultText' size='10' tabindex='5' /></td>");
                    
        sb.append("<td class='blueTableLastColumn'><input type='button' id='addCatBtn' value='Add Category' onclick='javascript:" + displayDiv + "AddCategory();void(0);' class='addButton' size='11' tabindex='6'  style='width: 110px'/></td></tr>");
        sb.append("<tr class='blueTableFooterRow'>");
        sb.append("<td colspan='4' class='blueTableBotLeftCorner'></td>");        
        
       sb.append("<td class='blueTableBotRightCorner' colspan='3'></td></tr></table>");
        
        document.getElementById(displayDiv).innerHTML = sb.toString();                
    };

    this.getCategory = function ()
    {
        var category = new Object();
        category.Name = getFieldValue(displayDiv + "addCatName");
        category.description = getFieldValue(displayDiv + "addCatDesc");

        category.yearBudget = getFieldValue(displayDiv + "addCatYearBudget");
        category.monthBudget = getFieldValue(displayDiv + "addCatMonthBudget");
        category.weekBudget = getFieldValue(displayDiv + "addCatWeekBudget");

        if (categoryType === "Expense")
        {
            category.CategoryType = "E";
        }
        else if (categoryType === "Income")
        {
            category.CategoryType = "I";
        }

        return category;
    };            
    
    //Clear out Fields 
    this.clearFields = function()
    {
        document.getElementById(displayDiv +"addCatName").value = "";
        document.getElementById(displayDiv +"addCatDesc").value = "";        
        document.getElementById(displayDiv +"addCatYearBudget").value = "";        
        document.getElementById(displayDiv +"addCatMonthBudget").value = "";        
        document.getElementById(displayDiv +"addCatWeekBudget").value = "";        
    };    
};