function CategoryData(categoryArray)
{    
    var catHashtable;
    var subCatHashtable;
    
    var totalYearBudget;
    var totalMonthBudget;
    var totalWeekBudget;
    var totalUserDateBudget;
    
    var totalVal;
    var totalYearVal;
    var totalPriorMonthVal;
    var totalMonthVal;
    var totalPriorWeekVal;
    var totalWeekVal;
    var totalCustomVal;
    var totalUserDateVal;

    var userStartDate;
    var userEndDate;

    var customStartDate;
    var customEndDate;
    var customDataLoaded = false;
    
    var catMonthAmountTable;
    var catMonthAmounts;
 
    calculateTotalBudgets();
       
    createHashtable();

    //Private Functions
    function createHashtable()
    {   
        catHashtable = new Object();
        subCatHashtable = new Object();
        
        var numCategories = categoryArray.length;
                
        for(var i=0; i<numCategories; i++)
        {
            var category = categoryArray[i];
            catHashtable[category.CategoryID] = category;
            
            if(category.SubCategories)
            {
                var numSubCategories = category.SubCategories.length;
                for (var j=0; j<numSubCategories; j++)
                {
                    var subCategory = category.SubCategories[j];
                    subCatHashtable[subCategory.SubCategoryID] = subCategory;
                }
            }
        }        
    }
    
    function getCategoryArrayIndex(categoryID)
    {
        var numCategories = categoryArray.length;
        
        for(var i=0; i<numCategories; i++)
        {
            if(categoryArray[i].CategoryID == categoryID)
            {
                return i;
            }
        }    
    }
    
    function calculateTotalBudgets()
    {
        if(categoryArray)
        {
            var numCategories = categoryArray.length;
            totalVal = 0;
            totalYearVal = 0;
            totalYearBudget = 0;

            totalPriorMonthVal = 0;
            totalMonthVal = 0;
            totalMonthBudget = 0;

            totalPriorWeekVal = 0;
            totalWeekVal = 0;
            totalWeekBudget = 0;

            totalUserDateVal = 0;
            totalUserDateBudget = 0;
            
            for(var i=0; i<numCategories; i++)
            {   
                totalVal += (categoryArray[i].TotalAmount  * 1);         
                totalYearVal += (categoryArray[i].YearAmount  * 1);
                totalPriorMonthVal += (categoryArray[i].PriorMonthAmount * 1);
                totalMonthVal += (categoryArray[i].MonthAmount * 1);
                totalPriorWeekVal += (categoryArray[i].PriorWeekAmount * 1);
                totalWeekVal += (categoryArray[i].WeekAmount * 1);
                totalUserDateVal += (categoryArray[i].UserDateAmount * 1);

                if (categoryArray[i].UserDateBudget)
                {
                    totalUserDateBudget += (parseFloat(categoryArray[i].UserDateBudget));
                }

                if(categoryArray[i].YearBudget)
                {   
                    totalYearBudget += (parseFloat(categoryArray[i].YearBudget));
                }
                
                if(categoryArray[i].MonthBudget)
                {
                    totalMonthBudget += (parseFloat(categoryArray[i].MonthBudget));
                }
                
                if(categoryArray[i].WeekBudget)
                {
                    totalWeekBudget += (parseFloat(categoryArray[i].WeekBudget));      
                }  
            }
        }        
    }    
    
    function sortCategoryArray() 
    {
        var numCategories = categoryArray.length;

        for (var i=0; i<(numCategories-1); i++)
        {
            for (var j=i+1; j<numCategories; j++)
            {

                if (categoryArray[j].Name.toUpperCase() < categoryArray[i].Name.toUpperCase()) 
                {
                    var dummyCategory = categoryArray[i];
                    categoryArray[i] = categoryArray[j];
                    categoryArray[j] = dummyCategory;
                }
            }
        }        
    }

    function addToTotalBudgets(yearBudget, monthBudget, weekBudget, userDateBudget)
    {
        if(yearBudget)
        {        
            totalYearBudget += yearBudget*1;
        }
        if(monthBudget)
        {
            totalMonthBudget += monthBudget*1;        
        }
        if(weekBudget)
        {
            totalWeekBudget += weekBudget*1;
        }
        if (userDateBudget)
        {
            totalUserDateBudget += userDateBudget * 1;
        }
    }

    function deleteFromTotalBudgets(yearBudget, monthBudget, weekBudget, userDateBudget)
    {
        if(yearBudget)
        {        
            totalYearBudget -= yearBudget*1;
        }
        if(monthBudget)
        {
            totalMonthBudget -= monthBudget*1;        
        }
        if(weekBudget)
        {
            totalWeekBudget -= weekBudget*1;        
        }
        if (userDateBudget)
        {
            totalUserDateBudget -= userDateBudget * 1;
        }
    }

    function deleteFromTotalAmount(deletedCat)
    {
        if(deletedCat.YearAmount )
        {        
            totalYearVal -= deletedCat.YearAmount *1;
        }
        
        if(deletedCat.PriorMonthAmount)
        {
            totalPriorMonthVal -= deletedCat.PriorMonthAmount*1;        
        }

        if(deletedCat.MonthAmount)
        {
            totalMonthVal -= deletedCat.MonthAmount*1;        
        }
        
        if(deletedCat.PriorWeekAmount)
        {
            totalPriorWeekVal -= deletedCat.PriorWeekAmount*1;        
        }    

        if(deletedCat.WeekAmount)
        {
            totalWeekVal -= deletedCat.WeekAmount*1;
        }

        if (deletedCat.UserDateAmount)
        {
            totalUserDateVal -= deletedCat.UserDateAmount * 1;
        }
    }
    
    
    function y2k(number) 
    { 
        return (number < 1000) ? number + 1900 : number; 
    }
    
    function addDeleteTrans(categoryID, amountString, dateString, operationType, subCategoryID)
    {        
        var transModifier;
        if(operationType == "Add")
        {
            transModifier = 1;
        }
        else if(operationType == "Delete")
        {
            transModifier = -1;
        }
            
        var amount = amountString * transModifier;
 
        //Identify the category to add the transaction to
        var category = catHashtable[categoryID];
        var subCategory = null;
              
        if(subCategoryID)
        {
            var numSubCategories = category.SubCategories.length;
            for(var subCatIndex=0; subCatIndex<numSubCategories; subCatIndex++)
            {
                if(category.SubCategories[subCatIndex].SubCategoryID == subCategoryID)
                {
                    subCategory = category.SubCategories[subCatIndex];                  
                }
            }
        }
        
        
        //Add or subtract amount from total amount values
        category.TotalAmount = roundAmount((category.TotalAmount  * 1) + amount);
        totalVal += amount;

        var transDate = getDateFromDefaultDateString(dateString);

        //Create a date represting current date
        var today = new Date();

        //Add to userDateAmount
        if (transDate.isBetweenDates(getDateFromDefaultDateString(ExpViewGlobalData.userStartDate), getDateFromDefaultDateString(ExpViewGlobalData.userEndDate)))
        {
            category.UserDateAmount = roundAmount((category.UserDateAmount * 1) + amount);
            totalUserDateVal += amount;
        }
                
        if(transDate.getFullYear() == today.getFullYear())
        {        
            category.YearAmount = roundAmount((category.YearAmount * 1) + amount);            
            if(subCategory)
            {
                subCategory.YearAmount = roundAmount((subCategory.YearAmount * 1) + amount); 
            }
            
            totalYearVal += amount;

            //If Transaction ocurred in the prior month, add to the PriorMonthAmount total
            if(transDate.getMonth() == today.getPriorMonth())
            {
                category.PriorMonthAmount = roundAmount((category.PriorMonthAmount * 1) + amount);
                
                if(subCategory)
                {
                    subCategory.PriorMonthAmount = roundAmount((subCategory.PriorMonthAmount * 1) + amount); 
                }

                totalPriorMonthVal += amount;

                
                //If Transaction ocurred in the prior week, add to the .priorWeekAmount total
                //Otherwise, if it ocurred this week add it to the .weekAmount total.		        
                if (transDate.fallsWithinLastWeek())
	            {	
                    category.PriorWeekAmount = roundAmount((category.PriorWeekAmount * 1) + amount);

                    if(subCategory)
                    {
                        subCategory.PriorWeekAmount = roundAmount((subCategory.PriorWeekAmount * 1) + amount); 
                    }
                    
                    totalPriorWeekVal += amount;
                }
                else if (transDate.fallsWithinThisWeek())
	            {
                    category.WeekAmount = roundAmount((category.WeekAmount * 1) + amount);

                    if(subCategory)
                    {
                        subCategory.WeekAmount = roundAmount((subCategory.WeekAmount * 1) + amount); 
                    }
                    
                    totalWeekVal += amount;                                      
	            }
	        }
            else if(transDate.getMonth() == today.getMonth())
            {                
                //If Transaction ocurred in this month , add to the MonthAmount total
                category.MonthAmount = roundAmount((category.MonthAmount * 1) + amount);
                
                if(subCategory)
                {
                    subCategory.MonthAmount = roundAmount((subCategory.MonthAmount * 1) + amount); 
                }

                totalMonthVal += amount;                                      

                //If Transaction ocurred in the prior week, add to the .priorWeekAmount total
                //Otherwise, if it ocurred this week add it to the .weekAmount total.		        
                if (transDate.fallsWithinLastWeek())
	            {	
                    category.PriorWeekAmount = roundAmount((category.PriorWeekAmount * 1) + amount);
                    
                    if(subCategory)
                    {
                        subCategory.PriorWeekAmount = roundAmount((subCategory.PriorWeekAmount * 1) + amount); 
                    }

                    totalPriorWeekVal += amount;
                }
                else if (transDate.fallsWithinThisWeek())
	            {
                    category.WeekAmount = roundAmount((category.WeekAmount * 1) + amount);
                    
                    if(subCategory)
                    {
                        subCategory.WeekAmount = roundAmount((subCategory.WeekAmount * 1) + amount); 
                    }

                    totalWeekVal += amount;                                      
                }
            }
        }
        else if(transDate.getFullYear() == (today.getFullYear() - 1))
        {
            //If Transaction ocurred in the prior month, add to the PriorMonthAmount total
            if(transDate.getMonth() == today.getPriorMonth())
            {
                category.PriorMonthAmount = roundAmount((category.PriorMonthAmount * 1) + amount);

                if(subCategory)
                {
                    subCategory.PriorMonthAmount = roundAmount((subCategory.PriorMonthAmount * 1) + amount); 
                }

                totalPriorMonthVal += amount;

                //If Transaction ocurred in the prior week, add to the .priorWeekAmount total
                //Otherwise, if it ocurred this week add it to the .weekAmount total.		        
	            if(transDate.fallsWithinLastWeek())
	            {	
                    category.PriorWeekAmount = roundAmount((category.PriorWeekAmount * 1) + amount);

                    if(subCategory)
                    {
                        subCategory.PriorWeekAmount = roundAmount((subCategory.PriorWeekAmount * 1) + amount); 
                    }

                    totalPriorWeekVal += amount;                                                          
	            }
	        }        
        }     
    }
    
    this.setCategoryMonthAmount = function(catMonthAmountArray)
    {
        catMonthAmounts = catMonthAmountArray;
        catMonthAmountTable = new Object();
        
        var numMonths = catMonthAmountArray.length;

        for(var i=0; i<numMonths; i++)
        {
            var monthAmountKey = catMonthAmountArray[i].year + "" + catMonthAmountArray[i].month;
            catHashtable[monthAmountKey] = catMonthAmountArray[i];
        }        

    };
    
    this.getCategoryMonthAmount = function()
    {
        return catMonthAmounts;
    };
    
    this.setCustomDate = function(startDateString, endDateString)
    {
        var dateArray = startDateString.split("-");
        customStartDate = new Date(dateArray[0]*1, ((dateArray[1]*1)-1), dateArray[2]*1);
        
        dateArray = endDateString.split("-");
        customEndDate = new Date(dateArray[0], ((dateArray[1]*1)-1), dateArray[2]);
    };
    
    this.setCustomDateAmount = function(custDateArray)
    {        
        totalCustomVal = 0;
        
        var numCustom = custDateArray.length;        
        for(custIndex=0; custIndex<numCustom; custIndex++)
        {
            var custCategory = custDateArray[custIndex];            
            
            catHashtable[custCategory.categoryID].CustomDateAmount = custCategory.CustomDateAmount;
            
            if(custCategory.CustomDateAmount)
            {
                totalCustomVal += (custCategory.CustomDateAmount * 1);             
            }
        }
        
        customDataLoaded = true;
    };
    
    this.isCustomDataLoaded = function()
    {
        return customDataLoaded;
    };

    this.getCustomStartDate = function()
    {
        return customStartDate;
    };

    this.getCustomEndDate = function()
    {
        return customEndDate;
    };
    
    this.getCategoryName = function(catID)
    {
        if(catHashtable[catID])
        {
            return catHashtable[catID].Name;
        }            
    };

    
    this.getTotalYearBudget = function()
    {
        return roundAmount(totalYearBudget);
    };

    this.getTotalMonthBudget = function()
    {
        return roundAmount(totalMonthBudget);
    };

    this.getTotalWeekBudget = function()
    {
        return roundAmount(totalWeekBudget);
    };

    this.getTotalUserDateBudget = function ()
    {
        return roundAmount(totalUserDateBudget);
    };

    this.getTotalAllTimeAmount = function()
    {
        return roundAmount(totalVal);
    };

    this.getTotalYearAmount = function()
    {
        return roundAmount(totalYearVal);
    };

    this.getTotalPriorMonthAmount = function()
    {
        return roundAmount(totalPriorMonthVal);
    };
    
    this.getTotalMonthAmount = function()
    {
        return roundAmount(totalMonthVal);
    };

    this.getTotalPriorWeekAmount = function()
    {
        return roundAmount(totalPriorWeekVal);
    };
        
    this.getTotalWeekAmount = function()
    {
        return roundAmount(totalWeekVal);
    };

    this.getTotalUserDateAmount = function ()
    {
        return roundAmount(totalUserDateVal);
    };



    this.getSubCategoryName = function(subCategoryId)
    {
        if (subCatHashtable[subCategoryId])
        {
            return subCatHashtable[subCategoryId].Name;
        }
    } 
    
    this.getSubCategory = function(subCategoryId)
    {
        return subCatHashtable[subCategoryId];
    } 

        
    this.addTrans = function(categoryID, amountString, dateString, subCategoryID)
    {
        addDeleteTrans(categoryID, amountString, dateString, "Add", subCategoryID);   
    };

    this.deleteTrans = function(categoryID, amountString, dateString, subCategoryID)
    {
        addDeleteTrans(categoryID, amountString, dateString, "Delete", subCategoryID);      
    };
    
    this.getCategories = function()
    {
        return categoryArray;
    };

    this.getNumCategories = function() 
    {
        return categoryArray.length;
    }

    this.getCategory = function(arrayIndex)
    {
        return categoryArray[arrayIndex];
    };   

    this.getCategoryByCategoryID = function(categoryID)
    {
        return catHashtable[categoryID];
    };   


    this.addCategory = function(newCategory)
    {   
        //Set Initial Trans Totals Values to 0
        newCategory.WeekAmount = 0;
        newCategory.PriorWeekAmount = 0;
        newCategory.MonthAmount = 0;
        newCategory.PriorMonthAmount = 0;        
        newCategory.YearAmount  = 0;

        var numCategories = categoryArray.length;
        categoryArray[numCategories] = newCategory;

        createHashtable();
                
        addToTotalBudgets(newCategory.YearBudget, newCategory.MonthBudget, newCategory.WeekBudget, newCategory.UserDateBudget);
    };


    this.addSubCategory = function(categoryID, newSubCategory)
    {   
        //Set Initial Trans Totals Values to 0
        var category = this.getCategoryByCategoryID(categoryID);

        if(!category.SubCategories)
        {
            category.SubCategories = new Array();;
        }

        var numSubCategories = category.SubCategories.length;
        category.SubCategories[numSubCategories] = newSubCategory;

        createHashtable();
    };
    
    this.changeSubCategoryID = function(oldSubCategoryID, newSubCategoryID)
    {
        var subCategory = this.getSubCategory(oldSubCategoryID);
        
        subCategory.SubCategoryID = newSubCategoryID;
        
        //Now recreate hashtable to use new ID
        createHashtable(); 
    }
    
    
    this.changeCategoryID = function(oldCategoryID, newCategoryID)
    {
        var category = catHashtable[oldCategoryID];
        
        category.CategoryID = newCategoryID;
        
        //Now recreate hashtable to use new ID
        createHashtable(); 
    }


    this.updateCategoryTotalBudgets = function (currentCat, newCat)
    {
        deleteFromTotalBudgets(currentCat.YearBudget, currentCat.MonthBudget, currentCat.WeekBudget, currentCat.UserDateBudget);
        addToTotalBudgets(newCat.YearBudget, newCat.MonthBudget, newCat.WeekBudget, newCat.UserDateBudget);
    };
            
    this.deleteCategory = function(categoryID)
    {  
        var delCat = catHashtable[categoryID];
        deleteFromTotalBudgets(delCat.YearBudget, delCat.MonthBudget, delCat.WeekBudget, delCat.UserDateBudget);
        
        deleteFromTotalAmount(delCat);

        //Remove from cateogoryArray
        var arrayIndex = getCategoryArrayIndex(categoryID)        
        categoryArray.splice(arrayIndex, 1);
        
        createHashtable();
    };    
    
    this.deleteSubCategory = function(subCategoryID)
    {  
        var subCategory = subCatHashtable[subCategoryID];        
        deleteFromTotalAmount(subCategory);
        
        var category = catHashtable[subCategory.CategoryID];                
        var numSubCategories = category.SubCategories.length;
        
        for(var i=0; i<numSubCategories; i++)
        {
            if(category.SubCategories[i].SubCategoryID == subCategoryID)
            {
                //Remove this sub category from the SubCategor array
                category.SubCategories.splice(i, 1);
                break;
            }
        }        
                
        createHashtable();
    };    

};
