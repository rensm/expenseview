//ALTERs a Table displaying the Expenses by Category by (Year, Month, etc.)
function CategoryTableModule(panelName, categoryData, categoryType)
{
    //Get a shallow copy of categories
    
    var categoryArray;
    if (categoryData) 
    {
        categoryArray = categoryData.getCategories();
    }
        
    var catFieldDesc = "";
    if(categoryType === "Expense") 
    { 
        catFieldDesc = "Budget"; 
    } 
    else 
    {
        catFieldDesc = "Amount";
    }

    this.toHTML = function () {
        var numCategories = 0;

        if (categoryArray) {
            numCategories = categoryArray.length;
        }

        var sb = new StringBuffer();

        //ALTER Table Headers
        sb.append("<table class='fixedTable' cellspacing='0' border='0' cellpadding='0' width='940px'>");

        sb.append("<thead><tr><th width='30px'></th>");
        sb.append("<th width='160px'></th>");
        sb.append("<th width='180px'></th>");
        sb.append("<th width='140px'></th>");
        sb.append("<th width='100px'></th>");
        sb.append("<th width='100px'></th>");
        sb.append("<th width='100px'></th>");
        sb.append("<th width='100px'></th>");
        sb.append("<th width='10px'></th></tr>");

        sb.append("<tr class='blueTableHeaderRow'>");
        sb.append("<td colspan='2' width='190px' class='blueTableTopLeftCorner'>");
        sb.append("&nbsp;Category Name</td>");
        sb.append("<td width='180px' align='left'>Description</td>");

        sb.append("<td width='130px' align='center'>");
        sb.append("<a class='headerLink' href='#' onmouseout='hideTooltip();' onmouseover='showTooltip(this, \"");
        sb.append("<b>" + getFormattedDateString(ExpViewGlobalData.userStartDate));
        sb.append(" to ");
        sb.append(getFormattedDateString(ExpViewGlobalData.userEndDate) + " </b><br />Go to settings to change custom date range.");
        sb.append("\", \"270px\", \"userDateBox\")'>");
        sb.append("Custom Date " + catFieldDesc + "</a></td>");

        sb.append("<td width='100px' align='center'>Year " + catFieldDesc + "</td>");
        sb.append("<td width='100px' align='center'>Month " + catFieldDesc + "</td>");
        sb.append("<td width='100px' align='center'>Week " + catFieldDesc + "</td>");

        sb.append("<td width='100px'>&nbsp;</td>");
        sb.append("<td width='10px' class='blueTableTopRightCorner'>&nbsp;</td></tr>");

        sb.append("<tr align='left' valign='top' class='blueCategoryTableDataRow' id='addCategoryDataRow'>");
        sb.append("<td class='blueTableFirstColumn' colspan='2'>&nbsp;");
        sb.append("<input type='text' id='" + panelName + "addCatName' class='defaultText' size='18' tabindex='1' />");

        //var colorValue = "#" + getRandomColor();
        var colorValue = "";
        sb.append("&nbsp;<input type='color' class='colorPicker' id='" + panelName + "addCatColor' value='" + colorValue + "' data-text='hidden' style='height:10px;width:10px;' /></td>");

        sb.append("<td><input type='text' id='" + panelName + "addCatDesc' class='defaultText' size='25' tabindex='2' /></td>");

        sb.append("<td align='center'><input type='text' id='" + panelName + "addCatUserDateBudget' class='defaultText' size='10' tabindex='3' /></td>");
        sb.append("<td align='center'><input type='text' id='" + panelName + "addCatYearBudget' class='defaultText' size='10' tabindex='4' /></td>");
        sb.append("<td align='center'><input type='text' id='" + panelName + "addCatMonthBudget' class='defaultText' size='10' tabindex='5' /></td>");
        sb.append("<td align='center'><input type='text' id='" + panelName + "addCatWeekBudget' class='defaultText' size='10' tabindex='6' /></td>");

        sb.append("<td class='blueTableLastColumn' colspan='2'><input type='button' id='addCatBtn' value='Add Category' onclick='javascript:" + panelName + ".addCategory();void(0);' class='addButton' size='11' tabindex='6'  style='width: 110px'/></td></tr>");

        for (var rowIndex = 0; rowIndex < numCategories; rowIndex++) {
            var style = (rowIndex % 2 === 0) ? 'blueTableEvenRow' : 'blueTableOddRow';
            var category = categoryArray[rowIndex];

            //Clear out any Null Values so they are not displayed
            if (!category.MonthBudget) {
                category.MonthBudget = "";
            }
            if (!category.UserDateBudget) {
                category.UserDateBudget = "";
            }
            if (!category.YearBudget) {
                category.YearBudget = "";
            }
            if (!category.WeekBudget) {
                category.WeekBudget = "";
            }
            if (!category.Description) {
                category.Description = "";
            }

            if (category.Selected) {
                sb.append("<tr align='left' id='catTableRow");
                sb.append(i);
                sb.append("' class='" + style + "'>");
                sb.append("<td width='30' class='blueTableFirstColumn' align=\"center\" onclick=\"" + panelName + ".toggleSubCategories('" + panelName + "CatRow" + rowIndex + "','" + panelName + "ClickIcon" + rowIndex + "'," + category.CategoryID + ")\" id=\"" + panelName + "ClickIcon" + rowIndex + "\" style=\"cursor: pointer; cursor: hand;\">");
                sb.append(this.getSubCategoryToggleIcon(panelName + "ClickIcon" + rowIndex));
                sb.append("</td>");
                sb.append("<td width='140' align='left'><input type='text' id='" + panelName + "editCatName" + category.CategoryID + "' class='defaultText' size='18' value='" + escapeQuote(category.Name) + "' />");

                var editCatColorValue = "#" + category.Color;
                sb.append("&nbsp;<input type='color' class='colorPicker' id='" + panelName + "editCatColor" + category.CategoryID + "' value='" + editCatColorValue + "' data-text='hidden' style='height:10px;width:10px;' /></td>");

                sb.append("<td align='left'><input type='text' id='" + panelName + "editCatDesc" + category.CategoryID + "' class='defaultText' size='25' value='" + escapeQuote(category.Description) + "' /></td>");

                sb.append("<td align='center'><input type='text' id='" + panelName + "editCatUserDateBudget" + category.CategoryID + "' class='defaultText' size='10' value='" + padZeros(category.UserDateBudget) + "' /></td>");
                sb.append("<td align='center'><input type='text' id='" + panelName + "editCatYearBudget" + category.CategoryID + "' class='defaultText' size='10' value='" + padZeros(category.YearBudget) + "' /></td>");
                sb.append("<td align='center'><input type='text' id='" + panelName + "editCatMonthBudget" + category.CategoryID + "' class='defaultText' size='10' value='" + padZeros(category.MonthBudget) + "' /></td>");
                sb.append("<td align='center'><input type='text' id='" + panelName + "editCatWeekBudget" + category.CategoryID + "' class='defaultText' size='10' value='" + padZeros(category.WeekBudget) + "' /></td>");

                sb.append("<td align='right'><a href='javascript:" + panelName + ".updateCategory(" + category.CategoryID + ");void(0);'>Update</a>&nbsp;<a href='javascript:" + panelName + ".toggleCategoryEdit(" + category.CategoryID + ");void(0);'>Cancel</a></td>");
                sb.append("<td class='blueTableLastColumn'>&nbsp;</td></tr>");
            }
            else {
                sb.append("<tr align='left' id='catTableRow" + rowIndex + "' class='" + style + "'>");
                sb.append("<td class='blueTableFirstColumn' align=\"center\" onclick=\"" + panelName + ".toggleSubCategories('" + panelName + "CatRow" + rowIndex + "','" + panelName + "ClickIcon" + rowIndex + "'," + category.CategoryID + ")\" id=\"" + panelName + "ClickIcon" + rowIndex + "\" style=\"cursor: pointer; cursor: hand;\">");
                sb.append(this.getSubCategoryToggleIcon(panelName + "ClickIcon" + rowIndex));
                sb.append("</td>");
                sb.append("<td width='140' align='left'>" + escapeQuote(category.Name));

                var catColorValue = "#" + category.Color;
                sb.append("&nbsp;<input type='color' disabled='disabled' class='categoryColorBox' style='background-color:" + catColorValue + ";height:5px;width:7px;' /></td>");

                sb.append("<td align='left'>" + escapeQuote(category.Description) + "</td>");
                sb.append("<td align='center'>" + padZeros(category.UserDateBudget) + "</td>");
                sb.append("<td align='center'>" + padZeros(category.YearBudget) + "</td>");
                sb.append("<td align='center'>" + padZeros(category.MonthBudget) + "</td>");
                sb.append("<td align='center'>" + padZeros(category.WeekBudget) + "</td>");

                if (!category.State || category.State === "Current") {
                    sb.append("<td align='right'><a href='javascript:" + panelName + ".deleteCategory(" + category.CategoryID + ");void(0);'>");
                    sb.append("<img src='images/delete.gif' alt='Delete Category' border='0' /></a>");
                    sb.append("<a href='javascript:" + panelName + ".toggleCategoryEdit(" + category.CategoryID + ");void(0);'>");
                    sb.append("<img src='images/table_edit.gif' alt='Edit Category' border='0' /></a></td>");
                }
                else if (category.State === "Adding" || category.State === "Updating" || category.State === "Deleting") {
                    sb.append("<td align='right'>");
                    sb.append("<img src='images/loading.gif' alt='loading' border='0' />...");
                    sb.append(category.State + "</td>");
                }
                else if (category.State === "AddFailed") {
                    sb.append("<td align='right'>");
                    sb.append("<a href='javascript:" + panelName + ".retryAddCategory(" + category.CategoryID + ");void(0);'>");
                    sb.append("<img src='images/error.gif' alt='loading' border='0' /> Retry Add</a></td>");
                }
                else if (category.State === "UpdateFailed") {
                    sb.append("<td align='right'>");
                    sb.append("<a href='javascript:" + panelName + ".updateCategory(" + category.CategoryID + ");void(0);'>");
                    sb.append("<img src='images/error.gif' alt='loading' border='0' /> Retry Update</a></td>");
                }
                else if (category.State === "DeleteFailed") {
                    sb.append("<td align='right'>");
                    sb.append("<a href='javascript:" + panelName + ".deleteCategory(" + category.CategoryID + ");void(0);'>");
                    sb.append("<img src='images/error.gif' alt='loading' border='0' /> Retry Delete</a></td>");
                }


                sb.append("<td class='blueTableLastColumn'>&nbsp;</td></tr>");
            }

            if (category.SubCatTableOpen) {
                sb.append("<tbody align='left' valign='middle' id=\"" + panelName + "CatRow" + rowIndex + "\">");
            }
            else {
                sb.append("<tbody align='left' valign='middle' id=\"" + panelName + "CatRow" + rowIndex + "\" style=\"display:none\">");
            }

            sb.append("<tr class='" + style + "'><td class='blueTableFirstColumn'>&nbsp;&nbsp;</td>");
            sb.append("<td align='left'>&nbsp;&nbsp;<input type='text' id='" + panelName + "addSubCatName" + category.CategoryID + "' class='defaultText' size='15' />");

            //var addSubCatColorValue = "#" + getRandomColor();
            var addSubCatColorValue = "";
            sb.append("&nbsp;<input type='color' class='colorPicker' id='" + panelName + "addSubCatColor" + category.CategoryID + "' value='" + addSubCatColorValue + "' data-text='hidden' style='height:10px;width:10px;' /></td>");


            sb.append("<td align='left' colspan='6'>&nbsp;<input type='button' id='addSubCatBtn' value='Add SubCategory' onclick='javascript:" + panelName + ".addSubCategory(" + category.CategoryID + ");void(0);' class='addButton' size='9' tabindex='6'  style='width: 135px'/></td>");
            sb.append("<td align='center' class='blueTableLastColumn'>&nbsp;</td></tr>");

            if (category.SubCategories) {
                var numSubCategories = category.SubCategories.length;

                for (var j = 0; j < numSubCategories; j++) {
                    var subCategory = category.SubCategories[j];
                    sb.append("<tr class='" + style + "'><td class='blueTableFirstColumn'>&nbsp;&nbsp;</td>");

                    if (!subCategory.Selected) {
                        sb.append("<td align='left'>&nbsp;&nbsp;" + subCategory.Name);

                        var subCatColorValue = "#" + subCategory.Color;
                        sb.append("&nbsp;<input type='color' disabled='disabled' class='categoryColorBox' style='background-color:" + subCatColorValue + ";height:5px;width:7px;' /></td>");

                        if (!subCategory.State || subCategory.State === "Current") {
                            sb.append("<td align='left' colspan='6'><a href='javascript:" + panelName + ".deleteSubCategory(" + subCategory.SubCategoryID + ");void(0);'>");
                            sb.append("<img src='images/delete.gif' alt='Delete SubCategory' border='0' /></a>");
                            sb.append("<a href='javascript:" + panelName + ".toggleSubCategoryEdit(" + subCategory.SubCategoryID + ");void(0);'>");
                            sb.append("<img src='images/table_edit.gif' alt='Edit SubCategory' border='0' /></a></td>");
                        }
                        else if (subCategory.State === "Adding" || subCategory.State === "Updating" || subCategory.State === "Deleting") {
                            sb.append("<td align='left' colspan='6'>");
                            sb.append("<img src='images/loading.gif' alt='loading' border='0' />...");
                            sb.append(subCategory.State + "</td>");
                        }
                        else if (subCategory.State === "AddFailed") {
                            sb.append("<td align='left' colspan='6'>");
                            sb.append("<a href='javascript:" + panelName + ".retryAddSubCategory(" + subCategory.SubCategoryID + ");void(0);'>");
                            sb.append("<img src='images/error.gif' alt='loading' border='0' /> Retry Add</a></td>");
                        }
                        else if (subCategory.State === "UpdateFailed") {
                            sb.append("<td align='left' colspan='6'>");
                            sb.append("<a href='javascript:" + panelName + ".retryUpdateSubCategory(" + subCategory.SubCategoryID + ");void(0);'>");
                            sb.append("<img src='images/error.gif' alt='loading' border='0' /> Retry Update</a></td>");
                        }
                        else if (subCategory.State === "DeleteFailed") {
                            sb.append("<td align='left' colspan='6'>");
                            sb.append("<a href='javascript:" + panelName + ".deleteSubCategory(" + subCategory.SubCategoryID + ");void(0);'>");
                            sb.append("<img src='images/error.gif' alt='loading' border='0' /> Retry Delete</a></td>");
                        }
                    }
                    else {
                        sb.append("<td align='left'>&nbsp;&nbsp;<input type='text' id='" + panelName + "editSubCatName" + subCategory.SubCategoryID + "' class='defaultText' size='15' value='" + escapeQuote(subCategory.Name) + "' />");

                        var editSubCatColorValue = "#" + subCategory.Color;
                        sb.append("&nbsp;<input type='color' class='colorPicker' id='" + panelName + "editSubCatColor" + subCategory.SubCategoryID + "' value='" + editSubCatColorValue + "' data-text='hidden' style='height:10px;width:10px;' /></td>");

                        sb.append("<td align='left' colspan='6'><a href='javascript:" + panelName + ".updateSubCategory(" + subCategory.SubCategoryID + ");void(0);'>Update</a>&nbsp;<a href='javascript:" + panelName + ".toggleSubCategoryEdit(" + subCategory.SubCategoryID + ");void(0);'>Cancel</a></td>");
                    }

                    sb.append("<td align='center' class='blueTableLastColumn'>&nbsp;</td></tr>");
                }
            }

            sb.append("</tbody>");
        }

        sb.append("<tr class='blueTableFooterRow'><td class='blueTableBotLeftCorner'></td>");

        sb.append("<td>Total</td><td>&nbsp;</td>");
        if (categoryData) {
            sb.append("<td align='center'>" + categoryData.getTotalUserDateBudget() + "</td>");
            sb.append("<td align='center'>" + categoryData.getTotalYearBudget() + "</td>");
            sb.append("<td align='center'>" + categoryData.getTotalMonthBudget() + "</td>");
            sb.append("<td align='center'>" + categoryData.getTotalWeekBudget() + "</td>");
        }
        else {
            sb.append("<td align='center'>0</td>");
            sb.append("<td align='center'>0</td>");
            sb.append("<td align='center'>0</td>");
            sb.append("<td align='center'>0</td>");
        }

        sb.append("<td class='blueTableBotRightCorner' colspan='2'></td>");
        sb.append("</tr></table>");

        return sb.toString();

        //document.getElementById(panelName).innerHTML = sb.toString();
    };

    this.getRow = function(rowIndex)
    {
        return categoryArray[rowIndex];
    };

    this.getModifiedRow = function (categoryID)
    {
        var category = new Object();
        category.CategoryID = categoryID;
        category.Name = document.getElementById(panelName + "editCatName" + categoryID).value;

        category.Color = getFieldValue(panelName + "editCatColor" + categoryID).substring(1);

        category.Description = document.getElementById(panelName + "editCatDesc" + categoryID).value;

        category.UserDateBudget = document.getElementById(panelName + "editCatUserDateBudget" + categoryID).value;
        category.YearBudget = document.getElementById(panelName + "editCatYearBudget" + categoryID).value;
        category.MonthBudget = document.getElementById(panelName + "editCatMonthBudget" + categoryID).value;
        category.WeekBudget = document.getElementById(panelName + "editCatWeekBudget" + categoryID).value;

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
    
    
    this.getAddingCategory = function()
    {
        var category = new Object();
        category.Name = getFieldValue(panelName+"addCatName");
        category.Color = getFieldValue(panelName + "addCatColor").substring(1);

        category.Description = getFieldValue(panelName+"addCatDesc");

        category.UserDateBudget = getFieldValue(panelName + "addCatUserDateBudget");               
        category.YearBudget = getFieldValue(panelName+"addCatYearBudget");               
        category.MonthBudget = getFieldValue(panelName+"addCatMonthBudget");
        category.WeekBudget = getFieldValue(panelName+"addCatWeekBudget");
        
        if(categoryType === "Expense")
        {                        
            category.CategoryType = "E";                                     
        }
        else if(categoryType === "Income")
        {
            category.CategoryType = "I";
        }          
                
        return category;  
    };            
    
    this.getSubCategoryToggleIcon = function(clickIcon)
    {
        var icon = document.getElementById(clickIcon);
        if(icon)
        {
            return icon.innerHTML;
        }
        else
        {
            return "<img src='images/show.png' />";
        }
    }
            
    this.toggleSubCategories = function(tbodyID,clickIcon,categoryID) 
    {
        var category = categoryData.getCategoryByCategoryID(categoryID);        
        
        if (document.getElementById(clickIcon).innerHTML.match("images/show.png"))
        {
            category.SubCatTableOpen = true;
            document.getElementById(clickIcon).innerHTML = "<img src='images/hide.png' />";
            document.getElementById(tbodyID).style.display = "";            
        } 
        else 
        {
            category.SubCatTableOpen = false;
            document.getElementById(tbodyID).style.display = "none";
            document.getElementById(clickIcon).innerHTML = "<img src='images/show.png' />";
        }
    };
    
    this.getModifiedSubCategory = function(subCategoryID)
    {
        var subCategory = categoryData.getSubCategory(subCategoryID);
        subCategory.Name = getFieldValue(panelName + "editSubCatName" + subCategoryID);
        subCategory.Color = getFieldValue(panelName + "editSubCatColor" + subCategoryID).substring(1);

        return subCategory;         
    };    
    
    this.getAddingSubCategory = function(categoryID)
    {
        var subCategory = new Object();
        subCategory.CategoryID = categoryID;
        subCategory.Name = getFieldValue(panelName+"addSubCatName" + categoryID);
        subCategory.Color = getFieldValue(panelName + "addSubCatColor" + categoryID).substring(1);

        return subCategory;         
    };        
};