<%@ Page Language="C#" AutoEventWireup="true" Inherits="newUserConfirm" CodePage="65001" Codebehind="newUserConfirm.aspx.cs" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <link REL=StyleSheet HREF="css/SimplePages.css" TYPE="text/css" MEDIA=screen />
	<link rel="shortcut icon" href="/images/favicon.ico" />

    <title>ExpenseView</title>
</head>
<body style="background-color:#FFFFFF">
    <form id="form1" runat="server">
        <a href="default.aspx"><img src="images/revision.png" style="border:0px"/></a>
        <br />&nbsp;&nbsp;<br />        
        <table width="600px" class="lightBlueBox" style="margin-left: 6em;">
            <tr>
                <td valign="top" align="center">
                <span class="blueText">Congratulations, your account has been created.<br />
                <a href="default.aspx">Click Here</a> to go to the application.</span>
                </td>
            </tr>
            <tr>
                <td><hr /></td>
            </tr>
            <tr>
                <td valign="top" align="center">
                    <table width="400px">
                        <tr>
                            <td align="left">
                                The following cateogries will be created for you by default:
                                <br />&nbsp;<br />
                                <b>Expense Categories:</b>
                                <ul>
                                    <li>Auto</li>
                                    <li>Eating Out</li>
                                    <li>Gas</li>
                                    <li>Groceries</li>                                    
                                    <li>Utilities</li>                                    
                                </ul>
                                <br />
                                <b>Income Categories</b>
                                <ul>
                                    <li>Salary</li>
                                </ul>
                                
                                You can add new categories, delete or edit these categories by selecting the "Edit Expense Category" link or "Edit Income Category" link from within the application.
                            </td>
                        </tr>
                    </table>                
                </td>
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
