
function JsonService(url)
{this["GetUserSummary"]=function(yearString,monthString,dateString,callback)
{return call("GetUserSummary",[yearString,monthString,dateString],callback);}
this["GetTransSummary"]=function(yearString,monthString,dateString,callback)
{return call("GetTransSummary",[yearString,monthString,dateString],callback);}
this["InsertTrans"]=function(trans,rowIndex,startPage,callback)
{return call("InsertTrans",[trans,rowIndex,startPage],callback);}
this["DeleteTrans"]=function(transID,rowIndex,startPage,callback)
{return call("DeleteTrans",[transID,rowIndex,startPage],callback);}
this["UpdateTrans"]=function(trans,rowIndex,startPage,callback)
{return call("UpdateTrans",[trans,rowIndex,startPage],callback);}
this["InsertCategory"]=function(category,callback)
{return call("InsertCategory",[category],callback);}
this["system.listMethods"]=function(callback)
{return call("system.listMethods",[],callback);}
this["system.version"]=function(callback)
{return call("system.version",[],callback);}
this["system.about"]=function(callback)
{return call("system.about",[],callback);}
var url=typeof(url)==='string'?url:'http://localhost:8080/Service/ExpJSONService.ashx';var self=this;var nextId=0;function call(method,params,callback)
{var request={id:nextId++,method:method,params:params};return callback==null?callSync(method,request):callAsync(method,request,callback);}
function callSync(method,request)
{var http=newHTTP();http.open('POST',url,false,self.httpUserName,self.httpPassword);setupHeaders(http,method);http.send(JSON.stringify(request));if(http.status!=200)
throw{message:http.status+' '+http.statusText,toString:function(){return message;}};var response=JSON.eval(http.responseText);if(response.error!=null)throw response.error;return response.result;}
function callAsync(method,request,callback)
{var http=newHTTP();http.open('POST',url,true,self.httpUserName,self.httpPassword);setupHeaders(http,method);http.onreadystatechange=function(){http_onreadystatechange(http,callback);}
http.send(JSON.stringify(request));return request.id;}
function setupHeaders(http,method)
{http.setRequestHeader('Content-Type','text/plain; charset=utf-8');http.setRequestHeader('X-JSON-RPC',method);}
function http_onreadystatechange(sender,callback)
{if(sender.readyState==4)
{var response=sender.status==200?JSON.eval(sender.responseText):{};response.xmlHTTP=sender;callback(response);}}
function newHTTP()
{if(typeof(window)!='undefined'&&window.XMLHttpRequest)
return new XMLHttpRequest();else
return new ActiveXObject('Microsoft.XMLHTTP');}}
JsonService.rpcMethods=["GetUserSummary","GetTransSummary","InsertTrans","DeleteTrans","UpdateTrans","InsertCategory","system.listMethods","system.version","system.about"];
﻿function AddTransController(transType,transCatData,transTbl,transSummaryTbl,addTransModule)
{this.addTrans=function()
{var trans=addTransModule.getTrans();if(isValidTransForAdd(trans,transType))
{trans.State="Adding";var rowIndex=transTbl.addRow(trans);var startPage=1;transTbl.drawModule(startPage);addTransModule.clearFields();jsonService.InsertTrans(trans,rowIndex,startPage,function(response){response.context=new Object();response.context.rowIndex=rowIndex;response.context.startPage=startPage;addTrans_CallBack(response);})}};this.retryAddTrans=function(rowIndex,startPage)
{var trans=transTbl.getRow(rowIndex);trans.State="Adding";transTbl.updateRow(rowIndex,trans);transTbl.drawModule(startPage);jsonService.InsertTrans(trans,rowIndex,startPage,function(response){response.context=new Object();response.context.rowIndex=rowIndex;response.context.startPage=startPage;addTrans_CallBack(response);})};function addTrans_CallBack(response)
{var rowIndex=response.context.rowIndex;var trans=transTbl.getRow(rowIndex);var startPage=response.context.startPage;var resValue=response.result;if(resValue&&resValue!==-1)
{trans.TransID=resValue;trans.State="Current";transCatData.addTrans(trans.CategoryID,trans.Amount,trans.Date);transSummaryTbl.drawModule();}
else
{trans.State="AddFailed";alert("Failed to add "+transType+" record. Unexpected error ocurred. Please retry");}
transTbl.updateRow(rowIndex,trans);transTbl.drawModule(startPage);}
function isValidTransForAdd(trans,transType)
{if(!isValidDate(trans.Date))
{alert("Cannot Add "+transType+".  Invalid Date Specified.");return false;}
if(!isValidAmount(trans.Amount))
{alert("Cannot Add "+transType+".  Invalid Amount Specified.");return false;}
return true;}}
var CategoryController=new function()
{function isValidCategory(category,operation)
{if(!category.Name||category.Name==="")
{alert("Cannot "+operation+" Category.  Category Name was not specified");return false;}
var catFieldDesc="";if(category.CategoryType==="E"){catFieldDesc="Budget";}else{catFieldDesc="Amount";}
if(category.yearBudget&&!isValidAmount(category.yearBudget))
{alert("Cannot "+operation+" Category.  Invalid amount specified for Year"+catFieldDesc);return false;}
if(category.monthBudget&&!isValidAmount(category.monthBudget))
{alert("Cannot "+operation+" Category.  Invalid amount specified for Month "+catFieldDesc);return false;}
if(category.weekBudget&&!isValidAmount(category.weekBudget))
{alert("Cannot "+operation+" Category.  Invalid amount specified for Week  "+catFieldDesc);return false;}
return true;}
function getRandomColor()
{var array=new Array("f","e","d","c","b","a","9","8","7","6","5","4","3","2","1");var hexColor="";for(var i=0;i<6;i++)
{hexColor+=array[Math.floor(Math.random()*array.length)];}
return hexColor;};this.updateCategory=function(category)
{var updCatResult=false;if(isValidCategory(category,"update"))
{var catString=JSON.stringify(category);var updResultCode=ExpenseTracker.UpdateCategory(catString).value;if(updResultCode&&updResultCode==1)
{updCatResult=true;}
else
{alert("Failed to update category.  Unexpected error ocurred when updating database.  Please retry.\nIf this fails continuously, please sign out and sign in again.");}}
return updCatResult;};this.insertCategory=function(category)
{var insCatResult=false;if(isValidCategory(category,"add"))
{category.Color=getRandomColor();alert(category.name);jsonService.InsertCategory(category,function(response){var catID=response.result;if(catID&&catID!=-1)
{category.CategoryID=catID;insCatResult=true;}
else
{alert("Error ocurred when adding Category.  Please retry.\nIf this fails continuously, please sign out and sign in again.");}})}
return insCatResult;};this.deleteCategory=function(category,categoryType)
{var delCatResult=false;if(confirm("Are you sure you want to delete the "+category.Name+" category? \nDeleting this category will also delete ALL "+categoryType+" records for this category!"))
{var catID=category.CategoryID+"";var delResultCode=ExpenseTracker.DeleteCategory(catID).value;if(delResultCode&&delResultCode==1)
{delCatResult=true;}
else
{alert("Unexpected error ocurred when trying to update database.  Please retry.\nIf this fails continuously, please sign out and sign in again.");}
return delCatResult;}};};
﻿function EditRecentTransController(transType,transCatData,transTbl,transSummaryTbl)
{this.updateTrans=function(rowIndex,startPage)
{var priorTrans=transTbl.getRow(rowIndex);transTbl.setPriorTrans(priorTrans);var newTrans=transTbl.getModifiedRow(rowIndex);if(isValidTransForUpdate(newTrans,transType))
{internalUpdateTrans(rowIndex,startPage,priorTrans,newTrans);}};this.retryUpdateTrans=function(rowIndex,startPage)
{var newTrans=transTbl.getRow(rowIndex);var priorTrans=transTbl.getPriorTrans(newTrans.transID);internalUpdateTrans(rowIndex,startPage,priorTrans,newTrans);};this.deleteTrans=function(rowIndex,startPage)
{var trans=transTbl.getRow(rowIndex);if(confirm("Are you sure you want to delete this "+transType+" record?\n--> "+trans.CategoryName+": "+roundAmount(trans.Amount)))
{transTbl.updateRowState(rowIndex,"Deleting");transTbl.drawModule(startPage);jsonService.DeleteTrans(trans.TransID,rowIndex,startPage,function(response){response.context=new Object();response.context.rowIndex=rowIndex;response.context.trans=trans;response.context.startPage=startPage;deleteTrans_CallBack(response);});}};function isValidTransForUpdate(trans,transType)
{if(!isValidDate(trans.Date))
{alert("Cannot update "+transType+".  Invalid Date Specified.");return false;}
if(!isValidAmount(trans.Amount))
{alert("Cannot update "+transType+".  Invalid Amount Specified.");return false;}
return true;}
function updateTrans_CallBack(response)
{var rowIndex=response.context.rowIndex;var newTrans=response.context.newTrans;var priorTrans=response.context.priorTrans;var startPage=response.context.startPage;var resValue=response.result;if(resValue&&resValue!==-1)
{transTbl.updateRow(rowIndex,newTrans);transTbl.updateRowState(rowIndex,"Current");transCatData.deleteTrans(priortrans.CategoryID,priortrans.Amount,priorTrans.date);transCatData.addTrans(newtrans.CategoryID,newtrans.Amount,newTrans.date);transSummaryTbl.drawModule();}
else
{transTbl.updateRow(rowIndex,newTrans);transTbl.updateRowState(rowIndex,"UpdateFailed");alert("Failed to update "+transType+" record. Unexpected error ocurred. Please retry");}
transTbl.drawModule(startPage);}
function internalUpdateTrans(rowIndex,startPage,priorTrans,newTrans)
{newTrans.state="Updating";transTbl.updateRow(rowIndex,newTrans);transTbl.drawModule(startPage);jsonService.UpdateTrans(newTrans,rowIndex,startPage,function(response){response.context=new Object();response.context.rowIndex=rowIndex;response.context.priorTrans=priorTrans;response.context.newTrans=newTrans;response.context.startPage=startPage;updateTrans_CallBack(response);});}
function deleteTrans_CallBack(response)
{var rowIndex=response.context.rowIndex;var startPage=response.context.startPage;var trans=response.context.Trans;var resValue=res.value;if(resValue&&resValue!==-1)
{transTbl.deleteRow(rowIndex);transTbl.drawModule(startPage);transCatData.deleteTrans(trans.CategoryID,trans.Amount,trans.Date);transSummaryTbl.drawModule();}
else
{transTbl.updateRowState(rowIndex,"DeleteFailed");transTbl.drawModule(startPage);alert("Failed to delete "+transType+" record. Unexpected error ocurred. Please retry");}}}
var pages=new Array('expensePage','incomePage','balancePage','loadingPage');var adPanels=new Array('expenseAds','incomeAds','balanceAds');var expensePanels=new Array('addExpPanel','searchExpPanel','expCategoryPanel','expTrends','expPieChartPanel');var incomePanels=new Array('addIncomePanel','searchIncomePanel','incomeCategoryPanel','incomePieChartPanel');var balancePanels=new Array('balanceSumPanel');var currentExpLinkId="addExpLink";var currentIncomeLinkId="addIncomeLink";var currentBalanceLinkId="balanceSumLink";var linkMenus=new Array('expenseLinks','incomeLinks','balanceLinks');var selectedTab=null;var currentPage="";var expenseAjaxPage;var incomeAjaxPage;var balanceAjaxPage;var transData=null;var expCategoryData=null;var incomeCategoryData=null;var jsonService=new JsonService();function loadApp()
{var userDate=new Date();var year=userDate.getFullYear()+"";var month=(userDate.getMonth()+1)+"";var date=userDate.getDate()+"";expenseAjaxPage=new AjaxPage("expensePage_v1.4.htm","expensePage");incomeAjaxPage=new AjaxPage("incomePage_v1.4.htm","incomePage");balanceAjaxPage=new AjaxPage("balancePage_v1.4.htm","balancePage");jsonService.GetUserSummary(year,month,date,viewFirstPage);}
function viewFirstPage(response)
{transData=JSON.parse(response.result);expCategoryData=new CategoryData(transData.ExpenseCategories);incomeCategoryData=new CategoryData(transData.IncomeCategories);viewPage("expense");}
function viewPage(pageName,linkId)
{if(currentPage!==pageName)
{currentPage=pageName;highlightTab(pageName);showPage("loading");showLinkMenu(pageName);if(pageName==="expense")
{showAd("expenseAds");if(!expenseAjaxPage.isLoaded())
{expenseAjaxPage.loadPage("viewExpensePanel()");}
else
{viewExpensePanel(linkId);}}
else if(pageName==="income")
{showAd("incomeAds");if(!incomeAjaxPage.isLoaded())
{incomeAjaxPage.loadPage("viewIncomePanel()");}
else
{viewIncomePanel(linkId);}}
else if(pageName==="balance")
{showAd("balanceAds");if(!balanceAjaxPage.isLoaded())
{balanceAjaxPage.loadPage("viewBalancePanel()");}
else
{viewBalancePanel(linkId);}}}}
function showPage(pageName)
{for(var i=0;i<pages.length;i++)
{document.getElementById(pages[i]).style.display=((pageName+'Page')==pages[i])?'block':'none';}}
function showPanel(panelArray,panelName)
{for(var i=0;i<panelArray.length;i++)
{document.getElementById(panelArray[i]).style.display=(panelName==panelArray[i])?'block':'none';}}
function showLinkMenu(linkMenuName)
{for(var i=0;i<linkMenus.length;i++)
{document.getElementById(linkMenus[i]).style.display=((linkMenuName+'Links')==linkMenus[i])?'block':'none';}}
function selectLink(currentLinkId,newLinkId)
{if(currentLinkId)
{var currentLink=document.getElementById(currentLinkId);currentLink.className="panelLink";}
var selectedLink=document.getElementById(newLinkId);selectedLink.className="selPanelLink";}
function highlightTab(tabID)
{if(selectedTab)
{selectedTab.className="tab";}
selectedTab=document.getElementById((tabID+'Tab'));selectedTab.className="selectedTab";}
function viewExpensePanel(linkId)
{showPage("expense");if(!linkId)
{linkId=currentExpLinkId;}
else
{selectLink(currentExpLinkId,linkId);}
showExpensePanel("loadingPanel");if(linkId==="addExpLink")
{drawAddExpensePanel();}
else if(linkId==="searchExpLink")
{drawSearchExpensePanel();}
else if(linkId==="expCategoryLink")
{drawExpCategoryPanel();}
else if(linkId==="expBreakdownLink")
{drawExpPieChart();}
else if(linkId==="expTrends")
{drawExpTrendsPanel();}
currentExpLinkId=linkId;}
function showExpensePanel(panelName)
{showPanel(expensePanels,panelName);}
function viewIncomePanel(linkId)
{showPage("income");if(!linkId)
{linkId=currentIncomeLinkId;}
else
{selectLink(currentIncomeLinkId,linkId);}
if(linkId==="addIncomeLink")
{drawAddIncomePanel();}
else if(linkId==="searchIncomeLink")
{drawSearchIncomePanel();}
else if(linkId==="incomeCategoryLink")
{drawIncomeCategoryPanel();}
else if(linkId==="incomeBreakdownLink")
{drawIncomePieChart();}
currentIncomeLinkId=linkId;}
function showIncomePanel(panelName)
{showPanel(incomePanels,panelName);}
function viewBalancePanel(linkId)
{showPage("balance");if(!linkId)
{linkId=currentBalanceLinkId;}
else
{selectLink(currentBalanceLinkId,linkId);}
if(linkId==="balanceSumLink")
{drawBalanceSummary();}
currentBalanceLinkId=linkId;}
function showBalancePanel(panelName)
{showPanel(balancePanels,panelName);}
function showAd(adType)
{showPanel(adPanels,adType);}
function validTrans(trans,editAction,transType)
{if(!isValidDate(trans.Date))
{alert("Cannot "+editAction+" "+transType+".  Invalid Date Specified.");return false;}
if(!isValidAmount(trans.Amount))
{alert("Cannot "+editAction+" "+transType+".  Invalid Amount Specified.");return false;}
return true;}
function AddTransProcessor(transType,transCatData,transTbl,transSummaryTbl,addTransModule)
{function addTransProc_TimeOut(time,request)
{request.abort();var rowIndex=request.args.rowIndex;var startPage=request.args.startPage;var timedOutTrans=transTbl.getRow(rowIndex);var editAction;if(request.method==="UpdateTrans")
{timedOutTrans.state="UpdateFailed";editAction="update";}
else if(request.method==="DeleteTrans")
{timedOutTrans.state="DeleteFailed";editAction="delete";}
transTbl.updateRow(rowIndex,timedOutTrans);transTbl.drawModule(startPage);alert("Failed to "+editAction+" "+transType+" record. Request Timed out. Please retry");}
function addTrans_CallBack(response)
{var rowIndex=response.context.rowIndex;var trans=transTbl.getRow(rowIndex);var startPage=response.context.startPage;var resValue=response.result;if(resValue&&resValue!==-1)
{trans.TransID=resValue;trans.State="Current";transCatData.addTrans(trans.CategoryID,trans.Amount,trans.Date);transSummaryTbl.drawModule();}
else
{trans.State="AddFailed";alert("Failed to add "+transType+" record. Unexpected error ocurred. Please retry");}
transTbl.updateRow(rowIndex,trans);transTbl.drawModule(startPage);}
this.retryAddTrans=function(rowIndex,startPage)
{var trans=transTbl.getRow(rowIndex);trans.State="Adding";transTbl.updateRow(rowIndex,trans);transTbl.drawModule(startPage);jsonService.InsertTrans(trans,rowIndex,startPage,function(response){response.context=new Object();response.context.rowIndex=rowIndex;response.context.startPage=startPage;addTrans_CallBack(response);})};this.addTrans=function()
{var trans=addTransModule.getTrans();if(validTrans(trans,"Add",transType))
{trans.State="Adding";var rowIndex=transTbl.addRow(trans);var startPage=1;transTbl.drawModule(startPage);addTransModule.clearFields();jsonService.InsertTrans(trans,rowIndex,startPage,function(response){response.context=new Object();response.context.rowIndex=rowIndex;response.context.startPage=startPage;addTrans_CallBack(response);})}};function updateTrans_CallBack(response)
{var rowIndex=response.context.rowIndex;var newTrans=response.context.newTrans;var priorTrans=response.context.priorTrans;var startPage=response.context.startPage;var resValue=response.result;if(resValue&&resValue!==-1)
{transTbl.updateRow(rowIndex,newTrans);transTbl.updateRowState(rowIndex,"Current");transCatData.deleteTrans(priortrans.CategoryID,priortrans.Amount,priorTrans.date);transCatData.addTrans(newtrans.CategoryID,newtrans.Amount,newTrans.date);transSummaryTbl.drawModule();}
else
{transTbl.updateRow(rowIndex,newTrans);transTbl.updateRowState(rowIndex,"UpdateFailed");alert("Failed to update "+transType+" record. Unexpected error ocurred. Please retry");}
transTbl.drawModule(startPage);}
function internalUpdateTrans(rowIndex,startPage,priorTrans,newTrans)
{newTrans.state="Updating";transTbl.updateRow(rowIndex,newTrans);transTbl.drawModule(startPage);var updateContext=new Object();updateContext.RowIndex=rowIndex;updateContext.PriorTrans=priorTrans;updateContext.NewTrans=newTrans;updateContext.StartPage=startPage;jsonService.UpdateTrans(newTrans,rowIndex,startPage,function(response){response.context=new Object();response.context.rowIndex=rowIndex;response.context.priorTrans=priorTrans;response.context.newTrans=newTrans;response.context.startPage=startPage;updateTrans_CallBack(response);});}
this.updateTrans=function(rowIndex,startPage)
{var priorTrans=transTbl.getRow(rowIndex);transTbl.setPriorTrans(priorTrans);var newTrans=transTbl.getModifiedRow(rowIndex);if(validTrans(newTrans,"Update",transType))
{internalUpdateTrans(rowIndex,startPage,priorTrans,newTrans);}};this.retryUpdateTrans=function(rowIndex,startPage)
{var newTrans=transTbl.getRow(rowIndex);var priorTrans=transTbl.getPriorTrans(newTrans.transID);internalUpdateTrans(rowIndex,startPage,priorTrans,newTrans);};function deleteTrans_CallBack(res)
{var rowIndex=res.context.RowIndex;var startPage=res.context.StartPage;var trans=res.context.Trans;var resValue=res.value;if(resValue&&resValue!==-1)
{transTbl.deleteRow(rowIndex);transTbl.drawModule(startPage);transCatData.deleteTrans(trans.CategoryID,trans.Amount,trans.Date);transSummaryTbl.drawModule();}
else
{transTbl.updateRowState(rowIndex,"DeleteFailed");transTbl.drawModule(startPage);alert("Failed to delete "+transType+" record. Unexpected error ocurred. Please retry");}}
this.deleteTrans=function(rowIndex,startPage)
{var trans=transTbl.getRow(rowIndex);if(confirm("Are you sure you want to delete this "+transType+" record?\n--> "+trans.CategoryName+": "+roundAmount(trans.Amount)))
{transTbl.updateRowState(rowIndex,"Deleting");transTbl.drawModule(startPage);var deleteContext=new Object();deleteContext.RowIndex=rowIndex;deleteContext.Trans=trans;deleteContext.StartPage=startPage;rowIndex=rowIndex+"";startPage=startPage+"";ExpenseTracker.DeleteTrans(trans.TransID+"",rowIndex,startPage,deleteTrans_CallBack,deleteContext,null,null,addTransProc_TimeOut);}};}
function SearchTransProcessor(transType,transCatData,searchTransTbl,recentTransTbl)
{function searchTransProc_TimeOut(time,request)
{request.abort();var rowIndex=request.args.rowIndex;var startPage=request.args.startPage;var timedOutTrans=transTbl.getRow(rowIndex);var editAction;if(request.method==="UpdateTrans")
{timedOutTrans.state="UpdateFailed";editAction="update";}
else if(request.method==="DeleteTrans")
{timedOutTrans.state="DeleteFailed";editAction="delete";}
searchTransTbl.updateRow(rowIndex,timedOutTrans);searchTransTbl.drawModule(startPage);alert("Failed to "+editAction+" "+transType+" record. Request Timed out. Please retry");}
function updateTrans_CallBack(res)
{var rowIndex=res.context.RowIndex;var newTrans=res.context.NewTrans;var priorTrans=res.context.PriorTrans;var startPage=res.context.StartPage;var resValue=res.value;if(resValue&&resValue!==-1)
{newTrans.state="Current";searchTransTbl.updateRow(rowIndex,newTrans);searchTransTbl.drawModule(startPage);recentTransTbl.updateRowByTransID(newTrans.transID,newTrans);transCatData.deleteTrans(priortrans.CategoryID,priortrans.Amount,priorTrans.date);transCatData.addTrans(newtrans.CategoryID,newtrans.Amount,newTrans.date);}
else
{newTrans.state="UpdateFailed";searchTransTbl.updateRow(rowIndex,newTrans);searchTransTbl.drawModule(startPage);alert("Failed to update "+transType+" record. Unexpected error ocurred. Please retry");}}
internalUpdateTrans=function(rowIndex,startPage,priorTrans,newTrans)
{newTrans.state="Updating";searchTransTbl.updateRow(rowIndex,newTrans);searchTransTbl.drawModule(startPage);var transObjectString=JSON.stringify(newTrans);var updateContext=new Object();updateContext.RowIndex=rowIndex;updateContext.PriorTrans=priorTrans;updateContext.NewTrans=newTrans;updateContext.StartPage=startPage;rowIndex=rowIndex+"";startPage=startPage+"";ExpenseTracker.UpdateTrans(transObjectString,rowIndex,startPage,updateTrans_CallBack,updateContext,null,null,searchTransProc_TimeOut);}
this.retryUpdateTrans=function(rowIndex,startPage)
{var newTrans=searchTransTbl.getRow(rowIndex);var priorTrans=searchTransTbl.getPriorTrans(newTrans.transID);internalUpdateTrans(rowIndex,startPage,priorTrans,newTrans);};this.updateTrans=function(rowIndex,startPage)
{var priorTrans=searchTransTbl.getRow(rowIndex);searchTransTbl.setPriorTrans(priorTrans);var newTrans=searchTransTbl.getModifiedRow(rowIndex);if(validTrans(newTrans,"Update",transType))
{internalUpdateTrans(rowIndex,startPage,priorTrans,newTrans);}};function deleteTrans_CallBack(res)
{var rowIndex=res.context.RowIndex;var startPage=res.context.StartPage;var trans=res.context.Trans;var resValue=res.value;if(resValue&&resValue!==-1)
{searchTransTbl.deleteRow(rowIndex);searchTransTbl.drawModule(startPage);recentTransTbl.deleteRowByTransID(trans.TransID);transCatData.deleteTrans(trans.CategoryID,trans.Amount,trans.Date);}
else
{trans.State="DeleteFailed";searchTransTbl.updateRow(rowIndex,trans);alert("Failed to delete "+transType+" record. Unexpected error ocurred. Please retry");}}
this.deleteTrans=function(rowIndex,startPage)
{var trans=searchTransTbl.getRow(rowIndex);if(confirm("Are you sure you want to delete this "+transType+" record?\n--> "+trans.CategoryName+": "+roundAmount(trans.Amount)))
{trans.State="Deleting";searchTransTbl.updateRow(rowIndex,trans);searchTransTbl.drawModule(startPage);var deleteContext=new Object();deleteContext.RowIndex=rowIndex;deleteContext.Trans=trans;deleteContext.StartPage=startPage;rowIndex=rowIndex+"";startPage=startPage+"";ExpenseTracker.DeleteTrans(trans.TransID+"",rowIndex,startPage,deleteTrans_CallBack,deleteContext,null,null,searchTransProc_TimeOut);}};}
function CategoryData(categoryArray)
{calculateTotalBudgets();var catHashtable;var subCatHashtable;var totalYearBudget;var totalMonthBudget;var totalWeekBudget;var totalVal;var totalYearVal;var totalPriorMonthVal;var totalMonthVal;var totalPriorWeekVal;var totalWeekVal;var totalCustomVal;var customStartDate;var customEndDate;var customDataLoaded=false;var catMonthAmountTable;var catMonthAmounts;createHashtable();function createHashtable()
{catHashtable=new Object();subCatHashtable=new Object();var numCategories=categoryArray.length;for(var i=0;i<numCategories;i++)
{var category=categoryArray[i];catHashtable[category.CategoryID]=category;if(category.SubCategories)
{var numSubCategories=category.SubCategories.length;for(var j=0;j<numSubCategories;j++)
{var subCategory=category.SubCategories[j];subCatHashtable[subCategory.SubCategoryID]=subCategory;}}}}
function calculateTotalBudgets()
{var numCategories=categoryArray.length;totalVal=0;totalYearVal=0;totalPriorMonthVal=0;totalMonthVal=0;totalPriorWeekVal=0;totalWeekVal=0;for(var i=0;i<numCategories;i++)
{totalVal+=(categoryArray[i].TotalAmount*1);totalYearVal+=(categoryArray[i].YearAmount*1);totalPriorMonthVal+=(categoryArray[i].PriorMonthAmount*1);totalMonthVal+=(categoryArray[i].MonthAmount*1);totalPriorWeekVal+=(categoryArray[i].PriorWeekAmount*1);totalWeekVal+=(categoryArray[i].WeekAmount*1);if(categoryArray[i].YearBudget)
{if(!totalYearBudget)
{totalYearBudget=0;}
totalYearBudget+=(parseFloat(categoryArray[i].YearBudget));}
if(categoryArray[i].MonthBudget)
{if(!totalMonthBudget)
{totalMonthBudget=0;}
totalMonthBudget+=(parseFloat(categoryArray[i].MonthBudget));}
if(categoryArray[i].WeekBudget)
{if(!totalWeekBudget)
{totalWeekBudget=0;}
totalWeekBudget+=(parseFloat(categoryArray[i].WeekBudget));}}}
function sortCategoryArray()
{var numCategories=categoryArray.length;for(var i=0;i<(numCategories-1);i++)
{for(var j=i+1;j<numCategories;j++)
{if(categoryArray[j].Name.toUpperCase()<categoryArray[i].Name.toUpperCase())
{var dummy=categoryArray[i];categoryArray[i]=categoryArray[j];categoryArray[j]=dummy;}}}}
function addToTotalBudgets(yearBudget,monthBudget,weekBudget)
{if(yearBudget)
{totalYearBudget+=yearBudget*1;}
if(monthBudget)
{totalMonthBudget+=monthBudget*1;}
if(weekBudget)
{totalWeekBudget+=weekBudget*1;}}
function deleteFromTotalBudgets(yearBudget,monthBudget,weekBudget)
{if(yearBudget)
{totalYearBudget-=yearBudget*1;}
if(monthBudget)
{totalMonthBudget-=monthBudget*1;}
if(weekBudget)
{totalWeekBudget-=weekBudget*1;}}
function deleteFromTotalAmount(deletedCat)
{if(deletedCat.YearAmount)
{totalYearVal-=deletedCat.YearAmount*1;}
if(deletedCat.PriorMonthAmount)
{totalPriorMonthVal-=deletedCat.PriorMonthAmount*1;}
if(deletedCat.MonthAmount)
{totalMonthVal-=deletedCat.MonthAmount*1;}
if(deletedCat.PriorWeekAmount)
{totalPriorWeekVal-=deletedCat.PriorWeekAmount*1;}
if(deletedCat.WeekAmount)
{totalWeekVal-=deletedCat.WeekAmount*1;}}
function y2k(number)
{return(number<1000)?number+1900:number;}
function getWeek(year,month,day)
{var when=new Date(year,month,day);var newYear=new Date(year,0,1);var offset=7+1-newYear.getDay();if(offset===8)
{offset=1;}
var daynum=((Date.UTC(y2k(year),when.getMonth(),when.getDate(),0,0,0)-Date.UTC(y2k(year),0,1,0,0,0))/1000/60/60/24)+1;var weeknum=Math.floor((daynum-offset+7)/7);if(weeknum===0)
{year--;var prevNewYear=new Date(year,0,1);var prevOffset=7+1-prevNewYear.getDay();if(prevOffset==2||prevOffset==8)
{weeknum=53;}
else
{weeknum=52;}}
return weeknum;}
function getPriorWeek(year,month,day)
{var priorWeekNum=getWeek(year,month,day)-1;if(priorWeekNum===0)
{year--;var prevNewYear=new Date(year,0,1);var prevOffset=7+1-prevNewYear.getDay();if(prevOffset==2||prevOffset==8)
{weeknum=53;}
else
{weeknum=52;}}
return priorWeekNum;}
function getPriorMonth(month)
{if(month===0)
{return 11;}
else
{return month-1;}}
function addDeleteTrans(categoryID,amountString,dateString,operationType)
{var transModifier;if(operationType=="Add")
{transModifier=1;}
else if(operationType=="Delete")
{transModifier=-1;}
var amount=amountString*transModifier;var category=catHashtable[categoryID];category.TotalAmount=roundAmount((category.TotalAmount*1)+amount);totalVal+=amount;var dateArray=dateString.split("-");var transYear=dateArray[0];var transMonth=dateArray[1]-1;var transDate=dateArray[2];var transWeek=getWeek(transYear,transMonth,transDate);var today=new Date();var todayYear=today.getFullYear();var todayMonth=today.getMonth();var todayDate=today.getDate();var todayPriorMonth=getPriorMonth(todayMonth);var todayWeek=getWeek(todayYear,todayMonth,todayDate);var todayPriorWeek=getPriorWeek(todayYear,todayMonth,todayDate);if(customStartDate&&customEndDate)
{var transFullDate=new Date(transYear,transMonth,transDate);if((transFullDate>=customStartDate)&&(transFullDate<=customEndDate))
{category.CustomDateAmount=roundAmount((category.CustomDateAmount*1)+amount);totalCustomVal+=amount;}}
if(transYear==todayYear)
{category.YearAmount=roundAmount((category.YearAmount*1)+amount);totalYearVal+=amount;if(transMonth==todayPriorMonth)
{category.PriorMonthAmount=roundAmount((category.PriorMonthAmount*1)+amount);totalPriorMonthVal+=amount;if(transWeek==todayPriorWeek)
{category.PriorWeekAmount=roundAmount((category.PriorWeekAmount*1)+amount);totalPriorWeekVal+=amount;}
else if(transWeek==todayWeek)
{category.WeekAmount=roundAmount((category.WeekAmount*1)+amount);totalWeekVal+=amount;}}
else if(transMonth==todayMonth)
{category.MonthAmount=roundAmount((category.MonthAmount*1)+amount);totalMonthVal+=amount;if(transWeek==todayPriorWeek)
{category.PriorWeekAmount=roundAmount((category.PriorWeekAmount*1)+amount);totalPriorWeekVal+=amount;}
else if(transWeek==todayWeek)
{category.WeekAmount=roundAmount((category.WeekAmount*1)+amount);totalWeekVal+=amount;}}}
else if(transYear==(todayYear-1))
{if(transMonth==todayPriorMonth)
{category.PriorMonthAmount=roundAmount((category.PriorMonthAmount*1)+amount);totalPriorMonthVal+=amount;if(transWeek==todayPriorWeek)
{category.PriorWeekAmount=roundAmount((category.PriorWeekAmount*1)+amount);totalPriorWeekVal+=amount;}}}}
this.setCategoryMonthAmount=function(catMonthAmountArray)
{catMonthAmounts=catMonthAmountArray;catMonthAmountTable=new Object();var numMonths=catMonthAmountArray.length;for(var i=0;i<numMonths;i++)
{var monthAmountKey=catMonthAmountArray[i].year+""+catMonthAmountArray[i].month;catHashtable[monthAmountKey]=catMonthAmountArray[i];}};this.getCategoryMonthAmount=function()
{return catMonthAmounts;};this.setCustomDate=function(startDateString,endDateString)
{var dateArray=startDateString.split("-");customStartDate=new Date(dateArray[0]*1,((dateArray[1]*1)-1),dateArray[2]*1);dateArray=endDateString.split("-");customEndDate=new Date(dateArray[0],((dateArray[1]*1)-1),dateArray[2]);};this.setCustomDateAmount=function(custDateArray)
{totalCustomVal=0;var numCustom=custDateArray.length;for(custIndex=0;custIndex<numCustom;custIndex++)
{var custCategory=custDateArray[custIndex];catHashtable[custCategory.categoryID].CustomDateAmount=custCategory.CustomDateAmount;if(custCategory.CustomDateAmount)
{totalCustomVal+=(custCategory.CustomDateAmount*1);}}
customDataLoaded=true;};this.isCustomDataLoaded=function()
{return customDataLoaded;};this.getCustomStartDate=function()
{return customStartDate;};this.getCustomEndDate=function()
{return customEndDate;};this.getCategoryName=function(catID)
{if(catHashtable[catID])
{return catHashtable[catID].Name;}};this.getTotalYearBudget=function()
{return roundAmount(totalYearBudget);};this.getTotalMonthBudget=function()
{return roundAmount(totalMonthBudget);};this.getTotalWeekBudget=function()
{return roundAmount(totalWeekBudget);};this.getTotalCustomDateAmount=function()
{return totalCustomVal;};this.getTotalAllTimeAmount=function()
{return roundAmount(totalVal);};this.getTotalYearAmount=function()
{return roundAmount(totalYearVal);};this.getTotalPriorMonthAmount=function()
{return roundAmount(totalPriorMonthVal);};this.getTotalMonthAmount=function()
{return roundAmount(totalMonthVal);};this.getTotalPriorWeekAmount=function()
{return roundAmount(totalPriorWeekVal);};this.getTotalWeekAmount=function()
{return roundAmount(totalWeekVal);};this.getSubCategoryName=function(subCategoryId)
{return subCatHashtable[subCategoryId].Name;}
this.addTrans=function(categoryID,amountString,dateString)
{addDeleteTrans(categoryID,amountString,dateString,"Add");};this.deleteTrans=function(categoryID,amountString,dateString)
{addDeleteTrans(categoryID,amountString,dateString,"Delete");};this.getCategories=function()
{return categoryArray;};this.getCategory=function(arrayIndex)
{return categoryArray[arrayIndex];};this.addCategory=function(newCategory)
{newCategory.WeekAmount=0;newCategory.PriorWeekAmount=0;newCategory.MonthAmount=0;newCategory.PriorMonthAmount=0;newCategory.YearAmount=0;var numCategories=categoryArray.length;categoryArray[numCategories]=newCategory;sortCategoryArray();createHashtable();addToTotalBudgets(newCategory.YearBudget,newCategory.MonthBudget,newCategory.WeekBudget);};this.updateCategory=function(arrayIndex,newCat)
{var currentCat=categoryArray[arrayIndex];deleteFromTotalBudgets(currentCat.YearBudget,currentCat.MonthBudget,currentCat.WeekBudget);addToTotalBudgets(newCat.YearBudget,newCat.MonthBudget,newCat.WeekBudget);categoryArray[arrayIndex].Name=newCat.Name;categoryArray[arrayIndex].Description=newCat.Description;categoryArray[arrayIndex].YearBudget=newCat.yearBudget;categoryArray[arrayIndex].MonthBudget=newCat.monthBudget;categoryArray[arrayIndex].WeekBudget=newCat.weekBudget;categoryArray[arrayIndex].Selected=false;sortCategoryArray();createHashtable();};this.deleteCategory=function(arrayIndex)
{var delCat=categoryArray[arrayIndex];deleteFromTotalBudgets(delCat.YearBudget,delCat.MonthBudget,delCat.WeekBudget);deleteFromTotalAmount(delCat);categoryArray.splice(arrayIndex,1);createHashtable();};this.selectCategory=function(arrayIndex)
{categoryArray[arrayIndex].Selected=true;};this.deselectCategory=function(arrayIndex)
{categoryArray[arrayIndex].Selected=false;};};
var JSON=function(){var m={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},s={'boolean':function(x){return String(x);},number:function(x){return isFinite(x)?String(x):'null';},string:function(x){if(/["\\\x00-\x1f]/.test(x)){x=x.replace(/([\x00-\x1f\\"])/g,function(a,b){var c=m[b];if(c){return c;}
c=b.charCodeAt();return'\\u00'+
Math.floor(c/16).toString(16)+
(c%16).toString(16);});}
return'"'+x+'"';},object:function(x){if(x){var a=[],b,f,i,l,v;if(x instanceof Array){a[0]='[';l=x.length;for(i=0;i<l;i+=1){v=x[i];f=s[typeof v];if(f){v=f(v);if(typeof v=='string'){if(b){a[a.length]=',';}
a[a.length]=v;b=true;}}}
a[a.length]=']';}else if(x instanceof Date){function p(n){return n<10?'0'+n:n;};var tz=x.getTimezoneOffset();if(tz!=0){var tzh=Math.floor(Math.abs(tz)/60);var tzm=Math.abs(tz)%60;tz=(tz<0?'+':'-')+p(tzh)+':'+p(tzm);}
else{tz='Z';}
return'"'+
x.getFullYear()+'-'+
p(x.getMonth()+1)+'-'+
p(x.getDate())+'T'+
p(x.getHours())+':'+
p(x.getMinutes())+':'+
p(x.getSeconds())+tz+'"';}else if(x instanceof Object){a[0]='{';for(i in x){v=x[i];f=s[typeof v];if(f){v=f(v);if(typeof v=='string'){if(b){a[a.length]=',';}
a.push(s.string(i),':',v);b=true;}}}
a[a.length]='}';}else{return;}
return a.join('');}
return'null';}};return{copyright:'(c)2005 JSON.org',license:'http://www.crockford.com/JSON/license.html',stringify:function(v){var f=s[typeof v];if(f){v=f(v);if(typeof v=='string'){return v;}}
return null;},eval:function(text){try{if(/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(text)){return eval('('+text+')');}}catch(e){}
throw new SyntaxError("eval");},parse:function(text){var at=0;var ch=' ';function error(m){throw{name:'JSONError',message:m,at:at-1,text:text};}
function next(){ch=text.charAt(at);at+=1;return ch;}
function white(){while(ch){if(ch<=' '){next();}else if(ch=='/'){switch(next()){case'/':while(next()&&ch!='\n'&&ch!='\r'){}
break;case'*':next();for(;;){if(ch){if(ch=='*'){if(next()=='/'){next();break;}}else{next();}}else{error("Unterminated comment");}}
break;default:error("Syntax error");}}else{break;}}}
function string(){var i,s='',t,u;if(ch=='"'){outer:while(next()){if(ch=='"'){next();return s;}else if(ch=='\\'){switch(next()){case'b':s+='\b';break;case'f':s+='\f';break;case'n':s+='\n';break;case'r':s+='\r';break;case't':s+='\t';break;case'u':u=0;for(i=0;i<4;i+=1){t=parseInt(next(),16);if(!isFinite(t)){break outer;}
u=u*16+t;}
s+=String.fromCharCode(u);break;default:s+=ch;}}else{s+=ch;}}}
error("Bad string");}
function array(){var a=[];if(ch=='['){next();white();if(ch==']'){next();return a;}
while(ch){a.push(value());white();if(ch==']'){next();return a;}else if(ch!=','){break;}
next();white();}}
error("Bad array");}
function object(){var k,o={};if(ch=='{'){next();white();if(ch=='}'){next();return o;}
while(ch){k=string();white();if(ch!=':'){break;}
next();o[k]=value();white();if(ch=='}'){next();return o;}else if(ch!=','){break;}
next();white();}}
error("Bad object");}
function number(){var n='',v;if(ch=='-'){n='-';next();}
while(ch>='0'&&ch<='9'){n+=ch;next();}
if(ch=='.'){n+='.';while(next()&&ch>='0'&&ch<='9'){n+=ch;}}
if(ch=='e'||ch=='E'){n+='e';next();if(ch=='-'||ch=='+'){n+=ch;next();}
while(ch>='0'&&ch<='9'){n+=ch;next();}}
v=+n;if(!isFinite(v)){}else{return v;}}
function word(){switch(ch){case't':if(next()=='r'&&next()=='u'&&next()=='e'){next();return true;}
break;case'f':if(next()=='a'&&next()=='l'&&next()=='s'&&next()=='e'){next();return false;}
break;case'n':if(next()=='u'&&next()=='l'&&next()=='l'){next();return null;}
break;}
error("Syntax error");}
function value(){white();switch(ch){case'{':return object();case'[':return array();case'"':return string();case'-':return number();default:return ch>='0'&&ch<='9'?number():word();}}
return value();}};}();
function AddCategoryModule(displayDiv,categoryType)
{var catFieldDesc="";if(categoryType==="Expense")
{catFieldDesc="Budget";}
else
{catFieldDesc="Amount";}
this.drawModule=function()
{var sb=new StringBuffer();sb.append("<table class='fixedTable' border='0' cellpadding='0' cellspacing='0' width='760px'>");sb.append("<tr class='blueTableHeaderRow'>");sb.append("<td width='10px' class='blueTableTopLeftCorner'>&nbsp;</td>");sb.append("<td width='140px' align='left'>Category Name</td>");sb.append("<td width='190px' align='left'>Description</td>");sb.append("<td width='100px' align='center'>Year "+catFieldDesc+"</td>");sb.append("<td width='100px' align='center'>Month "+catFieldDesc+"</td>");sb.append("<td width='100px' align='center'>Week "+catFieldDesc+"</td>");sb.append("<td width='114px' class='blueTableTopRightCorner'>&nbsp;&nbsp;</td></tr>");sb.append("<tr align='left' valign='top' class='blueTableDataRow' id='addCategoryDataRow'>");sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");sb.append("<td><input type='text' id='"+displayDiv+"addCatName' class='defaultText' size='18' tabindex='1' /></td>");sb.append("<td><input type='text' id='"+displayDiv+"addCatDesc' class='defaultText' size='25' tabindex='3' /></td>");sb.append("<td align='center'><input type='text' id='"+displayDiv+"addCatYearBudget' class='defaultText' size='10' tabindex='3' /></td>");sb.append("<td align='center'><input type='text' id='"+displayDiv+"addCatMonthBudget' class='defaultText' size='10' tabindex='4' /></td>");sb.append("<td align='center'><input type='text' id='"+displayDiv+"addCatWeekBudget' class='defaultText' size='10' tabindex='5' /></td>");sb.append("<td class='blueTableLastColumn'><input type='button' id='addCatBtn' value='Add Category' onclick='javascript:"+displayDiv+"AddCategory();void(0);' class='addButton' size='11' tabindex='6'  style='width: 110px'/></td></tr>");sb.append("<tr class='blueTableFooterRow'>");sb.append("<td colspan='4' class='blueTableBotLeftCorner'></td>");sb.append("<td class='blueTableBotRightCorner' colspan='3'></td></tr></table>");document.getElementById(displayDiv).innerHTML=sb.toString();};this.getCategory=function()
{var category=new Object();category.Name=getFieldValue(displayDiv+"addCatName");category.description=getFieldValue(displayDiv+"addCatDesc");category.yearBudget=getFieldValue(displayDiv+"addCatYearBudget");category.monthBudget=getFieldValue(displayDiv+"addCatMonthBudget");category.weekBudget=getFieldValue(displayDiv+"addCatWeekBudget");if(categoryType==="Expense")
{category.CategoryType="E";}
else if(categoryType==="Income")
{category.CategoryType="I";}
return category;};this.clearFields=function()
{document.getElementById(displayDiv+"addCatName").value="";document.getElementById(displayDiv+"addCatDesc").value="";document.getElementById(displayDiv+"addCatYearBudget").value="";document.getElementById(displayDiv+"addCatMonthBudget").value="";document.getElementById(displayDiv+"addCatWeekBudget").value="";};};
function AddTransModule(displayDivName,categoryType,categoryArray)
{var displayDiv=displayDivName;this.drawModule=function(selectedCategoryID)
{var selectedCategory;if(!selectedCategoryID)
{selectedCategoryID=categoryArray[0].CategoryID;}
var sb=new StringBuffer();var today=new Date();var day=today.getDate();if(day<10){day="0"+day;}
var month=today.getMonth()+1;if(month<10){month="0"+month;}
var todayString=today.getFullYear()+'-'+month+'-'+day;sb.append("<table class='fixedTable' cellspacing='0' border='0' cellpadding='0' width='860px'>");sb.append("<tr class='blueTableHeaderRow'>");sb.append("<td width='10px' class='blueTableTopLeftCorner'></td>");sb.append("<td width='160px' align='left'>Category</td>");sb.append("<td width='150px' align='left'>SubCategory</td>");sb.append("<td width='110px' align='left'>Date</td>");sb.append("<td width='100px' align='left'>Amount</td>");sb.append("<td width='205px' align='left'>Comment</td>");sb.append("<td width='125px' class='blueTableTopRightCorner'>&nbsp;</td>");sb.append("</tr>");sb.append("<tr align='left' class='blueTableDataRow'>");sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");sb.append("<td><select id='"+displayDiv+"_addTransCatList' class='defaultText' tabIndex='1' STYLE='width: 150px' onChange='"+displayDiv+"_TransCategorySelected()'>");var numCategories=categoryArray.length;for(i=0;i<numCategories;i++)
{var category=categoryArray[i];sb.append("<option value='");sb.append(category.CategoryID);sb.append("' ");if(category.CategoryID==selectedCategoryID)
{sb.append("selected");selectedCategory=category;}
sb.append(">");sb.append(category.Name);sb.append("</option>");}
sb.append("</select></td>");if(selectedCategory.SubCategories&&selectedCategory.SubCategories[0].Name)
{sb.append("<td><select id='"+displayDiv+"_addTransSubCatList' class='defaultText' tabIndex='3' STYLE='width: 140px'>");var numSubCategories=selectedCategory.SubCategories.length;for(i=0;i<numSubCategories;i++)
{sb.append("<option value='");sb.append(selectedCategory.SubCategories[i].SubCategoryID);sb.append("'>");sb.append(selectedCategory.SubCategories[i].Name);sb.append("</option>");}
sb.append("</select></td>");}
else
{sb.append("<td><select disabled STYLE='width: 140px'></select></td>");}
sb.append("<td><input type='text' size='12' id='"+displayDiv+"_addTransDate' class='defaultText' tabIndex='3' value='"+todayString+"' onfocus='this.select();lcs(this)' onclick='event.cancelBubble=true;this.select();lcs(this)' /></td>");sb.append("<td><input id='"+displayDiv+"_addTransAmount' size='10' type='text' class='defaultText' tabIndex='4' /></td>");sb.append("<td><input type='text' id='"+displayDiv+"_addTransComments' class='defaultText' size='30' tabIndex='5' /></td>");sb.append("<td class='blueTableLastColumn' align='center'>");sb.append("<input type='button' id='transAddBtn' value='Add "+categoryType+"' onclick='javascript:"+displayDiv+"_addTrans();void(0);' class='addButton' tabIndex='5' style='width: 110px'>");sb.append("</td></tr>");sb.append("<tr class='blueTableFooterRow'><td class='blueTableBotLeftCorner' colspan='4'></td><td class='blueTableBotRightCorner' colspan='3'></td>");sb.append("</tr></table>");document.getElementById(displayDiv).innerHTML=sb.toString();};this.getTrans=function()
{var trans=new Object();trans.Date=getFieldValue(displayDiv+"_addTransDate");trans.Amount=roundAmount(getFieldValue(displayDiv+"_addTransAmount"));trans.DisplayAmount=trans.Amount;trans.Description=getFieldValue(displayDiv+"_addTransComments");var categoryList=document.getElementById(displayDiv+"_addTransCatList");if(categoryList)
{trans.CategoryName=categoryList.options[categoryList.selectedIndex].text;trans.CategoryID=categoryList.options[categoryList.selectedIndex].value;}
if(categoryType==="Expense")
{trans.categoryType="E";}
else if(categoryType==="Income")
{trans.categoryType="I";}
return trans;};this.clearFields=function()
{document.getElementById(displayDiv+"_addTransAmount").value="";document.getElementById(displayDiv+"_addTransComments").value="";};this.focus=function()
{var categoryList=document.getElementById(displayDiv+"_addTransCatList");if(categoryList)
{categoryList.focus();}};this.redrawModule=function()
{var categoryList=document.getElementById(displayDiv+"_addTransCatList");var selectedIndex=categoryList.selectedIndex;var selectedCategoryID=categoryList.options[selectedIndex].value;this.drawModule(selectedCategoryID);};}
﻿function BalanceChangeTable(displayDivName,expCatData,incomeCatData)
{this.drawModule=function()
{var sb=new StringBuffer();sb.append("<table class='fixedTable' width='790px' cellspacing='0' border='0' cellpadding='0'>");sb.append("<tr class='blueTableHeaderRow'>");sb.append("<td width='10px' class='blueTableTopLeftCorner'>&nbsp;</td>");sb.append("<td width='210px' align='left'>&nbsp;</td>");sb.append("<td width='115px' align='center'>This Year</td>");sb.append("<td width='115px' align='center'>Last Month</td>");sb.append("<td width='115px' align='center'>This Month</td>");sb.append("<td width='115px' align='center'>Last Week</td>");sb.append("<td width='110px' align='center' class='blueTableTopRightCorner'>This Week</td></tr>");sb.append("<tr class='blueTableOddRow'>");sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");sb.append("<td align='left'>Income</td>");sb.append("<td align='center'>"+getRoundedAmount(incomeCatData.getTotalYearAmount())+"</td>");sb.append("<td align='center'>"+getRoundedAmount(incomeCatData.getTotalPriorMonthAmount())+"</td>");sb.append("<td align='center'>"+getRoundedAmount(incomeCatData.getTotalMonthAmount())+"</td>");sb.append("<td align='center'>"+getRoundedAmount(incomeCatData.getTotalPriorWeekAmount())+"</td>");sb.append("<td align='center' class='blueTableLastColumn'>"+getRoundedAmount(incomeCatData.getTotalWeekAmount())+"</td>");sb.append("</tr>");sb.append("<tr class='blueTableEvenRow'>");sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");sb.append("<td align='left'>Expenses</td>");sb.append("<td align='center'>"+getRoundedAmount(expCatData.getTotalYearAmount())+"</td>");sb.append("<td align='center'>"+getRoundedAmount(expCatData.getTotalPriorMonthAmount())+"</td>");sb.append("<td align='center'>"+getRoundedAmount(expCatData.getTotalMonthAmount())+"</td>");sb.append("<td align='center'>"+getRoundedAmount(expCatData.getTotalPriorWeekAmount())+"</td>");sb.append("<td align='center' class='blueTableLastColumn'>"+getRoundedAmount(expCatData.getTotalWeekAmount())+"</td>");sb.append("</tr>");var totalYearSavings=(incomeCatData.getTotalYearAmount()*1)-(expCatData.getTotalYearAmount()*1);var totalYearStyle=(totalYearSavings<(incomeCatData.getTotalYearBudget()-expCatData.getTotalYearBudget()))?'negativeAmount':'possitiveAmount';var totalPriorMonthSavings=(incomeCatData.getTotalPriorMonthAmount()*1)-(expCatData.getTotalPriorMonthAmount()*1);var totalPriorMonthStyle=(totalPriorMonthSavings<(incomeCatData.getTotalMonthBudget()-expCatData.getTotalMonthBudget()))?'negativeAmount':'possitiveAmount';var totalMonthSavings=(incomeCatData.getTotalMonthAmount()*1)-(expCatData.getTotalMonthAmount()*1);var totalMonthStyle=(totalMonthSavings<(incomeCatData.getTotalMonthBudget()-expCatData.getTotalMonthBudget()))?'negativeAmount':'possitiveAmount';var totalPriorWeekSavings=(incomeCatData.getTotalPriorWeekAmount()*1)-(expCatData.getTotalPriorWeekAmount()*1);var totalPriorWeekStyle=(totalPriorWeekSavings<(incomeCatData.getTotalWeekBudget()-expCatData.getTotalWeekBudget()))?'negativeAmount':'possitiveAmount';var totalWeekSavings=(incomeCatData.getTotalWeekAmount()*1)-(expCatData.getTotalWeekAmount()*1);var totalWeekStyle=(totalWeekSavings<(incomeCatData.getTotalWeekBudget()-expCatData.getTotalWeekBudget()))?'negativeAmount':'possitiveAmount';sb.append("<tr class='blueTableFooterRow'>");sb.append("<td class='blueTableBotLeftCorner'></td>");sb.append("<td align='left'><b>Balance Change</b></td>");sb.append("<td align='center' class='"+totalYearStyle+"'>"+getRoundedAmount(totalYearSavings)+"</td>");sb.append("<td align='center' class='"+totalPriorMonthStyle+"'>"+getRoundedAmount(totalPriorMonthSavings)+"</td>");sb.append("<td align='center' class='"+totalMonthStyle+"'>"+getRoundedAmount(totalMonthSavings)+"</td>");sb.append("<td align='center' class='"+totalPriorWeekStyle+"'>"+getRoundedAmount(totalPriorWeekSavings)+"</td>");sb.append("<td  align='center' class='blueTableBotRightCorner "+totalWeekStyle+"'>"+getRoundedAmount(totalWeekSavings)+"</td></tr>");sb.append("</table>");document.getElementById(displayDivName).innerHTML=sb.toString();};}
function getObj(objID)
{if(document.getElementById){return document.getElementById(objID);}
else if(document.all){return document.all[objID];}
else if(document.layers){return document.layers[objID];}}
function checkClick(e){e?evt=e:evt=event;CSE=evt.target?evt.target:evt.srcElement;if(getObj('fc'))
if(!isChild(CSE,getObj('fc')))
getObj('fc').style.display='none';}
function isChild(s,d){while(s){if(s==d)
return true;s=s.parentNode;}
return false;}
function Left(obj)
{var curleft=0;if(obj.offsetParent)
{while(obj.offsetParent)
{curleft+=obj.offsetLeft
obj=obj.offsetParent;}}
else if(obj.x)
curleft+=obj.x;return curleft;}
function Top(obj)
{var curtop=0;if(obj.offsetParent)
{while(obj.offsetParent)
{curtop+=obj.offsetTop
obj=obj.offsetParent;}}
else if(obj.y)
curtop+=obj.y;return curtop;}
document.write('<table id="fc" style="position:absolute;border-collapse:collapse;background:#FFFFFF;border:1px solid #ABABAB;display:none;z-index:20;" cellpadding=2>');document.write('<tr><td style="cursor:pointer" onclick="csubm()"><img src="images/arrowleftmonth.gif"></td><td colspan=5 id="mns" align="center" style="font:bold 13px Arial"></td><td align="right" style="cursor:pointer" onclick="caddm()"><img src="images/arrowrightmonth.gif"></td></tr>');document.write('<tr><td align=center style="background:#ABABAB;font:12px Arial">S</td><td align=center style="background:#ABABAB;font:12px Arial">M</td><td align=center style="background:#ABABAB;font:12px Arial">T</td><td align=center style="background:#ABABAB;font:12px Arial">W</td><td align=center style="background:#ABABAB;font:12px Arial">T</td><td align=center style="background:#ABABAB;font:12px Arial">F</td><td align=center style="background:#ABABAB;font:12px Arial">S</td></tr>');for(var kk=1;kk<=6;kk++){document.write('<tr>');for(var tt=1;tt<=7;tt++){num=7*(kk-1)-(-tt);document.write('<td id="v'+num+'" style="width:18px;height:18px">&nbsp;</td>');}
document.write('</tr>');}
document.write('</table>');document.all?document.attachEvent('onclick',checkClick):document.addEventListener('click',checkClick,false);var now=new Date;var sccm=now.getMonth();var sccy=now.getFullYear();var ccm=now.getMonth();var ccy=now.getFullYear();var updobj;function lcs(ielem){updobj=ielem;getObj('fc').style.left=''+Left(ielem)+'px';getObj('fc').style.top=''+(Top(ielem)+ielem.offsetHeight)+'px';getObj('fc').style.display='';curdt=ielem.value;curdtarr=curdt.split('-');isdt=true;for(var k=0;k<curdtarr.length;k++){if(isNaN(curdtarr[k]))
isdt=false;}
if(isdt&(curdtarr.length==3)){ccm=curdtarr[1]-1;ccy=curdtarr[0];prepcalendar(curdtarr[1]-1,curdtarr[2],curdtarr[0]);}}
function evtTgt(e)
{var el;if(e.target)el=e.target;else if(e.srcElement)el=e.srcElement;if(el.nodeType==3)el=el.parentNode;return el;}
function EvtObj(e){if(!e)e=window.event;return e;}
function cs_over(e){evtTgt(EvtObj(e)).style.background='#FFCC66';}
function cs_out(e){evtTgt(EvtObj(e)).style.background='#C4D3EA';}
function cs_click(e){updobj.value=calvalarr[evtTgt(EvtObj(e)).id.substring(1,evtTgt(EvtObj(e)).id.length)];getObj('fc').style.display='none';}
var mn=new Array('JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC');var mnn=new Array('31','28','31','30','31','30','31','31','30','31','30','31');var mnl=new Array('31','29','31','30','31','30','31','31','30','31','30','31');var calvalarr=new Array(42);function f_cps(obj){obj.style.background='#C4D3EA';obj.style.font='10px Arial';obj.style.color='#333333';obj.style.textAlign='center';obj.style.textDecoration='none';obj.style.border='1px solid #6487AE';obj.style.cursor='pointer';}
function f_cpps(obj){obj.style.background='#C4D3EA';obj.style.font='10px Arial';obj.style.color='#ABABAB';obj.style.textAlign='center';obj.style.textDecoration='line-through';obj.style.border='1px solid #6487AE';obj.style.cursor='default';}
function f_hds(obj){obj.style.background='#FFF799';obj.style.font='bold 10px Arial';obj.style.color='#333333';obj.style.textAlign='center';obj.style.border='1px solid #6487AE';obj.style.cursor='pointer';}
function prepcalendar(cm,hd,cy){now=new Date();sd=now.getDate();td=new Date();td.setDate(1);td.setFullYear(cy);td.setMonth(cm);cd=td.getDay();getObj('mns').innerHTML=mn[cm]+' '+cy;marr=((cy%4)==0)?mnl:mnn;for(var d=1;d<=42;d++){f_cps(getObj('v'+parseInt(d)));if((d>=(cd-(-1)))&&(d<=cd-(-marr[cm]))){htd=((hd!='')&&(d-cd==hd));if(htd)
f_hds(getObj('v'+parseInt(d)));getObj('v'+parseInt(d)).onmouseover=cs_over;getObj('v'+parseInt(d)).onmouseout=cs_out;getObj('v'+parseInt(d)).onclick=cs_click;getObj('v'+parseInt(d)).innerHTML=d-cd;var monthVal=''+(cm-(-1));if(monthVal.length===1){monthVal="0"+monthVal};var dateVal=''+(d-cd);if(dateVal.length===1){dateVal="0"+dateVal};calvalarr[d]=''+cy+'-'+monthVal+'-'+dateVal;}
else{getObj('v'+d).innerHTML='&nbsp;';getObj('v'+parseInt(d)).onmouseover=null;getObj('v'+parseInt(d)).onmouseout=null;getObj('v'+parseInt(d)).style.cursor='default';}}}
prepcalendar(ccm,'',ccy);function caddm(){marr=((ccy%4)==0)?mnl:mnn;ccm+=1;if(ccm>=12){ccm=0;ccy++;}
prepcalendar(ccm,'',ccy);}
function csubm(){marr=((ccy%4)==0)?mnl:mnn;ccm-=1;if(ccm<0){ccm=11;ccy--;}
prepcalendar(ccm,'',ccy);}
function CategoryTableModule(displayDiv,categoryData,categoryType)
{var categoryArray=categoryData.getCategories();var catFieldDesc="";if(categoryType==="Expense")
{catFieldDesc="Budget";}
else
{catFieldDesc="Amount";}
this.drawModule=function()
{var numItems=categoryArray.length;var sb=new StringBuffer();sb.append("<table class='fixedTable' cellspacing='0' border='0' cellpadding='0' width='760px'>");sb.append("<tr class='blueTableHeaderRow'>");sb.append("<td width='10px' class='blueTableTopLeftCorner'>&nbsp;</td>");sb.append("<td width='140px' align='left'>Category Name</td>");sb.append("<td width='190px' align='left'>Description</td>");sb.append("<td width='100px' align='center'>Year "+catFieldDesc+"</td>");sb.append("<td width='100px' align='center'>Month "+catFieldDesc+"</td>");sb.append("<td width='100px' align='center'>Week "+catFieldDesc+"</td>");sb.append("<td width='104px'>&nbsp;</td>");sb.append("<td width='10px' class='blueTableTopRightCorner'>&nbsp;</td></tr>");sb.append("<tr align='left' valign='top' class='blueCategoryTableDataRow' id='addCategoryDataRow'>");sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");sb.append("<td><input type='text' id='"+displayDiv+"addCatName' class='defaultText' size='18' tabindex='1' /></td>");sb.append("<td><input type='text' id='"+displayDiv+"addCatDesc' class='defaultText' size='25' tabindex='3' /></td>");sb.append("<td align='center'><input type='text' id='"+displayDiv+"addCatYearBudget' class='defaultText' size='10' tabindex='3' /></td>");sb.append("<td align='center'><input type='text' id='"+displayDiv+"addCatMonthBudget' class='defaultText' size='10' tabindex='4' /></td>");sb.append("<td align='center'><input type='text' id='"+displayDiv+"addCatWeekBudget' class='defaultText' size='10' tabindex='5' /></td>");sb.append("<td class='blueTableLastColumn' colspan='2'><input type='button' id='addCatBtn' value='Add Category' onclick='javascript:"+displayDiv+"_AddCategory();void(0);' class='addButton' size='11' tabindex='6'  style='width: 110px'/></td></tr>");for(i=0;i<numItems;i++)
{var style=(i%2===0)?'blueTableEvenRow':'blueTableOddRow';var category=categoryArray[i];if(!category.MonthBudget)
{category.MonthBudget="";}
if(!category.YearBudget)
{category.YearBudget="";}
if(!category.WeekBudget)
{category.WeekBudget="";}
if(!category.Description)
{category.Description="";}
if(category.selected)
{sb.append("<tr align='left' id='catTableRow");sb.append(i);sb.append("' class='"+style+"'>");sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");sb.append("<td align='left'><input type='text' id='"+displayDiv+"editCatName"+i+"' class='defaultText' size='18' value='"+escapeQuote(category.Name)+"' /></td>");sb.append("<td align='left'><input type='text' id='"+displayDiv+"editCatDesc"+i+"' class='defaultText' size='30' value='"+escapeQuote(category.Description)+"' /></td>");sb.append("<td align='center'><input type='text' id='"+displayDiv+"editCatYearBudget"+i+"' class='defaultText' size='10' value='"+padZeros(category.YearBudget)+"' /></td>");sb.append("<td align='center'><input type='text' id='"+displayDiv+"editCatMonthBudget"+i+"' class='defaultText' size='10' value='"+padZeros(category.MonthBudget)+"' /></td>");sb.append("<td align='center'><input type='text' id='"+displayDiv+"editCatWeekBudget"+i+"' class='defaultText' size='10' value='"+padZeros(category.WeekBudget)+"' /></td>");sb.append("<td align='right'><a href='javascript:"+displayDiv+"UpdateCategory("+i+");void(0);'>Update</a>&nbsp;<a href='javascript:"+displayDiv+"CancelCategoryEdit("+i+");void(0);'>Cancel</a></td>");sb.append("<td class='blueTableLastColumn'>&nbsp;</td></tr>");}
else
{sb.append("<tr align='left' id='catTableRow"+i+"' class='"+style+"'>");sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");sb.append("<td align='left'>"+escapeQuote(category.Name)+"</td>");sb.append("<td align='left'>"+escapeQuote(category.Description)+"</td>");sb.append("<td align='center'>"+padZeros(category.YearBudget)+"</td>");sb.append("<td align='center'>"+padZeros(category.MonthBudget)+"</td>");sb.append("<td align='center'>"+padZeros(category.WeekBudget)+"</td>");sb.append("<td align='right'><a href='javascript:"+displayDiv+"DeleteCategory("+i+");void(0);'>");sb.append("<img src='images/delete.gif' alt='Delete Category' border='0' /></a>");sb.append("<a href='javascript:"+displayDiv+"EditCategory("+i+");void(0);'>");sb.append("<img src='images/table_edit.gif' alt='Edit Category' border='0' /></a></td>");sb.append("<td class='blueTableLastColumn'>&nbsp;</td></tr>");}}
sb.append("<tr class='blueTableFooterRow'><td class='blueTableBotLeftCorner'></td>");sb.append("<td>Total</td><td>&nbsp;</td>");sb.append("<td align='center'>"+categoryData.getTotalYearBudget()+"</td>");sb.append("<td align='center'>"+categoryData.getTotalMonthBudget()+"</td>");sb.append("<td align='center'>"+categoryData.getTotalWeekBudget()+"</td>");sb.append("<td class='blueTableBotRightCorner' colspan='2'></td>");sb.append("</tr></table>");document.getElementById(displayDiv).innerHTML=sb.toString();};this.getModifiedRow=function(rowIndex)
{var category=new Object();category.CategoryID=categoryArray[rowIndex].CategoryID;category.Name=document.getElementById(displayDiv+"editCatName"+rowIndex).value;category.Description=document.getElementById(displayDiv+"editCatDesc"+rowIndex).value;category.YearBudget=document.getElementById(displayDiv+"editCatYearBudget"+rowIndex).value;category.MonthBudget=document.getElementById(displayDiv+"editCatMonthBudget"+rowIndex).value;category.WeekBudget=document.getElementById(displayDiv+"editCatWeekBudget"+rowIndex).value;if(categoryType==="Expense")
{category.CategoryType="E";}
else if(categoryType==="Income")
{category.CategoryType="I";}
return category;};this.getCategory=function()
{var category=new Object();category.Name=getFieldValue(displayDiv+"addCatName");category.Description=getFieldValue(displayDiv+"addCatDesc");category.YearBudget=getFieldValue(displayDiv+"addCatYearBudget");category.MonthBudget=getFieldValue(displayDiv+"addCatMonthBudget");category.WeekBudget=getFieldValue(displayDiv+"addCatWeekBudget");if(categoryType==="Expense")
{category.CategoryType="E";}
else if(categoryType==="Income")
{category.CategoryType="I";}
return category;};this.clearFields=function()
{document.getElementById(displayDiv+"addCatName").value="";document.getElementById(displayDiv+"addCatDesc").value="";document.getElementById(displayDiv+"addCatYearBudget").value="";document.getElementById(displayDiv+"addCatMonthBudget").value="";document.getElementById(displayDiv+"addCatWeekBudget").value="";};};
﻿
function ExpectedBalanceTableModule(displayDivName,expCatData,incomeCatData)
{this.drawModule=function()
{var sb=new StringBuffer();sb.append("<table class='fixedTable' width='570px' cellspacing='0' border='0' cellpadding='0'>");sb.append("<tr class='blueTableHeaderRow'>");sb.append("<td width='10px' class='blueTableTopLeftCorner'>&nbsp;</td>");sb.append("<td width='215px' align='left'>&nbsp;&nbsp;</td>");sb.append("<td width='115px' align='center'>Year</td>");sb.append("<td width='115px' align='center'>Month</td>");sb.append("<td width='115px' align='center' class='blueTableTopRightCorner'>Week</td></tr>");sb.append("<tr class='blueTableOddRow'>");sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");sb.append("<td align='left'>Expected Income</td>");sb.append("<td align='center'>"+incomeCatData.getTotalYearBudget()+"</td>");sb.append("<td align='center'>"+incomeCatData.getTotalMonthBudget()+"</td>");sb.append("<td align='center' class='blueTableLastColumn'>"+incomeCatData.getTotalWeekBudget()+"</td></tr>");sb.append("<tr class='blueTableEvenRow'>");sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");sb.append("<td align='left'>Budgeted Expense Amount</td>");sb.append("<td align='center'>"+expCatData.getTotalYearBudget()+"</d>");sb.append("<td align='center'>"+expCatData.getTotalMonthBudget()+"</td>");sb.append("<td align='center' class='blueTableLastColumn'>"+expCatData.getTotalWeekBudget()+"</td></tr>");sb.append("<tr class='blueTableFooterRow'>");sb.append("<td class='blueTableBotLeftCorner'></td>");sb.append("<td align='left'><b>Expected Balance Change</b></td>");sb.append("<td align='center'>"+roundAmount(incomeCatData.getTotalYearBudget()-expCatData.getTotalYearBudget())+"</td>");sb.append("<td align='center'>"+roundAmount(incomeCatData.getTotalMonthBudget()-expCatData.getTotalMonthBudget())+"</td>");sb.append("<td align='center' class='blueTableBotRightCorner'>"+roundAmount(incomeCatData.getTotalWeekBudget()-expCatData.getTotalWeekBudget())+"</td></tr>");document.getElementById(displayDivName).innerHTML=sb.toString();};}
﻿function PieGraphModule(displayDiv,graphId,catData)
{function createGraphData(amountArray)
{var sb1=new StringBuffer();sb1.append("<graph>");sb1.append("<general_settings bg_color='FFFFFF' />");sb1.append("<header text='' font='Verdana' color='000000' size='18' />");sb1.append("<subheader text='' font='Verdana' color='000000' size='15' />");sb1.append("<legend font='Verdana' font_color='000000' font_size='11' bgcolor='FFFFFF' alternate_bg_color='FFF9E1' border_color='BFBFBF' />");sb1.append("<legend_popup font='Verdana' bgcolor='FFFFE3' font_size='10' />");sb1.append("<pie_chart radius='120' height='35' angle_slope='45' alpha_sides='90' alpha_lines='20' />");var numAmounts=amountArray.length;for(x=0;x<numAmounts;x++)
{sb1.append("<data name='"+amountArray[x].Name+" ("+amountArray[x].CategoryAmount+")' value='"+amountArray[x].Amount+"' color='"+amountArray[x].Color+"' />");}
sb1.append("</graph>");return sb1.toString();}
function createAmountArray(dateRange)
{var categoryArray=catData.getCategories();var allCatAmount=0;var numCat=categoryArray.length;var amountArray=new Array();for(var x=0;x<numCat;x++)
{var category=categoryArray[x];amountArray[x]=new Object();amountArray[x].Name=cleanXML(category.Name);amountArray[x].Amount=0;amountArray[x].CategoryAmount=0;amountArray[x].Color=category.Color;if(dateRange=="This Year")
{if(category.yearAmount)
{amountArray[x].Amount=category.yearAmount/catData.getTotalYearAmount();amountArray[x].CategoryAmount=category.yearAmount;}}
else if(dateRange=="Last Month")
{if(category.priorMonthAmount)
{amountArray[x].Amount=category.priorMonthAmount/catData.getTotalPriorMonthAmount();amountArray[x].CategoryAmount=category.priorMonthAmount;}}
else if(dateRange=="This Month")
{if(category.monthAmount)
{amountArray[x].Amount=category.monthAmount/catData.getTotalMonthAmount();amountArray[x].CategoryAmount=category.monthAmount;}}
else if(dateRange=="Last Week")
{if(category.priorWeekAmount)
{amountArray[x].Amount=category.priorWeekAmount/catData.getTotalPriorWeekAmount();amountArray[x].CategoryAmount=category.priorWeekAmount;}}
else if(dateRange=="This Week")
{if(category.weekAmount)
{amountArray[x].Amount=category.weekAmount/catData.getTotalWeekAmount();amountArray[x].CategoryAmount=category.weekAmount;}}
else if(dateRange=="Custom Date")
{if(category.CustomDateAmount)
{amountArray[x].Amount=((category.CustomDateAmount*1)/catData.getTotalCustomDateAmount());amountArray[x].CategoryAmount=category.CustomDateAmount;}}
else if(dateRange=="All Time")
{if(category.TotalAmount)
{amountArray[x].Amount=((category.TotalAmount*1)/catData.getTotalAllTimeAmount());amountArray[x].CategoryAmount=category.TotalAmount;}}
if(amountArray[x].Amount!=0)
{allCatAmount=allCatAmount+amountArray[x].Amount;amountArray[x].Amount=roundAmount(amountArray[x].Amount*100);amountArray[x].CategoryAmount=roundAmount(amountArray[x].CategoryAmount);}}
for(var y=0;y<(numCat-1);y++)
{for(var z=y+1;z<numCat;z++)
{if((amountArray[z].Amount*1)>(amountArray[y].Amount*1))
{var dummy=amountArray[y];amountArray[y]=amountArray[z];amountArray[z]=dummy;}}}
if(allCatAmount>0)
{return amountArray;}
else
{return null;}}
this.drawEmpty=function()
{document.getElementById(displayDiv).innerHTML="";};this.drawLoading=function()
{document.getElementById(displayDiv).innerHTML="loading...<img src='images/loading.gif' />";};this.drawChart=function(dateRange)
{var sb=new StringBuffer();var amountArray=createAmountArray(dateRange);if(amountArray!=null)
{var graphData=createGraphData(amountArray);var movieHeight=catData.getCategories().length*22;if(movieHeight<400)
{movieHeight=400;}
sb.append("<div style='z-index:2;'>");sb.append("<object id='"+graphId+"' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' width='700' height='"+movieHeight+"'>");sb.append("<param name='movie' value='fcp/swf/fcp-pie-chart.swf' />");sb.append("<param name='bgcolor' value='#ffffff' />");sb.append("<param name='quality' value='high' />");sb.append("<param name='valign' value='top' />");sb.append("<param name='wmode' value='transparent' />");sb.append("<param name='flashvars' value=\"xml_string="+graphData+"\" />");sb.append("<embed type='application/x-shockwave-flash' src='fcp/swf/fcp-pie-chart.swf' width='700' height='"+movieHeight+"' name='"+graphId+"' bgcolor='#ffffff' quality='high' flashvars=\"xml_string="+graphData+"\" />");sb.append("</object></div>");}
else
{sb.append("<p class='showText'>No transactions found for this date range.</p>");}
document.getElementById(displayDiv).innerHTML=sb.toString();};}
function SearchTransModule(displayDiv,categoryType)
{this.getTransSearch=function()
{var transSearch=new Object();transSearch.CategoryType=categoryType;transSearch.StartDate=document.getElementById(displayDiv+"searchStartDate").value;transSearch.EndDate=document.getElementById(displayDiv+"searchEndDate").value;var categoryList=document.getElementById(displayDiv+"searchTransCategory");transSearch.CategoryId=categoryList.options[categoryList.selectedIndex].value;var amountList=document.getElementById(displayDiv+"searchTransAmountList");transSearch.AmountOperator=amountList.options[amountList.selectedIndex].value;transSearch.Amount=document.getElementById(displayDiv+"txtSearchTransAmount").value;return transSearch;};this.drawModule=function(categoryArray)
{var sb=new StringBuffer();var srchBtnTitle;if(categoryType==="Expense")
{srchBtnTitle="Get Expenses";}
else if(categoryType==="Income")
{srchBtnTitle="Get Income";}
sb.append("<table cellspacing='0' border='0' cellpadding='2' width='790px'>");sb.append("<tr class='blueTableHeaderRow'>");sb.append("<td width='600px' class='blueTableTopLeftCorner' colspan='2'>Parameters</td>");sb.append("<td width='190px' class='blueTableTopRightCorner'></td></tr>");sb.append("<tr style='background: #E7EFFF'>");sb.append("<td class='blueTableFirstColumn'>&nbsp;<b>Date Range</b></td>");sb.append("<td align='left'><table cellpadding='0' cellspacing='0'><tr valign='bottom'><td>Start Date:&nbsp;</td><td><input type='text' size=9' class='defaultText' id='"+displayDiv+"searchStartDate' onfocus='this.select();lcs(this)' onclick='event.cancelBubble=true;this.select();lcs(this)' /></td>");sb.append("<td>&nbsp;&nbsp;&nbsp;End Date:&nbsp;<input type='text' size=9' class='defaultText' id='"+displayDiv+"searchEndDate' onfocus='this.select();lcs(this)' onclick='event.cancelBubble=true;this.select();lcs(this)' /></td></tr></table></td>");sb.append("<td align='center' class='blueTableLastColumn' align='center'><input type='button' id='searchTransBtn' value='"+srchBtnTitle+"' onclick='javascript:"+displayDiv+"SearchTrans();void(0);' class='addButton' tabIndex='5'  style='width: 130px'></tr>");sb.append("<tr style='background: #E7EFFF'>");sb.append("<td align='left' class='blueTableFirstColumn'>&nbsp;<b>Category</b></td>");sb.append("<td align='left' class='blueTableLastColumn' colspan='2'>");sb.append("<select id='"+displayDiv+"searchTransCategory' class='defaultText' STYLE='width: 150px'>");sb.append("<option value='Any'>All Categories</option>");var numCategories=categoryArray.length;for(i=0;i<numCategories;i++)
{var category=categoryArray[i];sb.append("<option value='");sb.append(category.CategoryID);sb.append("'>");sb.append(category.Name);sb.append("</option>");}
sb.append("</select></td></tr>");sb.append("<tr style='background: #E7EFFF'>");sb.append("<td align='left' class='blueTableFirstColumn'>&nbsp;<b>Amount</b></td>");sb.append("<td align='left' class='blueTableLastColumn' colspan='3'>");sb.append("<select id='"+displayDiv+"searchTransAmountList' class='defaultText' STYLE='width: 150px'>");sb.append("<option value='Any'>Any Amount</option>");sb.append("<option value='Equal'>Equal To</option>");sb.append("<option value='Greater'>Greater Than</option>");sb.append("<option value='Less'>Less Than</option>");sb.append("</select>&nbsp;");sb.append("<input type='text' id='"+displayDiv+"txtSearchTransAmount' class='defaultText' size='8' /></td></tr>");sb.append("<tr class='blueTableFooterRow'><td class='blueTableBotLeftCorner' colspan='1'></td><td class='blueTableBotRightCorner' colspan='3'></td>");sb.append("</tr></table>");document.getElementById(displayDiv).innerHTML=sb.toString();};}
function TransSummaryTableModule(displayDivName,catData,catType)
{var displayDiv=displayDivName;var categoryArray=catData.getCategories();function getRoundedAmount(amount)
{if(!amount||amount==="")
{return"0";}
else
{return roundAmount(amount);}}
this.drawModule=function()
{var sb=new StringBuffer();var numCategories=categoryArray.length;sb.append("<table class='fixedTable' width='790px' cellspacing='0' border='0' cellpadding='0'>");sb.append("<tr class='blueTableHeaderRow'>");sb.append("<td width='10px' class='blueTableTopLeftCorner'>&nbsp;</td>");sb.append("<td width='210px' align='left'>Category</td>");sb.append("<td width='115px' align='center'>This Year</td>");sb.append("<td width='115px' align='center'>Last Month</td>");sb.append("<td width='115px' align='center'>This Month</td>");sb.append("<td width='115px' align='center'>Last Week</td>");sb.append("<td width='110px' align='center' class='blueTableTopRightCorner'>This Week</td></tr>");for(i=0;i<numCategories;i++)
{var style=(i%2===0)?'blueTableEvenRow':'blueTableOddRow';var category=categoryArray[i];var yearColumnStyle=(category.yearBudget&&(category.yearAmount*1>category.yearBudget*1))?'overAmountColumn':'default';var priorMonthColumnStyle=(category.monthBudget&&(category.priorMonthAmount*1>category.monthBudget*1))?'overAmountColumn':'default';var monthColumnStyle=(category.monthBudget&&(category.monthAmount*1>category.monthBudget*1))?'overAmountColumn':'default';var priorWeekColumnStyle=(category.weekBudget&&(category.priorWeekAmount*1>category.weekBudget*1))?'overAmountColumn':'default';var weekColumnStyle=(category.weekBudget&&(category.weekAmount*1>category.weekBudget*1))?'overAmountColumn':'default';sb.append("<tr class='"+style+"'>");sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");sb.append("<td align='left'>"+category.name+"</td>");sb.append("<td align='center' class='"+yearColumnStyle+"'>"+getRoundedAmount(category.yearAmount)+"</td>");sb.append("<td align='center' class='"+priorMonthColumnStyle+"'>"+getRoundedAmount(category.priorMonthAmount)+"</td>");sb.append("<td align='center' class='"+monthColumnStyle+"'>"+getRoundedAmount(category.monthAmount)+"</td>");sb.append("<td align='center' class='"+priorWeekColumnStyle+"'>"+getRoundedAmount(category.priorWeekAmount)+"</td>");sb.append("<td align='center' class='blueTableLastColumn "+weekColumnStyle+"'>"+getRoundedAmount(category.weekAmount)+"</td>");sb.append("</tr>");}
var totalYearStyle=((catType==="Expense")&&catData.getTotalYearBudget()&&(catData.getTotalYearAmount()*1>catData.getTotalYearBudget()*1))?'overAmountColumn':'default';var totalPriorMonthStyle=((catType==="Expense")&&catData.getTotalMonthBudget()&&(catData.getTotalPriorMonthAmount()*1>catData.getTotalMonthBudget()*1))?'overAmountColumn':'default';var totalMonthStyle=((catType==="Expense")&&catData.getTotalMonthBudget()&&(catData.getTotalMonthAmount()*1>catData.getTotalMonthBudget()*1))?'overAmountColumn':'default';var totalPriorWeekStyle=((catType==="Expense")&&catData.getTotalWeekBudget()&&(catData.getTotalPriorWeekAmount()*1>catData.getTotalWeekBudget()*1))?'overAmountColumn':'default';var totalWeekStyle=((catType==="Expense")&&catData.getTotalWeekBudget()&&(catData.getTotalWeekAmount()*1>catData.getTotalWeekBudget()*1))?'overAmountColumn':'default';sb.append("<tr class='blueTableFooterRow'>");sb.append("<td class='blueTableBotLeftCorner'></td>");sb.append("<td align='left'>Total</td>");sb.append("<td align='center' class='"+totalYearStyle+"'>"+getRoundedAmount(catData.getTotalYearAmount())+"</td>");sb.append("<td align='center' class='"+totalPriorMonthStyle+"'>"+getRoundedAmount(catData.getTotalPriorMonthAmount())+"</td>");sb.append("<td align='center' class='"+totalMonthStyle+"'>"+getRoundedAmount(catData.getTotalMonthAmount())+"</td>");sb.append("<td align='center' class='"+totalPriorWeekStyle+"'>"+getRoundedAmount(catData.getTotalPriorWeekAmount())+"</td>");sb.append("<td  align='center' class='blueTableBotRightCorner "+totalWeekStyle+"'>"+getRoundedAmount(catData.getTotalWeekAmount())+"</td></tr>");sb.append("</table>");document.getElementById(displayDiv).innerHTML=sb.toString();};}
function TransTableModule(displayDiv,transArray,catData,numToDisplay,fixedHeight)
{var categoryArray=catData.getCategories();var priorTransHashtable=new Object();var dateSortDirection=1;var catSortDirection=1;var amountSortDirection=1;var descSortDirection=1;this.getPriorTrans=function(transID)
{return priorTransHashtable[transID];};this.setPriorTrans=function(trans)
{priorTransHashtable[trans.TransID]=trans;};this.getTransArray=function()
{return transArray;};this.getRow=function(rowIndex)
{return transArray[rowIndex];};this.getModifiedRow=function(rowIndex)
{var trans=new Object();trans.TransID=transArray[rowIndex].TransID;trans.Amount=roundAmount(getFieldValue(displayDiv+rowIndex+"EditRowAmount"));trans.displayAmount=trans.Amount;trans.description=getFieldValue(displayDiv+rowIndex+"EditRowComments");trans.Date=getFieldValue(displayDiv+rowIndex+"EditRowDate");var categoryList=document.getElementById(displayDiv+rowIndex+"EditRowCatList");trans.CategoryID=categoryList.options[categoryList.selectedIndex].value;trans.categoryName=categoryList.options[categoryList.selectedIndex].text;return trans;};this.editRow=function(rowIndex)
{transArray[rowIndex].selected=true;};this.cancelRowEdit=function(rowIndex)
{transArray[rowIndex].selected=false;};this.deleteRow=function(rowIndex)
{transArray.splice(rowIndex,1);};this.deleteRowByTransID=function(transID)
{var numTrans=transArray.length;for(var i=numTrans;i>0;i--)
{var delIndex=i-1;if(transArray[delIndex].transID===transID)
{transArray.splice(delIndex,1);break;}}};this.deleteAllRowsInCategory=function(categoryID)
{var numTrans=transArray.length;for(var i=numTrans;i>0;i--)
{var delIndex=i-1;if(transArray[delIndex].CategoryID===categoryID)
{transArray.splice(delIndex,1);}}};this.addRow=function(trans)
{var numRows=transArray.length;transArray[numRows]=trans;return numRows;};this.updateRow=function(rowIndex,trans)
{transArray[rowIndex]=trans;transArray[rowIndex].selected=false;};this.updateRowState=function(rowIndex,state)
{transArray[rowIndex].state=state;};this.updateRowByTransID=function(transID,trans)
{var numTrans=transArray.length;for(var i=0;i<numTrans;i++)
{if(transArray[i].transID===transID)
{transArray[i]=trans;transArray[i].selected=false;break;}}};this.sortTable=function(columnName,startPage)
{var numTrans=transArray.length;for(var i=0;i<(numTrans-1);i++)
{for(var j=i+1;j<numTrans;j++)
{if(columnName==="Date")
{if(dateSortDirection===-1)
{if(transArray[j].Date<transArray[i].Date)
{var dummy=transArray[i];transArray[i]=transArray[j];transArray[j]=dummy;}}
else
{if(transArray[j].Date>transArray[i].Date)
{var dummy=transArray[i];transArray[i]=transArray[j];transArray[j]=dummy;}}}
else if(columnName==="Category")
{if(catSortDirection===-1)
{if(catData.getCategoryName(transArray[j].CategoryID)<catData.getCategoryName(transArray[i].CategoryID))
{var dummy=transArray[i];transArray[i]=transArray[j];transArray[j]=dummy;}}
else
{if(catData.getCategoryName(transArray[j].CategoryID)>catData.getCategoryName(transArray[i].CategoryID))
{var dummy=transArray[i];transArray[i]=transArray[j];transArray[j]=dummy;}}}
else if(columnName==="Amount")
{if(amountSortDirection===-1)
{if((transArray[j].DisplayAmount*1)<(transArray[i].DisplayAmount*1))
{var dummy=transArray[i];transArray[i]=transArray[j];transArray[j]=dummy;}}
else
{if((transArray[j].DisplayAmount*1)>(transArray[i].DisplayAmount*1))
{var dummy=transArray[i];transArray[i]=transArray[j];transArray[j]=dummy;}}}
else if(columnName==="Description")
{if(descSortDirection===-1)
{if(transArray[j].Description<transArray[i].Description)
{var dummy=transArray[i];transArray[i]=transArray[j];transArray[j]=dummy;}}
else
{if(transArray[j].Description>transArray[i].Description)
{var dummy=transArray[i];transArray[i]=transArray[j];transArray[j]=dummy;}}}}}
if(columnName==="Date")
{dateSortDirection=dateSortDirection*-1;}
else if(columnName==="Category")
{catSortDirection=catSortDirection*-1;}
else if(columnName==="Amount")
{amountSortDirection=amountSortDirection*-1;}
else if(columnName==="Description")
{descSortDirection=descSortDirection*-1;}
this.drawModule(startPage);}
this.drawModule=function(startPage)
{var numItems=transArray.length;var numCategories=categoryArray.length;var sb=new StringBuffer();var startItem=numItems-(numToDisplay*(startPage-1));var endItem=startItem-numToDisplay;if(endItem<1)
{endItem=0;}
sb.append("<table id='expTable' class='fixedTable' cellspacing='0' border='0' cellpadding='0' width='860px'>");sb.append("<tr class='blueTableHeaderRow'>");sb.append("<td width='10px' class='blueTableTopLeftCorner'></td>");sb.append("<td width='160px' align='left'><a href='javascript:"+displayDiv+"_SortTable(\"Category\","+startPage+")'>Category</a></td>");sb.append("<td width='150px' align='left'><a href='javascript:"+displayDiv+"_SortTable(\"SubCategory\","+startPage+")'>SubCategory</a></td>");sb.append("<td width='110px' align='left'><a href='javascript:"+displayDiv+"_SortTable(\"Date\","+startPage+")'>Date</a></td>");sb.append("<td width='100px' align='left'><a href='javascript:"+displayDiv+"_SortTable(\"Amount\","+startPage+")'>Amount</a></td>");sb.append("<td width='205px' align='left'><a href='javascript:"+displayDiv+"_SortTable(\"Description\","+startPage+")'>Comment</a></td>");sb.append("<td width='115px'></td>");sb.append("<td width='10px' class='blueTableTopRightCorner'></td>");sb.append("</tr>");for(var i=startItem;i>endItem;i--)
{var style=(i%2===0)?'blueTableEvenRow':'blueTableOddRow';var transIndex=i-1;var trans=transArray[transIndex];sb.append("<tr align='left' id='expTableRow"+transIndex+"' class='"+style+"'>");sb.append("<td class='blueTableFirstColumn'>&nbsp;</td>");if(trans.Selected)
{sb.append("<td><select STYLE='width: 150px' id='");sb.append(displayDiv+transIndex+"EditRowCatList");sb.append("' class='defaultText' tabIndex='0' onChange='TransCategorySelected()'>");var selectedCategory;for(var j=0;j<numCategories;j++)
{var category=categoryArray[j];sb.append("<option value='");sb.append(category.CategoryID+"'");if(category.CategoryID==trans.CategoryID)
{sb.append(" selected ");selectedCategory=category;}
sb.append(">");sb.append(category.Name);sb.append("</option>");}
sb.append("</select></td>");if(selectedCategory.SubCategories)
{sb.append("<td><select STYLE='width: 140px' id='");sb.append(displayDiv+transIndex+"EditRowSubCatList");sb.append("' class='defaultText' tabIndex='1'>");var numSubCategories=selectedCategory.SubCategories.length;for(var subCatIndex=0;subCatIndex<numSubCategories;subCatIndex++)
{var subCategory=selectedCategory.SubCategories[subCatIndex];sb.append("<option value='");sb.append(subCategory.SubCategoryID+"'");if(subCategory.SubCategoryID==trans.SubCategoryID)
{sb.append(" selected ");}
sb.append(">");sb.append(subCategory.Name);sb.append("</option>");}}
else
{sb.append("<td></td>");}
sb.append("<td><input type='text' size='9' id='"+displayDiv+transIndex+"EditRowDate' class='defaultText' tabindex='2' value='"+trans.Date+"' onfocus='this.select();lcs(this)' onclick='event.cancelBubble=true;this.select();lcs(this)' /></td>");sb.append("<td><input id='"+displayDiv+transIndex+"EditRowAmount' class='defaultText' size='10' value='"+trans.DisplayAmount+"' /></td>");sb.append("<td><input id='"+displayDiv+transIndex+"EditRowComments' class='defaultText' size='30' value='"+trans.Description+"' /></td>");sb.append("<td align='right'><a href='javascript:"+displayDiv+"UpdateTrans("+transIndex+","+startPage+");void(0);'>Update</a>&nbsp;<a href='javascript:"+displayDiv+"CancelEdit("+transIndex+","+startPage+");void(0);'>Cancel</a></td>");}
else
{sb.append("<td align='left'>"+trans.CategoryName+"</td>");if(trans.SubCategoryID)
{sb.append("<td align='left'>"+catData.getSubCategoryName(trans.SubCategoryID)+"</td>");}
else
{sb.append("<td align='left'></td>");}
sb.append("<td align='left'>"+trans.Date+"</td>");sb.append("<td align='left'>"+trans.DisplayAmount+"</td>");sb.append("<td align='left'>"+trans.Description+"</td>");if(trans.State==""||trans.State==="Current")
{sb.append("<td align='right'><a href='javascript:"+displayDiv+"DeleteTrans("+transIndex+","+startPage+");void(0);'>");sb.append("<img src='images/delete.gif' alt='Delete' border='0' /></a>");sb.append("<a href='javascript:"+displayDiv+"EditTrans("+transIndex+","+startPage+");void(0);'>");sb.append("<img src='images/table_edit.gif' alt='Edit' border='0' /></a></td>");}
else if(trans.State==="Adding"||trans.State==="Updating"||trans.State==="Deleting")
{sb.append("<td align='right'>");sb.append("<img src='images/loading.gif' alt='loading' border='0' />...");sb.append(trans.State+"</td>");}
else if(trans.State==="AddFailed")
{sb.append("<td align='right'>");sb.append("<a href='javascript:"+displayDiv+"RetryAddTrans("+transIndex+","+startPage+");void(0);'>");sb.append("<img src='images/error.gif' alt='loading' border='0' /> Retry Add</a></td>");}
else if(trans.State==="UpdateFailed")
{sb.append("<td align='right'>");sb.append("<a href='javascript:"+displayDiv+"RetryUpdateTrans("+transIndex+","+startPage+");void(0);'>");sb.append("<img src='images/error.gif' alt='loading' border='0' /> Retry Update</a></td>");}
else if(trans.State==="DeleteFailed")
{sb.append("<td align='right'>");sb.append("<a href='javascript:"+displayDiv+"DeleteTrans("+transIndex+","+startPage+");void(0);'>");sb.append("<img src='images/error.gif' alt='loading' border='0' /> Retry Delete</a></td>");}}
sb.append("<td class='blueTableLastColumn'>&nbsp;</td></tr>");}
if(fixedHeight)
{for(i=startItem-endItem;i<numToDisplay;i++)
{sb.append("<tr class='blueTableEvenRow'><td  class='blueTableFirstColumn' colspan='3' style='height:16px'>&nbsp;</td><td  class='blueTableLastColumn' colspan='4'>&nbsp;</td></tr>");}}
sb.append("<tr class='blueTableFooterRow'><td colspan='4' class='blueTableBotLeftCorner'></td><td colspan='4' align='right' class='blueTableBotRightCorner'>");var numPages=Math.ceil(numItems/numToDisplay);if(numPages>1)
{for(i=1;i<=numPages;i++)
{var pageNum;if(i==startPage)
{pageNum="<b>"+i+"</b>";}
else
{pageNum=i;}
sb.append("<a href='javascript:"+displayDiv+"ShowPage("+i+");void(0);'>"+pageNum+"</a>&nbsp;");}}
sb.append("</td></tr></table>");document.getElementById(displayDiv).innerHTML=sb.toString();};}
﻿function SubCategoryModule(displayDiv,categoryType)
{this.drawModule=function(categoryArray)
{var numItems=categoryArray.length;var sb=new StringBuffer();sb.append("<table class='fixedTable' border='0' cellpadding='0' cellspacing='0' width='500px'>");sb.append("<tr><td width='30%'>");sb.append("<table>")
for(i=0;i<numItems;i++)
{var category=categoryArray[i];sb.append("<tr><td>");sb.append(category.name);sb.append("</td></tr>");}
sb.append("</table>");sb.append("</td>");sb.append("<td width='70%'>");sb.append("<table><tr><td><input type='text'></td>");sb.append("<td><input type='button' id='addSubCatBtn' value='Add SubCategory' onclick='javascript:"+displayDiv+"AddCategory();void(0);' class='addButton' size='11' tabindex='6'  style='width: 110px'/></td>");sb.append("</tr></table>");sb.append("</td></tr></table>");document.getElementById(displayDiv).innerHTML=sb.toString();}}
function AjaxPage(htmlURL,containerId,jsURLs)
{var httpRequest;var numJSFilesToLoad=0;var numJSFilesLoaded=0;var jsFileArray=null;if(jsURLs)
{jsFileArray=jsURLs.split(",");numJSFilesToLoad+=jsFileArray.length;}
var pageLoaded=false;var onLoadFunction;this.isLoaded=function()
{return pageLoaded;}
this.loadPage=function(loadFunction)
{onLoadFunction=loadFunction;httpRequest=getXMLHttpRequest();if(httpRequest)
{httpRequest.onreadystatechange=function()
{loadHTML_Callback();};httpRequest.open('GET',htmlURL,true);httpRequest.send(null);}
else
{return false;}}
function loadHTML_Callback()
{if(httpRequest.readyState==4&&(httpRequest.status==200||window.location.href.indexOf("http")==-1))
{document.getElementById(containerId).innerHTML=httpRequest.responseText;if(numJSFilesToLoad>0)
{loadJSFile(0);}
else
{callOnLoadFunction();}}}
function loadJSFile(fileIndex)
{httpRequest=getXMLHttpRequest();httpRequest.onreadystatechange=function()
{loadJS_Callback(fileIndex);};httpRequest.open('GET',jsFileArray[fileIndex],true);httpRequest.send(null);}
function loadJS_Callback(fileIndex)
{if(httpRequest.readyState==4&&(httpRequest.status==200||window.location.href.indexOf("http")==-1))
{var code=httpRequest.responseText;if(window.execScript)
{window.execScript(code,'javascript');}
else if(navigator.userAgent.indexOf('Safari')!=-1)
{window.setTimeout(code,0);}
else
{window.eval(code);}
numJSFilesLoaded+=1;if(numJSFilesToLoad>numJSFilesLoaded)
{loadJSFile(fileIndex+1);}
else
{callOnLoadFunction();}}}
function callOnLoadFunction()
{setTimeout(onLoadFunction,100);pageLoaded=true;}
function getXMLHttpRequest()
{if(window.XMLHttpRequest)
{return new XMLHttpRequest();}
else if(window.ActiveXObject)
{try
{return new ActiveXObject("Msxml2.XMLHTTP");}
catch(e)
{try
{return new ActiveXObject("Microsoft.XMLHTTP");}
catch(e)
{}}}
return false;}}
var addExpModule;var recentExpTable;var expenseSummary;var searchExpModule;var searchExpTable;var expCategoryTable;var expPieChart;var expSubCategoryModule;var recentExpData;var searchExpData;var expDataLoadRequired=true;var editRecentExpenseController;var searchExpProcessor;var addExpenseController;function drawAddExpensePanel()
{if(expDataLoadRequired)
{addExpModule=new AddTransModule("addExpModule","Expense",expCategoryData.getCategories());recentExpTable=new TransTableModule("recentExpTable",transData.RecentExpenses.reverse(),expCategoryData,5,true);expenseSummary=new TransSummaryTableModule("expenseSummaryTable",expCategoryData,"Expense");editRecentExpenseController=new EditRecentTransController("Expense",expCategoryData,recentExpTable,expenseSummary);addExpenseController=new AddTransController("Expense",expCategoryData,recentExpTable,expenseSummary,addExpModule);expDataLoadRequired=false;drawAddExpensePanelModules();}
else
{drawAddExpensePanelModules();}}
function drawAddExpensePanelModules()
{addExpModule.drawModule();recentExpTable.drawModule(1);expenseSummary.drawModule();showExpensePanel("addExpPanel");}
function addExpModule_addTrans()
{addExpenseController.addTrans();}
function addExpModule_TransCategorySelected()
{addExpModule.redrawModule();}
function recentExpTable_SortTable(column,startPage)
{recentExpTable.sortTable(column,startPage);}
function recentExpTableRetryAddTrans(rowIndex,startPage)
{addExpenseController.retryAddTrans(rowIndex,startPage);}
function recentExpTableEditTrans(rowIndex,startPage)
{recentExpTable.editRow(rowIndex);recentExpTable.drawModule(startPage);}
function recentExpTableCancelEdit(rowIndex,startPage)
{recentExpTable.cancelRowEdit(rowIndex);recentExpTable.drawModule(startPage);}
function recentExpTableDeleteTrans(rowIndex,startPage)
{editRecentExpenseController.deleteTrans(rowIndex,startPage);}
function recentExpTableUpdateTrans(rowIndex,startPage)
{editRecentExpenseController.updateTrans(rowIndex,startPage);}
function recentExpTableRetryUpdateTrans(rowIndex,startPage)
{editRecentExpenseController.retryUpdateTrans(rowIndex,startPage);}
function recentExpTableShowPage(pageNum)
{recentExpTable.drawModule(pageNum);}
function drawSearchExpensePanel()
{if(!searchExpModule)
{searchExpModule=new SearchTransModule("searchExpModule","Expense");}
searchExpModule.drawModule(expCategoryData.getCategories());document.getElementById("searchExpHeader").innerHTML="";document.getElementById("searchExpResults").innerHTML="";showExpensePanel("searchExpPanel");}
function searchExpModuleSearchTrans()
{var ts=searchExpModule.getTransSearch();ExpenseTracker.SearchTrans(ts.StartDate,ts.EndDate,ts.CategoryType,ts.CategoryId,ts.AmountOperator,ts.Amount,showExpSearchResults);searchHeaderString="&nbsp;&nbsp;<table cellpadding='1' cellspacing='0'><tr><td valign='bottom'><span class='panelHeader'>Search Results</span>&nbsp;&nbsp;</td><td valign='bottom'><img src='images/page_excel.png' style='border-style: none'/></td><td><a href='generateReport.aspx?catType=Expense&startDate="+ts.StartDate+"&endDate="+ts.EndDate+"&catId="+ts.CategoryId+"&amountOper="+ts.AmountOperator+"&amount="+ts.Amount+"'>Export Expense Records</a></td></tr></table>";document.getElementById("searchExpHeader").innerHTML=searchHeaderString;var searchResults=document.getElementById("searchExpResults");searchResults.innerHTML="Searching...<img src='images/loading.gif' />";}
function searchExpResults_SortTable(column,startPage)
{searchExpTable.sortTable(column,startPage);}
function showExpSearchResults(res)
{var searchResponseArray=JSON.parse(res.value);if(searchResponseArray&&searchResponseArray.length>0)
{searchExpTable=new TransTableModule("searchExpResults",searchResponseArray,expCategoryData,20,false);searchExpTable.drawModule(1);searchExpProcessor=new SearchTransProcessor("Expense",expCategoryData,searchExpTable,recentExpTable);}
else
{var searchResults=document.getElementById("searchExpResults");searchResults.innerHTML="<i>No expense records found for specified parameters.</i>";}}
function searchExpResultsEditTrans(arrayIndex,startPage)
{searchExpTable.editRow(arrayIndex);searchExpTable.drawModule(startPage);}
function searchExpResultsCancelEdit(arrayIndex,startPage)
{searchExpTable.cancelRowEdit(arrayIndex);searchExpTable.drawModule(startPage);}
function searchExpResultsDeleteTrans(rowIndex,startPage)
{searchExpProcessor.deleteTrans(rowIndex,startPage);}
function searchExpResultsUpdateTrans(rowIndex,startPage)
{searchExpProcessor.updateTrans(rowIndex,startPage);}
function searchExpResultsRetryUpdateTrans(rowIndex,startPage)
{searchExpProcessor.retryUpdateTrans(rowIndex,startPage);}
function searchExpResultsShowPage(pageNum)
{searchExpTable.drawModule(pageNum);}
function drawExpCategoryPanel()
{if(!expCategoryTable)
{expCategoryTable=new CategoryTableModule("expCatTable",expCategoryData,"Expense");expCategoryTable.drawModule();expSubCategoryModule=new SubCategoryModule("expSubCategoryModule","Expense");expSubCategoryModule.drawModule(expCategoryData.getCategories());}
showExpensePanel("expCategoryPanel");}
function expCatTableEditCategory(arrayIndex)
{expCategoryData.selectCategory(arrayIndex);expCategoryTable.drawModule();}
function expCatTableCancelCategoryEdit(arrayIndex)
{expCategoryData.deselectCategory(arrayIndex);expCategoryTable.drawModule();}
function expCatTableUpdateCategory(arrayIndex)
{var category=expCategoryTable.getModifiedRow(arrayIndex);if(CategoryController.updateCategory(category))
{expCategoryData.updateCategory(arrayIndex,category);expCategoryTable.drawModule();}}
function expCatTable_AddCategory()
{var newCategory=expCategoryTable.getCategory();alert(newCategory.name);if(CategoryController.insertCategory(newCategory))
{expCategoryData.addCategory(newCategory);expCategoryTable.drawModule();expCategoryTable.clearFields();}}
function expCatTableDeleteCategory(arrayIndex)
{var category=expCategoryData.getCategory(arrayIndex);if(CategoryController.deleteCategory(category,"Expense"))
{expCategoryData.deleteCategory(arrayIndex);expCategoryTable.drawModule();if(recentExpTable)
{recentExpTable.deleteAllRowsInCategory(category.CategoryID);}
if(searchExpTable)
{searchExpTable.deleteAllRowsInCategory(category.CategoryID);}}}
function drawExpPieChart()
{if(!expPieChart)
{expPieChart=new PieGraphModule("expPieChart","flashChart",expCategoryData);}
var expPieDateList=document.getElementById("expPieChartDate");var dateRange=expPieDateList.options[expPieDateList.selectedIndex].text;if(dateRange=="Custom Date")
{document.getElementById("expPieOtherSelColumn").style.display="block";if(expCategoryData.isCustomDataLoaded())
{var startDate=expCategoryData.getCustomStartDate();var endDate=expCategoryData.getCustomEndDate();setFieldValue("expPieStartDate",(startDate.getMonth()+1)+"/"+startDate.getDate()+"/"+startDate.getYear());setFieldValue("expPieEndDate",(endDate.getMonth()+1)+"/"+endDate.getDate()+"/"+endDate.getYear());expPieChart.drawChart("Custom Date");}
else
{expPieChart.drawEmpty();}}
else
{document.getElementById("expPieOtherSelColumn").style.display="none";expPieChart.drawChart(dateRange);}
showExpensePanel("expPieChartPanel");}
function drawOtherDateExpPieChart()
{var expPieStartDate=getFieldValue("expPieStartDate");var expPieEndDate=getFieldValue("expPieEndDate");if(!isValidDate(expPieStartDate))
{alert("Cannot create Chart.  Invalid start date specified");return;}
if(!isValidDate(expPieEndDate))
{alert("Cannot create Chart.  Invalid end date specified");return;}
expCategoryData.setCustomDate(expPieStartDate,expPieEndDate);ExpenseTracker.GetCustomDateCategories('E',expPieStartDate,expPieEndDate,drawCustomPieChart_callBack);expPieChart.drawLoading();}
function drawCustomPieChart_callBack(res)
{var catArray=JSON.parse(res.value);expCategoryData.setCustomDateAmount(catArray);expPieChart.drawChart("Custom Date");}
function drawExpTrendsPanel()
{alert("Drawing Table todo");}
var addIncomeModule;var addIncomeCategoryModule;var recentIncomeTable;var incomeSummaryTable;var searchIncomeModule;var searchIncomeProcessor;var searchIncomeTable;var incomeCategoryTable;var incomePieChart;var recentIncomeData;var incomeDataLoadRequired=true;function drawAddIncomePanel()
{if(incomeDataLoadRequired)
{addIncomeModule=new AddTransModule("addIncomeModule","Income",incomeCategoryData.getCategories());recentIncomeTable=new TransTableModule("recentIncomeTable",transData.recentIncome.reverse(),incomeCategoryData,5,true);incomeSummaryTable=new TransSummaryTableModule("incomeSummaryTable",incomeCategoryData,"Income");recentIncomeProcessor=new AddTransProcessor("Income",incomeCategoryData,recentIncomeTable,incomeSummaryTable,addIncomeModule);drawAddIncomePanelModules();incomeDataLoadRequired=false;}
else
{drawAddIncomePanelModules();}}
function recentIncomeTable_SortTable(column,startPage)
{recentIncomeTable.sortTable(column,startPage);}
function drawAddIncomePanelModules()
{addIncomeModule.drawModule();recentIncomeTable.drawModule(1);incomeSummaryTable.drawModule();showIncomePanel("addIncomePanel");}
function addIncomeModule_addTrans()
{recentIncomeProcessor.addTrans();}
function recentIncomeTableEditTrans(rowIndex,startPage)
{recentIncomeTable.editRow(rowIndex);recentIncomeTable.drawModule(startPage);}
function recentIncomeTableCancelEdit(rowIndex,startPage)
{recentIncomeTable.cancelRowEdit(rowIndex);recentIncomeTable.drawModule(startPage);}
function recentIncomeTableDeleteTrans(rowIndex,startPage)
{recentIncomeProcessor.deleteTrans(rowIndex,startPage);}
function recentIncomeTableUpdateTrans(rowIndex,startPage)
{recentIncomeProcessor.updateTrans(rowIndex,startPage);}
function recentIncomeTableRetryUpdateTrans(rowIndex,startPage)
{recentIncomeProcessor.retryUpdateTrans(rowIndex,startPage);}
function recentIncomeTableShowPage(pageNum)
{recentIncomeTable.drawModule(pageNum);}
function drawSearchIncomePanel()
{if(!searchIncomeModule)
{searchIncomeModule=new SearchTransModule("searchIncomeModule","Income");}
searchIncomeModule.drawModule(incomeCategoryData.getCategories());document.getElementById("searchIncomeHeader").innerHTML="";document.getElementById("searchIncomeResults").innerHTML="";showIncomePanel("searchIncomePanel");}
function searchIncomeModuleSearchTrans()
{var ts=searchIncomeModule.getTransSearch();ExpenseTracker.SearchTrans(ts.StartDate,ts.EndDate,ts.CategoryType,ts.CategoryId,ts.AmountOperator,ts.Amount,showIncomeSearchResults);searchHeaderString="&nbsp;&nbsp;<table cellpadding='1' cellspacing='0'><tr><td valign='bottom'><span class='panelHeader'>Search Results</span>&nbsp;&nbsp;</td><td valign='bottom'><img src='images/page_excel.png' style='border-style: none'/></td><td><a href='generateReport.aspx?catType=Income&startDate="+ts.StartDate+"&endDate="+ts.EndDate+"&catId="+ts.CategoryId+"&amountOper="+ts.AmountOperator+"&amount="+ts.Amount+"'>Export Income Records</a></td></tr></table>";document.getElementById("searchIncomeHeader").innerHTML=searchHeaderString;var searchResults=document.getElementById("searchIncomeResults");searchResults.innerHTML="Searching...<img src='images/loading.gif' />";}
function showIncomeSearchResults(res)
{var searchResponseArray=JSON.parse(res.value);if(searchResponseArray&&searchResponseArray.length>0)
{searchIncomeTable=new TransTableModule("searchIncomeResults",searchResponseArray,incomeCategoryData,20,false);searchIncomeTable.drawModule(1);searchIncomeProcessor=new SearchTransProcessor("Income",incomeCategoryData,searchIncomeTable,recentIncomeTable);}
else
{var searchResults=document.getElementById("searchIncomeResults");searchResults.innerHTML="<i>No income records found for specified parameters.</i>";}}
function searchIncomeResults_SortTable(column,startPage)
{searchIncomeTable.sortTable(column,startPage);}
function searchIncomeResultsShowPage(pageNum)
{searchIncomeTable.drawModule(pageNum);}
function searchIncomeResultsEditTrans(arrayIndex,startPage)
{searchIncomeTable.editRow(arrayIndex);searchIncomeTable.drawModule(startPage);}
function searchIncomeResultsCancelEdit(arrayIndex,startPage)
{searchIncomeTable.cancelRowEdit(arrayIndex);searchIncomeTable.drawModule(startPage);}
function searchIncomeResultsDeleteTrans(rowIndex,startPage)
{searchIncomeProcessor.deleteTrans(rowIndex,startPage);}
function searchIncomeResultsUpdateTrans(rowIndex,startPage)
{searchIncomeProcessor.updateTrans(rowIndex,startPage);}
function searchIncomeResultsRetryUpdateTrans(rowIndex,startPage)
{searchIncomeProcessor.retryUpdateTrans(rowIndex,startPage);}
function drawIncomeCategoryPanel()
{if(!incomeCategoryTable)
{addIncomeCategoryModule=new AddCategoryModule("addIncomeCategoryModule","Income");addIncomeCategoryModule.drawModule();incomeCategoryTable=new CategoryTableModule("incomeCatTable",incomeCategoryData,"Income");incomeCategoryTable.drawModule();}
showIncomePanel("incomeCategoryPanel");}
function incomeCatTableEditCategory(arrayIndex)
{incomeCategoryData.selectCategory(arrayIndex);incomeCategoryTable.drawModule();}
function incomeCatTableCancelCategoryEdit(arrayIndex)
{incomeCategoryData.deselectCategory(arrayIndex);incomeCategoryTable.drawModule();}
function incomeCatTableUpdateCategory(arrayIndex)
{var category=incomeCategoryTable.getModifiedRow(arrayIndex);if(CategoryController.updateCategory(category))
{incomeCategoryData.updateCategory(arrayIndex,category);incomeCategoryTable.drawModule();}}
function addIncomeCategoryModuleAddCategory()
{var category=addIncomeCategoryModule.getCategory();if(CategoryController.insertCategory(category))
{incomeCategoryData.addCategory(category);incomeCategoryTable.drawModule();addIncomeCategoryModule.clearFields();}}
function incomeCatTableDeleteCategory(arrayIndex)
{var category=incomeCategoryData.getCategory(arrayIndex);if(CategoryController.deleteCategory(category,"Income"))
{incomeCategoryData.deleteCategory(arrayIndex);incomeCategoryTable.drawModule();if(recentIncomeTable)
{recentIncomeTable.deleteAllRowsInCategory(category.CategoryID);}
if(searchIncomeTable)
{searchIncomeTable.deleteAllRowsInCategory(category.CategoryID);}}}
function drawIncomePieChart()
{if(!incomePieChart)
{incomePieChart=new PieGraphModule("incomePieChart","flashChart",incomeCategoryData);}
var incomePieDateList=document.getElementById("incomePieChartDate");var dateRange=incomePieDateList.options[incomePieDateList.selectedIndex].text;if(dateRange=="Custom Date")
{document.getElementById("incomePieOtherSelColumn").style.display="block";if(incomeCategoryData.isCustomDataLoaded())
{var startDate=incomeCategoryData.getCustomStartDate();var endDate=incomeCategoryData.getCustomEndDate();setFieldValue("incomePieStartDate",(startDate.getMonth()+1)+"/"+startDate.getDate()+"/"+startDate.getYear());setFieldValue("incomePieEndDate",(endDate.getMonth()+1)+"/"+endDate.getDate()+"/"+endDate.getYear());incomePieChart.drawChart("Custom Date");}
else
{incomePieChart.drawEmpty();}}
else
{document.getElementById("incomePieOtherSelColumn").style.display="none";incomePieChart.drawChart(dateRange);}
showIncomePanel("incomePieChartPanel");}
function drawOtherDateIncomePieChart()
{var incomePieStartDate=getFieldValue("incomePieStartDate");var incomePieEndDate=getFieldValue("incomePieEndDate");if(!isValidDate(incomePieStartDate))
{alert("Cannot create Chart.  Invalid start date specified");return;}
if(!isValidDate(incomePieEndDate))
{alert("Cannot create Chart.  Invalid end date specified");return;}
incomeCategoryData.setCustomDate(incomePieStartDate,incomePieEndDate);ExpenseTracker.GetCustomDateCategories('E',incomePieStartDate,incomePieEndDate,drawCustomIncomePieChart_callBack);incomePieChart.drawLoading();}
function drawCustomIncomePieChart_callBack(res)
{var catArray=JSON.parse(res.value);incomeCategoryData.setCustomDateAmount(catArray);incomePieChart.drawChart("Custom Date");}
var balanceChangeTable;var expectedBalanceChangeTable;function drawBalanceSummary(expCatData,incomeCatData)
{var balance=roundAmount(incomeCategoryData.getTotalAllTimeAmount()-expCategoryData.getTotalAllTimeAmount());if(!balance)
{balance=0;}
var balanceColor="green";if(balance<0)
{balanceColor="red";}
document.getElementById("currentBalanceDiv").innerHTML="<font color='"+balanceColor+"'>"+balance+"</font>";if(!balanceChangeTable)
{balanceChangeTable=new BalanceChangeTable("balanceSumTable",expCategoryData,incomeCategoryData);}
if(!expectedBalanceChangeTable)
{expectedBalanceChangeTable=new ExpectedBalanceTableModule("expectedBalanceDiv",expCategoryData,incomeCategoryData);}
balanceChangeTable.drawModule();expectedBalanceChangeTable.drawModule();showBalancePanel("balanceSumPanel");}
function getFieldValue(fieldName)
{var field=document.getElementById(fieldName);if(field){return field.value;}
else{return"";}}
function setFieldValue(fieldName,fieldValue)
{var field=document.getElementById(fieldName);if(field){field.value=fieldValue;}}
function cleanXML(xmlValue)
{xmlValue=xmlValue.replace(/&/g,"*").replace(/>/g,"*").replace(/</g,"*").replace(/'/g,"*");return xmlValue;}
function escapeQuote(stringValue)
{if(!stringValue||stringValue==="")
{return stringValue;}
else
{return stringValue.replace(/'/g,"&#39;");}}
function getRoundedAmount(amount)
{if(!amount||amount==="")
{return"0";}
else
{return roundAmount(amount);}}
function roundAmount(amount)
{var roundedValue=Math.round(amount*100)/100;return padZeros(roundedValue);}
function padZeros(amount)
{if(!amount||amount==="")
{return"";}
var amountString=amount.toString();var decimalIndex=amountString.indexOf('.');if(decimalIndex===-1)
{return(amountString+=".00");}
else
{var numDecimalPlaces=(amountString.length-1)-decimalIndex;if(numDecimalPlaces===2)
{return amountString;}
else if(numDecimalPlaces>2)
{return(amountString.substring(0,decimalIndex)+amountString.substring(decimalIndex,(decimalIndex+3)));}
else if(numDecimalPlaces===1)
{return(amountString+="0");}
else if(numDecimalPlaces===0)
{return(amountString+="00");}}}
function StringBuffer()
{this.buffer=[];}
StringBuffer.prototype.append=function append(string)
{this.buffer.push(string);return this;};StringBuffer.prototype.toString=function toString()
{return this.buffer.join("");};
function showTooltip(anchor,text)
{var toolTipDiv=document.getElementById("toolTip");var left=(Left(anchor)+30)+"px";var top=(Top(anchor))+"px";toolTipDiv.style.position="absolute";toolTipDiv.style.left=left;toolTipDiv.style.top=top;toolTipDiv.innerHTML=anchor.getAttribute('tipitle');toolTipDiv.style.display="block";}
function hideTooltip()
{var toolTipDiv=document.getElementById("toolTip");toolTipDiv.innerHTML="";toolTipDiv.style.display="none";}
﻿function isValidDate(dateValue)
{var dateRegExp=/^\d{4}(\-)\d{1,2}\1\d{1,2}$/;if(!dateRegExp.test(dateValue))
{return false;}
else
{var dateArray=dateValue.split('-');var yearValue=dateArray[0];var monthValue=dateArray[1]-1;var dayValue=dateArray[2];var ALTERdDate=new Date(yearValue,monthValue,dayValue);if((ALTERdDate.getMonth()!=monthValue)||(ALTERdDate.getDate()!=dayValue)||(ALTERdDate.getFullYear()!=yearValue))
{return false;}
else
{return true;}}}
function isValidAmount(amountValue)
{var amountRegExp=/^\d{1,}\.{0,1}\d{0,2}$/;if(!amountRegExp.test(amountValue))
{return false;}
return true;}