/*
Author: Rens Methratta
Copyright ExpenseView.com
This code is property of ExpenseView.com and cannot be used without explicit permission
from Rens Methratta.
*/

/*Functions for Add Income Panel 
  This panel dispalys the following elements:
    - Add Income
    - Recent Income
    - Income Summary
*/
var addIncomeModule;
var addIncomeCategoryModule;
var recentIncomeTable;
var incomeSummaryTable;
var searchIncomeModule;
var searchIncomeProcessor;
var searchIncomeTable;
var incomeCategoryTable;
var incomePieChart;

//Variable to store income Data
var recentIncomeData;
var incomeDataLoadRequired = true;

var incomeTransController;
 
function drawAddIncomePanel()
{
    if(incomeDataLoadRequired)
    {           
        //Create AddIncomePanel Modules
        addIncomeModule = new AddTransModule("addIncomeModule", "Income", incomeCategoryData.getCategories());    

        recentIncomeTable = new TransTableModule("recentIncomeTable", transData.RecentIncome.reverse(), incomeCategoryData, 5, true); 

        incomeSummaryTable = new TransSummaryTableModule("incomeSummaryTable", incomeCategoryData,  "Income");
        
        incomeTransController = new TransController("Income", incomeCategoryData, recentIncomeTable, incomeSummaryTable, addIncomeModule);

        //Draw Modules
        drawAddIncomePanelModules();

        incomeDataLoadRequired = false;            
    }
    else
    {
        drawAddIncomePanelModules();
    }    
}

function recentIncomeTable_SortTable(column, startPage)
{
    recentIncomeTable.sortTable(column, startPage);
}

function drawAddIncomePanelModules()
{
    //Draw Add Income Module
    //Set Focus on Select Category DropDownList    
    addIncomeModule.drawModule();        

    //Draw Recent Income Table
    recentIncomeTable.drawModule(1);

    incomeSummaryTable.drawModule();
   
    showIncomePanel("addIncomePanel");         
}

function addIncomeModule_AddTrans()
{
    incomeTransController.addTrans();    
}

function recentIncomeTable_EditTrans(rowIndex, startPage)
{
    recentIncomeTable.editRow(rowIndex);
    recentIncomeTable.drawModule(startPage);        
}

function recentIncomeTable_CancelEdit(rowIndex, startPage)
{
    recentIncomeTable.cancelRowEdit(rowIndex);
    recentIncomeTable.drawModule(startPage);        
}

function recentIncomeTable_DeleteTrans(rowIndex, startPage)
{
    incomeTransController.deleteTrans(rowIndex, startPage);
}

function recentIncomeTable_UpdateTrans(rowIndex, startPage)
{
    incomeTransController.updateTrans(rowIndex, startPage);
}

function recentIncomeTable_RetryUpdateTrans(rowIndex, startPage)
{
    incomeTransController.retryUpdateTrans(rowIndex, startPage);
}


function recentIncomeTable_ShowPage(pageNum)
{
    recentIncomeTable.drawModule(pageNum);                
}

function drawSearchIncomePanel()
{
    if(!searchIncomeModule)
    {
        searchIncomeModule = new SearchTransModule("searchIncomeModule", "Income");
    }
    
    searchIncomeModule.drawModule(incomeCategoryData.getCategories());    

    //Clear out any previous searches
    document.getElementById("searchIncomeHeader").innerHTML = "";    
    document.getElementById("searchIncomeResults").innerHTML = "";
 
    showIncomePanel("searchIncomePanel");                
}

function searchIncomeModuleSearchTrans()
{
    var ts = searchIncomeModule.getTransSearch();
    ExpenseTracker.SearchTrans(ts.StartDate, ts.EndDate, ts.CategoryType, ts.CategoryId, ts.AmountOperator, ts.Amount, showIncomeSearchResults);

    //Display Search Header
    searchHeaderString = "&nbsp;&nbsp;<table cellpadding='1' cellspacing='0'><tr><td valign='bottom'><span class='panelHeader'>Search Results</span>&nbsp;&nbsp;</td><td valign='bottom'><img src='images/page_excel.png' style='border-style: none'/></td><td><a href='generateReport.aspx?catType=Income&startDate=" + ts.StartDate + "&endDate=" + ts.EndDate + "&catId=" + ts.CategoryId + "&amountOper=" + ts.AmountOperator + "&amount=" + ts.Amount + "'>Export Income Records</a></td></tr></table>";                
    document.getElementById("searchIncomeHeader").innerHTML = searchHeaderString;

    //Display Searching Text
    var searchResults = document.getElementById("searchIncomeResults");
    searchResults.innerHTML = "Searching...<img src='images/loading.gif' />";
}

function showIncomeSearchResults(res)
{
    var searchResponseArray = JSON.parse(res.value);
    
    if(searchResponseArray && searchResponseArray.length > 0)
    {
        searchIncomeTable = new TransTableModule("searchIncomeResults", searchResponseArray, incomeCategoryData, 20, false);    
        searchIncomeTable.drawModule(1);    
        
        searchIncomeProcessor = new SearchTransProcessor("Income", incomeCategoryData, searchIncomeTable, recentIncomeTable);        
    }
    else
    {
        var searchResults = document.getElementById("searchIncomeResults");
        searchResults.innerHTML = "<i>No income records found for specified parameters.</i>";    
    }    
}

function searchIncomeResults_SortTable(column, startPage)
{
    searchIncomeTable.sortTable(column, startPage);
}

