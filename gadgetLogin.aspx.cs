using System;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using ExpenseView.Service.DataAccessor;

public partial class gadget_gadgetLogin : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //Ensures Page is not cached
        Response.ClearHeaders();
        Response.AppendHeader("Cache-Control", "no-cache"); //HTTP 1.1
        Response.AppendHeader("Cache-Control", "private"); // HTTP 1.1
        Response.AppendHeader("Cache-Control", "no-store"); // HTTP 1.1
        Response.AppendHeader("Cache-Control", "must-revalidate"); // HTTP 1.1
        Response.AppendHeader("Cache-Control", "max-stale=0"); // HTTP 1.1 
        Response.AppendHeader("Cache-Control", "post-check=0"); // HTTP 1.1 
        Response.AppendHeader("Cache-Control", "pre-check=0"); // HTTP 1.1 
        Response.AppendHeader("Pragma", "no-cache"); // HTTP 1.1 
        Response.AppendHeader("Keep-Alive", "timeout=3, max=993"); // HTTP 1.1 
        Response.AppendHeader("Expires", "Mon, 26 Jul 1997 05:00:00 GMT"); // HTTP 1.1 

        //Include Information About Compact Privacy Policy
        //This is required for IE to allow cookies to be set by the gadget.
        Response.AppendHeader("P3P", "CP=\"NOI ADM DEV PSAi COM NAV OUR OTR STP IND DEM\"");

        if (!IsPostBack)
        {
            if (!User.Identity.Name.Equals(String.Empty))
            {
                Response.Redirect("gadgetDefault.aspx");
            }
        }
    }


    protected void btnLogin_Click(object sender, EventArgs e)
    {
        try
        {
            string hashedPwd = FormsAuthentication.HashPasswordForStoringInConfigFile(txtPwd.Text, "SHA1");
            AccessorResult result = UserInfoAccessor.LoginUser(txtUserName.Text, hashedPwd);

            if (result.IsSuccess())
            {
                HttpCookie cookie = FormsAuthentication.GetAuthCookie(txtUserName.Text, cbInputRememberLogin.Checked);

                Response.Cookies.Add(cookie);

                Response.Redirect("gadgetDefault.aspx", false);
            }
            else
            {
                if (result.IsFailure())
                {
                    lblLoginFailure.Text =
                        "Login Failed.  Please check your username and password.  Go to ExpenseView.com to reset your password if you've forgotten.";
                }
                else if (result.IsError())
                {
                    lblLoginFailure.Text = "Unexpected error ocurred trying to login to application.  Please retry.";
                }
            }
        }
        catch
        {
            ///TODO: Log Exception
            lblLoginFailure.Text = "Unexpected error ocurred trying to login to application.  Please retry.";
        }
    }
}