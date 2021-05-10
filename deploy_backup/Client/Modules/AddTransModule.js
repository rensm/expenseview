// JScript File
//Add either expenses or income Category by (Year, Month, etc.)
function AddTransModule(panelName, categoryType, categoryArray)
{
    var displayDiv = panelName;

    this.toHTML = function(trans) {

        if (!categoryArray) {
            return;
        }
        
        var sb = new StringBuffer();

        //ALTER Table Headers
        sb.append("<table class='fixedTable' cellspacing='0' border='0' cellpadding='0' width='730px'>");
        sb.append("<tr class='blueTableHeaderRow'>");
        sb.append("<td width='10px' class='blueTableTopLeftCorner'></td>");
        sb.append("<td width='170px' align='left'>Category</td>");
        sb.append("<td width='110px' align='left'>Date</td>");
        sb.append("<td width='100px' align='left'>Amount</td>");
        sb.append("<td width='205px' align='left'>Comment</td>");
        sb.append("<td width='125px' class='blueTableTopRightCorner'>&nbsp;</td>");
        sb.append("</tr>");

        sb.append("<tr align='left' class='blueTableDataRow'>");
        sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");
        sb.append("<td><select id='" + displayDiv + "_addTransCatList' class='defaultText' tabIndex='1' STYLE='width: 160px'>");

        //Fill in Drop Down Option Values For Categories
        var numCategories = 0;
        if (categoryArray) {
            numCategories = categoryArray.length;
        }
        for (i = 0; i < numCategories; i++) {
            var category = categoryArray[i];
            sb.append("<option value='");
            sb.append(category.CategoryID);
            sb.append("' ");
            sb.append(">");
            sb.append(category.Name);
            sb.append("</option>");

            if (category.SubCategories) {
                var numSubCategories = category.SubCategories.length;
                for (subCatIndex = 0; subCatIndex < numSubCategories; subCatIndex++) {
                    var subCategory = category.SubCategories[subCatIndex];

                    sb.append("<option value='");
                    sb.append(category.CategoryID + ":" + subCategory.SubCategoryID);
                    sb.append("' ");

                    sb.append(">&nbsp;");
                    sb.append(category.Name + " - " + subCategory.Name);
                    sb.append("</option>");
                }
            }
        }

        sb.append("</select></td>");

        sb.append("<td><input type='text' size='12' id='" + displayDiv + "_addTransDate' class='defaultText' tabIndex='2' value='" + getFormattedDateString() + "'  /></td>");
        sb.append("<td><input id='" + displayDiv + "_addTransAmount' size='10' type='text' class='defaultText' tabIndex='3' /></td>");
        sb.append("<td><input type='text' id='" + displayDiv + "_addTransComments' class='defaultText' size='30' tabIndex='4' /></td>");
        sb.append("<td class='blueTableLastColumn' align='center'>");
        sb.append("<input type='button' id='transAddBtn' value='Add " + categoryType + "' onclick='javascript:" + panelName + ".addTrans();void(0);' class='addButton' tabIndex='5' style='width: 110px'>");
        sb.append("</td></tr>");

        sb.append("<tr class='blueTableFooterRow'><td class='blueTableBotLeftCorner' colspan='3'></td><td class='blueTableBotRightCorner' colspan='3'></td>");
        sb.append("</tr></table>");

        return sb.toString();
    };

    this.getTrans = function()
    {
        var trans = new Object();
        trans.Date = getDateStringFromFormattedDateString(getFieldValue(displayDiv + "_addTransDate"));

        trans.Amount = roundAmount(getFieldValue(displayDiv + "_addTransAmount"));
        trans.DisplayAmount = trans.Amount;
        trans.Description = getFieldValue(displayDiv + "_addTransComments");

        var categoryList = document.getElementById(displayDiv + "_addTransCatList");
        if (categoryList)
        {
            var selectedIDs = categoryList.options[categoryList.selectedIndex].value.split(":");

            trans.CategoryID = selectedIDs[0];
            if (selectedIDs.length > 1)
            {
                trans.SubCategoryID = selectedIDs[1];
            }
        }

        if (categoryType === "Expense")
        {
            trans.CategoryType = "E";
        }
        else if (categoryType === "Income")
        {
            trans.CategoryType = "I";
        }

        return trans;
    };
    
    //Clear out Fields 
    this.clearFields = function()
    {
        document.getElementById(displayDiv +"_addTransAmount").value = "";
        document.getElementById(displayDiv +"_addTransComments").value = "";        
    }; 
    
    //Set focus back on Category drop-down list
    this.focus = function()
    {
        var categoryList = document.getElementById(displayDiv +"_addTransCatList");       

        if(categoryList) 
        { 
            categoryList.focus();             
        }
    };
}