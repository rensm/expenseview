using System;
using System.Globalization;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using ExpenseView.Service.DataAccessor;

public partial class createUser : Page
{
    protected Label lblErrorMsg;
    protected TextBox txtConfirmPwd;
    protected TextBox txtEmailAdr;
    protected TextBox txtPwd;
    protected TextBox txtUserName;

    protected void Page_Load(object sender, EventArgs e)
    {
        var sb = new StringBuilder();

        sb.Append("Disclaimer of Warranty and Limitation of Liability\n");
        sb.Append(
            "ExpenseView MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED AS TO THE OPERATION OF THE SERVICE, OR THE CONTENT OR PRODUCTS, PROVIDED THROUGH THE SERVICE. YOU EXPRESSLY AGREE THAT YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. ExpenseView MAKES NO WARRANTY AS TO THE SECURITY, RELIABILITY, TIMELINESS, AND PERFORMANCE OF THIS SERVICE.\n\n");
        sb.Append("Availability\n");
        sb.Append(
            "This Service is provided by ExpenseView on an 'AS IS' and 'AS AVAILABLE' basis and ExpenseView reserves the right to modify, suspend or discontinue the Service, in its sole discretion, at any time and without notice. You agree that ExpenseView is and will not be liable to you for any modification, suspension or discontinuance of the Service.\n\n");
        sb.Append("Trademarks\n");
        sb.Append(
            "All brand, product and service names used in this Service which identify ExpenseView are proprietary marks of ExpenseView. Nothing in this Service shall be deemed to confer on any person any license or right on the part of ExpenseView with respect to any such image, logo or name.\n\n");
        sb.Append("Copyright\n");
        sb.Append(
            "ExpenseView is, unless otherwise stated, the owner of all copyright and data rights in the Service and its contents. You may not reproduce, distribute, publicly display or perform, or prepare derivative works based on any of the Content without the express, written consent of ExpenseView.\n\n");
        sb.Append("Amendment of the Terms\n");
        sb.Append(
            "We reserve the right to amend these Terms from time to time in our sole discretion. If you have registered as a member, we shall notify you of any material changes to these Terms (and the effective date of such changes) by sending an email to the address you have provided to ExpenseView for your account. For all other users, we will post the revised terms on the Site. If you continue to use the Service after the effective date of the revised Terms, you will be deemed to have accepted those changes. If you do not agree to the revised Terms, your sole remedy shall be to discontinue using the Service.");
    }

    protected void btnAddUser_Click(object sender, EventArgs e)
    {
        string userName = txtUserName.Text.Trim();
        string emailAddress = txtEmailAdr.Text.Trim();
        string pwd = txtPwd.Text.Trim();
        string confirmPwd = txtConfirmPwd.Text.Trim();
        int amountDisplayDecimals = Int32.Parse(ddlCurrencyDecimalFormat.SelectedValue);

        int preferredDateFormat = selDateFormat.SelectedIndex + 1;
        int preferredFirstDayOfWeek = selFirstDayOfWeek.SelectedIndex;

        string dateFormat;
        switch (preferredDateFormat)
        {
            case 1:
                dateFormat = "yyyy-MM-dd";
                break;
            case 2:
                dateFormat = "MM/dd/yyyy";
                break;
            case 3:
                dateFormat = "dd/MM/yyyy";
                break;
            default:
                dateFormat = "yyyy-MM-dd";
                break;
        }


        if ((userName.Length > 0) && (emailAddress.Length > 0) && (pwd.Length > 0) && (confirmPwd.Length > 0) && (txtUserDateStart.Value.Length > 0) && (txtUserDateEnd.Value.Length > 0))
        {
            if (!UserInfoAccessor.IsValidUserName(txtUserName.Text))
            {
                if (txtPwd.Text.Equals(txtConfirmPwd.Text))
                {
                    if (txtPwd.Text.Length >= 6)
                    {
                        if (UserInfoAccessor.IsValidEmailAddress(txtEmailAdr.Text))
                        {
                            DateTime userDateStart = DateTime.ParseExact(txtUserDateStart.Value, dateFormat, CultureInfo.InvariantCulture);
                            DateTime userDateEnd = DateTime.ParseExact(txtUserDateEnd.Value, dateFormat, CultureInfo.InvariantCulture);

                            AccessorResult result = UserInfoAccessor.CreateUser(userName, pwd, emailAddress,
                                                                                preferredDateFormat,
                                                                                amountDisplayDecimals, userDateStart, userDateEnd, preferredFirstDayOfWeek);

                            if (result.IsSuccess())
                            {
                                lblErrorMsg.Text = "";

                                HttpCookie cookie = FormsAuthentication.GetAuthCookie(userName, false);
                                Response.Cookies.Add(cookie);
                                Response.Redirect("newUserConfirm.aspx");
                            }
                            else
                            {
                                if (result.IsNonUniqueError())
                                {
                                    lblErrorMsg.Text = "Username has already been taken.  Please try another.";
                                }
                                else
                                {
                                    lblErrorMsg.Text =
                                        "Unable to create account.  Unknown error ocurred when accessing database.  Please try again.";
                                }
                            }
                        }
                        else
                        {
                            lblErrorMsg.Text = "Invalid email address specified.  Please retype.";
                        }
                    }
                    else
                    {
                        lblErrorMsg.Text = "Password must be at least six characters long.";
                    }
                }
                else
                {
                    lblErrorMsg.Text = "Passwords don't match.  Please re-type them.  ";
                }
            }
            else
            {
                lblErrorMsg.Text =
                    "UserName contains invalid characters.  Only letters, numbers, underscore and period allowed.  Please re-type.  ";
            }
        }
        else
        {
            lblErrorMsg.Text = "Unable to create account. Not all required fields specified.";
        }
    }
}