function searchIncomeResultsShowPage(pageNum)
{
    searchIncomeTable.drawModule(pageNum);                
}

function searchIncomeResultsEditTrans(arrayIndex, startPage)
{
    searchIncomeTable.editRow(arrayIndex);    
    searchIncomeTable.drawModule(startPage);        
}

function searchIncomeResultsCancelEdit(arrayIndex, startPage)
{
    searchIncomeTable.cancelRowEdit(arrayIndex);
    searchIncomeTable.drawModule(startPage);        
}

function searchIncomeResultsDeleteTrans(rowIndex, startPage)
{
    searchIncomeProcessor.deleteTrans(rowIndex, startPage);
}

function searchIncomeResultsUpdateTrans(rowIndex, startPage)
{
    searchIncomeProcessor.updateTrans(rowIndex, startPage);
}

function searchIncomeResultsRetryUpdateTrans(rowIndex, startPage)
{
    searchIncomeProcessor.retryUpdateTrans(rowIndex, startPage);    
}

function drawIncomeCategoryPanel()
{
    if(!incomeCategoryTable)
    {   
        addIncomeCategoryModule = new AddCategoryModule("addIncomeCategoryModule", "Income");       
        addIncomeCategoryModule.drawModule();
        incomeCategoryTable = new CategoryTableModule("incomeCatTable", incomeCategoryData, "Income");        
        incomeCategoryTable.drawModule();             
    }
    
    showIncomePanel("incomeCategoryPanel");
}


function incomeCatTableEditCategory(arrayIndex)
{   
    incomeCategoryData.selectCategory(arrayIndex);
    incomeCategoryTable.drawModule();
}

function incomeCatTableCancelCategoryEdit(arrayIndex)
{
    incomeCategoryData.deselectCategory(arrayIndex);
    incomeCategoryTable.drawModule();
}

function incomeCatTableUpdateCategory(arrayIndex)
{    
    var category = incomeCategoryTable.getModifiedRow(arrayIndex);

    if(CategoryController.updateCategory(category))
    {
        incomeCategoryData.updateCategory(arrayIndex, category);

        //Redraw CategoryTableModule
        incomeCategoryTable.drawModule();               
    }    
}


function addIncomeCategoryModuleAddCategory()
{
    var category = addIncomeCategoryModule.getCategory();
    
    if(CategoryController.insertCategory(category))
    {
        incomeCategoryData.addCategory(category);    
        incomeCategoryTable.drawModule();         
        
        addIncomeCategoryModule.clearFields();
    }    
}

function incomeCatTableDeleteCategory(arrayIndex)
{
    var category = incomeCategoryData.getCategory(arrayIndex);
    
    if (CategoryController.deleteCategory(category, "Income")) 
    {
        incomeCategoryData.deleteCategory(arrayIndex);            
        incomeCategoryTable.drawModule();

        if(recentIncomeTable)
        {
            recentIncomeTable.deleteAllRowsInCategory(category.CategoryID);
        }
        
        if(searchIncomeTable)
        {
            searchIncomeTable.deleteAllRowsInCategory(category.CategoryID);            
        }
    }
}


function drawIncomePieChart()
{       
    if(!incomePieChart)
    { 
        incomePieChart = new PieGraphModule("incomePieChart", "flashChart", incomeCategoryData);
    }
        
    var incomePieDateList = document.getElementById("incomePieChartDate");
    var dateRange = incomePieDateList.options[incomePieDateList.selectedIndex].text;                        

    if(dateRange == "Custom Date")
    {
        document.getElementById("incomePieOtherSelColumn").style.display = "block";
            
        if(incomeCategoryData.isCustomDataLoaded())
        {            
            var startDate = incomeCategoryData.getCustomStartDate();
            var endDate = incomeCategoryData.getCustomEndDate();
            
            setFieldValue("incomePieStartDate", (startDate.getMonth() + 1) + "/" + startDate.getDate() + "/" + startDate.getYear());
            setFieldValue("incomePieEndDate", (endDate.getMonth() + 1) + "/" + endDate.getDate() + "/" + endDate.getYear());

            incomePieChart.drawChart("Custom Date");                        
        }
        else
        {
            incomePieChart.drawEmpty();
        }
    }
    else
    {
        document.getElementById("incomePieOtherSelColumn").style.display = "none";
        incomePieChart.drawChart(dateRange);          
    }
        
    showIncomePanel("incomePieChartPanel"); 
}

function drawOtherDateIncomePieChart()
{
    var incomePieStartDate = getFieldValue("incomePieStartDate");
    var incomePieEndDate = getFieldValue("incomePieEndDate");
    
    if(!isValidDate(incomePieStartDate))
    {
        alert("Cannot create Chart.  Invalid start date specified");
        return;
    }
    
    if(!isValidDate(incomePieEndDate))
    {
        alert("Cannot create Chart.  Invalid end date specified");
        return;
    }
    
    incomeCategoryData.setCustomDate(incomePieStartDate, incomePieEndDate);
    ExpenseTracker.GetCustomDateCategories('E', incomePieStartDate, incomePieEndDate, drawCustomIncomePieChart_callBack);
    
    incomePieChart.drawLoading();
}

function drawCustomIncomePieChart_callBack(res)
{
    var catArray = JSON.parse(res.value);   
    incomeCategoryData.setCustomDateAmount(catArray);
        
    incomePieChart.drawChart("Custom Date");
}
