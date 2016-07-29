using System.Data;
using System.Data.SqlClient;
using ExpenseView.Service.DataObject;
using ExpenseView.Service.Util;

/// <summary>
/// Summary description for IncomeUtility
/// </summary>
/// 
namespace ExpenseView.Service.DataAccessor
{
    public class IncomeAccessor
    {
        private IncomeAccessor()
        {
        }

        public static int UpdateSavingsGoal(string userName, SavingsGoal savGoal)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("UpdateSavingsGoal");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;
            cmd.Parameters.Add("yearGoal", SqlDbType.Money);
            cmd.Parameters["yearGoal"].Precision = 2;
            cmd.Parameters["yearGoal"].Value = savGoal.YearGoal;
            cmd.Parameters.Add("monthGoal", SqlDbType.Money);
            cmd.Parameters["monthGoal"].Precision = 2;
            cmd.Parameters["monthGoal"].Value = savGoal.MonthGoal;
            cmd.Parameters.Add("weekGoal", SqlDbType.Money);
            cmd.Parameters["weekGoal"].Precision = 2;
            cmd.Parameters["weekGoal"].Value = savGoal.WeekGoal;

            try
            {
                cmd.Connection.Open();
                cmd.ExecuteNonQuery();
                return 1;
            }
            catch
            {
                return -1;
            }
            finally
            {
                cmd.Connection.Close();
            }
        }
    }
}