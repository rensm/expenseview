<%@ Page Language="C#" AutoEventWireup="true" Inherits="ResetPassword" CodePage="65001" Codebehind="resetPassword.aspx.cs" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">


<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <link REL=StyleSheet HREF="css/SimplePages.css" TYPE="text/css" MEDIA=screen />
	<link rel="shortcut icon" href="/images/favicon.ico" />

    <title>ExpenseView.com</title>
</head>
<body style="background-color:#FFFFFF">
    <form id="form1" runat="server">
        <br />
        <a href="default.aspx"><img src="images/revision.png" style="border:0px"/></a>
        <br />&nbsp;&nbsp;<br />
        <table cellpadding="0" cellspacing="0" width="600px">
            <tr>
                <td>
                    &nbsp;&nbsp;<span class="headerText">Get Username/Reset Password</span>
                    <br />&nbsp;
                    <table width="500px" class="lightBlueBox" style="margin-left: 4em;" border="0">
                        <tr>
                            <td>
                                <table width="450px" border="0">
                                    <col width="150px" />
                                    <col width="200px" />
                                    <col width="200px" />
                                    <tr>
                                        <td colspan="3">
                                            <span class="blueText">Forgot your username?</span>
                                            <br /><span class="greyText">Enter the email address you specified when creating your account. We'll send your username to this address.</span>                                                                        
                                        </td>
                                    </tr>
                                    <tr>
                                        <td valign="middle">Email Address</td>
                                        <td><asp:TextBox ID="txtGetUserNameEmail" runat="server" Width="160px" MaxLength="30" /></td>                            
                                        <td><asp:Button ID="btnGetUserName" runat="server" CssClass="addButton" Text="Get Username" OnClick="btnGetUserName_Click"/></td>
                                    </tr>
                                </table>
                            </td>                            
                        </tr>
                        <tr>
                            <td><hr /></td>
                        </tr> 
                        <tr>
                            <td>
                                <table width="450px" border="0">
                                    <col width="120px" />
                                    <col width="200px" />
                                    <col width="130px" />
                                    <tr>
                                        <td colspan="3">
                                            <span class="blueText">Forgot your password?</span>
                                            <br /><span class="greyText">Enter the username and email address you specified when creating your account. We'll reset your password and send it to your email address.</span>                                                                        
                                        </td>
                                    </tr>
                                    <tr>
                                        <td valign="middle">Username</td>
                                        <td><asp:TextBox ID="txtResetPwdUsername" runat="server" Width="160px" MaxLength="30" /></td>                            
                                        <td align="center"><asp:Button ID="btnResetPwd" runat="server" CssClass="addButton" Text="Reset Password" OnClick="btnResetPwd_Click"/></td>                                   

                                    </tr>
                                    <tr>
                                        <td valign="middle">Email Address</td>
                                        <td colspan="2" align="left"><asp:TextBox ID="txtResetPwdEmail" runat="server" Width="160px" MaxLength="30" /></td>                            
                                    </tr>
                                    <tr>
                                        <td colspan="3"><asp:Label runat="server" ID="lblResetPwd" /></td>
                                    </tr>                                                                                                         
                                </table>
                            </td>                            
                        </tr>
                    </table>
                    <br />                
                </td>
            </tr>
            <tr>
                <td><asp:Label runat="server" ID="lblResults" /></td>
            </tr>                                                                                                                     
            <tr>
                <td align="center">
                <br />&nbsp;<br />
                    <span class="greyText">Copyright 2007 &#169; ExpenseView.com</span>                        
                </td>
            </tr>
        </table>
    </form>
</body>
</html>