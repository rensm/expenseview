using System;
using System.Text;
using System.Web.UI;
using ExpenseView.Service.DataAccessor;
using ExpenseView.Service.DataObject;

public class generateReport : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Transaction[] transArray = TransactionAccessor.SearchTrans(User.Identity.Name, Request.QueryString["catType"],
                                                                   Request.QueryString["startDate"],
                                                                   Request.QueryString["endDate"],
                                                                   Request.QueryString["catId"],
                                                                   Request.QueryString["amountOper"],
                                                                   Request.QueryString["amount"]);

        int numTrans = transArray.Length;
        var sb = new StringBuilder();
        sb.Append("Category,Date,Amount,Comment\r\n");
        for (int i = 0; i < numTrans; i++)
        {
            sb.Append(transArray[i].CategoryName + ",");
            sb.Append(transArray[i].Date + ",");
            sb.Append(transArray[i].Amount + ",");
            sb.Append(transArray[i].Description);
            sb.Append("\r\n");
        }


        Response.ContentType = "Application/x-msexcel";
        string fileName;
        if (Request.QueryString["catType"].Equals("Expense"))
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