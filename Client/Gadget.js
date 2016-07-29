//navigation objects
var gadgetSelectedTab;
var gadgetPages = new Array('expGadgetPage', 'incomeGadgetPage', 'balanceGadgetPage');

var ExpViewGlobalData = ExpViewGlobalData ? ExpViewGlobalData : new Object();

//income objects
var incomeGadgetCatData;
var incomeGadgetAddTransModule;
var incomeGadgetNewTransTable;
var newIncomeGadgetTrans;

//expense objects
var expGadgetCatData;
var expGadgetAddTransModule;
var expGadgetNewTransTable;
var newExpGadgetTrans;

//balance gadgets
var balanceGadgetTable;


var jsonService = new JsonService();

//Page Load Functions
function loadGadget()
{
    var userDate = new Date();               
    jsonService.GetUserSummary(userDate, drawGadgetPages);        
}

//Navigation Functions
function drawGadgetPages(res) 
{
    var transData = JSON.parse(res.result);

    ExpViewGlobalData.userDateFormat = transData.PreferredDateFormat;
    ExpViewGlobalData.userDisplayDecimals = transData.AmountDisplayDecimals;

    //Create Expense and Income Category Data
    expGadgetCatData = new CategoryData(transData.ExpenseCategories);    
    incomeGadgetCatData = new CategoryData(transData.IncomeCategories);

    //Get Recent Expenses and Income
    newExpGadgetTrans = transData.RecentExpenses;            
    newIncomeGadgetTrans = transData.RecentIncome;

    //Draw AddExpense module
    expGadgetAddTransModule = new AddTransGadgetModule("addExpGadgetModule", "Expense");
    expGadgetAddTransModule.drawModule(expGadgetCatData.getCategories());
        
    //Draw NewExpense Table
    expGadgetNewTransTable = new NewTransModule("newExpGadgetTable");
    expGadgetNewTransTable.drawModule(newExpGadgetTrans);    
    
    
    //Draw AddIncome module
    incomeGadgetAddTransModule = new AddTransGadgetModule("addIncomeGadgetModule", "Income");
    incomeGadgetAddTransModule.drawModule(incomeGadgetCatData.getCategories());
        
    //Draw NewIncome Table
    incomeGadgetNewTransTable = new NewTransModule("newIncomeGadgetTable");
    incomeGadgetNewTransTable.drawModule(newIncomeGadgetTrans);    
    
    balanceGadgetTable = new BalanceModule("balanceGadgetTable");

    //Show Expense Page First by default
    showPage("expGadgetPage");
}

//Navigation Functions
function showPage(pageName)
{
    for(var i=0; i< gadgetPages.length; i++)
    {
        document.getElementById(gadgetPages[i]).style.display = ((pageName) == gadgetPages[i]) ? 'block':'none';
    }
    
    highlightTab(pageName);
    
    if(pageName === "balanceGadgetPage")
    {
        balanceGadgetTable.drawModule();
    }
}

function highlightTab(tabID)
{    
    if(gadgetSelectedTab)
    {
        gadgetSelectedTab.className = "tab";
    }

    gadgetSelectedTab = document.getElementById((tabID + 'Tab'));            
    gadgetSelectedTab.className = "selectedTab";
}


function addExp_CallBack(res)
{
    var rowIndex = res.Context.RowIndex;    
    var resValue = res.result;
    
    if(resValue && resValue !== -1)
    {       
        newExpGadgetTrans[rowIndex].TransID = resValue;
        newExpGadgetTrans[rowIndex].state = "Current"; 

        var expense = newExpGadgetTrans[rowIndex];        
        expGadgetCatData.addTrans(expense.CategoryID, expense.Amount, expense.Date);
    }
    else
    {
        newExpGadgetTrans[rowIndex].state = "AddFailed";        
        alert("Failed to add expense record. Unexpected error ocurred. Please retry"); 
    }
    
    expGadgetNewTransTable.drawModule(newExpGadgetTrans);     
}


