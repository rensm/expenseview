using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Quartz;
using ExpenseView.Service.DataObject;
using ExpenseView.Service.DataAccessor;
using System.Globalization;

namespace ExpenseView
{
    /// <summary>
    /// Recurring Transaction Job
    /// </summary>
    public class RecurrTransJob : IJob
    {
        /// <summary>
        /// Initialize an empty instance
        /// </summary>
        public RecurrTransJob()
        {
        }

        /// <summary>
        /// Execute job to get all recurring transactions and insert the income or expense transaction based on 
        /// todays date as needed
        /// </summary>
        /// <param name="context"></param>
        public void Execute(IJobExecutionContext context)
        {
            //Get all the recurring transactions
            List<RecurringTransaction> recurringTransList = RecurringTransactionAccessor.GetAllRecurringTrans();
            DayOfWeek todayWeekDay = DateTime.UtcNow.DayOfWeek;

            foreach (RecurringTransaction recurrTrans in recurringTransList)
            {
                CultureInfo provider = CultureInfo.InvariantCulture;
                DateTime startDate = DateTime.ParseExact(recurrTrans.StartDate, "yyyy-MM-dd", provider);
                DateTime endDate = DateTime.ParseExact(recurrTrans.EndDate, "yyyy-MM-dd", provider);
                
                //Compare the start and end date of the recurring transation with the universal date time to ensure 
                //there are no daylight saving issues 
                // Store todays date(mm/dd/yyyy),  day(1-31) and day of week (Mon-Sun) in variable for quick access
                if (DateTime.UtcNow >= startDate && DateTime.UtcNow <= endDate)
                {
                    //WeekDay enum values are from 1-7 and DayOfWeek enum values are from 0-6
                    int currentDay = recurrTrans.Day - 1;
                    DayOfWeek recurrWeekDay = (DayOfWeek)Enum.ToObject(typeof(DayOfWeek), currentDay);

                    switch (recurrTrans.RecurringType)
                    {
                        //Weekly
                        case "W":
                            //If the recurring day is the same as today, then insert transaction
                            if (recurrWeekDay == todayWeekDay)
                            {
                                InsertTrans(recurrTrans);
                            }
                            break;
                        //Bi-Weekly
                        case "B":
                            //If today is the same as the recurring week and no transaction found for last week, then insert transaction
                            if (recurrWeekDay == todayWeekDay)
                            {
                                DateTime lastweekDate = DateTime.UtcNow.AddDays(-7);
                                Transaction lastWeekTrans = TransactionAccessor.GetTransByCategoryDateAndAmount(recurrTrans.UserID, recurrTrans.CategoryID, recurrTrans.SubCategoryID, lastweekDate, recurrTrans.Amount);
                                if (lastWeekTrans == null)
                                {
                                    InsertTrans(recurrTrans);
                                }
                            }
                            break;
                        //Monthly
                        case "M":
                            //If today's date is the same as the recurring date; then insert transaction
                            if (recurrTrans.Day == DateTime.UtcNow.Day)
                            {
                                InsertTrans(recurrTrans);
                            }
                            break;
                    }
                }
            }
        }

        /// <summary>
        /// Create a new Income/Expense Transaction and insert it into the database
        /// </summary>
        /// <param name="recurrTrans"></param>
        private void InsertTrans(RecurringTransaction recurrTrans)
        {
            Transaction trans = new Transaction();
            trans.CategoryID = recurrTrans.CategoryID;
            trans.SubCategoryID = recurrTrans.SubCategoryID;
            trans.Amount = recurrTrans.Amount;
            trans.Description = recurrTrans.Description;
            trans.Date = DateTime.UtcNow.ToShortDateString();
            int i = TransactionAccessor.InsertTrans(recurrTrans.Username, trans);
          
        }    
    }

}