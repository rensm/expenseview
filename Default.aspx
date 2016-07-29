<%@ Page Language="C#" AutoEventWireup="true" Inherits="ExpenseView.ExpenseTracker" Codebehind="Default.aspx.cs" %>

<%@ Register assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" namespace="System.Web.UI" tagprefix="asp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<!--
Author: Rens Methratta
Copyright ExpenseView.com
This code is property of ExpenseView.com and cannot be used without explicit permission
from ExpenseView.com.
-->

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>ExpenseView.com</title>        
    <link rel="Stylesheet" href="css/Style.css" type="text/css" media="screen" />
    <link rel="Stylesheet" href="css/DhtmlWindow.css" type="text/css" media="screen" />
        <link rel="Stylesheet" href="css/Redmond/jquery-ui-1.8.4.custom.css" type="text/css" media="screen" />
	<link rel="shortcut icon" href="/images/favicon.ico" />
    <script language="JavaScript"  type="text/Javascript" src="JSMinifier.ashx"></script>
</head>

<body onload="loadApp(<%= ExpenseView.ExpenseTracker.isLoggedIn %>);void(0);" style="background-image:url('images/bg1_test.jpg')">

    <form name="recurringTransactionsForm" id="recurringTransactionsForm"  runat="server">


        <div id="wrapper">
            <div id="mainArea">
            <div id="fbButton"><a href="https://www.facebook.com/ExpenseView"><img src="images/f_logo.png"/></a></div>
            <div id="fbLikeButton">
                <iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com%2Fexpenseview&amp;send=false&amp;layout=button_count&amp;width=450&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font=arial&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:21px;" allowTransparency="true"></iframe>
            </div>

            <div id="twitterButton">
                <a href="https://twitter.com/expenseview" class="twitter-follow-button" data-show-count="false" data-show-screen-name="false">Follow @expenseview</a>
                <script>                !function (d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.src = "//platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs); } } (document, "script", "twitter-wjs");</script>
            </div>
                <!-- Page Header -->            
                <div id="header">
                    <img src="images/modifiedLogo.gif" style="top:5px;" alt="Logo" />

                    <div id="loggedInHeader" class="loggedInPageHeader" runat="server" visible="false">
                        <asp:Label runat="server" id="lblWelcome" CssClass="headerWelcome">Welcome</asp:Label><span class="loggedInHeaderText">&nbsp;|&nbsp;<a href="javascript:openRecurrTransactionWindow();void(0);"><img src="images/arrow_refresh.png" style="border-width:0" />&nbsp;Recurring Expenses/Income</a>&nbsp;|&nbsp;<a href="javascript:openTransactionImportWindow();void(0);"><img src="images/folder_table.png" style="border-width:0" />&nbsp;Import Statements</a>&nbsp;|&nbsp;<a href="javascript:openEditAccountInfoWindow();void(0);"><img src="images/cog.png" style="border-width:0" />&nbsp;Account Settings</a>&nbsp;|&nbsp;<a href="mailto:ContactUs@ExpenseView.com" class="headerText">Contact Us</a>&nbsp;|&nbsp;<a href="http://www.facebook.com/expenseview" target="_blank">&nbsp;|&nbsp;<asp:LinkButton runat="server" id="lnkLogOut" OnClick="lnkLogOut_Click">Sign Out</asp:LinkButton>&nbsp;&nbsp;</span>       
                    </div>

                    <div id="loggedOutHeader" runat="server" visible="false" class="loggedOutPageHeader">
                            <div class="loggedOutHeaderText">
                                <span >Username:&nbsp;<input id="txtUsername" runat="server" style="width:120px" type="text" />
                                &nbsp;Password:&nbsp;<input style="width:120px" id="txtPassword" runat="server" type="password" />
                                &nbsp;<asp:button ID="btnLoginSubmit" Text="Login" CssClass="addButton" runat="server" onclick="btnLoginSubmit_Click" />                    
                                </span>
                                <span class="createAccountText">&nbsp;|&nbsp;<a class="createAccountText" href="createUser.aspx">Create Account</a></span>
                                <br />
                                <span><input type="checkbox" id="cbLoginRemember" runat="server" />Remember Me
                                &nbsp;&nbsp;<a href="resetPassword.aspx">Forgot Username / Password</a><br /><asp:Label runat="server" ID="lblLoginMsg" CssClass="loginMsgText"></asp:Label>
                                </span>
                            </div>
                    </div>                        
                </div>
        
                <!-- App Tabs and Panels -->
                <div id="navTable">            
                    <!-- Tabs !-->
                    <div id="ddcolortabs">
                        <ul>
                            <li id="welcomeTab"><a href="javascript:viewPage('welcome');void(0);" title="Home"><span>&nbsp;&nbsp;Home&nbsp;&nbsp;</span></a></li>
                            <li id="expenseTab"><a href="javascript:viewPage('expense');void(0);" title="Expenses"><span>&nbsp;&nbsp;Expenses&nbsp;&nbsp;</span></a></li>
                            <li id="incomeTab"><a href="javascript:viewPage('income');void(0);" title="Income"><span>&nbsp;Income&nbsp;</span></a></li>
                            <li id="balanceTab"><a href="javascript:viewPage('balance');void(0);;" title="Balance"><span>&nbsp;Balance&nbsp;</span></a></li>
                        </ul>
                    </div>                            
                    <div id="ddcolortabsline">
                        <ul id="welcomeLinks" class="linkMenu" style="display:none">
                            <li class="selPanelLink" id="siteOverviewLink"><a href="javascript:viewWelcomePanel('siteOverviewLink');void(0);">Overview</a></li>
                            <li class="panelLink" id="aboutUsLink"><a href="javascript:viewWelcomePanel('aboutUsLink');void(0);">About Us</a></li>
                            <li class="panelLink" id="latestUpdatesLink"><a href="javascript:viewWelcomePanel('latestUpdatesLink');void(0);">Latest Updates</a></li>
                        </ul>
                        <ul id="expenseLinks" class="linkMenu" style="display:none">
                            <li class="selPanelLink" id="addExpLink"><a href="javascript:viewExpensePanel('addExpLink');void(0);">Add Expenses</a></li>
                            <li class="panelLink" id="expCategoryLink"><a href="javascript:viewExpensePanel('expCategoryLink');void(0);">Edit Expense Categories</a></li>
                            <li class="panelLink" id="searchExpLink"><a href="javascript:viewExpensePanel('searchExpLink');void(0);">Search/Export Expenses</a></li>
                            <li class="panelLink" id="expBreakdownLink"><a href="javascript:viewExpensePanel('expBreakdownLink');void(0);"><img alt="pieChartIcon" src="images/chart_pie.png" style="border-width:0px;" />&nbsp;Expense Breakdown</a></li>
                            <li class="panelLink" id="expTrendsLink"><a href="javascript:viewExpensePanel('expTrendsLink');void(0);"><img alt="lineChartIcon" src="images/chart_bar.png" style="border-width:0px;" />&nbsp;Expense Trends</a></li>    
                        </ul>                    
                        <ul id="incomeLinks" class="linkMenu" style="display:none">
                            <li class="selPanelLink" id="addIncomeLink"><a href="javascript:viewIncomePanel('addIncomeLink');void(0);">Add Income</a></li>
                            <li class="panelLink" id="incomeCategoryLink"><a href="javascript:viewIncomePanel('incomeCategoryLink');void(0);">Edit Income Categories</a></li>
                            <li class="panelLink" id="searchIncomeLink"><a href="javascript:viewIncomePanel('searchIncomeLink');void(0);">Search/Export Income</a></li>
                            <li class="panelLink" id="incomeBreakdownLink"><a href="javascript:viewIncomePanel('incomeBreakdownLink');void(0);"><img alt="pieChartIcon" src="images/chart_pie.png" style="border-width:0px;" />&nbsp;Income Breakdown</a></li>    
                            <li class="panelLink" id="incomeTrendsLink"><a href="javascript:viewIncomePanel('incomeTrendsLink');void(0);"><img alt="lineChartIcon" src="images/chart_bar.png" style="border-width:0px;" />&nbsp;Income Trends</a></li>    
                        </ul>                    
                        <ul id="balanceLinks" class="linkMenu" style="display:none">
                            <li class="selPanelLink" id="balanceSumLink"><a href="javascript:viewBalancePanel('balanceSumLink');void(0);"">Balance Summary</a></li>                                    
                        </ul>                    
                    </div>
                    </div>
                    <!-- end of NavTable -->


                    <!-- Content !-->                    
                    <div id="content">                 
                        <div id="loadingPage" style="display:block">
                            loading... <img src="images/ajax-loader.gif" width="16" height="16" alt="Loading Image" />
                        </div>
                
                        <div id="expensePage">
                            <div class="panel" id="div_addExpensePanel" style="display:none"></div>            
                            <div class="panel" id="div_searchExpPanel" style="display:none"></div>
                            <div class="panel" id="div_expCategoryPanel" style="display: none"></div>    
                            <div class="panel" id="div_expPieChartPanel" style="display: none"></div>
                            <div class="panel" id="div_expTrendsPanel" style="display: none"></div>    
                            <div id="div_expenseLoggedOutPanel" class="panel" style="display:none">
                                <div class="welcomeText">
                                    You need to <b>login</b> to track expenses. If you don't have an account, you can <a class="createAccountText" href="createUser.aspx">create one now</a>. <br /><br />
                                    Once you're logged in, you can use this section to add expenses, create/edit expense categories and view the breakdown of your spending.
                                </div>
                            </div>
                        </div>

                        <div id="incomePage">
                            <div id="div_addIncomePanel" class="panel" style="display:none"></div>        
                            <div id="div_incomeCategoryPanel" class="panel" style="display:none"></div>    
                            <div id="div_searchIncomePanel" class="panel" style="display:none"></div>           
                            <div id="div_incomePieChartPanel" class="panel"  style="display:none"></div>
                            <div id="div_incomeTrends" class="panel" style="display:none"></div>
                            <div class="panel" id="div_incomeTrendsPanel" style="display: none"></div>                                    
                            <div id="div_incomeLoggedOutPanel" class="panel" style="display:none">
                                <div class="welcomeText">
                                    You need to <b>login</b> to track income transactions. If you don't have an account, you can <a class="createAccountText" href="createUser.aspx">create one now</a>.
                                    <br /> <br />
                                    Once you're logged in, you can use this section to add income data, create/edit income categories and view the breakdown
                                    of the income that you have coming in.
                                 </div>
                            </div>
                        </div>

                        <div id="balancePage">
                            <div class="panel" id="div_balanceSumPanel" style="display:none">           
                                <span class="panelHeader">Current Balance:&nbsp;</span> 
                                 <span id="currentBalanceDiv" class="showText"></span>    
                                 <br />&nbsp;&nbsp;<br />

                                <span class="panelHeader">Balance Changes</span>                     
                                &nbsp;<a href="#" onmouseout="hideTooltip();" onmouseover="showTooltip(this);" tipitle="Balance changes are highlighed in red if they're less than the expected value."><img src="images/information.jpg" style=" border: 0px" /></a>              
                                <div id="balanceSumTable"></div>
                                 <br />&nbsp;&nbsp;<br />

                                <span class="panelHeader">Expected Balance Changes</span>       
                                &nbsp;<a href="#" onmouseout="hideTooltip();" onmouseover="showTooltip(this);" tipitle="Expected change is derived by subtracting the expected income of the income categories from the expected budget of the expense categories."><img src="images/information.jpg" style=" border: 0px" /></a>              
                                <div id="expectedBalanceDiv"></div>            
                                 <br />&nbsp;&nbsp;<br />
                            </div>
                           <div id="div_balanceLoggedOutPanel" class="panel" style="display:none">
                                <div class="welcomeText">
                                You need to <b>login</b> to see your balance information. If you don't have an account, you can <a class="createAccountText" href="createUser.aspx">create one now</a>.
                                <p> Once you're logged in, you can use this section to see a comparison of your income and expenses.  This is helpful to guage how much you're saving and to forecast 
                                your potential future savings.</p>
                                </div>
                            </div>                             
                       </div>
                        <div id="welcomePage">
                            <div class="panel" id="div_welcomeOverviewPanel" style="display:none;">  
                            <div class="loginPageTitle" style="width:100%;">Welcome to ExpenseView</div>
                            <div class="welcomeText">
                                ExpenseView is a <b>free</b>, easy to use application that helps you to understand how you're spending your money.
                                <br /><br />
                                The application is still in beta mode, so if you encounter any problems or have any suggestions please 
                                <a href="mailto:contactus@expenseview.com" style="text-decoration: none;">contact us.</a>
                                <br /><br />
                                    To use the app, simply do the following:<br />                                    
                                    &nbsp;&nbsp;1. Create categories to track your expenses or income  (i.e. Groceries, Utilities, Gas, etc.)
                                    <br />&nbsp;&nbsp;2. Then just add transactions for those categories.
                                    <br /><br />
                                        You can also add expenses, through our <a href="http://www.google.com/ig/adde?moduleurl=http://www.expenseview.com/ExpViewGadget.xml" style="text-decoration: none;">Google gadget</a> or even on the go with our <a href="gadgetDefault.aspx" style="text-decoration: none;">mobile web app</a>.
                                    <br /><br />
                                   ExpenseView will then take this data and provide you an overall view of your expenses, income and your potential savings.                                          
                                    <br /><br />
                                    <img src="images/SampleGraph.gif" style="padding-left:30%;" /><br /><br />
                            
                                    We hope this provides you a clear view of where your money is going.  Hence our name, ExpenseView. &nbsp;                                 
                                    <a href="createUser.aspx" style="text-decoration: none;" class="createAccountText">Create an account to get started.</a>                        
                                </div>
                           </div>
                   
                           <div class="panel" id="div_welcomeAboutUsPanel" style="display:none;">  
                            <div class="welcomeText">
                                This application came about because of a Google Gadget I created, called ExpenseTracker.
                                I made the gadget as a quick and easy way to track my daily expenses.  
                                But suprisingly, the gadget started to be used by a large number of people.
                                <br />&nbsp;<br />
                                    The more popular the gadget got, the more requests I got to add new functionality to it.  Unfortunatley, there's only so much that you can do with a gadget.  Thus 
                                    I created this site to provide the full set of features that people were looking for.
                                <br />&nbsp;<br />
                                Like the Gadget, this site will also be free.  Eventually, I plan on adding some ads to the site to pay the maintenance costs. 
                                <br />&nbsp;<br />
                                This site is still in beta mode and I plan on adding more features as people request.  So if you have any suggestions or questions, please feel free to send me an <a href="mailto:contactus@expenseview.com">email</a>.                       
                            </div>               
                           </div>
                           <div class="panel" id="div_welcomeLatestUpdatesPanel" style="display:none;">  
                                <table border="0" cellpadding="2" cellspacing="4">                    
                                    <tr>
                                        <td>05/19/2012</td>
                                        <td>Fixed issue caused when updating Recurring Transactions for Income or Expenses.</td>
                                    </tr>
                                    <tr>
                                        <td>04/11/2012</td>
                                        <td>Added Recurring Transactions for Income or Expenses.  It is available via the navigation menu at the top.</td>
                                    </tr>
                                    <tr>
                                        <td>03/14/2012</td>
                                        <td>Fixed issue caused when Exporting Income or Expenses.</td>
                                    </tr> 
                                    <tr>
                                        <td>03/10/2012</td>
                                        <td>Added additional supported file type for importing Income/Expense data. Supported file types include: Microsoft Monet (*.ofx) and Quicken (*.qfx).</td>
                                    </tr> 
                                    <tr>
                                        <td>01/15/2012</td>
                                        <td>Fixed issue caused when logging into the account.</td>
                                    </tr> 
                                    <tr>
                                        <td>02/11/2011</td>
                                        <td>Added trend graphs to the Income and Expense sections.  The Trend shows how your income and expenses fluctuate from month to month.</td>
                                    </tr> 
                                    <tr>
                                        <td>11/10/2010</td>
                                        <td>Fixed scrolling issues.</td>
                                    </tr> 
                                    <tr>
                                        <td>08/31/2010</td>
                                        <td>Added a custom date range feature to track expenses and income.  Added user preference to set first day of week to Sunday or Monday.  Added functionality to set graph color for each category.</td>
                                    </tr> 
                                    <tr>
                                        <td>01/16/2010</td>
                                        <td>Updated site layout.  Merged homepage and login page.</td>
                                    </tr> 
                                    <tr>
                                        <td>07/01/2009</td>
                                        <td>New v2.0 site.  Updated site design.  Inproved Site Performance.  Added Sub-categoriy functionality and updated graphs.</td>
                                    </tr> 
                                    <tr>
                                        <td>07/18/2007</td>
                                        <td>Added Sort Feature to Trans Table</td>
                                    </tr> 
                                    <tr>
                                        <td>07/17/2007</td>
                                        <td>Fixed Cookie timeout issue that was affecting some users.  Now site will always remember user's who specify this option and will not make them logon again.</td>
                                    </tr>                
                                    <tr>
                                        <td>07/09/2007</td>
                                        <td>Added new balance tab.  Application now displays current balance.  Also added expense and income breakdown graphs.</td>
                                    </tr>
                                    <tr>
                                        <td>07/01/2007</td>
                                        <td>Fixed issue with Pie Graph not displaying correctly when "&" present in category name.</td>
                                    </tr>
                                    <tr>
                                        <td>05/08/2007</td>
                                        <td>Added new integrated Google Gadget.</td>
                                    </tr>
                                    <tr>
                                        <td>04/08/2007</td>
                                        <td>Incorporated new calendar and changed dates to ISO standard format.</td>
                                    </tr>
                                    <tr>
                                        <td>04/08/2007</td>
                                        <td>Added Income Category Year, Month and Week Amounts to estimate income for those periods.</td>
                                    </tr>
                                    <tr>
                                        <td>04/01/2007</td>
                                        <td>Eased restrictions on username and email address validation to support . and _ characters.</td>
                                    </tr>
                                    <tr>
                                        <td>04/01/2007</td>
                                        <td>Resolved issue with graph not displaying properly when large number of categories added.</td>
                                    </tr>
                                    <tr>
                                        <td>04/01/2007</td>
                                        <td>Resolved issue of slow page load times.</td>
                                    </tr>
                                    <tr>
                                        <td>04/01/2007</td>
                                        <td>Fixed next page navigation on search expense table.</td>
                                    </tr>
                                    <tr>
                                        <td>03/20/2007</td>
                                        <td>Added Savings Summary to provide income vs. expense comparison.</td>
                                    </tr>
                                    <tr>
                                        <td>03/19/2007</td>
                                        <td>Added Reset Password/Get Username functionality.</td>
                                    </tr>
                                    <tr>
                                        <td>03/19/2007</td>
                                        <td>Added Edit User Info page.</td>
                                    </tr>
                                    <tr>
                                        <td>03/15/2007</td>
                                        <td>Added export feature for income and expenses.</td>
                                    </tr>
                                    <tr>
                                        <td>03/15/2007</td>
                                        <td>Added asynchronous processing when editting income and expense records.</td>
                                    </tr>
                                    <tr>
                                        <td>03/08/2007</td>
                                        <td>Fixed issue with expenses being incorrectly displayed as over budget in expense summary.</td>
                                    </tr>
                                    <tr>
                                        <td>03/06/2007</td>
                                        <td>Fixed issue with adding categories and expenses on some Firefox browsers.</td>
                                    </tr>                    
                                </table>                                               
                           </div>                             
                        </div>                                                                
                    </div>

                    <div id="copyRightText">
                        <br /><br />
                        <span class="greyText">Copyright 2010 &#169; ExpenseView.com</span>                        
                    </div>                             
            </div>
            <div id="adArea">
                <div id="expenseAds" class="adcontent">
                    <script type="text/javascript"><!--
                     google_ad_client = "pub-4357202946150090";
                     /* 160x600, created 7/2/09 */
                     google_ad_slot = "6900990485";
                     google_ad_width = 160;
                     google_ad_height = 600;
                    //-->
                  </script>
                  <script type="text/javascript"
                    src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
                </script>
            </div>        
        </div>


           <div id="toolTip" class="infoBox" style="display:none"></div>                           

 
         </form>
   </body>    
</html>