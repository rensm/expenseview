using System.Data;
using System.Runtime.Serialization;
using ExpenseView.Service.Util;
using System;

namespace ExpenseView.Service.DataObject
{
    public enum WeekDay
    {
        Sunday = 1,
        Monday,
        Tuesday,
        Wednesday,
        Thursday,
        Friday,
        Saturday
    }


    /// <summary>
    /// A RecurringTransaction represents an income or expense recurring transaction.  
    /// </summary>
    [DataContract]
    public class RecurringTransaction
    {
        /// <summary>
        /// Unique reucrring transation ID
        /// </summary>
        public int RecurringTransID { get; set; }

        /// <summary>
        /// Unique reucrring UserID
        /// </summary>
        public int UserID { get; set; }

        /// <summary>
        /// Unique username
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// Recurring amount
        /// </summary>
        public decimal Amount { get; set; }

        /// <summary>
        /// Begginning date of the recurring transaction
        /// </summary>
        public string StartDate { get; set; }

        /// <summary>
        /// Ending date of the recurring transaction
        /// </summary>
        public string EndDate { get; set; }

        /// <summary>
        /// CategoryID
        /// </summary>
        public int CategoryID { get; set; }

        /// <summary>
        /// Category name
        /// </summary>
        public string CategoryName { get; set; }

        /// <summary>
        /// SubcategoryID
        /// </summary>
        public int SubCategoryID { get; set; }

        /// <summary>
        /// Subcategory name
        /// </summary>
        public string SubCategoryName { get; set; }

        /// <summary>
        /// Income or Expense [E,I]
        /// </summary>
        public string CategoryType { get; set; }

        /// <summary>
        /// Weekly, Biweekly or Monthly [W,B,M]
        /// </summary>
        public string RecurringType { get; set; }
        
        /// <summary>
        /// Day of the week
        /// </summary>
        public int Day { get; set; }

        /// <summary>
        /// Day of the week Sunday- Saturday
        /// </summary>
        public string DayName { get; set; }

        public string Description { get; set; }

        /// <summary>
        /// Get the recurring transaction details via the data reader
        /// </summary>
        /// <param name="reader"></param>
        /// <returns>RecurringTransaction</returns>
        public static RecurringTransaction GetTransactionFromReader(IDataReader reader)
        {
            //Define RecurringTransaction as an Expense
            var recurrTrans = new RecurringTransaction();

            recurrTrans.RecurringTransID = DbUtil.GetIntFromReader(reader, "RecurringTransID");
            
            recurrTrans.UserID = DbUtil.GetIntFromReader(reader, "UserID");
            recurrTrans.Username = DbUtil.GetStringFromReader(reader, "UserName");
            recurrTrans.CategoryID = DbUtil.GetIntFromReader(reader, "CategoryID");
            recurrTrans.CategoryType = DbUtil.GetStringFromReader(reader, "CategoryType");
            recurrTrans.CategoryName = DbUtil.GetStringFromReader(reader, "CategoryName");
            recurrTrans.SubCategoryID = DbUtil.GetIntFromReader(reader, "SubcategoryID");
            recurrTrans.SubCategoryName = DbUtil.GetStringFromReader(reader, "SubCategoryName");
            recurrTrans.Amount = DbUtil.GetDecimalFromReader(reader, "Amount");
            recurrTrans.StartDate = DbUtil.GetDateTimeFromReader(reader, "StartDate").ToString("yyyy-MM-dd");
            recurrTrans.EndDate = DbUtil.GetDateTimeFromReader(reader, "EndDate").ToString("yyyy-MM-dd"); ;
            recurrTrans.RecurringType = DbUtil.GetStringFromReader(reader, "RecurringType");
            recurrTrans.Day = DbUtil.GetIntFromReader(reader, "Day");
            recurrTrans.Description = DbUtil.GetStringFromReader(reader, "Description");


          //  recurrTrans.CategoryType = DbUtil.GetStringFromReader(reader, "CategoryType");
          //  recurrTrans.RecurringTransID = DbUtil.GetIntFromReader(reader, "RecurringTransID");
          ////  recurrTrans.UserID = DbUtil.GetIntFromReader(reader, "UserID");
          
          //  recurrTrans.RecurringType = DbUtil.GetStringFromReader(reader, "RecurringType");
          //  recurrTrans.Day = DbUtil.GetIntFromReader(reader, "Day");
          //  if (recurrTrans.RecurringType == "W" || recurrTrans.RecurringType == "B")
          //      recurrTrans.DayName = Enum.GetName(typeof(WeekDay), recurrTrans.Day); 
          //  else
          //      recurrTrans.DayName = recurrTrans.Day.ToString(); 
            
          //  recurrTrans.CategoryID = DbUtil.GetIntFromReader(reader, "CategoryID");
          //  recurrTrans.CategoryName = DbUtil.GetStringFromReader(reader, "CategoryName");
            
          //  recurrTrans.SubCategoryID = DbUtil.GetIntFromReader(reader, "SubCategoryID");
          //  recurrTrans.SubCategoryName = DbUtil.GetStringFromReader(reader, "SubCategoryName");
            
          //  recurrTrans.Amount = DbUtil.GetDecimalFromReader(reader, "Amount");
          //  recurrTrans.StartDate = DbUtil.GetDateTimeFromReader(reader, "StartDate").ToString("yyyy-MM-dd");
          //  recurrTrans.EndDate = DbUtil.GetDateTimeFromReader(reader, "EndDate").ToString("yyyy-MM-dd");

            return recurrTrans;
        }

    }
}