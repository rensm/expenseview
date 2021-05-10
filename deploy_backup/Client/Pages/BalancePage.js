/*
Author: Rens Methratta
Copyright ExpenseView.com
This code is property of ExpenseView.com and cannot be used without explicit permission
from ExpenseView.com.
*/

//Modules which are displayed on this page
var balanceChangeTable;
var expectedBalanceChangeTable;

/******************************* Savings Summary ****************************/

function drawBalanceSummary(expCatData, incomeCatData)
{
    //Set Current Balance
    var balance = roundAmount(incomeCategoryData.getTotalAllTimeAmount() - expCategoryData.getTotalAllTimeAmount());
    if(!balance)
    {
        balance = 0;
    }
    
    var balanceColor = "green";
    if(balance < 0)
    {
        balanceColor = "red";
    }
    
    document.getElementById("currentBalanceDiv").innerHTML =  "<font color='" + balanceColor + "'>" + balance + "</font>";

        
    balanceChangeTable = new BalanceChangeTable("balanceSumTable", expCategoryData, incomeCategoryData);
    
    expectedBalanceChangeTable = new ExpectedBalanceTableModule("expectedBalanceDiv", expCategoryData, incomeCategoryData);    
    
    balanceChangeTable.drawModule();
    expectedBalanceChangeTable.drawModule();
}