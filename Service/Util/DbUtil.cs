using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace ExpenseView.Service.Util
{
    /// <summary>
    /// A utility class containing database helper functions.
    /// </summary>
    public class DbUtil
    {
        public static SqlCommand GetProcedureCommand(string procedureName)
        {
            string connString = ConfigurationManager.ConnectionStrings["ExpenseViewConnectionString"].ConnectionString;
            var conn = new SqlConnection(connString);

            var cmd = new SqlCommand(procedureName, conn);
            cmd.CommandType = CommandType.StoredProcedure;

            return cmd;
        }

        public static SqlCommand GetTextCommand(string queryText)
        {
            string connString = ConfigurationManager.ConnectionStrings["ExpenseViewConnectionString"].ConnectionString;
            var conn = new SqlConnection(connString);
            var cmd = new SqlCommand(queryText, conn);
            cmd.CommandType = CommandType.Text;

            return cmd;
        }

        public static string GetStringFromReader(IDataReader reader, string columnName)
        {
            string value = null;

            if (HasColumn(reader, columnName) && reader[columnName] != DBNull.Value)
            {
                value = Convert.ToString(reader[columnName]);
            }

            return value;
        }

        /// <summary>
        /// Extension class for the DataReader to check if a column exists
        /// </summary>
        public static bool HasColumn(IDataReader reader, string columnName)
        {
            try
            {
                return reader.GetOrdinal(columnName) >= 0;
            }
            catch (IndexOutOfRangeException)
            {
                return false;
            }
        }  
 
      
        public static int GetIntFromReader(IDataReader reader, string columnName)
        {
            int value = 0;

            if (HasColumn(reader, columnName) && reader[columnName] != DBNull.Value)
            {
                value = Convert.ToInt32(reader[columnName]);
            }

            return value;
        }

        public static decimal GetDecimalFromReader(IDataReader reader, string columnName)
        {
            decimal value = 0m;

            if (HasColumn(reader, columnName) && reader[columnName] != DBNull.Value)
            {
                value = Convert.ToDecimal(reader[columnName]);
            }

            return value;
        }

        public static DateTime GetDateTimeFromReader(IDataReader reader, string columnName)
        {
            DateTime value;

            if (HasColumn(reader, columnName) && reader[columnName] != DBNull.Value)
            {
                value = (DateTime) reader[columnName];
            }
            else
            {
                value = new DateTime();
            }

            return value;
        }
    }
}