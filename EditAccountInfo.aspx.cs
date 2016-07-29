using System;
using System.Drawing;
using System.Globalization;
using System.Web.UI;
using ExpenseView.Service.DataAccessor;
using ExpenseView.Service.DataObject;

namespace ExpenseView
{
    public partial class EditAccountInfo : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                UserInfo userInfo = UserInfoAccessor.GetUserInfo(User.Identity.Name);
                lblUserName.Text = User.Identity.Name;
                txtEmailAddress.Text = userInfo.Email;

                txtPwd.Text = "";
                txtConfirPwd.Text = "";
                txtConfirPwd.Enabled = false;
                txtPwd.Enabled = false;

                switch (userInfo.AmountDisplayDecimals)
                {
                    case 2:
                        ddlCurrencyDecimalFormat.SelectedIndex = 0;
                        break;
                    case 3:
                        ddlCurrencyDecimalFormat.SelectedIndex = 1;
                        break;
                    case 0:
                        ddlCurrencyDecimalFormat.SelectedIndex = 2;
                        break;
                }

                //First Day of Week (0=Sunday,1=Monday)
                //The selected index matches this exactly, thus no further mapping is required
                selFirstDayOfWeek.SelectedIndex = userInfo.WeekStartDay;

                string dateFormat = "";
                switch (userInfo.PreferredDateFormat)
                {
                    case 1:
                        selDateFormat.SelectedIndex = 0;
                        dateFormat = "yyyy-MM-dd";
                        break;
                    case 2:
                        selDateFormat.SelectedIndex = 1;
                        dateFormat = "MM/dd/yyyy";
                        break;
                    case 3:
                        selDateFormat.SelectedIndex = 2;
                        dateFormat = "dd/MM/yyyy";
                        break;
                }



                //Sets the user date values
                txtUserDateStart.Value = userInfo.UserStartDate.ToString(dateFormat);
                txtUserDateEnd.Value = userInfo.UserEndDate.ToString(dateFormat);
            }
        }

        protected void btnUpdateAccountInfo_Click(object sender, EventArgs e)
        {
            string emailAddress = txtEmailAddress.Text;
            bool passwordSpecified = txtPwd.Enabled;
            string password = txtPwd.Text;
            string confirmPwd = txtConfirPwd.Text;
            int amountDisplayDecimals = Int32.Parse(ddlCurrencyDecimalFormat.SelectedValue);
            int preferredDateFormat = selDateFormat.SelectedIndex + 1;
            int preferredFirstDayOfWeek = selFirstDayOfWeek.SelectedIndex;

            string dateFormat;
            switch(preferredDateFormat)
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

            DateTime userDateStart, userDateEnd;
            try
            {
                userDateStart = DateTime.ParseExact(txtUserDateStart.Value, dateFormat, CultureInfo.InvariantCulture);
                userDateEnd = DateTime.ParseExact(txtUserDateEnd.Value, dateFormat, CultureInfo.InvariantCulture);
            }
            catch(Exception)
            {
                lblResults.ForeColor = Color.Red;
                lblResults.Text = "Invalid date values found.  Please enter valid custom dates.";
                return;
            }

            if (passwordSpecified)
            {
                if (!password.Equals(confirmPwd))
                {
                    lblResults.ForeColor = Color.Red;
                    lblResults.Text = "Passwords don't match.  Please retype them.";

                    txtPwd.Text = "";
                    txtConfirPwd.Text = "";
                    return;
                }

                if (password.Length <= 3)
                {
                    lblResults.ForeColor = Color.Red;
                    lblResults.Text = "Password must be at least four characters long.";

                    txtPwd.Text = "";
                    txtConfirPwd.Text = "";
                    return;
                }
            }

            if (!UserInfoAccessor.IsValidEmailAddress(emailAddress))
            {
                lblResults.ForeColor = Color.Red;
                lblResults.Text = "Invalid email address specified.  Please retype.";
                return;
            }

            try
            {
                if (UserInfoAccessor.UpdateUserInfo(User.Identity.Name, emailAddress, passwordSpecified, password,
                                                    preferredDateFormat, amountDisplayDecimals, userDateStart, userDateEnd, preferredFirstDayOfWeek))
                {
                    lblResults.ForeColor = Color.Black;
                    lblResults.Text = "Your account settings have been updated.";
                }
                else
                {
                    lblResults.ForeColor = Color.Red;
                    lblResults.Text = "Update failed.  Please try again.";
                }
            }
            catch(Exception)
            {               
                lblResults.ForeColor = Color.Red;
                lblResults.Text = "Update failed.  Please try again.";
            }
        }

        protected void lnkChangePassword_Click(object sender, EventArgs e)
        {
            txtPwd.Enabled = true;
            txtConfirPwd.Enabled = true;

            lnkChangePassword.Visible = false;
        }
    }
}