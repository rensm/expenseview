/*
Author: Rens Methratta
Copyright ExpenseView.com
This code is property of ExpenseView.com and cannot be used without explicit permission
from Rens Methratta.
*/

//Panels that are displayed on the page
var addExpensePanel;
var expCategoryPanel;
var searchExpPanel;
var expPieChartPanel;
var expTrendsPanel;

/*Function for Add Expense Panel 
  This panel dispalys the following elements:
    - Add Expense
    - Recent Expenses
    - Expense Summary
*/ 
function drawAddExpensePanel()
{
    addExpensePanel = new AddTransPanel("addExpensePanel", "Expense", recentExpData, expCategoryData);
    addExpensePanel.drawPanel();
}

function drawExpCategoryPanel()
{
    expCategoryPanel = new EditCategoryPanel("expCategoryPanel", "Expense", expCategoryData, recentExpData);
    expCategoryPanel.drawPanel();                
}

function drawSearchExpensePanel()
{
    searchExpPanel = new SearchTransPanel("searchExpPanel", "Expense", expCategoryData, recentExpData);
    searchExpPanel.drawPanel();    
}

function drawExpensePieChartPanel()
{
    expPieChartPanel = new BreakdownPieGraphPanel("expPieChartPanel", "E");
    expPieChartPanel.drawPanel();
}

function drawExpenseTrendsPanel()
{
    if (!expTrendsPanel)
    {
        expTrendsPanel = new ViewTrendsPanel("div_expTrendsPanel", "Expense");
    }
    else
    {
        expTrendsPanel.redrawPanel();
        //No need to do anything else.  Flash chart automatically redraws itself once it's made visible again
    }
}