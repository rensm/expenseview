//navigation objects
var gadgetSelectedTab;
var gadgetPages = new Array('expGadgetPage', 'incomeGadgetPage', 'balanceGadgetPage');

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


//Page Load Functions
function loadGadget()
{
    var userDate = new Date();
    var year = userDate.getFullYear() + "";
    var month = (userDate.getMonth() + 1) + "";
    var date = userDate.getDate() + "";
    
    //Set Ajax Function call timeout to 10 seconds
    AjaxPro.timeoutPeriod = 10000;
           
    GadgetTracker.GetTransSummary(year, month, date, drawGadgetPages);        
}

//Navigation Functions
function drawGadgetPages(res)
{
    var rawTransData = JSON.parse(res.value);

    //Create Expense and Income Category Data
    expGadgetCatData = new CategoryData(rawTransData.ExpenseCategories);    
    incomeGadgetCatData = new CategoryData(rawTransData.IncomeCategories);        

    //Get Recent Expenses and Income
    newExpGadgetTrans = rawTransData.RecentExpenses.reverse();    
    newIncomeGadgetTrans = rawTransData.RecentIncome.reverse();

    //Draw Add Expense module
    expGadgetAddTransModule = new AddTransGadgetModule("addExpGadgetModule", "Expense");
    expGadgetAddTransModule.drawModule(expGadgetCatData.getCategories());
        
    //Draw new Expense Table
    expGadgetNewTransTable = new NewTransModule("newExpGadgetTable");
    expGadgetNewTransTable.drawModule(newExpGadgetTrans);    
    
    
    //Draw Add Income module
    incomeGadgetAddTransModule = new AddTransGadgetModule("addIncomeGadgetModule", "Income");
    incomeGadgetAddTransModule.drawModule(incomeGadgetCatData.getCategories());
        
    //Draw new Income Table
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

//Expense Functions
function addExp_TimeOut(time, request)
{
    request.abort();    
    var rowIndex = request.args.rowIndex;

    var transState = newExpGadgetTrans[rowIndex].state;
    
    if(transState === "Adding")
    {
        alert("Failed to Add new Expense. Request Timed out. Please try again");
        newExpGadgetTrans[rowIndex].state = "AddFailed";
    }
    else if(transState === "Deleting")
    {
        alert("Failed to Delete Expense. Request Timed out. Please try again");
        newExpGadgetTrans[rowIndex].state = "DeleteFailed";    
    }   
}

function addExp_CallBack(res)
{
    var rowIndex = res.context.RowIndex;    
    var resValue = res.value;
    
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
                
        //Insert New Transaction into database
        var transObjectString = JSON.stringify(expense);

        //Convert to string to send to server
        var rowIndex = newRowIndex + "";

        //Provide RowIndex as context
        var addContext = new Object();
        addContext.RowIndex = rowIndex;
                
        GadgetTracker.InsertTrans(transObjectString, rowIndex, addExp_CallBack, addContext, null, null, addExp_TimeOut);                        
        
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
        
    //Insert New Transaction into database
    var transObjectString = JSON.stringify(expense);

    //Provide RowIndex as context
    var addContext = new Object();
    addContext.RowIndex = rowIndex + "";
            
    GadgetTracker.InsertTrans(transObjectString, rowIndex + "", addExp_CallBack, addContext, null, null, addExp_TimeOut);                        
}

function deleteExp_CallBack(res)
{
    var rowIndex = res.context.RowIndex;    
    var resValue = res.value;
        
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
            
    var transId = newExpGadgetTrans[rowIndex].TransID + "";

    //Provide RowIndex as context
    var addContext = new Object();
    addContext.RowIndex = rowIndex;
            
    GadgetTracker.DeleteTrans(transId, rowIndex + "", deleteExp_CallBack, addContext, null, null, addExp_TimeOut);                            
 }


//Income Functions
function addIncome_TimeOut(time, request)
{
    request.abort();    
    var rowIndex = request.args.rowIndex;

    var transState = newIncomeGadgetTrans[rowIndex].state;
    
    if(transState === "Adding")
    {
        alert("Failed to Add new Income. Request Timed out. Please try again");
        newIncomeGadgetTrans[rowIndex].state = "AddFailed";
    }
    else if(transState === "Deleting")
    {
        alert("Failed to Delete Income. Request Timed out. Please try again");
        newIncomeGadgetTrans[rowIndex].state = "DeleteFailed";    
    }    
}

function addIncome_CallBack(res)
{
    var rowIndex = res.context.RowIndex;    
    var resValue = res.value;
    
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
                
        //Insert New Transaction into database
        var transObjectString = JSON.stringify(income);

        //Convert to string to send to server
        var rowIndex = newRowIndex + "";

        //Provide RowIndex as context
        var addContext = new Object();
        addContext.RowIndex = rowIndex;
                
        GadgetTracker.InsertTrans(transObjectString, rowIndex, addIncome_CallBack, addContext, null, null, addIncome_TimeOut);                        
        
        incomeGadgetAddTransModule.clearFields();    
    }
    else
    {
        alert("Invalid Amount specified. Please correct and try again");
    }
}

