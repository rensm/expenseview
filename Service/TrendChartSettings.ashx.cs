using System;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Data.SqlClient;
using ExpenseView.Service.Util;
using ExpenseView.Service.DataAccessor;

namespace ExpenseView.Service
{
    /// <summary>
    /// Returns date and transactions of all income or expenses in CSV format
    /// </summary>
    public class TrendChartSettings : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            if (!context.User.Identity.IsAuthenticated)
            {
                return;
            }


            string transType = context.Request.QueryString["transType"];

            if (transType == "Expense")
            {
                transType = "E";
            }
            else if (transType == "Income")
            {
                transType = "I";
            }
            else
            {
                return;
                ///TODO: Log invalide query param issued
            }

            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.ClearHeaders();
            HttpContext.Current.Response.ClearContent();
            HttpContext.Current.Response.AddHeader("content-disposition", "attachment; filename=trendChartSettings.xml");
            HttpContext.Current.Response.ContentType = "text/xml";
            context.Response.Write(GraphAccessor.GetTrendChartResponse(context.User.Identity.Name, transType));
            context.Response.End();
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}