function addExpGadgetModule_AddTrans()
{
    var expense = expGadgetAddTransModule.getTrans();

    if(isValidAmount(expense.Amount))
    {
        var newRowIndex = newExpGadgetTrans.length;
        newExpGadgetTrans[newRowIndex] = expense;
            
        expGadgetNewTransTable.drawModule(newExpGadgetTrans); 
                
        //Convert to string to send to server
        var rowIndex = newRowIndex + "";
                
        jsonService.InsertTrans(expense, function(response)
        {
	        response.Context = new Object();
	        response.Context.RowIndex = rowIndex;		
            addExp_CallBack(response);
        });                        
        
        expGadgetAddTransModule.clearFields();    
    }
    else
    {
        alert("Invalid Amount specified. Please correct and try again");    
    }
}

function newExpGadgetTable_RetryAddTrans(rowIndex)
{
    var expense = newExpGadgetTrans[rowIndex];
    
    jsonService.InsertTrans(expense, function(response)
    {
        response.Context = new Object();
        response.Context.RowIndex = rowIndex;		
        addExp_CallBack(response);
    });                        
}

function deleteExp_CallBack(res)
{
    var rowIndex = res.context.RowIndex;    
    var resValue = res.result;
        
    if(resValue && resValue !== -1)
    {       
        var expense = newExpGadgetTrans[rowIndex];
        expGadgetCatData.deleteTrans(expense.CategoryID, expense.Amount, expense.Date);
        newExpGadgetTrans.splice(rowIndex, 1);
    }
    else
    {
        newExpGadgetTrans[rowIndex].state = "DeleteFailed";
        alert("Failed to delete expense recorde. Unexpected error ocurred. Please retry");
    }
    
    expGadgetNewTransTable.drawModule(newExpGadgetTrans);     
}

function newExpGadgetTable_DeleteTrans(rowIndex)
{
    newExpGadgetTrans[rowIndex].state = "Deleting";       
    expGadgetNewTransTable.drawModule(newExpGadgetTrans); 
            
    var transID = newExpGadgetTrans[rowIndex].TransID + "";

    jsonService.DeleteTrans(transID, function(response) {
        response.context = new Object();
        response.context.RowIndex = rowIndex;

        deleteExp_CallBack(response);
    });        
        
 }


//Income Functions
function addIncome_CallBack(res)
{
    var rowIndex = res.context.RowIndex;    
    var resValue = res.result;
    
    if(resValue && resValue !== -1)
    {       
        newIncomeGadgetTrans[rowIndex].TransID = resValue;
        newIncomeGadgetTrans[rowIndex].state = "Current";     
        
        var income = newIncomeGadgetTrans[rowIndex];        
        incomeGadgetCatData.addTrans(income.CategoryID, income.Amount, income.Date);   
    }
    else
    {
        newIncomeGadgetTrans[rowIndex].state = "AddFailed";        
        alert("Failed to add income record. Unexpected error ocurred. Please retry"); 
    }
    
    incomeGadgetNewTransTable.drawModule(newIncomeGadgetTrans);     
}

function addIncomeGadgetModule_AddTrans()
{
    var income = incomeGadgetAddTransModule.getTrans();
    
    if(isValidAmount(income.Amount))
    {
        var newRowIndex = newIncomeGadgetTrans.length;
        newIncomeGadgetTrans[newRowIndex] = income;
            
        incomeGadgetNewTransTable.drawModule(newIncomeGadgetTrans); 
                
        //Convert to string to send to server
        var rowIndex = newRowIndex + "";

        jsonService.InsertTrans(income, function(response) 
        {
            response.context = new Object();
            response.context.RowIndex = rowIndex;
            addIncome_CallBack(response);
        });                        
               
        incomeGadgetAddTransModule.clearFields();    
    }
    else
    {
        alert("Invalid Amount specified. Please correct and try again");
    }
}

function newIncomeGadgetTable_RetryAddTrans(rowIndex)
{
    //Insert New Transaction into database
    var income = newIncomeGadgetTrans[rowIndex];
        
    //Provide RowIndex as context
    var addContext = new Object();
    addContext.RowIndex = rowIndex + "";

    jsonService.InsertTrans(income, function(response) {
        response.Context = new Object();
        response.Context.RowIndex = rowIndex;
        addIncome_CallBack(response);
    });
}

