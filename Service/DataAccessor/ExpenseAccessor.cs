using System;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using ExpenseView.Service.DataObject;
using ExpenseView.Service.Util;

namespace ExpenseView.Service.DataAccessor
{
    /// <summary>
    /// Utility performs CRUD functions on Expense and ExpenseCategory Records.
    /// </summary>
    public class ExpenseAccessor
    {
        private ExpenseAccessor()
        {
        }

        public static Category[] GetYearExpenses(string userName)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("GetYearExpenses");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;

            var categoryList = new ArrayList();

            try
            {
                cmd.Connection.Open();

                //StoredProcedure returns the following ResultSets:
                //Transaction Category Summary --> CategoryID, Name, YearAmount, PriorMonthAmount, MonthAmount, PriorWeekAmount, WeekAmount
                //Transaction Transactions --> TransID, CategoryName, Amount, Date, Description                 
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader != null)
                    {
                        //Load Category Data
                        while (reader.Read())
                        {
                            var cat = new Category();
                            cat.CategoryID = reader.GetInt32(0);
                            cat.Name = reader.GetString(1);

                            if (!reader.IsDBNull(2))
                            {
                                cat.YearAmount = reader.GetDecimal(2);
                            }

                            categoryList.Add(cat);
                        }
                    }
                }

                return (Category[]) categoryList.ToArray(typeof (Category));
            }
            catch
            {
                throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
        }
    }
}