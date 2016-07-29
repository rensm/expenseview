<%@ Page Language="C#" AutoEventWireup="True" EnableEventValidation="false" CodeBehind="RecurringTransactions.aspx.cs" Inherits="ExpenseView.RecurringTransactions" %>
<%@ Register assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" namespace="System.Web.UI" tagprefix="asp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
	  <link rel="stylesheet" type="text/css" href="css/redmond/jquery-ui-1.8.19.custom.css"/>
      <link rel="stylesheet" type="text/css" href="css/Style.css"/>
      <script type="text/javascript" src="Client/Utilities/DateUtil.js"></script>     
      <script type="text/javascript" src="Client/Utilities/ValidationFunctions.js"></script>     
      <script type="text/javascript" src="Client/Utilities/FormatFunctions.js"></script>     
      <script type="text/javascript" src="Client/Lib/jquery-1.7.2.min.js"></script>
	  <script type="text/javascript" src="Client/Lib/jquery-ui-1.8.19.custom.min.js"></script>

    <style type="text/css">    
        .required 
        {
            border-color: Red;
        }
        .rounderCorners
        {
            border-radius: 15px;
        }
    </style>
       <script type="text/javascript">

        //Get user preference date format and user week start day from the DB and populate it in these 2 fields
           var ExpViewGlobalData = {
                userDateFormat: <%=userDateFormat%>,
                userWeekStart: <%=userWeekStart %>,
                userDisplayDecimals: <%=userCurrencyFormat %>
           };


           //Check of empty required fields (Amount, Start Date and End Date)
           function isNewRecurringValid() {
                var amountField = $('#txtAmount');
                var startDateField = $('#txtStartDate');
                var endDateField = $('#txtEndDate');

                var issuesFound;

                if(amountField.val().length === 0 || !isValidAmount(amountField.val())) {
                        amountField.addClass("required");
                        issuesFound = true;
                }
                else {
                    amountField.removeClass("required");
                }
                
                //make sure the date is in the user preffered format
                if(startDateField.val().length === 0 || 
                !isValidFormattedDate(startDateField.val())) {
                    startDateField.addClass("required");
                    issuesFound = true;
                }
                else {
                    startDateField.removeClass("required");
                }

                //make sure the date is in the user preffered format
                if(endDateField.val().length === 0 || 
                !isValidFormattedDate(endDateField.val())) {
                    endDateField.addClass("required");
                    issuesFound = true;
                }
                else {
                    endDateField.removeClass("required");
                }

                //If no other issues found, make sure end date is not before the start date
                if(!issuesFound) {
                    if(getDateFromFormattedDateString(endDateField.val()) < getDateFromFormattedDateString(startDateField.val())) {
                        issuesFound = true;
                        endDateField.addClass("required");
                        startDateField.addClass("required");
                    }
                    else {
                        endDateField.removeClass("required");
                        startDateField.removeClass("required");
                    }
                }

                //Generate error text if any errors present otherwise show empty text
                if(issuesFound) {
                    $("#errorLabel").html("<b>Required data not specified or invalid value. </b>");
                    return false;
                }
                else {
                    $("#errorLabel").html("");
                    return true;
                }
           }


            $(document).ready(function() {

                //Get the preferred date format set by the user
                var preferredDateFormat = getPreferredDateFormatFromValue(ExpViewGlobalData.userDateFormat);
                    
                //Set DatePicker defaults (user preference saved date format and week start day)
                $.datepicker.setDefaults({
                    dateFormat: preferredDateFormat,
                    firstDay: ExpViewGlobalData.userWeekStart
                });

                //Initialize Date pickers for text fields
                $("#txtStartDate").datepicker();
                $("#txtEndDate").datepicker();

                //Used by the GridView in Edit mode to initiate the datepicker for gridview startDate and endDate
                $(".datepickerCompleted").datepicker();
            
                //Force the category dropdown to be generated dynamically to prevent the datepicker selection issue post a post back
             //Used by gridview in edit mode
              $("#gvddlCatType").change(function() {
                    BindGridCategory();
            });

                //Populate the category dropdownlist when page is loaded
                BindCategory();
              
                //Update the category dropdownlist option elements based on the changed recurring type (Week, Biweek, Month)
                $("#ddlCategoryType").change(function() {
                    BindCategory();
            });

            //Force the Day dropdown to be generated dynamically to prevent post back issue caused for the datepicker
            //Since the category type was dynamically generated was forced to do the same for recurring day to prevent 
            //postback exception of not having all elements generated on a postback
            //Populate the day dropdownlist when page is loaded
            BindRecurrDay();

            //Update the day dropdownlist option elements based on the changed recurring type (Week, Biweek, Month)
              $("#ddlRecurringType").change(function() {
                    BindRecurrDay();
               });

            //Update the day dropdownlist option elements based on the changed recurring type (Week, Biweek, Month)
             //Used by gridview in edit mode
              $("#gvddlRecurrType").change(function() {
                    BindGridRecurrDay();
               });
    
         });

        //Get Income or Expense categories based on selected category type
        //Returns a list of CategoryDisplay objects in json format
        //If subcategories are present it will return data in the following format: 
        // Value (Category - Subcategory ex. Auto - Gas) and Key (CategoryID : SubcategoryID)  
        function BindCategory()
        {
            //Force the categories to be loaded via an ajax call to prevent the datepicker to disappear on a post back that
            //was caused each time the category type was changed which resulted in a post back to load categories  
            var expServiceURL = "";
            if (window.location.host == "localhost")
                expServiceURL = "http://" + window.location.host + "/expViewWeb/Service/ExpViewService.asmx";
            else
                expServiceURL = "http://" + window.location.host + "/Service/ExpViewService.asmx";

            $.ajax({
            type: "POST",
            url: expServiceURL + "/GetUserCategories",
            data: "{categoryType:'" +  $('#ddlCategoryType').val() + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(categories) {
               BindCategoryddl(categories.d);
            }
            });
        }

        function BindGridCategory()
        {
            //Force the categories to be loaded via an ajax call to prevent the datepicker to disappear on a post back that
            //was caused each time the category type was changed which resulted in a post back to load categories  
            var expServiceURL = "";
            if (window.location.host == "localhost")
                expServiceURL = "http://" + window.location.host + "/expViewWeb/Service/ExpViewService.asmx";
            else
                expServiceURL = "http://" + window.location.host + "/Service/ExpViewService.asmx";

            $.ajax({
            type: "POST",
            url: expServiceURL + "/GetUserCategories",
            data: "{categoryType:'" +  $('#gvddlCatType').val() + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(categories) {
               BindGridCategoryddl(categories.d);
            }
            });
        }
         //Generate option elements for the Category dropdown based on the received json data of CategoryDisplay object type
        function BindCategoryddl(categories) { 
         //empty the data in dropdown list only if categories are received from the server
         $("#ddlCategory").html("");          
          $.each(categories, function() {
            $("#ddlCategory").append($("<option></option>").val(this['Key']).html(this['Value']));          
          });
       }

         //Generate option elements for the Category dropdown based on the received json data of CategoryDisplay object type
        //Done for the gridview
        function BindGridCategoryddl(categories) { 
         //empty the data in dropdown list only if categories are received from the server
         $("#gvddlCat").html("");          
          $.each(categories, function() {
            $("#gvddlCat").append($("<option></option>").val(this['Key']).html(this['Value']));          
          });
       }

         //Weekday
            var weekOptions = {
                "1" : "Sunday",
                "2" : "Monday",
                "3" : "Tuesday",
                "4" : "Wednesday",
                "5" : "Thursday",
                "6" : "Friday",
                "7" : "Saturday"
            };


        //Populate the option elements for the day dropdownlist based on the selected RecurringType: Week, Biweek or Month
        //Week and Biweek - display days of the week
        //Month - displays days from 1-31 
        function BindRecurrDay() {
              $("#ddlDay").html("");
               var selectedItem = $(ddlRecurringType).val();
               if(selectedItem == "W" || selectedItem == "B")
               {
                    $.each(weekOptions, function(val, text) {
                        $('#ddlDay').append(
                            $('<option></option>').val(val).html(text)
                        );
                    });
               }
               else
               {
                    for (i=1;i<32;i++)
                    {
                        $('#ddlDay').append(
                        $('<option></option>').val(i).html(i));
                    }
               }
         }

        //Populate the option elements for the day dropdownlist based on the selected RecurringType: Week, Biweek or Month
        //Week and Biweek - display days of the week
        //Month - displays days from 1-31 
        //Called by the gridview in edit mode
        function BindGridRecurrDay() {
              $("#gvddlDay").html("");
               var selectedItem = $(gvddlRecurrType).val();
               if(selectedItem == "W" || selectedItem == "B")
               {
                    $.each(weekOptions, function(val, text) {
                        $('#gvddlDay').append(
                            $('<option></option>').val(val).html(text)
                        );
                    });
               }
               else
               {
                    for (i=1;i<32;i++)
                    {
                        $('#gvddlDay').append(
                        $('<option></option>').val(i).html(i));
                    }
               }
         }

    </script>


   </head>