function newIncomeGadgetTable_RetryAddTrans(rowIndex)
{
    var income = newIncomeGadgetTrans[rowIndex];
        
    //Insert New Transaction into database
    var transObjectString = JSON.stringify(income);

    //Provide RowIndex as context
    var addContext = new Object();
    addContext.RowIndex = rowIndex + "";
            
    GadgetTracker.InsertTrans(transObjectString, rowIndex + "", addIncome_CallBack, addContext, null, null, addIncome_TimeOut);                        
}

function deleteIncome_CallBack(res)
{
    var rowIndex = res.context.RowIndex;    
    var resValue = res.value;
        
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
            
    var transId = newIncomeGadgetTrans[rowIndex].TransID + "";

    //Provide RowIndex as context
    var addContext = new Object();
    addContext.RowIndex = rowIndex;
            
    GadgetTracker.DeleteTrans(transId, rowIndex + "", deleteIncome_CallBack, addContext, null, null, addIncome_TimeOut);                            
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
        for(var transIndex=numTrans-1; transIndex>=0; transIndex--)
        {
            var trans = transArray[transIndex];
            sb.append("<tr><td align='left'>" + trans.CategoryName + "</td>");
            sb.append("<td align='center'>" + trans.Date + "</td>");
            sb.append("<td align='center'>" + roundAmount(trans.Amount) + "</td>");
            
            
            if(trans.State == "" || trans.State === "Current")
            {
                sb.append("<td align='left'><a href='javascript:" + displayDivName + "_DeleteTrans(" + transIndex + ");void(0);'>");
                sb.append("<img src='images/delete.gif' alt='Delete' border='0' /></a></td>"); 
            }                                
            else if(trans.State === "Adding" || trans.State === "Deleting")
            {
                sb.append("<td align='left'>");
                sb.append("<img src='images/loading.gif' alt='loading' border='0' />..");
                sb.append(trans.State + "</td>");                
            }
            else if(trans.State === "AddFailed")
            {
                sb.append("<td align='left'>");
                sb.append("<a href='javascript:" + displayDivName + "_RetryAddTrans(" + transIndex + ");void(0);'>");
                sb.append("<img src='images/error.gif' alt='loading' border='0' /> Retry Add</a></td>");
            }
            else if(trans.State === "DeleteFailed")
            {
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
        for(i=0; i<numCategories; i++)
        {   
            var category = categoryArray[i];
            sb.append("<option value='");
            sb.append(category.CategoryID);
            sb.append("'>");
            sb.append(category.Name);
            sb.append("</option>");        
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
        
        if(categoryType === "Expense")
        {
            trans.CategoryType = "E";
        }
        else if(categoryType === "Income")
        {
            trans.CategoryType = "I";
        }
        
        trans.State = "Adding";
        
        return trans;    
    };
    
    //Clear out Fields 
    this.clearFields = function()
    {
        document.getElementById(displayDiv +"_addTransAmount").value = "";
        document.getElementById(displayDiv +"_addTransComments").value = "";        
    }; 
}


