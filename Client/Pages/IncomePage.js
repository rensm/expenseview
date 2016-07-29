/*
Author: Rens Methratta
Copyright ExpenseView.com
This code is property of ExpenseView.com and cannot be used without explicit permission
from Rens Methratta.
*/

//Panels that comprise the page
var addIncomePanel;
var incomeCategoryPanel;
var searchIncomePanel;
var incomePieChartPanel;
var incomeTrendsPanel;

/*Function for Add Income Panel 
  This panel dispalys the following elements:
    - Add Income
    - Recent Income
    - Income Summary
*/ 
function drawAddIncomePanel()
{
    addIncomePanel = new AddTransPanel("addIncomePanel", "Income", recentIncomeData, incomeCategoryData);
    addIncomePanel.drawPanel();
}

function drawIncomeCategoryPanel()
{
    incomeCategoryPanel = new EditCategoryPanel("incomeCategoryPanel", "Income", incomeCategoryData, recentIncomeData);
    incomeCategoryPanel.drawPanel();
}

function drawSearchIncomePanel() 
{
    searchIncomePanel = new SearchTransPanel("searchIncomePanel", "Income", incomeCategoryData, recentIncomeData);
    searchIncomePanel.drawPanel();
}

function drawIncomePieChartPanel()
{
    incomePieChartPanel = new BreakdownPieGraphPanel("incomePieChartPanel", "I");
    incomePieChartPanel.drawPanel();
}

function drawIncomeTrendsPanel()
{
    if (!incomeTrendsPanel)
    {
        incomeTrendsPanel = new ViewTrendsPanel("div_incomeTrendsPanel", "Income");
    }
    else
    {
        incomeTrendsPanel.redrawPanel();
        //No need to do anything else.  Flash chart automatically redraws itself once it's made visible again
    }
}