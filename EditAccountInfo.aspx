<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="EditAccountInfo.aspx.cs" Inherits="ExpenseView.EditAccountInfo" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <link rel="Stylesheet" href="css/Style.css" type="text/css" media="screen" />
    <link rel="Stylesheet" href="css/Redmond/jquery-ui-1.8.4.custom.css" type="text/css" media="screen" />
    <script language="JavaScript"  type="text/Javascript" src="Client/Lib/jquery-1.4.2.min.js"></script>
    <script language="JavaScript"  type="text/Javascript" src="Client/Lib/jquery-ui-1.8.4.custom.min.js"></script>

    <title>ExpenseView.com</title>
</head>
<body style="background-color: #FDFCFC;">
    <form id="form1" runat="server" style="padding-top: 10px; padding-left: 10px;">
        <table width="590px" border="0">
            <col width="150px" />
            <col width="440px" />
            <tr>
                <td valign="middle" class="formLabel">Username</td>
                <td align="left" colspan="2"><asp:Label runat="server" ID="lblUserName"></asp:Label></td>
            </tr>
            <tr>
                <td valign="middle" class="formLabel">Email Address</td>
                <td colspan="2" align="left"><asp:TextBox ID="txtEmailAddress" runat="server" Width="160px" MaxLength="30" /></td>                            
            </tr>
            <tr>
                <td valign="middle" class="formLabel">Password</td>
                <td colspan="2" align="left">
                    <asp:TextBox ID="txtPwd" runat="server" Width="160px" MaxLength="30" TextMode="Password" />
                    &nbsp; <asp:LinkButton runat="server" 
                        ID="lnkChangePassword" onclick="lnkChangePassword_Click" Text="Change Password" />
                    </td>                            
            </tr>
            <tr>
                <td valign="middle" class="formLabel">Confirm Password</td>
                <td colspan="2" align="left"><asp:TextBox ID="txtConfirPwd" runat="server" Width="160px" MaxLength="30" TextMode="Password"/></td>                            
            </tr>                                    
            <tr valign="top">
                <td class="formLabel">Preferred Date Format</td>                
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
                <td class="formLabel">First Day of Week</td>                
                <td colspan="2" align="left">
                <select id="selFirstDayOfWeek" runat="server">
                    <option value="0">Sunday</option>
                    <option value="1">Monday</option>
                </select>
                </td>
            </tr>                                                                    
            <tr valign="top">
                <td class="formLabel">Currency Fomat</td>                
                <td align="left">
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
                <td valign="top" class="formLabel">Custom Date Range</td>
                <td align="left" colspan="2">Start: <input id="txtUserDateStart" runat="server"/>&nbsp;&nbsp;                            
                End: <input id="txtUserDateEnd" runat="server"/>
                <br /><span class="greyText">A custom date range you can use to track expenses or income.</span>
                <input type="hidden" id="hidUserStartDate" runat="server" />
                <input type="hidden" id="hidUserEndDate" runat="server" />
                </td>
            </tr>                                    
            <tr>
                <td valign="middle" colspan="2" align="center">
                    <br />
                    <asp:Button ID="btnUpdateAccountInfo" runat="server" CssClass="addButton" Text="Update" OnClick="btnUpdateAccountInfo_Click"/>
                &nbsp;</td>                            
            </tr>
            <tr>
                <td colspan="2" align="center">
                    <br />
                        <asp:Label runat="server" ID="lblResults" Font-Bold="true" />
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