function deleteIncome_CallBack(res)
{
    var rowIndex = res.context.RowIndex;    
    var resValue = res.result;
        
    if(resValue && resValue !== -1)
    {       
        var income = newIncomeGadgetTrans[rowIndex];        
        incomeGadgetCatData.deleteTrans(income.CategoryID, income.Amount, income.Date);   
        newIncomeGadgetTrans.splice(rowIndex, 1);
    }
    else
    {
        newIncomeGadgetTrans[rowIndex].state = "DeleteFailed";        
        alert("Failed to delete expense recorde. Unexpected error ocurred. Please retry"); 
    }
    
    incomeGadgetNewTransTable.drawModule(newIncomeGadgetTrans);     
}

function newIncomeGadgetTable_DeleteTrans(rowIndex)
{
    newIncomeGadgetTrans[rowIndex].state = "Deleting";       
    incomeGadgetNewTransTable.drawModule(newIncomeGadgetTrans); 
            
    var transID = newIncomeGadgetTrans[rowIndex].TransID + "";

    jsonService.DeleteTrans(transID, function(response) {
        response.context = new Object();
        response.context.RowIndex = rowIndex;

        deleteIncome_CallBack(response);
    });                    
}

function BalanceModule(displayDivName)
{
    this.drawModule = function()
    {        
        var sb = new StringBuffer();
        
        sb.append("<table><tr><td width='170px'>Total Income</td><td width='100px'>");
        sb.append(incomeGadgetCatData.getTotalAllTimeAmount());
        sb.append("</td><tr><td>Total Expense</td><td>");
        sb.append(expGadgetCatData.getTotalAllTimeAmount());
        sb.append("</td><tr><td colspan='2'><hr /></td></tr>");
        sb.append("<tr><td>Current Balance</td>");
        
        var balance = roundAmount(incomeGadgetCatData.getTotalAllTimeAmount() - expGadgetCatData.getTotalAllTimeAmount());
        
        if(!balance)
        {
            balance = 0;
        }

        var balanceStyle = "negativeAmount";
        if(balance > 0)
        {
            balanceStyle = "possitiveAmount";
        }
                
        sb.append("<td class='" + balanceStyle + "'>");
        sb.append(balance);
        sb.append("</td></tr></table>");
        
        document.getElementById(displayDivName).innerHTML = sb.toString();
    };
    
}

function NewTransModule(dispalyDiv)
{
    var displayDivName = dispalyDiv;

    this.drawModule = function(transArray) 
    {        
        var sb = new StringBuffer();
        sb.append("<table class='fixedTable' width='300px' cellpadding='1' cellspacing='0' border='0'>");
        sb.append("<tr class='blueBGColumn'><td style='width: 100px; text-align: left; word-wrap: break-word'>Category</td>");
        sb.append("<td style='width: 90px; text-align: center;'>Date</td>");
        sb.append("<td style='width: 90px; text-align: center;'>Amount</td>");
        sb.append("<td style='width: 20px; text-align: left;'></td></tr>");

        var numTrans = transArray.length;
        for (var transIndex = numTrans - 1; transIndex >= 0; transIndex--) {
            var trans = transArray[transIndex];
            sb.append("<tr><td align='left'>" + trans.CategoryName + "</td>");
            sb.append("<td align='center'>" + trans.Date + "</td>");
            sb.append("<td align='center'>" + roundAmount(trans.Amount) + "</td>");


            if (!trans.state || trans.state == "" || trans.state === "Current") {
                sb.append("<td align='left'><a href='javascript:" + displayDivName + "_DeleteTrans(" + transIndex + ");void(0);'>");
                sb.append("<img src='images/delete.gif' alt='Delete' border='0' /></a></td>");
            }
            else if (trans.state === "Adding" || trans.state === "Deleting") {
                sb.append("<td align='left'>");
                sb.append("<img src='images/loading_flower.gif' alt='loading' border='0' />..");
                sb.append(trans.state + "</td>");
            }
            else if (trans.state === "AddFailed") {
                sb.append("<td align='left'>");
                sb.append("<a href='javascript:" + displayDivName + "_RetryAddTrans(" + transIndex + ");void(0);'>");
                sb.append("<img src='images/error.gif' alt='loading' border='0' /> Retry Add</a></td>");
            }
            else if (trans.state === "DeleteFailed") {
                sb.append("<td align='left'>");
                sb.append("<a href='javascript:" + displayDivName + "_DeleteTrans(" + transIndex + ");void(0);'>");
                sb.append("<img src='images/error.gif' alt='Retry Delete' border='0' /> Retry Delete</a></td>");
            }

            sb.append("</tr>");
        }

        sb.append("</table>");

        document.getElementById(displayDivName).innerHTML = sb.toString();
    };
}

