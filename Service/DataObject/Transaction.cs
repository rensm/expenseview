using System;
using System.Data;
using System.Runtime.Serialization;
using ExpenseView.Service.Util;

namespace ExpenseView.Service.DataObject
{
    /// <summary>
    /// A Transaction represents an income or expense transaction.  
    /// </summary>
    /// 
    [DataContract]
    public class Transaction
    {
        public int TransID { get; set; }

        public decimal Amount { get; set; }

        public string Date { get; set; }

        public string Description { get; set; }

        public int CategoryID { get; set; }

        public string CategoryName { get; set; }

        public int SubCategoryID { get; set; }

        public string SubCategoryName { get; set; }

        public string CategoryType { get; set; }

        public bool Selected { get; set; }

        public string State
        {
            get { return String.Empty; }
            set { }
        }

        public static Transaction GetTransactionFromReader(IDataReader reader)
        {
            //Define Transaction as an Expense
            var trans = new Transaction();

            trans.CategoryType = DbUtil.GetStringFromReader(reader, "CategoryType");
            trans.TransID = DbUtil.GetIntFromReader(reader, "TransID");
            trans.CategoryName = DbUtil.GetStringFromReader(reader, "CategoryName");
            trans.SubCategoryID = DbUtil.GetIntFromReader(reader, "SubCategoryID");
            trans.SubCategoryName = DbUtil.GetStringFromReader(reader, "SubCategoryName");
            trans.Amount = DbUtil.GetDecimalFromReader(reader, "Amount");
            trans.Date = DbUtil.GetDateTimeFromReader(reader, "Date").ToString("yyyy-MM-dd");

            if (reader["Description"] != null)
            {
                trans.Description = DbUtil.GetStringFromReader(reader, "Description");
            }

            trans.CategoryID = DbUtil.GetIntFromReader(reader, "CategoryID");

            return trans;
        }
    }
}