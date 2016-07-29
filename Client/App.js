/*
Author: Rens Methratta
Copyright ExpenseView.com
This code is property of ExpenseView.com and cannot be used without explicit permission
from Rens Methratta.
*/


//Specifies the pages that make up the application
var pages = new Array('expensePage', 'incomePage', 'balancePage', 'loadingPage', 'welcomePage');

//Specifies the panels within the pages
var welcomePanels = new Array('div_welcomeOverviewPanel', 'div_welcomeAboutUsPanel', 'div_welcomeLatestUpdatesPanel');
var expensePanels = new Array('div_addExpensePanel', 'div_searchExpPanel', 'div_expCategoryPanel', 'div_expTrendsPanel', 'div_expPieChartPanel', 'div_expenseLoggedOutPanel');
var incomePanels = new Array('div_addIncomePanel', 'div_searchIncomePanel', 'div_incomeCategoryPanel', 'div_incomeTrendsPanel', 'div_incomePieChartPanel', 'div_incomeLoggedOutPanel');
var balancePanels = new Array('div_balanceSumPanel', 'div_balanceLoggedOutPanel');

var adPanels = new Array('expenseAds');

//Stores currently selected link for each Page
var currentExpLinkId = "addExpLink";
var currentIncomeLinkId = "addIncomeLink";
var currentBalanceLinkId = "balanceSumLink";
var currentWelcomeLinkId = "siteOverviewLink";

var linkMenus = new Array('welcomeLinks', 'expenseLinks', 'incomeLinks', 'balanceLinks');

var selectedTab = null;
var currentPage = "";

//Global Data Objects
var ExpViewGlobalData = ExpViewGlobalData ? ExpViewGlobalData : new Object();
var transData = null;
var expCategoryData = null;
var incomeCategoryData = null;
var recentExpData = null;
var recentIncomeData = null;
var isAuthenticated = false;

//JSON Service
var serviceURL = "";
if (window.location.host == "localhost")
    serviceURL = "http://" + window.location.host + "/expViewWeb/Service/ExpJSONService.ashx";
else
    serviceURL = "http://" + window.location.host + "/Service/ExpJSONService.ashx";
var jsonService = new JsonService(serviceURL);



/************************ Edit Settings Window Functions *********************/
function openEditAccountInfoWindow() {
    var editSettingsWin = dhtmlwindow.open("editSettingsBox", "iframe", "editAccountInfo.aspx", "Edit Account Settings", "width=630px,height=430px,resize=0,scrolling=0,left=300,top=40,center=0")
    dhtmlwindow.setCloseFunction(reloadApp);
}

/************************ Edit Settings Window Functions *********************/
function openTransactionImportWindow() {
    var transactionImportWin = dhtmlwindow.open("transactionImportBox", "iframe", "TransactionImport.aspx", "Import Bank/Credit Card Statements", "width=750px,height=600px,resize=1,scrolling=0,left=300,top=40,center=0")
    dhtmlwindow.setCloseFunction(reloadApp);
}

/************************ Recurring Transactions Window Functions *********************/
function openRecurrTransactionWindow() {
    var transactionImportWin = dhtmlwindow.open("transactionRecurrBox", "iframe", "RecurringTransactions.aspx", "Create or Update Recurring Income/Expenses", "width=900px,height=600px,resize=1,scrolling=0,left=300,top=40,center=0")
    dhtmlwindow.setCloseFunction(reloadApp);
}


/************************* Common Tab Menu Functions *************************/
function loadApp(isLoggedIn, reload) {
    var userDate = new Date();
    isAuthenticated = isLoggedIn;

    if (isAuthenticated)
    {
        if (reload)
        {
            jsonService.GetUserSummary(userDate, viewCurrentPage);
        }
        else
        {
            jsonService.GetUserSummary(userDate, viewFirstPage);
        }
    }
    else {
        viewPage("welcome");
    }
}

function reloadApp()
{
    loadApp(true, true);
}

function viewCurrentPage(response)
{
    loadData(response);
    viewPage(currentPage);
}

function viewFirstPage(response)
{
    loadData(response);
    viewPage("expense");
}

function loadData(response)
{
    transData = JSON.parse(response.result);

    //Set Global Variables
    ExpViewGlobalData.userDateFormat = transData.PreferredDateFormat;
    ExpViewGlobalData.userDisplayDecimals = transData.AmountDisplayDecimals;
    ExpViewGlobalData.userStartDate = transData.UserStartDate;
    ExpViewGlobalData.userEndDate = transData.UserEndDate;

    ExpViewGlobalData.transDataNeedsRefresh = false;
    ExpViewGlobalData.userSettignsDataNeedsRefresh = false;

    //0=Sunday, 1=Monday
    ExpViewGlobalData.userWeekStart = transData.UserWeekStart;

    //Create Expense Data Objects
    if (transData.ExpenseCategories) {
        expCategoryData = new CategoryData(transData.ExpenseCategories);
    }

    if (transData.RecentExpenses) {
        recentExpData = new TransData(transData.RecentExpenses);
    }

    //Create Income Data Objects
    if (transData.IncomeCategories) {
        incomeCategoryData = new CategoryData(transData.IncomeCategories);
    }

    if (transData.RecentIncome) {
        recentIncomeData = new TransData(transData.RecentIncome);
    }

    var preferredDateFormat = getPreferredDateFormatFromValue(ExpViewGlobalData.userDateFormat);
    
    //Set DatePicker defaults
    $.datepicker.setDefaults({
        dateFormat: preferredDateFormat,
        firstDay: ExpViewGlobalData.userWeekStart
    });
}

