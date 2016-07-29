using System;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using ExpenseView.Service.DataAccessor;

namespace ExpenseView
{
    public partial class ExpenseTracker : Page
    {
        public static string isLoggedIn = "false";

        protected void Page_Load(object sender, EventArgs e)
        {
            if (User.Identity.IsAuthenticated)
            {
                loggedInHeader.Visible = true;
                loggedOutHeader.Visible = false;
                isLoggedIn = "true";
                lblWelcome.Text = "Welcome " + User.Identity.Name;
            }
            else
            {
                loggedInHeader.Visible = false;
                loggedOutHeader.Visible = true;
                isLoggedIn = "false";
            }

            //Ensures page is not cached
            //forces all browsers to grab new copies of the pages when the user pressed the BACK or FORWARD button on their browsers
            Response.ClearHeaders();
            Response.AppendHeader("Cache-Control", "no-cache"); //HTTP 1.1
            Response.AppendHeader("Cache-Control", "private"); // HTTP 1.1
            Response.AppendHeader("Cache-Control", "no-store"); // HTTP 1.1
            Response.AppendHeader("Cache-Control", "must-revalidate"); // HTTP 1.1
            Response.AppendHeader("Cache-Control", "max-stale=0"); // HTTP 1.1 
            Response.AppendHeader("Cache-Control", "post-check=0"); // HTTP 1.1 
            Response.AppendHeader("Cache-Control", "pre-check=0"); // HTTP 1.1 
            Response.AppendHeader("Pragma", "no-cache"); // HTTP 1.1 
            Response.AppendHeader("Expires", "Mon, 26 Jul 1997 05:00:00 GMT"); // HTTP 1.1 
        }


        protected void lnkLogOut_Click(object sender, EventArgs e)
        {
            FormsAuthentication.SignOut();
            lblWelcome.Text = "";
            loggedInHeader.Visible = false;
            loggedOutHeader.Visible = true;
            isLoggedIn = "false";
        }

        protected void btnLoginSubmit_Click(object sender, EventArgs e)
        {
            string hashedPwd = FormsAuthentication.HashPasswordForStoringInConfigFile(txtPassword.Value, "SHA1");
            AccessorResult result = UserInfoAccessor.LoginUser(txtUsername.Value, hashedPwd);

            if (result.IsSuccess())
            {
                loggedInHeader.Visible = true;
                loggedOutHeader.Visible = false;
                isLoggedIn = "true";

                //Clear out any existing login text
                lblLoginMsg.Text = "";

                //Set welcome text
                lblWelcome.Text = "Welcome " + txtUsername.Value;

                HttpCookie cookie = FormsAuthentication.GetAuthCookie(txtUsername.Value, cbLoginRemember.Checked);
                Response.Cookies.Add(cookie);
            }
            else

            {
                loggedInHeader.Visible = false;
                loggedOutHeader.Visible = true;
                isLoggedIn = "false";

                if (result.IsFailure())
                {
                    lblLoginMsg.Text = "Login Failed.  Please check your username and password";
                }
                else if (result.IsError())
                {
                    lblLoginMsg.Text = "Unexpected error ocurred trying to login to application.  Please retry.";
                }
            }

        }
    }
}