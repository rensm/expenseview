<%@ Page Language="C#" AutoEventWireup="true" Inherits="gadget_gadgetLogin" CodePage="65001" Codebehind="gadgetLogin.aspx.cs" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>ExpenseView - Gadget</title>    
    <link rel="Stylesheet" href="css/Gadget.css" type="text/css" media="screen" /> 
    <meta name="viewport" content="width=320px" user-scalable="no"/>        
</head>   
<body>
    <form id="form1" runat="server">
        <a href="default.aspx"><img src="images/revision.png" style="border:0px"/></a>
        <br />&nbsp;&nbsp;<br />
        <div class="logonMenu" style="height:220px; width:220px;">
            <table cellpadding="0" border="0" cellspacing="0" width="100%" height="100%">                                
                <tr>
                    <td width="35%">Username</td>
                    <td width="60%"><asp:TextBox ID="txtUserName" runat="server" CssClass="defaultText" Width="90px"></asp:TextBox></td>                                                                            
                </tr>
                <tr>
                    <td>Password</td>
                    <td><asp:TextBox ID="txtPwd" runat="server" CssClass="defaultText" TextMode="password" Width="90px"></asp:TextBox></td>
                </tr>
                <tr>
                    <td colspan="2"><label for='cbInputRememberLogin'>Remember me&nbsp;</label>
                    <input type="checkbox" id="cbInputRememberLogin" runat="server" /></td>
                </tr>                         
                <tr>
                    <td colspan="2" align="center"><asp:Button ID="btnLogin" runat="server" Text="Login" OnClick="btnLogin_Click" CssClass="addButton" />
                    <br />
                    <asp:Label runat="server" ID="lblLoginFailure" ForeColor="red"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" align="center"><a href="javascript:window.open('http://www.expenseview.com','expenseview_window','width=820,height=600,toolbar=yes,
location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,
resizable=yes');void(0);">Go to ExpenseView.com / Create A Free Account</a> </td>
                </tr>
                <tr>
                    <td colspan="2" align="center"></td>
                </tr>                                                            
            </table>                            
            <br />
            <div class="menuBox" align="center">
            </div>
        </div>
    </form>
</body>
</html>