// JScript File
//Add either expenses or income Category by (Year, Month, etc.)
function AddTransGadgetModule(displayDiv, categoryType)
{        
    this.drawModule = function(categoryArray) 
    {
        var sb = new StringBuffer();
        
        var today = new Date();
        var day = today.getDate();
        if(day<10) {day = "0" + day;}
        
        var month = today.getMonth() + 1;
        if(month<10) {month= "0" + month;} 

        var todayString = today.getFullYear() + '-' + month + '-' + day;

        sb.append("<table class='fixedTable' width='300px' cellpadding='1' cellspacing='1' border='0'>");
        sb.append("<tr><td style='width: 90px'><b>Category:</b></td>");
        sb.append("<td width='150px'>");
        sb.append("<select STYLE='width: 150px' id='" + displayDiv + "_addTransCatList'>");

        //Fill in Drop Down Option Values For Categories
        var numCategories = categoryArray.length;
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
                    sb.append("'>");

                    sb.append(category.Name + " - " + subCategory.Name);
                    sb.append("</option>");
                }
            }
        }

        sb.append("</select></td>");
        
        sb.append("<td width='60px' align='center'><input type='button' STYLE='width: 50px' value='Add' size='8' class='addButton' onclick='" + displayDiv +"_AddTrans();' /></td></tr>");
        sb.append("<tr><td><b>Date:</b></td>");
        sb.append("<td align='left' colspan='2'><TABLE cellspacing='0' cellpadding='0'><TR><TD><input type='text' size='10' id='" + displayDiv + "_addTransDate' value='" + todayString + "'/></TD>");
        sb.append("<TD>&nbsp;&nbsp;<a href='javascript:lcs(document.getElementById(\"" + displayDiv + "_addTransDate\"));'><img src='images/icon_calendar.png' border='0' alt='Open Calendar'></a></TD></TR></TABLE></td>");
        sb.append("<tr><td><b>Amount:</b></td><td align='left' colspan='2'><input type='text' name='zipAmount' size='10' id='" + displayDiv + "_addTransAmount' /></td></tr>");
        sb.append("<tr><td><b>Comments:</b></td><td colspan='2' align='left'><input type='text' size='23' style='width: 185px'  id='" + displayDiv + "_addTransComments' /></td></tr></table>");
        
        document.getElementById(displayDiv).innerHTML = sb.toString();
    };
    
    this.getTrans = function()
    {
        var trans = new Object();
        
        trans.Date = getFieldValue(displayDiv +"_addTransDate"); 
        trans.Amount = roundAmount(getFieldValue(displayDiv +"_addTransAmount"));
        trans.DisplayAmount = trans.Amount;
        trans.Description = getFieldValue(displayDiv +"_addTransComments");
        
        var categoryList = document.getElementById(displayDiv +"_addTransCatList");        
        if(categoryList)
        {
            trans.CategoryName = categoryList.options[categoryList.selectedIndex].text;
            trans.CategoryID = categoryList.options[categoryList.selectedIndex].value;
        }

        if (categoryList) 
        {
            var selectedIDs = categoryList.options[categoryList.selectedIndex].value.split(":");

            trans.CategoryName = categoryList.options[categoryList.selectedIndex].text;
            trans.CategoryID = selectedIDs[0];
            if (selectedIDs.length > 1) 
            {
                trans.SubCategoryID = selectedIDs[1];
            }
        }

        
        if(categoryType === "Expense")
        {
            trans.CategoryType = "E";
        }
        else if(categoryType === "Income")
        {
            trans.CategoryType = "I";
        }
        
        trans.state = "Adding";
        
        return trans;    
    };
    
    //Clear out Fields 
    this.clearFields = function()
    {
        document.getElementById(displayDiv +"_addTransAmount").value = "";
        document.getElementById(displayDiv +"_addTransComments").value = "";        
    }; 
}


