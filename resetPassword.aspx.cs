using System;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;
using ExpenseView.Service.DataAccessor;

public partial class ResetPassword : Page
{
    protected Label lblResults;
    protected TextBox txtGetUserNameEmail;
    protected TextBox txtResetPwdEmail;
    protected TextBox txtResetPwdUsername;

    protected void Page_Load(object sender, EventArgs e)
    {
        lblResults.Font.Bold = true;
        lblResults.Text = "";
    }

    protected void btnGetUserName_Click(object sender, EventArgs e)
    {
        try
        {
            if (UserInfoAccessor.EmailUsername(txtGetUserNameEmail.Text))
            {
                lblResults.ForeColor = Color.Black;
                lblResults.Text = "Your username was sent to " + txtGetUserNameEmail.Text +
                                  ". <a href='default.aspx'>Click Here</a> to go back to the home page.";

                txtGetUserNameEmail.Text = "";
            }
            else
            {
                lblResults.ForeColor = Color.Red;
                lblResults.Text =
                    "Unable to get username.  This email address wasn't found in our system.  Please check the specified address and try again.";
            }
        }
        catch
        {
            lblResults.ForeColor = Color.Red;
            lblResults.Text = "Unexepected error ocurred when trying to get username.  Please try again.";
        }
    }


    protected void btnResetPwd_Click(object sender, EventArgs e)
    {
        try
        {
            if (UserInfoAccessor.ResetUserPassword(txtResetPwdUsername.Text, txtResetPwdEmail.Text))
            {
                lblResults.ForeColor = Color.Black;
                lblResults.Text = "Your new password was sent to " + txtResetPwdEmail.Text +
                                  ". <a href='default.aspx'>Click Here</a> to go back to the home page.";

                txtResetPwdEmail.Text = "";
                txtResetPwdUsername.Text = "";
            }
            else
            {
                lblResults.ForeColor = Color.Red;
                lblResults.Text =
                    "Unable to reset password.  This UserName/Email Address combination wasn't found in our system.  Please check the specified values and try again.";
            }
        }
        catch
        {
            lblResults.ForeColor = Color.Red;
            lblResults.Text = "Unexepected error ocurred when trying to reset password.  Please try again.";
        }
    }
}