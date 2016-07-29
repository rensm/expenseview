<%@ Page Language="C#" AutoEventWireup="true" Inherits="GadgetTracker" CodePage="65001" Codebehind="gadgetDefault.aspx.cs" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">


<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <link REL=StyleSheet HREF="css/Gadget.css" TYPE="text/css" MEDIA=screen />
    <link rel="apple-touch-icon" href="images/iphone_logo.png"/>

	<script language="JavaScript"  type="text/Javascript">
	    window.onload = function() {
	    var ignoreMe = document.body.offsetWidth;
        var endTime = new Date();
        
        loadGadget();
	    }
	</script>	

    <title>ExpenseView - Gadget</title>
    <meta name="viewport" content="width=320px, user-scalable=no" />        
    
</head>

<body>
    <form name="newExpenseForm" id="expForm"  runat="server">
        <!-- Page Header -->
        <!-- Tab Menu and Header -->
        <table id="navTable" class="fixedTable" border="0" cellpadding="0" cellspacing="0" width="320px">
            <tr valign="top">
            <td width="30px" height="30px">     
            <img src="images/smalllogo.png" />
            </td>
            <td valign="top" height="30px">
            <a href="javascript:window.open('http://www.expenseview.com','expenseview_window','width=820,height=600,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes');void(0);">Open ExpenseView.com</a>&nbsp;&nbsp;&nbsp;<asp:LinkButton 
				id="btnLogout" runat="server" onclick="btnLogout_Click">Logout</asp:LinkButton><br />
			</td>
			</tr>
            <tr valign="bottom" align="left" height="100%">
                <td valign="bottom" colspan="2">
                    <div id="ddcolortabs">
                    <ul>
                    <li id="expGadgetPageTab" class="selectedTab"><a href="javascript:showPage('expGadgetPage');void(0);" title="Expenses"><span>&nbsp;&nbsp;Expenses&nbsp;&nbsp;</span></a></li>
                    <li id="incomeGadgetPageTab"><a href="javascript:showPage('incomeGadgetPage');void(0);" title="Income"><span>&nbsp;Income&nbsp;</span></a></li>
                    <li id="balanceGadgetPageTab"><a href="javascript:showPage('balanceGadgetPage');void(0);" title="Balance"><span>&nbsp;Balance&nbsp;</span></a></li>
                    </ul>
                    </div>
                    <div id="ddcolortabsline" style="height: 10px">
                    </div>               
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <table width="100%" cellpadding="1" cellspacing="0">
                        <tr valign="top">
                            <td align="left" valign="top">
                                <div id="incomeGadgetPage" style="display:none">
                                    <div id="addIncomeGadgetModule"></div>
                                    <br />
                                    <b>Recent Income </b><br />                                   
                                    <div id="newIncomeGadgetTable"></div>
                                </div>
                                <div id="expGadgetPage" style="display:none">
                                    <div id="addExpGadgetModule"></div>
                                    <br />
                                    <b>Recent Expenses </b><br />
                                    <div id="newExpGadgetTable"></div>
                                </div>
                                <div id="balanceGadgetPage" style="display:none">
                                    <div id="balanceGadgetTable"></div>
                                </div>                                
                            </td>
                        </tr>
                    </table>
                    <br />                
                </td>            
            </tr>
         </table>
        <div id="toolTip" class="infoBox" style="display:none"></div>             
        
    </form>
    
    <script language="JavaScript"  type="text/Javascript" src="JSMinifier.ashx?jsFileSet=Gadget"></script>

    <script src="http://www.google-analytics.com/urchin.js" type="text/javascript">
    </script>
    <script type="text/javascript">
    _uacct = "UA-1797260-1";
    urchinTracker();
    </script>
</body>
</html>