<body style="background-color: #FDFCFC;">
    <form id="recurrForm" runat="server">
    <div class="rounderCorners" style="border: 0px solid #94B2DE;padding:5px; width:870px;margin:10px;">
    <div>
         <div style="margin:5px; padding:1px 1px 4px 1px;"> 
            <span style="padding-right:75px;">
                <span style="vertical-align:middle;">Type:</span>
                <span style="vertical-align:top">
                    <asp:DropDownList ID="ddlCategoryType" runat="server" style="height: 22px; width: 77px"> 
                        <asp:ListItem Value="E">Expense</asp:ListItem>
                        <asp:ListItem Value="I">Income</asp:ListItem>
                    </asp:DropDownList>
                </span>
            </span>
            <span style="padding-right:30px;padding-top:10px;">
                <span style="vertical-align:middle">Category:</span>
                <span style="vertical-align:top">
                    <asp:DropDownList ID="ddlCategory" runat="server">
                    </asp:DropDownList>
                </span>            
            </span>
        </div>
         <div style="margin:5px; padding:1px 1px 4px 1px;">
            <span style="padding-right:30px;">
                <span style="vertical-align:middle">*Amount:</span>
                <span style="vertical-align:top">
                    <input id="txtAmount" class="amount" style="width:100px"  type="text" runat="server" name="txtAmount" />
                </span>            
            </span>
            <span style="padding-right:10px;">
                <span style="vertical-align:middle">Description:</span>
                <span style="vertical-align:top">
                    <input style="width:200px" id="txtDesc" type="text" runat="server" />
                </span>            
            </span>
        </div>
         <div  style="margin:5px;  padding:1px 1px 4px 1px;">            
            <span style="padding-right:40px;">
                <span style="vertical-align:middle">*Start Date:</span>
                <span style="vertical-align:top">
                    <input style="width:70px" id="txtStartDate" enableviewstate="false" class="date" type="text" runat="server" />
                     <asp:HiddenField ID="hfStartDate" runat="server" /> 
                </span>            
            </span>
            <span style="padding-right:10px;">
                <span style="vertical-align:middle">*End Date:</span>
                <span style="vertical-align:top">
                    <input style="width:70px" id="txtEndDate" enableviewstate="false" class="date" type="text" runat="server" />
                     <asp:HiddenField ID="hfEndDate" runat="server" /> 
                </span>            
            </span>
          </div>
         <div style="margin:5px;  padding:1px 1px 4px 1px;">
            <span style="padding-right:5px;">
                <span style="vertical-align:middle">Recurr every</span>
                <span style="vertical-align:top">
                    <asp:DropDownList ID="ddlRecurringType" 
                 runat="server">
                        <asp:ListItem Value="W">Week</asp:ListItem>
                        <asp:ListItem Value="B">Biweek</asp:ListItem>
                        <asp:ListItem Value="M">Month</asp:ListItem>
                    </asp:DropDownList> </span>
           </span>
            <span style="padding-right:30px;">
                <span style="vertical-align:middle">on: </span>
                <span style="vertical-align:top">
                    <asp:DropDownList ID="ddlDay" runat="server"> 
                    </asp:DropDownList></span>
                </span>
           <span>
           </span>
           </div>

           <div style="padding-top:10px">
                <span style="vertical-align:top; padding-left:200px">
                    <asp:Button runat="server" ID="btnAdd" Text="Add" type="submit" UseSubmitBehavior="true"
                 onclick="btnAdd_Click" CssClass="addButton" OnClientClick="return isNewRecurringValid()"  />
                </span>
                <span id="errorLabel" style="color:Red;"></span>
                <br />
         </div>   
