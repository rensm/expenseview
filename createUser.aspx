<%@ Page Language="C#" AutoEventWireup="true" Inherits="createUser" CodePage="65001" Codebehind="createUser.aspx.cs" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <link rel="Stylesheet" href="css/SimplePages.css" type="text/css" media="screen" />
	<link rel="shortcut icon" href="/images/favicon.ico" />
    <link rel="Stylesheet" href="css/Redmond/jquery-ui-1.8.4.custom.css" type="text/css" media="screen" />
    <script language="JavaScript"  type="text/Javascript" src="Client/Lib/jquery-1.4.2.min.js"></script>
    <script language="JavaScript"  type="text/Javascript" src="Client/Lib/jquery-ui-1.8.4.custom.min.js"></script>

    <title>ExpenseView</title>
</head>
<body style="background-color:#FFFFFF">
    <form id="form1" runat="server">
    <br />
        <a href="default.aspx"><img src="images/revision.png" style="border:0px"/></a>
        <br />&nbsp;&nbsp;<br />
        <table cellpadding="0" cellspacing="0">
            <tr>
                <td>
                    &nbsp;&nbsp;<span class="headerText">Create an Account</span>
                    <br />&nbsp;&nbsp;Creating an ExpenseView account allows you to start using the application and start tracking your expenses.
                    <br />&nbsp;
                    <table width="530px" class="lightBlueBox" style="margin-left: 4em;">
                        <tr>
                            <td valign="top">
                                <table width="450px" border="0" cellspacing="10">
                                    <col width="180px" />
                                    <col width="300px" />
                                    <tr>
                                        <td colspan="2">
                                            <span class="blueText">Required Information for New Account</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <asp:Label runat="server" ID="lblErrorMsg" ForeColor="red"></asp:Label>
                                        </td>
                                    </tr>                        
                                    <tr valign="top">
                                        <td>UserName</td>
                                        <td><asp:TextBox ID="txtUserName" runat="server" Width="160px" MaxLength="30" />
                                            <br /><span class="greyText">No spaces or punctuation other than '_' or '.'</span>                            
                                        </td>                            
                                    </tr>
                                    <tr valign="top">
                                        <td>Password</td>
                                        <td><asp:TextBox TextMode="password" ID="txtPwd" runat="server" Width="160px" MaxLength="30" />
                                            <br /><span class="greyText">
                                            Minimum length 6 characters</span>                            
                                        </td>
                                    </tr>
                                    <tr>
                                        <td valign="top">Confirm Password</td>
                                        <td valign="top"><asp:TextBox TextMode="password" ID="txtConfirmPwd" runat="server" Width="160px" MaxLength="30" /></td>
                                    </tr>
                                    <tr valign="top">
                                        <td>Email</td>                
                                        <td><asp:TextBox ID="txtEmailAdr" runat="server" Width="160px" MaxLength="95" />
                                            <br /><span class="greyText">
                                            Your email address will be kept private.  We will not share it with anyone, period.  It will only be used for communications from us (i.e. password resets).</span>
                                        </td>
                                    </tr>
                                    <tr valign="top">
                                        <td>Preferred Date Format</td>                
                                        <td colspan="2" align="left">
                                        <select id="selDateFormat" runat="server">
                                            <option value="yy-mm-dd">yyyy-mm-dd (2008-12-31)</option>
                                            <option value="mm/dd/yy">mm/dd/yyyy (12/31/2008)</option>
                                            <option value="dd/mm/yy">dd/mm/yyyy (31/12/2008)</option>
                                        </select>
                                            <br /><span class="greyText">
                                            Defines how dates will be displayed in the application.</span>
                                        </td>
                                    </tr>                                       
                                    <tr valign="top">
                                        <td>First Day of Week</td>                
                                        <td colspan="2" align="left">
                                        <select id="selFirstDayOfWeek" runat="server">
                                            <option value="0">Sunday</option>
                                            <option value="1">Monday</option>
                                        </select>
                                        </td>
                                    </tr>                                               
                                    <tr valign="top">
                                        <td >Currency Fomat</td>                
                                        <td>
                                            <asp:DropDownList runat="server" ID="ddlCurrencyDecimalFormat">
                                                <asp:ListItem Text="2 decimals (100.00)" Value="2" Selected="True"></asp:ListItem>
                                                <asp:ListItem Text="3 decimals (100.000)" Value="3"></asp:ListItem>
                                                <asp:ListItem Text="No decimals (100)" Value="0"></asp:ListItem>                                                
                                            </asp:DropDownList>
                                            <br /><span class="greyText">
                                            Defines how currency amounts will be displayed in the application.</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td valign="top">Custom Date Range</td>
                                        <td align="left" colspan="2">Start: <input id="txtUserDateStart" runat="server"/><br />                            
                                        End: <input id="txtUserDateEnd" runat="server"/>
                                        <br /><span class="greyText">A custom date range you can use to track expenses or income.</span>
                                        </td>
                                    </tr>                                                                                                                                                                                    
                                </table>                
                            </td>
                        </tr>
                        <tr>
                            <td><hr /></td>
                        </tr>            
                        <tr>
                            <td align="center">
                                <asp:Button ID="btnAddUser" runat="server" CssClass="addButton" Text="Create User Account" OnClick="btnAddUser_Click" />
                            </td>
                        </tr>
                    </table>
                    <br />
                
                </td>
            </tr>
            <tr>
                <td align="center">
                    <span class="greyText">Copyright 2007 &#169; ExpenseView.com</span>                        
                </td>
            </tr>
        </table>
    </form>

        <script type="text/javascript">

            $(function ()
            {
                //Set DatePicker defaults
                $.datepicker.setDefaults({
                    dateFormat: $("#selDateFormat").val(),
                    firstDay: $("#selFirstDayOfWeek").val(),
                    showOn: 'button',
                    buttonImageOnly: true,
                    buttonImage: 'images/calendar.gif'
                });

                //Initialize Date Date pickers for text fields
                $("#txtUserDateStart").datepicker();
                $("#txtUserDateEnd").datepicker();

                $("#selDateFormat").change(function ()
                {
                    $('#txtUserDateStart').datepicker('option', { dateFormat: $(this).val() });
                    $('#txtUserDateEnd').datepicker('option', { dateFormat: $(this).val() });

                    $.datepicker.setDefaults({ dateFormat: $(this).val() });
                });

                $("#selFirstDayOfWeek").change(function ()
                {
                    $("#txtUserDateStart").datepicker('option', { firstDay: $(this).val() });
                    $("#txtUserDateEnd").datepicker('option', { firstDay: $(this).val() });
                });
            });


	</script>

</body>
</html>
