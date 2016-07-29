using System;
using System.Data.SqlClient;
using System.Web.UI;
using System.Web.UI.WebControls;
using ExpenseView.Service.Util;

public partial class totalCount : Page
{
    protected TextBox totUser;

    protected void Page_Load(object sender, EventArgs e)
    {
        lbl_UserCount.Text = "" + GetTotalUserCount();
    }

    private int GetTotalUserCount()
    {
        int result = -1;

        SqlCommand cmd = DbUtil.GetTextCommand("SELECT COUNT(1) as UserCount FROM [User]");

        try
        {
            cmd.Connection.Open();
            result = Convert.ToInt32(cmd.ExecuteScalar());
        }
        catch (Exception e)
        {
            string msg = e.Message;
        }
        finally
        {
            cmd.Connection.Close();
        }

        return result;
    }
}