</div>
    <div  style="padding-top:10px"></div>
    <div class="panelHeader" style="padding-top: 30px;padding-bottom: 7px;font-style: italic;">Recurring transactions are processed every night.</div>
    
<div>
            <asp:GridView ID="gridView"  DataKeyNames="RecurringTransID" runat="server" 
                AutoGenerateColumns="False" ShowFooter="True" GridLines="None"
                OnRowDataBound="gridView_RowDataBound"
                OnRowDeleting="gridView_RowDeleting" OnRowEditing="gridView_RowEditing" 
                OnRowCancelingEdit="gridView_RowCancelingEdit" 
                OnRowUpdating="gridView_RowUpdating" AllowPaging="True" 
                CssClass="recurrTable" Width="850px" 
                BorderColor="#94B2DE" BorderStyle="Solid" BorderWidth="1px" 
                CellPadding="1" onpageindexchanging="gridView_PageIndexChanging" >
             
                <AlternatingRowStyle BackColor="#E7EFFF" />
             
            <Columns>
            <asp:BoundField DataField="RecurringTransID" HeaderText="RecurringTransID" Visible = "false" ReadOnly="true"/>
            <asp:BoundField DataField="CategoryID" HeaderText="CategoryID" Visible = "false" ReadOnly="true"/>
            <asp:BoundField DataField="SubcategoryID" HeaderText="SubcategoryID" Visible = "false" ReadOnly="true"/>
            <asp:TemplateField HeaderText="Type">
                <ItemTemplate>
                     <asp:Label ID="gvlblCatType" runat="server" Text='<%# Bind("CategoryType") %>'></asp:Label>
                </ItemTemplate>
                <EditItemTemplate>
                    <asp:DropDownList ID="gvddlCatType"  
                        runat="server" 
                        style="height: 22px" AutoPostBack="true" OnSelectedIndexChanged="gvddlCatType_SelectedIndexChanged">
                    </asp:DropDownList>
                </EditItemTemplate>
                <HeaderStyle HorizontalAlign="Left" />
                <ItemStyle HorizontalAlign="Left" />
            </asp:TemplateField>
             <asp:TemplateField HeaderText="Category">
                <ItemTemplate>
                     <asp:Label ID="gvlblCategory" runat="server" Text='<%# Bind("CategoryName") %>'></asp:Label>
                </ItemTemplate>
                <EditItemTemplate>
                    <asp:DropDownList ID="gvddlCat" runat="server">
                    </asp:DropDownList>
                </EditItemTemplate>
                 <HeaderStyle HorizontalAlign="Left" />
                 <ItemStyle HorizontalAlign="Left" />
            </asp:TemplateField>
             <asp:TemplateField HeaderText="Start Date">
                <ItemTemplate>
                     <asp:Label ID="gvlblStrtDate" runat="server" Text='<%# 
                            Bind("StartDate") %>'></asp:Label>
                </ItemTemplate>
                <EditItemTemplate>
                    <asp:TextBox ID="gvtxtStDate" CssClass="datepickerCompleted"
                        runat="server" Text='<%#   Bind("StartDate") %>' ></asp:TextBox><asp:RequiredFieldValidator ID="startDateRequiredFieldValidator" runat="server" ControlToValidate="gvtxtEnDate" Display="Dynamic" validationgroup="recurrValidation">* Required</asp:RequiredFieldValidator>
                </EditItemTemplate>
                 <HeaderStyle HorizontalAlign="Left" />
                 <ItemStyle HorizontalAlign="Left" />
            </asp:TemplateField>        
            <asp:TemplateField HeaderText="End Date">
                <ItemTemplate>
                     <asp:Label ID="gvlblEndDate" runat="server" Text='<%# 
                            Bind("EndDate") %>'></asp:Label>
                </ItemTemplate>
                <EditItemTemplate>
                    <asp:TextBox ID="gvtxtEnDate" CssClass="datepickerCompleted"
                        runat="server" Text='<%# Bind("EndDate") %>' ></asp:TextBox> <asp:RequiredFieldValidator ID="endDateRequiredFieldValidator" runat="server" ControlToValidate="gvtxtEnDate" Display="Dynamic" validationgroup="recurrValidation">* Required</asp:RequiredFieldValidator>

                </EditItemTemplate>
                <HeaderStyle HorizontalAlign="Left" />
                <ItemStyle HorizontalAlign="Left" />
            </asp:TemplateField>
            <asp:TemplateField HeaderText="Amount">
                <ItemTemplate>
                     <asp:Label ID="gvlblAmount" runat="server" Text='<%# 
                            Bind("Amount") %>'></asp:Label>
                </ItemTemplate>
                <EditItemTemplate>
                    <asp:TextBox ID="gvtxtAmount"
                        runat="server" Text='<%# Bind("Amount") %>' ></asp:TextBox><asp:RequiredFieldValidator ID="amountRequiredFieldValidator" runat="server" ControlToValidate="gvtxtAmount" Display="Dynamic" validationgroup="recurrValidation">* Required</asp:RequiredFieldValidator>
                </EditItemTemplate>
                <HeaderStyle HorizontalAlign="Left" />
                <ItemStyle HorizontalAlign="Left" />
            </asp:TemplateField>                
            <asp:BoundField DataField="Description" HeaderText="Description">
                <HeaderStyle HorizontalAlign="Left" />
                <ItemStyle HorizontalAlign="Left" />
                </asp:BoundField>
            <asp:TemplateField HeaderText="Recurr every">
                <ItemTemplate>
                     <asp:Label ID="gvlblRecurrType" runat="server" Text='<%# 
                            Bind("RecurringType") %>'></asp:Label>
                </ItemTemplate>
                <EditItemTemplate>
                    <asp:DropDownList ID="gvddlRecurrType" runat="server" OnSelectedIndexChanged="gvddlRecurrType_SelectedIndexChanged" AutoPostBack="true">
                    </asp:DropDownList>
                </EditItemTemplate>
                <HeaderStyle HorizontalAlign="Left" />
                <ItemStyle HorizontalAlign="Left" />
            </asp:TemplateField>
            <asp:TemplateField HeaderText="Day">
                <ItemTemplate>
                     <asp:Label ID="gvlblDay" runat="server" Text='<%# Eval("Day") %>'></asp:Label>
                </ItemTemplate>
                <EditItemTemplate>
                    <asp:DropDownList ID="gvddlDay" runat="server">
                    </asp:DropDownList>
                </EditItemTemplate>
                <HeaderStyle HorizontalAlign="Left" />
                <ItemStyle HorizontalAlign="Left" />
            </asp:TemplateField>
            <asp:TemplateField> 
                <ItemTemplate> 
                   <asp:ImageButton ID="btnEdit" runat="server" ImageUrl="images/table_edit.gif" Height="16px" Width="16px" CommandName="Edit" />
                    <asp:ImageButton ID="btnDelete" runat="server" ImageUrl="images/delete.gif" Height="16px" Width="16px" CommandName="Delete" />
                 </ItemTemplate> 
                 <EditItemTemplate> 
                   <asp:linkbutton id="btnUpdate" runat="server" commandname="Update" text="Update" /> 
                   <asp:linkbutton id="btnCancel" runat="server" CausesValidation="False" commandname="Cancel"  text="Cancel" /> 
                  </EditItemTemplate> 
            </asp:TemplateField>         
                 </Columns>
                <EditRowStyle Height="25px" VerticalAlign="Middle" Width="800px" />
                <FooterStyle BackColor="#94B2DE" Height="8px" />
                <HeaderStyle BackColor="#94B2DE" Font-Bold="True" 
                    Font-Names="Arial" Font-Size="12px" ForeColor="White" Height="20px" 
                    VerticalAlign="Middle" />
                <RowStyle BackColor="White" Height="25px" VerticalAlign="Middle" />
                <SelectedRowStyle BackColor="#9FF763" Height="30px" VerticalAlign="Middle" />
           </asp:GridView>
    </div>
    </div>
    </form>
</body>
</html>
