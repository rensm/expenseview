using System;
using System.Web.Security;
using System.Web.UI;

public partial class GadgetTracker : Page
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

        if (!Page.IsPostBack)
        {
            if (!Request.IsAuthenticated)
            {
                Response.Redirect("gadgetLogin.aspx");
            }
        }
    }

    protected void btnLogout_Click(object sender, EventArgs e)
    {
        FormsAuthentication.SignOut();
        Response.Redirect("gadgetLogin.aspx", true);
    }
}