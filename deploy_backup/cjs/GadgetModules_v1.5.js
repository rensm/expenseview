
//JSON Service
var GadgetTracker = new JsonService();var gadgetSelectedTab;var gadgetPages=new Array('expGadgetPage','incomeGadgetPage','balanceGadgetPage');var incomeGadgetCatData;var incomeGadgetAddTransModule;var incomeGadgetNewTransTable;var newIncomeGadgetTrans;var expGadgetCatData;var expGadgetAddTransModule;var expGadgetNewTransTable;var newExpGadgetTrans;var balanceGadgetTable;function loadGadget()
{var userDate=new Date();var year=userDate.getFullYear()+"";var month=(userDate.getMonth()+1)+"";var date=userDate.getDate()+"";GadgetTracker.GetUserSummary(date,drawGadgetPages);}
function drawGadgetPages(res)
{var rawTransData=JSON.parse(res.result);expGadgetCatData=new CategoryData(rawTransData.ExpenseCategories);incomeGadgetCatData=new CategoryData(rawTransData.IncomeCategories);newExpGadgetTrans=rawTransData.RecentExpenses.reverse();newIncomeGadgetTrans=rawTransData.RecentIncome.reverse();expGadgetAddTransModule=new AddTransGadgetModule("addExpGadgetModule","Expense");expGadgetAddTransModule.drawModule(expGadgetCatData.getCategories());expGadgetNewTransTable=new NewTransModule("newExpGadgetTable");expGadgetNewTransTable.drawModule(newExpGadgetTrans);incomeGadgetAddTransModule=new AddTransGadgetModule("addIncomeGadgetModule","Income");incomeGadgetAddTransModule.drawModule(incomeGadgetCatData.getCategories());incomeGadgetNewTransTable=new NewTransModule("newIncomeGadgetTable");incomeGadgetNewTransTable.drawModule(newIncomeGadgetTrans);balanceGadgetTable=new BalanceModule("balanceGadgetTable");showPage("expGadgetPage");}
function showPage(pageName)
{for(var i=0;i<gadgetPages.length;i++)
{document.getElementById(gadgetPages[i]).style.display=((pageName)==gadgetPages[i])?'block':'none';}
highlightTab(pageName);if(pageName==="balanceGadgetPage")
{balanceGadgetTable.drawModule();}}
function highlightTab(tabID)
{if(gadgetSelectedTab)
{gadgetSelectedTab.className="tab";}
gadgetSelectedTab=document.getElementById((tabID+'Tab'));gadgetSelectedTab.className="selectedTab";}
function addExp_TimeOut(time,request)
{request.abort();var rowIndex=request.args.rowIndex;var transState=newExpGadgetTrans[rowIndex].state;if(transState==="Adding")
{alert("Failed to Add new Expense. Request Timed out. Please try again");newExpGadgetTrans[rowIndex].state="AddFailed";}
else if(transState==="Deleting")
{alert("Failed to Delete Expense. Request Timed out. Please try again");newExpGadgetTrans[rowIndex].state="DeleteFailed";}}
function addExp_CallBack(res)
{var rowIndex=res.context.RowIndex;var resValue=res.result;if(resValue&&resValue!==-1)
{newExpGadgetTrans[rowIndex].TransID=resValue;newExpGadgetTrans[rowIndex].state="Current";var expense=newExpGadgetTrans[rowIndex];expGadgetCatData.addTrans(expense.CategoryID,expense.Amount,expense.Date);}
else
{newExpGadgetTrans[rowIndex].state="AddFailed";alert("Failed to add expense record. Unexpected error ocurred. Please retry");}
expGadgetNewTransTable.drawModule(newExpGadgetTrans);}
function addExpGadgetModule_AddTrans()
{var expense=expGadgetAddTransModule.getTrans();if(isValidAmount(expense.Amount))
{var newRowIndex=newExpGadgetTrans.length;newExpGadgetTrans[newRowIndex]=expense;expGadgetNewTransTable.drawModule(newExpGadgetTrans);var transObjectString=JSON.stringify(expense);var rowIndex=newRowIndex+"";var addContext=new Object();addContext.RowIndex=rowIndex;GadgetTracker.InsertTrans(transObjectString,rowIndex,addExp_CallBack,addContext,null,null,addExp_TimeOut);expGadgetAddTransModule.clearFields();}
else
{alert("Invalid Amount specified. Please correct and try again");}}
function newExpGadgetTable_RetryAddTrans(rowIndex)
{var expense=newExpGadgetTrans[rowIndex];var transObjectString=JSON.stringify(expense);var addContext=new Object();addContext.RowIndex=rowIndex+"";GadgetTracker.InsertTrans(transObjectString,rowIndex+"",addExp_CallBack,addContext,null,null,addExp_TimeOut);}
function deleteExp_CallBack(res)
{var rowIndex=res.context.RowIndex;var resValue=res.result;if(resValue&&resValue!==-1)
{var expense=newExpGadgetTrans[rowIndex];expGadgetCatData.deleteTrans(expense.CategoryID,expense.Amount,expense.Date);newExpGadgetTrans.splice(rowIndex,1);}
else
{newExpGadgetTrans[rowIndex].state="DeleteFailed";alert("Failed to delete expense recorde. Unexpected error ocurred. Please retry");}
expGadgetNewTransTable.drawModule(newExpGadgetTrans);}
function newExpGadgetTable_DeleteTrans(rowIndex)
{newExpGadgetTrans[rowIndex].state="Deleting";expGadgetNewTransTable.drawModule(newExpGadgetTrans);var transId=newExpGadgetTrans[rowIndex].TransID+"";var addContext=new Object();addContext.RowIndex=rowIndex;GadgetTracker.DeleteTrans(transId,rowIndex+"",deleteExp_CallBack,addContext,null,null,addExp_TimeOut);}
function addIncome_TimeOut(time,request)
{request.abort();var rowIndex=request.args.rowIndex;var transState=newIncomeGadgetTrans[rowIndex].state;if(transState==="Adding")
{alert("Failed to Add new Income. Request Timed out. Please try again");newIncomeGadgetTrans[rowIndex].state="AddFailed";}
else if(transState==="Deleting")
{alert("Failed to Delete Income. Request Timed out. Please try again");newIncomeGadgetTrans[rowIndex].state="DeleteFailed";}}
function addIncome_CallBack(res)
{var rowIndex=res.context.RowIndex;var resValue=res.result;if(resValue&&resValue!==-1)
{newIncomeGadgetTrans[rowIndex].TransID=resValue;newIncomeGadgetTrans[rowIndex].state="Current";var income=newIncomeGadgetTrans[rowIndex];incomeGadgetCatData.addTrans(income.CategoryID,income.Amount,income.Date);}
else
{newIncomeGadgetTrans[rowIndex].state="AddFailed";alert("Failed to add income record. Unexpected error ocurred. Please retry");}
incomeGadgetNewTransTable.drawModule(newIncomeGadgetTrans);}
function addIncomeGadgetModule_AddTrans()
{var income=incomeGadgetAddTransModule.getTrans();if(isValidAmount(income.Amount))
{var newRowIndex=newIncomeGadgetTrans.length;newIncomeGadgetTrans[newRowIndex]=income;incomeGadgetNewTransTable.drawModule(newIncomeGadgetTrans);var transObjectString=JSON.stringify(income);var rowIndex=newRowIndex+"";var addContext=new Object();addContext.RowIndex=rowIndex;GadgetTracker.InsertTrans(transObjectString,rowIndex,addIncome_CallBack,addContext,null,null,addIncome_TimeOut);incomeGadgetAddTransModule.clearFields();}
else
{alert("Invalid Amount specified. Please correct and try again");}}
function newIncomeGadgetTable_RetryAddTrans(rowIndex)
{var income=newIncomeGadgetTrans[rowIndex];var transObjectString=JSON.stringify(income);var addContext=new Object();addContext.RowIndex=rowIndex+"";GadgetTracker.InsertTrans(transObjectString,rowIndex+"",addIncome_CallBack,addContext,null,null,addIncome_TimeOut);}
function deleteIncome_CallBack(res)
{var rowIndex=res.context.RowIndex;var resValue=res.result;if(resValue&&resValue!==-1)
{var income=newIncomeGadgetTrans[rowIndex];incomeGadgetCatData.deleteTrans(income.CategoryID,income.Amount,income.Date);newIncomeGadgetTrans.splice(rowIndex,1);}
else
{newIncomeGadgetTrans[rowIndex].state="DeleteFailed";alert("Failed to delete expense recorde. Unexpected error ocurred. Please retry");}
incomeGadgetNewTransTable.drawModule(newIncomeGadgetTrans);}
function newIncomeGadgetTable_DeleteTrans(rowIndex)
{newIncomeGadgetTrans[rowIndex].state="Deleting";incomeGadgetNewTransTable.drawModule(newIncomeGadgetTrans);var transId=newIncomeGadgetTrans[rowIndex].TransID+"";var addContext=new Object();addContext.RowIndex=rowIndex;GadgetTracker.DeleteTrans(transId,rowIndex+"",deleteIncome_CallBack,addContext,null,null,addIncome_TimeOut);}
function BalanceModule(displayDivName)
{this.drawModule=function()
{var sb=new StringBuffer();sb.append("<table><tr><td width='170px'>Total Income</td><td width='100px'>");sb.append(incomeGadgetCatData.getTotalAllTimeAmount());sb.append("</td><tr><td>Total Expense</td><td>");sb.append(expGadgetCatData.getTotalAllTimeAmount());sb.append("</td><tr><td colspan='2'><hr /></td></tr>");sb.append("<tr><td>Current Balance</td>");var balance=roundAmount(incomeGadgetCatData.getTotalAllTimeAmount()-expGadgetCatData.getTotalAllTimeAmount());if(!balance)
{balance=0;}
var balanceStyle="negativeAmount";if(balance>0)
{balanceStyle="possitiveAmount";}
sb.append("<td class='"+balanceStyle+"'>");sb.append(balance);sb.append("</td></tr></table>");document.getElementById(displayDivName).innerHTML=sb.toString();};}
function NewTransModule(dispalyDiv)
{var displayDivName=dispalyDiv;this.drawModule=function(transArray)
{var sb=new StringBuffer();sb.append("<table class='fixedTable' width='300px' cellpadding='1' cellspacing='0' border='0'>");sb.append("<tr class='blueBGColumn'><td style='width: 100px; text-align: left; word-wrap: break-word'>Category</td>");sb.append("<td style='width: 90px; text-align: center;'>Date</td>");sb.append("<td style='width: 90px; text-align: center;'>Amount</td>");sb.append("<td style='width: 20px; text-align: left;'></td></tr>");var numTrans=transArray.length;for(var transIndex=numTrans-1;transIndex>=0;transIndex--)
{var trans=transArray[transIndex];sb.append("<tr><td align='left'>"+trans.CategoryName+"</td>");sb.append("<td align='center'>"+trans.Date+"</td>");sb.append("<td align='center'>"+roundAmount(trans.Amount)+"</td>");if(trans.State==""||trans.State==="Current")
{sb.append("<td align='left'><a href='javascript:"+displayDivName+"_DeleteTrans("+transIndex+");void(0);'>");sb.append("<img src='images/delete.gif' alt='Delete' border='0' /></a></td>");}
else if(trans.State==="Adding"||trans.State==="Deleting")
{sb.append("<td align='left'>");sb.append("<img src='images/loading.gif' alt='loading' border='0' />..");sb.append(trans.State+"</td>");}
else if(trans.State==="AddFailed")
{sb.append("<td align='left'>");sb.append("<a href='javascript:"+displayDivName+"_RetryAddTrans("+transIndex+");void(0);'>");sb.append("<img src='images/error.gif' alt='loading' border='0' /> Retry Add</a></td>");}
else if(trans.State==="DeleteFailed")
{sb.append("<td align='left'>");sb.append("<a href='javascript:"+displayDivName+"_DeleteTrans("+transIndex+");void(0);'>");sb.append("<img src='images/error.gif' alt='Retry Delete' border='0' /> Retry Delete</a></td>");}
sb.append("</tr>");}
sb.append("</table>");document.getElementById(displayDivName).innerHTML=sb.toString();};}
function AddTransGadgetModule(displayDiv,categoryType)
{this.drawModule=function(categoryArray)
{var sb=new StringBuffer();var today=new Date();var day=today.getDate();if(day<10){day="0"+day;}
var month=today.getMonth()+1;if(month<10){month="0"+month;}
var todayString=today.getFullYear()+'-'+month+'-'+day;sb.append("<table class='fixedTable' width='300px' cellpadding='1' cellspacing='1' border='0'>");sb.append("<tr><td style='width: 90px'><b>Category:</b></td>");sb.append("<td width='150px'>");sb.append("<select STYLE='width: 150px' id='"+displayDiv+"_addTransCatList'>");var numCategories=categoryArray.length;for(i=0;i<numCategories;i++)
{var category=categoryArray[i];sb.append("<option value='");sb.append(category.CategoryID);sb.append("'>");sb.append(category.Name);sb.append("</option>");}
sb.append("</select></td>");sb.append("<td width='60px' align='center'><input type='button' STYLE='width: 50px' value='Add' size='8' class='addButton' onclick='"+displayDiv+"_AddTrans();' /></td></tr>");sb.append("<tr><td><b>Date:</b></td>");sb.append("<td align='left' colspan='2'><TABLE cellspacing='0' cellpadding='0'><TR><TD><input type='text' size='10' id='"+displayDiv+"_addTransDate' value='"+todayString+"'/></TD>");sb.append("<TD>&nbsp;&nbsp;<a href='javascript:lcs(document.getElementById(\""+displayDiv+"_addTransDate\"));'><img src='images/icon_calendar.png' border='0' alt='Open Calendar'></a></TD></TR></TABLE></td>");sb.append("<tr><td><b>Amount:</b></td><td align='left' colspan='2'><input type='text' name='zipAmount' size='10' id='"+displayDiv+"_addTransAmount' /></td></tr>");sb.append("<tr><td><b>Comments:</b></td><td colspan='2' align='left'><input type='text' size='23' style='width: 185px'  id='"+displayDiv+"_addTransComments' /></td></tr></table>");document.getElementById(displayDiv).innerHTML=sb.toString();};this.getTrans=function()
{var trans=new Object();trans.Date=getFieldValue(displayDiv+"_addTransDate");trans.Amount=roundAmount(getFieldValue(displayDiv+"_addTransAmount"));trans.DisplayAmount=trans.Amount;trans.Description=getFieldValue(displayDiv+"_addTransComments");var categoryList=document.getElementById(displayDiv+"_addTransCatList");if(categoryList)
{trans.CategoryName=categoryList.options[categoryList.selectedIndex].text;trans.CategoryID=categoryList.options[categoryList.selectedIndex].value;}
if(categoryType==="Expense")
{trans.CategoryType="E";}
else if(categoryType==="Income")
{trans.CategoryType="I";}
trans.State="Adding";return trans;};this.clearFields=function()
{document.getElementById(displayDiv+"_addTransAmount").value="";document.getElementById(displayDiv+"_addTransComments").value="";};}
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
function getFieldValue(fieldName)
{var field=document.getElementById(fieldName);if(field){return field.value;}
else{return"";}}
function setFieldValue(fieldName,fieldValue)
{var field=document.getElementById(fieldName);if(field){field.value=fieldValue;}}
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
function StringBuffer()
{this.buffer=[];}
StringBuffer.prototype.append=function append(string)
{this.buffer.push(string);return this;};StringBuffer.prototype.toString=function toString()
{return this.buffer.join("");};