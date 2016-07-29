using System;
using System.Globalization;
using System.Text;
using System.Web.UI;
using ExpenseView.Service.DataAccessor;
using ExpenseView.Service.DataObject;

public partial class generateReport : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string dateFormat;
        Transaction[] transArray = TransactionAccessor.SearchTrans(User.Identity.Name, Request.QueryString["catType"],
                                                                   Request.QueryString["startDate"],
                                                                   Request.QueryString["endDate"],
                                                                   Request.QueryString["catId"],
                                                                   Request.QueryString["amountOper"],
                                                                   Request.QueryString["amount"], out dateFormat);

        StringBuilder sb = new StringBuilder();

        if (transArray != null)
        {
            int numTrans = transArray.Length;
            sb.Append("Category,SubCategory,Date,Amount,Comment\r\n");
            for (int i = 0; i < numTrans; i++)
            {
                Transaction trans = transArray[i];
                if (!String.IsNullOrEmpty(trans.SubCategoryName))
                {
                    sb.Append(trans.CategoryName + "," + trans.SubCategoryName + ",");
                }
                else
                {
                    sb.Append(transArray[i].CategoryName + ",,");
                }

                sb.Append(DateTime.ParseExact(transArray[i].Date, "yyyy-MM-dd", CultureInfo.InvariantCulture).ToString(dateFormat) + ",");
                sb.Append(transArray[i].Amount + ",");
                sb.Append(transArray[i].Description);
                sb.Append("\r\n");
            }
        }

        Response.ContentType = "text/csv";
        Response.ContentEncoding = Encoding.UTF8;

        string fileName;
        if (Request.QueryString["catType"] != null && Request.QueryString["catType"].Equals("Expense"))
        {
            fileName = "ExpenseExport_" + DateTime.Now.Month + "-" + DateTime.Now.Day + "-" + DateTime.Now.Year + ".csv";
        }
        else
        {
            fileName = "IncomeExport_" + DateTime.Now.Month + "-" + DateTime.Now.Day + "-" + DateTime.Now.Year + ".csv";
        }

        Response.Write(sb.ToString());

        //add the response headers
        Response.AddHeader("content-disposition", "attachment; filename=\"" + fileName + "\"");

        Response.End();
    }
}