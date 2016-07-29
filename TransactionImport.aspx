<%@ Page Language="C#" AutoEventWireup="true" Inherits="ExpenseView.TransactionImport" Codebehind="TransactionImport.aspx.cs" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>ExpenseView OFX Importer</title>
    <link rel="Stylesheet" href="css/Style.css" type="text/css" media="screen" />
        <script language="JavaScript"  type="text/Javascript">

  /*          function onUpload() {

                //check to see if the uploaded file extension is .ofx or .qfx. If not show a warning message to user and prevent server click 

                var str = document.getElementById("filename").value;
                var extension = str.substring(str.length - 4, str.length);
                extension = extension.toLowerCase();
                if (extension != ".ofx") 
                {
                    document.getElementById("errorLbl").innerText = "Please select an .OFX or .QFX file to import.";
                    document.getElementById("btnMultipleRowDelete").style.display = 'none';
                    document.getElementById("saveBtn").style.display = 'none';
                    document.getElementById("btnCancel").style.display = 'none';
                    
                   
                    return false;
                }
                else 
                {
                    document.getElementById("errorLbl").innerText = '';
                    document.getElementById("gridView").style.display = 'block';
                    document.getElementById("btnMultipleRowDelete").style.display = 'block';
                    document.getElementById("saveBtn").style.display = 'block';
                    document.getElementById("btnCancel").style.display = 'block';
                    
                    return true;
                }
            }
*/

        </script>

</head>
<body style="background-color: #FDFCFC;">
    <form id="form1" runat="server">
        
        <div style="position:relative; left:10px; padding-top: 10px; padding-left: 10px; width: 600px;">
        <span class="defaultText">Upload the bank or credit card statement <b>(OFX or QFX file)</b> you would like to import and then specify the categories and description for each transaction.
        </span>
        <br /><br />
        <asp:Label ID="errorLbl" runat="server" style="color:Red;font: 12px Arial, Verdana, sans-serif; font-weight: bold;"></asp:Label><br /><br />

        <input type="file" id="filename" runat="server" />&nbsp;
        <asp:Button ID="uploadBtn" runat="server"  CssClass="addButton" Text="Upload file" OnClick="uploadBtn_Click"  />

        <br /><br />
        <asp:GridView ID="gridView" runat="server" OnRowDataBound="GridView_RowDatabound" EnableViewState="true" AllowSorting="true" 
            AutoGenerateColumns="False" HeaderStyle-Font-Bold="true" HeaderStyle-BackColor="#94B2DE" CellPadding="2" BorderStyle="Groove">
        <columns>
            <asp:TemplateField HeaderText="Remove">
                <ItemTemplate>
                    <asp:CheckBox ID="cbRows" runat="server"/>
                </ItemTemplate>
            </asp:TemplateField>
            <asp:boundfield datafield="type" headertext="Type" />
            <asp:templatefield headertext="Category">
                <itemtemplate>
                    <asp:dropdownlist id="drpdwnlist" Width="150px" AutoPostBack="false" runat="server" DataTextField="ComboName" DataValueField="ComboID">
                    </asp:dropdownlist>
                </itemtemplate>
            </asp:templatefield>
            <asp:boundfield datafield="FormattedDate" headertext="Date"  />
            <asp:BoundField DataField="Amount" HeaderText="Amount" />
            <asp:BoundField DataField="Date" HeaderStyle-CssClass="Invisible" ItemStyle-CssClass="Invisible" />
            <asp:templatefield headertext="Description">
            <itemtemplate>
                <asp:TextBox Width="300" ID="Description" runat="server" Text='<%# Bind("Description") %>'></asp:TextBox>
            </itemtemplate>            
            </asp:templatefield>             
        </columns>
        </asp:GridView>
        <br />&nbsp;&nbsp;<span class="defaultText"><asp:label runat="server" ID="lbl_SaveDisclosure" Visible="false" CssClass="defaultText">*To ensure your privacy, no other data than what is shown in the table above is saved in our systems</asp:label></span>

        <br /><br />               
        <asp:Button ID="btnMultipleRowDelete" OnClick="btnMultipleRowDelete_Click" CssClass="addButton" runat="server" Text="Remove Selected Transactions" Visible="false" />
        &nbsp;&nbsp;<asp:Button ID="saveBtn" runat="server" Text="Save" CssClass="addButton" Visible="False" OnClick="saveBtn_Click" />
        &nbsp;&nbsp;<asp:Button ID="btnCancel" runat="server" Text="Cancel"  
                CssClass="addButton" Visible="False" onclick="btnCancel_Click" />
        
         <br /><br />
        &nbsp;<br />
        </div>
    </form>
</body>
</html>