function viewPage(pageName, linkId) {
    if (pageName == "welcome") {
        currentPage = "welcome";
        highlightTab("welcome");
        showLinkMenu("welcome");
        showPage(pageName);
        viewWelcomePanel();
    }
    else {
    
        currentPage = pageName;
        highlightTab(pageName);
        showPage(pageName);

        if (isAuthenticated) 
        {
            showLinkMenu(pageName);
            showAd("expenseAds");

            if (pageName === "expense") 
            {
                viewExpensePanel(linkId);
            }
            else if (pageName === "income") 
            {
                viewIncomePanel(linkId);
            }
            else if (pageName === "balance") 
            {
                viewBalancePanel(linkId);
            }
        }
        else {
            //Done show any links
            showLinkMenu("");
            if (pageName === "expense") 
            {
                showPanel(expensePanels, "div_expenseLoggedOutPanel");
            }
            else if (pageName === "income") 
            {
                showPanel(incomePanels, "div_incomeLoggedOutPanel");
            }
            else if (pageName === "balance") 
            {
                showPanel(balancePanels, "div_balanceLoggedOutPanel");
            }
        }
    }
}

function showPage(pageName) {
    for (var i = 0; i < pages.length; i++) {
        document.getElementById(pages[i]).style.display = ((pageName + 'Page') == pages[i]) ? 'block' : 'none';
    }
}

function showPanel(panelArray, panelName) {
    for (var i = 0; i < panelArray.length; i++) {
        document.getElementById(panelArray[i]).style.display = (panelName == panelArray[i]) ? 'block' : 'none';
    }
}

function showLinkMenu(linkMenuName) {
    for (var i = 0; i < linkMenus.length; i++) {
        document.getElementById(linkMenus[i]).style.display = ((linkMenuName + 'Links') == linkMenus[i]) ? 'block' : 'none';
    }
}

/* Higlight the newly selected link and unhighlight the currently selected */
function selectLink(currentLinkId, newLinkId) {
    if (currentLinkId) {
        var currentLink = document.getElementById(currentLinkId);
        currentLink.className = "panelLink";
    }

    var selectedLink = document.getElementById(newLinkId);
    selectedLink.className = "selPanelLink";
}

function highlightTab(tabID) {
    if (selectedTab) {
        selectedTab.className = "tab";
    }

    selectedTab = document.getElementById((tabID + 'Tab'));
    selectedTab.className = "selectedTab";
}


/************************* Expense Page Menu Functions *************************/
function viewExpensePanel(linkId) {

    if (!linkId) {
        linkId = currentExpLinkId;
    }
    else {
        selectLink(currentExpLinkId, linkId);
    }

    if (linkId === "addExpLink") {
        drawAddExpensePanel();
        showPanel(expensePanels, "div_addExpensePanel");
    }
    else if (linkId === "searchExpLink") {
        drawSearchExpensePanel();
        showPanel(expensePanels, "div_searchExpPanel");
    }
    else if (linkId === "expCategoryLink") {
        drawExpCategoryPanel();
        showPanel(expensePanels, "div_expCategoryPanel");
    }
    else if (linkId === "expBreakdownLink") {
        drawExpensePieChartPanel();
        showPanel(expensePanels, "div_expPieChartPanel");
    }
    else if (linkId === "expTrendsLink") {
        drawExpenseTrendsPanel();
        showPanel(expensePanels, "div_expTrendsPanel");
    }

    currentExpLinkId = linkId;
}

/************************* Income Page Menu Functions *************************/
function viewIncomePanel(linkId) {

    if (!linkId) {
        linkId = currentIncomeLinkId;
    }
    else {
        //If PanelName is not specified, default to the current income panel
        selectLink(currentIncomeLinkId, linkId);
    }

    if (linkId === "addIncomeLink") {
        drawAddIncomePanel();
        showPanel(incomePanels, "div_addIncomePanel");
    }
    else if (linkId === "searchIncomeLink") {
        drawSearchIncomePanel();
        showPanel(incomePanels, "div_searchIncomePanel");
    }
    else if (linkId === "incomeCategoryLink") {
        drawIncomeCategoryPanel();
        showPanel(incomePanels, "div_incomeCategoryPanel");
    }
    else if (linkId === "incomeBreakdownLink") {
        drawIncomePieChartPanel();
        showPanel(incomePanels, "div_incomePieChartPanel");
    }
    else if (linkId === "incomeTrendsLink")
    {
        drawIncomeTrendsPanel();
        showPanel(incomePanels, "div_incomeTrendsPanel");
    }


    currentIncomeLinkId = linkId;
}

/************************* Balance Page Menu Functions *************************/
function viewBalancePanel(linkId) {

    if (!linkId) {
        //If linkId is not specified, default to the currently displayed balance panel 
        linkId = currentBalanceLinkId;
    }
    else {
        selectLink(currentBalanceLinkId, linkId);
    }

    if (linkId === "balanceSumLink") 
    {
        drawBalanceSummary();
        showPanel(balancePanels, "div_balanceSumPanel");
    }

    currentBalanceLinkId = linkId;
}

/************************* Welcome Panel Menu Functions *************************/
function viewWelcomePanel(linkId) 
{
    if (!linkId) 
    {
        linkId = currentWelcomeLinkId;
    }
    else 
    {
        selectLink(currentWelcomeLinkId, linkId);
    }

    if (linkId === "siteOverviewLink") {
        showPanel(welcomePanels, "div_welcomeOverviewPanel");
    }
    else if (linkId === "aboutUsLink") {
        showPanel(welcomePanels, "div_welcomeAboutUsPanel");
    }
    else if (linkId === "latestUpdatesLink") {
        showPanel(welcomePanels, "div_welcomeLatestUpdatesPanel");
    }

    currentWelcomeLinkId = linkId;
}


//Required to load components when loading panel
function showAd(adType) {
    showPanel(adPanels, adType);
}
