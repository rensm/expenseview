function TransTableModule(panelName, transData, catData, numToDisplay, fixedHeight)
{
    var categoryArray;

    if (catData) 
    {
        categoryArray = catData.getCategories();
    }
    
    //Retrieves the Data in the row form fields for the specified transID    
    this.getCurrentRowData = function(transID)
    {
        var trans = new Object();
        trans.TransID = transID;

        trans.Amount = roundAmount(getFieldValue(panelName + transID + "EditRowAmount"));
        trans.Description = getFieldValue(panelName + transID + "EditRowComments");
        trans.Date = getDateStringFromFormattedDateString(getFieldValue(panelName + transID + "EditRowDate"));

        var categoryList = document.getElementById(panelName + transID + "EditRowCatList");
        
        var selectedIDs = categoryList.options[categoryList.selectedIndex].value.split(":");

        trans.CategoryID = selectedIDs[0];
        if(selectedIDs.length > 1)
        {
            trans.SubCategoryID = selectedIDs[1];                  
        }
                                    
        trans.CategoryName = categoryList.options[categoryList.selectedIndex].text;
        
        return trans;
    };
    

    //Redraws the table module
    this.toHTML = function(startPage) {

        if (!transData || !categoryArray) {
            return;
        }

        var tempTransArray = transData.getTransArray().slice(0);
        tempTransArray = tempTransArray.reverse();

        var numItems = tempTransArray.length;

        var numCategories = categoryArray.length;

        var sb = new StringBuffer();
        var startItem = numItems - (numToDisplay * (startPage - 1));

        //Determine the Last Item to display
        var endItem = startItem - numToDisplay;

        //If there are less items then the numToDisplay, set
        //lastIndexOnPage to 0     
        if (endItem < 1) {
            endItem = 0;
        }

        //ALTER Table Headers
        sb.append("<table id='" + panelName + "_transTable' class='fixedTable' cellspacing='0' border='0' cellpadding='0' width='720px'>");
        sb.append("<tr class='blueTableHeaderRow'>");
        sb.append("<td width='10px' class='blueTableTopLeftCorner'></td>");
        sb.append("<td width='170px' align='left'><a href='javascript:" + panelName + ".sortTransTableByColumn(\"Category\"," + startPage + ")'>Category</a></td>");
        sb.append("<td width='110px' align='left'><a href='javascript:" + panelName + ".sortTransTableByColumn(\"Date\"," + startPage + ")'>Date</a></td>");
        sb.append("<td width='100px' align='left'><a href='javascript:" + panelName + ".sortTransTableByColumn(\"Amount\"," + startPage + ")'>Amount</a></td>");
        sb.append("<td width='205px' align='left'><a href='javascript:" + panelName + ".sortTransTableByColumn(\"Description\"," + startPage + ")'>Comment</a></td>");
        sb.append("<td width='115px'></td>");
        sb.append("<td width='10px' class='blueTableTopRightCorner'></td>");
        sb.append("</tr>");

        for (var i = startItem; i > endItem; i--) {
            var style = (i % 2 === 0) ? 'blueTableEvenRow' : 'blueTableOddRow';
            var transIndex = i - 1;
            var trans = tempTransArray[transIndex];

            sb.append("<tr align='left' id='" + panelName + "_transTable_" + transIndex + "' class='" + style + "'>");
            sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");

            if (trans.Selected) {
                sb.append("<td><select STYLE='width: 160px' id='");
                sb.append(panelName + trans.TransID + "EditRowCatList");
                sb.append("' class='defaultText' tabIndex='0'>");

                var selectedCategory;
                for (var j = 0; j < numCategories; j++) {
                    //Fill in Drop Down Option Values in HTML FORM
                    var category = categoryArray[j];

                    sb.append("<option value='");
                    sb.append(category.CategoryID + "'");

                    if ((category.CategoryID == trans.CategoryID) && !trans.SubCategoryID) {
                        sb.append(" selected ");
                        selectedCategory = category;
                    }

                    sb.append(">");
                    sb.append(catData.getCategoryName(category.CategoryID));
                    sb.append("</option>");

                    if (category.SubCategories) {
                        var numSubCategories = category.SubCategories.length;
                        for (subCatIndex = 0; subCatIndex < numSubCategories; subCatIndex++) {
                            var subCategory = category.SubCategories[subCatIndex];

                            sb.append("<option value='");
                            sb.append(category.CategoryID + ":" + subCategory.SubCategoryID);
                            sb.append("' ");

                            if ((category.CategoryID == trans.CategoryID) && (subCategory.SubCategoryID == trans.SubCategoryID)) {
                                sb.append(" selected ");
                            }

                            sb.append(">&nbsp;");
                            sb.append(category.Name + " - " + subCategory.Name);
                            sb.append("</option>");
                        }
                    }
                }

                sb.append("</select></td>");

                sb.append("<td><input type='text' size='9' id='" + panelName + trans.TransID + "EditRowDate' class='defaultText' tabindex='2' value='" + getFormattedDateString(trans.Date) + "' /></td>");
                sb.append("<td><input id='" + panelName + trans.TransID + "EditRowAmount' class='defaultText' size='10' value='" + getRoundedAmount(trans.Amount) + "' /></td>");
                sb.append("<td><input id='" + panelName + trans.TransID + "EditRowComments' class='defaultText' size='30' value='" + trans.Description + "' /></td>");
                sb.append("<td align='right'><a href='javascript:" + panelName + ".updateTrans(" + trans.TransID + "," + startPage + ");void(0);'>Update</a>&nbsp;<a href='javascript:" + panelName + ".toggleTransSelect(" + trans.TransID + "," + startPage + ");void(0);'>Cancel</a></td>");
            }
            else {
                var transCategoryName = catData.getCategoryName(trans.CategoryID);
                if (trans.SubCategoryID) {
                    transCategoryName = transCategoryName + " - " + catData.getSubCategoryName(trans.SubCategoryID);
                }

                sb.append("<td align='left'>" + transCategoryName + "</td>");
                sb.append("<td align='left'>" + getFormattedDateString(trans.Date) + "</td>");
                sb.append("<td align='left'>" + getRoundedAmount(trans.Amount) + "</td>");
                sb.append("<td align='left'>" + trans.Description + "</td>");

                if (trans.State == "" || trans.State === "Current") {
                    sb.append("<td align='right'><a href='javascript:" + panelName + ".deleteTrans(" + trans.TransID + "," + startPage + ");void(0);'>");
                    sb.append("<img src='images/delete.gif' alt='Delete' border='0' /></a>");
                    sb.append("<a href='javascript:" + panelName + ".toggleTransSelect(" + trans.TransID + "," + startPage + ");void(0);'>");
                    sb.append("<img src='images/table_edit.gif' alt='Edit' border='0' /></a></td>");
                }
                else if (trans.State === "Adding" || trans.State === "Updating" || trans.State === "Deleting") {
                    sb.append("<td align='right'>");
                    sb.append("<img src='images/loading.gif' alt='loading' border='0' />...");
                    sb.append(trans.State + "</td>");
                }
                else if (trans.State === "AddFailed") {
                    sb.append("<td align='right'>");
                    sb.append("<a href='javascript:" + panelName + ".retryAddTrans(" + trans.TransID + "," + startPage + ");void(0);'>");
                    sb.append("<img src='images/error.gif' alt='loading' border='0' /> Retry Add</a></td>");
                }
                else if (trans.State === "UpdateFailed") {
                    sb.append("<td align='right'>");
                    sb.append("<a href='javascript:" + panelName + ".retryUpdateTrans(" + trans.TransID + "," + startPage + ");void(0);'>");
                    sb.append("<img src='images/error.gif' alt='loading' border='0' /> Retry Update</a></td>");
                }
                else if (trans.State === "DeleteFailed") {
                    sb.append("<td align='right'>");
                    sb.append("<a href='javascript:" + panelName + ".deleteTrans(" + trans.TransID + "," + startPage + ");void(0);'>");
                    sb.append("<img src='images/error.gif' alt='loading' border='0' /> Retry Delete</a></td>");
                }
            }

            sb.append("<td class='blueTableLastColumn'>&nbsp;</td></tr>");
        }

        //If Specified Add Filler Rows to Ensure consistent Table size
        if (fixedHeight) {
            for (i = startItem - endItem; i < numToDisplay; i++) {
                sb.append("<tr class='blueTableEvenRow'><td  class='blueTableFirstColumn' colspan='4' style='height:16px'>&nbsp;</td><td  class='blueTableLastColumn' colspan='4'>&nbsp;</td></tr>");
            }
        }

        sb.append("<tr class='blueTableFooterRow'><td colspan='4' class='blueTableBotLeftCorner'></td><td colspan='4' align='right' class='blueTableBotRightCorner'>");

        var numPages = Math.ceil(numItems / numToDisplay);
        if (numPages > 1) {
            for (i = 1; i <= numPages; i++) {
                var pageNum;
                if (i == startPage) {
                    pageNum = "<b>" + i + "</b>";
                }
                else {
                    pageNum = i;
                }

                sb.append("<a href='javascript:" + panelName + ".drawRecentTransModule(" + i + ");void(0);'>" + pageNum + "</a>&nbsp;");
            }
        }

        sb.append("</td></tr></table>");

        return sb.toString();
    };    
}