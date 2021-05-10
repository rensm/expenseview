function EditCategoryPanel(panelName, categoryType, catTypeCatagoryData, recentTransData)
{
    var transCategoryTable;

    //Displays all the modules in the panel
    this.drawPanel = function()
    {
        //Create AddExpensePanel Modules
        transCategoryTable = new CategoryTableModule(panelName, catTypeCatagoryData, categoryType);
        document.getElementById("div_" + panelName).innerHTML = toHTML();

        //Bind colorPickers after drawing them
        $('input.colorPicker').mColorPicker();
    }
    
    function toHTML()
    {
        var sb = new StringBuffer();
        if (categoryType === "Expense")
        {
            sb.append("<span class='panelHeader'>Expense Categories</span>");
            sb.append("&nbsp;<a href='#' onmouseout='hideTooltip();' onmouseover='showTooltip(this);' tipitle=\"Expense Categories allow you to track where you're spending your money. You can also specify a Yearly, Monthly or Weekly <i>Budget</i> for each category. Specifiying a <i>Budget</i> is opitonal, but it's useful a way to limit your spending and to forecast your potential savings.  You can also set the colors used to display the categories on the graphs.\"><img src='images/information.jpg' style='border: 0px' /></a>");
        }
        else
        {
            sb.append("<span class='panelHeader'>Income Categories</span>");
            sb.append("&nbsp;<a href='#' onmouseout='hideTooltip();' onmouseover='showTooltip(this);' tipitle=\"Income Categories allow you to track the sources of your income. You can also specify a Yearly, Monthly or Weekly <i>Amount</i> for each category to represent the amount you expect to receive for that period.  Specifiying an <i>Amount</i> is opitonal, but it is useful to forecast your potential balance.  You can also set the colors used to display the categories on the graphs.\"><img src='images/information.jpg' style='border: 0px' /></a>");        
        }
        
        sb.append("<div id='" + panelName + "_CategoryTableModule'>");
        sb.append(transCategoryTable.toHTML());
        sb.append("</div>");
        
        return sb.toString();
    }

    function redrawTransCategoryTable()
    {
        document.getElementById(panelName + "_CategoryTableModule").innerHTML = transCategoryTable.toHTML();

        //Bind colorPickers after drawing them
        $('input.colorPicker').mColorPicker();
    }

    function isValidCategory(category, operation)
    {
        if(!category.Name || category.Name === "")
        {
            alert("Cannot " + operation + " Category.  Category Name was not specified");
            return false;
        }


        if (!category.Color || category.Color === "") {
            category.Color = getRandomColor();
        }

        var catFieldDesc = "";
        if(category.CategoryType === "E") 
        { 
            catFieldDesc = "Budget"; 
        } 
        else 
        {
            catFieldDesc = "Amount";
        }

        if (category.UserDateBudget && !isValidAmount(category.UserDateBudget))
        {
            alert("Cannot " + operation + " Category.  Invalid amount specified for Custom Date " + catFieldDesc);
            return false;
        }

        
        if(category.YearBudget && !isValidAmount(category.YearBudget))
        {
            alert("Cannot " + operation + " Category.  Invalid amount specified for Year" + catFieldDesc);
            return false;    
        }

        if(category.MonthBudget && !isValidAmount(category.MonthBudget))
        {
            alert("Cannot " + operation + " Category.  Invalid amount specified for Month " + catFieldDesc);
            return false;    
        }

        if(category.WeekBudget && !isValidAmount(category.WeekBudget))
        {
            alert("Cannot " + operation + " Category.  Invalid amount specified for Week  " + catFieldDesc);
            return false;    
        }
        
        return true;    
    }
    
    function isValidSubCategory(subCategory, operation)
    {
        if(!subCategory.Name || subCategory.Name === "")
        {
            alert("Cannot " + operation + " SubCategory.  SubCategory Name was not specified");
            return false;
        }

        if (!subCategory.Color || subCategory.Color === "")
        {
            subCategory.Color = getRandomColor();
        }

        
        return true;    
    }

    
    this.toggleSubCategories = function(tbodyID, clickIcon, categoryID)
    {
        transCategoryTable.toggleSubCategories(tbodyID, clickIcon, categoryID);
    }

    this.updateCategory = function (categoryID)
    {
        var modifiedCategory = transCategoryTable.getModifiedRow(categoryID);
        var existingCategory = new Object();

        //Convert "" values to null before sending to server, otherwise it will cause a 
        //processing error
        if (modifiedCategory.UserDateBudget === "") { modifiedCategory.UserDateBudget = null; }
        if (modifiedCategory.YearBudget === "") { modifiedCategory.YearBudget = null; }
        if (modifiedCategory.MonthBudget === "") { modifiedCategory.MonthBudget = null; }
        if (modifiedCategory.WeekBudget === "") { modifiedCategory.WeekBudget = null; }

        if (isValidCategory(modifiedCategory, "update"))
        {
            var category = catTypeCatagoryData.getCategoryByCategoryID(categoryID);

            //Create a copy existing category in case values need to be rolled back
            copyCategoryAttributes(existingCategory, category);

            //Update total Budgets within category data
            catTypeCatagoryData.updateCategoryTotalBudgets(category, modifiedCategory);

            //Update category attributes with modified values
            copyCategoryAttributes(category, modifiedCategory);

            //Redraw table to show that category is being updated
            category.Selected = false;
            category.State = "Updating";
            redrawTransCategoryTable();

            jsonService.UpdateCategory(modifiedCategory, function (response)
            {
                response.context = new Object();
                response.context.modifiedCategory = modifiedCategory;
                response.context.existingCategory = existingCategory;
                updateCategory_CallBack(response);
            });
        }
    };

    function updateCategory_CallBack(response)
    {
        var modifiedCategory = response.context.modifiedCategory;
        var existingCategory = response.context.existingCategory;

        var categoryID = modifiedCategory.CategoryID;
        var category = catTypeCatagoryData.getCategoryByCategoryID(categoryID);                        
                
        var resValue = response.result;
        if(resValue && resValue !== -1)
        {            
            //Redraw Category Table to show that the update succeeded
            category.State = "Current";
            redrawTransCategoryTable();
        }
        else
        {
            //Rollback changes to total budget since the update failed
            catTypeCatagoryData.updateCategoryTotalBudgets(category, existingCategory);

            //Redraw Category Table to show that the update failed
            category.State = "UpdateFailed";
            redrawTransCategoryTable();
        }
    };

    function copyCategoryAttributes(categoryToSetAttributes, categoryToCopyAttributes)
    {
        categoryToSetAttributes.Name = categoryToCopyAttributes.Name;
        categoryToSetAttributes.Color = categoryToCopyAttributes.Color;
        categoryToSetAttributes.Description = categoryToCopyAttributes.Description;
        categoryToSetAttributes.UserDateBudget = categoryToCopyAttributes.UserDateBudget;
        categoryToSetAttributes.YearBudget = categoryToCopyAttributes.YearBudget;
        categoryToSetAttributes.MonthBudget = categoryToCopyAttributes.MonthBudget;
        categoryToSetAttributes.WeekBudget = categoryToCopyAttributes.WeekBudget;
    }
        
    this.toggleCategoryEdit = function(categoryID)
    {
        var category = catTypeCatagoryData.getCategoryByCategoryID(categoryID);

        if(category.Selected)
        {
            category.Selected = false;            
        }
        else
        {
            category.Selected = true;    
        }

        redrawTransCategoryTable();
    }
    
    this.toggleSubCategoryEdit = function(subCategoryID)
    {
        var subCategory = catTypeCatagoryData.getSubCategory(subCategoryID);
        
        if(subCategory.Selected)
        {
            subCategory.Selected = false;            
        }
        else
        {
            subCategory.Selected = true;    
        }

        redrawTransCategoryTable();
    }

    this.addCategory = function() {
        var category = transCategoryTable.getAddingCategory();

        //Insert New Category onto database
        if (isValidCategory(category, "add")) {
            category.CategoryID = createGuid();
            category.State = "Adding";

            if (!catTypeCatagoryData) {
                var categories = new Array();
                categories[0] = category;
                catTypeCatagoryData = new CategoryData(categories);
            }
            else {

                catTypeCatagoryData.addCategory(category);
            }
            
            //Redraw Category Table to display category being added
            redrawTransCategoryTable();

            //Create tempCategory object to pass to backend
            //Can't pass category object directly because it contains
            //a generated guid for CategoryID 
            var tempCategory = new Object();
            tempCategory.Name = category.Name;
            tempCategory.Color = category.Color;
            tempCategory.CategoryType = category.CategoryType;
            tempCategory.Description = category.Description;
            tempCategory.YearBudget = category.YearBudget;
            tempCategory.MonthBudget = category.MonthBudget;
            tempCategory.WeekBudget = category.WeekBudget;

            //Convert "" values to null to prevent any processing errors
            if (tempCategory.YearBudget == "") { tempCategory.YearBudget = null; }
            if (tempCategory.MonthBudget == "") { tempCategory.MonthBudget = null; }
            if (tempCategory.WeekBudget == "") { tempCategory.WeekBudget = null; }

            //Set CategoryID to null to avoid parsing error on server
            tempCategory.CategoryID = null;

            jsonService.InsertCategory(tempCategory, function(response) {
                response.context = new Object();
                response.context.guidCategoryID = category.CategoryID;
                addCategory_CallBack(response);
            })
        }
    };

    this.retryAddCategory = function(categoryID)
    {
        var category = catTypeCatagoryData.getCategoryByCategoryID(categoryID);
        category.State = "Adding";
        
        //Redraw Category Table to display category being added
        redrawTransCategoryTable();

        //Create tempCategory object to pass to backend
        //Can't pass category object directly because it contains
        //a generated guid for CategoryID 
        var tempCategory = new Object();
        tempCategory.Name = category.Name;
        tempCategory.Color = category.Color;
        tempCategory.CategoryType = category.CategoryType;
        tempCategory.Description = category.Description;
        tempCategory.YearBudget = category.YearBudget;
        tempCategory.MonthBudget = category.MonthBudget;
        tempCategory.WeekBudget = category.WeekBudget;

        //Convert "" values to null to prevent any processing errors
        if (tempCategory.YearBudget == "") { tempCategory.YearBudget = null; }
        if (tempCategory.MonthBudget == "") { tempCategory.MonthBudget = null; }
        if (tempCategory.WeekBudget == "") { tempCategory.WeekBudget = null; }

        //Set CategoryID to null to avoid parsing error on server
        tempCategory.CategoryID = null;

        jsonService.InsertCategory(tempCategory, function(response)
        {
            response.context = new Object();
            response.context.guidCategoryID = category.CategoryID;
            addCategory_CallBack(response);
        })
    };
        
    function addCategory_CallBack(response)
    {
        if(response.result && response.result != -1)
        {
            var category = catTypeCatagoryData.getCategoryByCategoryID(response.context.guidCategoryID);
            category.State = "Current";
            catTypeCatagoryData.changeCategoryID(response.context.guidCategoryID, response.result);

            //Redraw Category Table to show that the insert succeeded
            redrawTransCategoryTable();
        }
        else
        {
            //Redraw Category Table to show that the update succeeded
            var category = catTypeCatagoryData.getCategoryByCategoryID(response.context.guidCategoryID);

            category.State = "AddFailed";
            redrawTransCategoryTable();
        }        
    };

    this.deleteCategory = function(categoryID) {
        if (catTypeCatagoryData.getNumCategories() == 1) {
            alert("Cannot delete Category. At least on category is required to use the application");
            return;
        }

        var category = catTypeCatagoryData.getCategoryByCategoryID(categoryID);

        var catTypeDesc;

        if (confirm("Are you sure you want to delete the " + category.Name + " category? \nDeleting this category will also delete ALL " + categoryType + " records for this category!")) {
            category.State = "Deleting";
            redrawTransCategoryTable();

            //Convert "" values to null before sending to server, otherwise it will cause a 
            //processing error
            if (category.YearBudget === "") { category.YearBudget = null; }
            if (category.MonthBudget === "") { category.MonthBudget = null; }
            if (category.WeekBudget === "") { category.WeekBudget = null; }

            jsonService.DeleteCategory(category.CategoryID, function(response) {
                response.context = new Object();
                response.context.deletingCategory = category;
                deleteCategory_CallBack(response);
            });
        }
    };
    
    function deleteCategory_CallBack(response)
    {
        if(response.result && response.result != -1)
        {            
            var deletedCatID = response.context.deletingCategory.CategoryID;
            catTypeCatagoryData.deleteCategory(deletedCatID);

            redrawTransCategoryTable();
            
            if(recentTransData)
            {
                recentTransData.deleteAllTransInCategory(deletedCatID);
            }            
        }
        else
        {
            //Redraw Category Table to show that the update succeeded
            response.context.deletingCategory.Selected = false;            
            response.context.deletingCategory.State = "DeleteFailed";
            redrawTransCategoryTable();
        }      
    }
    
    this.updateSubCategory = function(subCategoryID)
    {
        var modifiedSubCategory = transCategoryTable.getModifiedSubCategory(subCategoryID);
                
        if(isValidSubCategory(modifiedSubCategory, "update"))
        {
            modifiedSubCategory.State = "Updating";
            redrawTransCategoryTable();
            
            jsonService.UpdateSubCategory(modifiedSubCategory, function(response) { 
                response.context = new Object();
                response.context.subCategoryID = modifiedSubCategory.SubCategoryID;            
                updateSubCategory_CallBack(response);
            });
        }                           
    };
    
    
    function updateSubCategory_CallBack(response)
    {
        var modifiedSubCategory = catTypeCatagoryData.getSubCategory(response.context.subCategoryID);
                
        var resValue = response.result;
        if(resValue && resValue !== -1)
        {
            //Redraw Category Table to show that the update succeeded
            modifiedSubCategory.Selected = false;
            modifiedSubCategory.State = "Current";
            redrawTransCategoryTable();
        }
        else
        {
            //Redraw Category Table to show that the update failed
            modifiedSubCategory.Selected = false;            
            modifiedSubCategory.State = "UpdateFailed";
            redrawTransCategoryTable();
        }
    };

    this.addSubCategory = function(categoryID)
    {
        var addingSubCategory = transCategoryTable.getAddingSubCategory(categoryID);
                        
        if(isValidSubCategory(addingSubCategory, "add"))
        {
            addingSubCategory.State = "Adding";

            //set temp SubCategoryID
            addingSubCategory.SubCategoryID = createGuid();            
            
            //add subCategory to catData
            catTypeCatagoryData.addSubCategory(categoryID, addingSubCategory);

            redrawTransCategoryTable();

            //Create a SubCategory object without the temp SubCategoryID to pass 
            //to the backend
            var newSubCategory = new Object();
            newSubCategory.SubCategoryID = null;
            newSubCategory.CategoryID = addingSubCategory.CategoryID;
            newSubCategory.Name = addingSubCategory.Name;
            newSubCategory.Color = addingSubCategory.Color;
            
            jsonService.InsertSubCategory(newSubCategory, function(response) { 
                response.context = new Object();
                response.context.tempSubCategoryID = addingSubCategory.SubCategoryID;            
                addSubCategory_CallBack(response);
            });
        }                           
    };    
    
    function addSubCategory_CallBack(response)
    {
        //Get SubCategory with the tempSubCategoryID
        var addedSubCategory = catTypeCatagoryData.getSubCategory(response.context.tempSubCategoryID);
                
        var resValue = response.result;
        if(resValue && resValue !== -1)
        {
            //Update the SubCategory with the ID generated from the backend
            catTypeCatagoryData.changeSubCategoryID(response.context.tempSubCategoryID, resValue);
            
            //Redraw Category Table to show that the add succeeded
            addedSubCategory.Selected = false;
            addedSubCategory.State = "Current";
            redrawTransCategoryTable();
        }
        else
        {
            //Redraw Category Table to show that the add failed
            addedSubCategory.Selected = false;            
            addedSubCategory.State = "AddFailed";
            redrawTransCategoryTable();
        }
    };
      
      
    this.deleteSubCategory = function(subCategoryID) 
    {
        var subCategory = catTypeCatagoryData.getSubCategory(subCategoryID);
                
        if (confirm("Are you sure you want to delete the " + subCategory.Name +" sub-category? \nDeleting this category will also delete ALL " + categoryType + " records for this sub-category!")) 
        {   
            subCategory.State = "Deleting";
            redrawTransCategoryTable();
                                             
            jsonService.DeleteSubCategory(subCategoryID, function(response) { 
                response.context = new Object();
                response.context.deletingSubCategoryID = subCategoryID;            
                deleteSubCategory_CallBack(response);
            });
        }                                   
    };
    
    function deleteSubCategory_CallBack(response)
    {
        if(response.result && response.result != -1)
        {   
            //Remove SubCategory from CategoryData       
            catTypeCatagoryData.deleteSubCategory(response.context.deletingSubCategoryID);

            //Remove recent transactions for the deleted subcategory
            if (recentTransData)
            {
                recentTransData.deleteAllTransInSubCategory(response.context.deletingSubCategoryID);
            }
            
            //Redraw CategoryTable to remove deleted sub-category
            redrawTransCategoryTable();
        }
        else
        {
            //Redraw CategoryTable to show that the delete failed                       
            var subCategory = catTypeCatagoryData.getSubCategory(response.context.deletingSubCategoryID);
            subCategory.State = "DeleteFailed";
            redrawTransCategoryTable();
        }      
    }
    
};