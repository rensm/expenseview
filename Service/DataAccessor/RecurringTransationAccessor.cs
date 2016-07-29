using System;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using ExpenseView.Service.DataObject;
using ExpenseView.Service.Util;
using ExpenseView.Service.DataMapper;

namespace ExpenseView.Service.DataAccessor
{
    public class RecurringTransactionAccessor
    {

        public static List<RecurringTransaction> GetAllRecurringTrans()
        {
            List<RecurringTransaction> recurringTransList = new List<RecurringTransaction>();

            SqlCommand cmd = DbUtil.GetProcedureCommand("GetAllRecurringTrans");
           
            try
            {
                cmd.Connection.Open();

                //StoredProcedure returns the following ResultSets:
                //RecurringTrans Category Subcategory Summary --> RecurringTransID, CategoryID, Name, SubcategoryID, Name, Amount StartDate, EndDate, RecurringType, Day, Description
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader != null)
                    {
                        while (reader.Read())
                        {
                            RecurringTransaction recurrTrans = RecurringTransaction.GetTransactionFromReader(reader);
                            if (!recurringTransList.Contains(recurrTrans))
                                recurringTransList.Add(recurrTrans);
                        }

                    }
                }

                DataTable dt = new DataTable();
                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    da.Fill(dt);
            }
            catch (Exception e)
            {
                string msg = e.Message;
            }
            finally
            {
                cmd.Connection.Close();
            }

            return recurringTransList;
        }


        public static List<RecurringTransaction> GetRecurringTrans(string userName)
        {
            List<RecurringTransaction> recurringTransList = new List<RecurringTransaction>();

            SqlCommand cmd = DbUtil.GetProcedureCommand("GetRecurringTrans");
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters[0].Value = userName;

            try
            {
                cmd.Connection.Open();

                //StoredProcedure returns the following ResultSets:
                //RecurringTrans Category Subcategory Summary --> RecurringTransID, CategoryID, Name, SubcategoryID, Name, Amount StartDate, EndDate, RecurringType, Day, Description
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader != null)
                    {
                        while (reader.Read())
                        {
                            RecurringTransaction recurrTrans = RecurringTransaction.GetTransactionFromReader(reader);
                            if (!recurringTransList.Contains(recurrTrans))
                                recurringTransList.Add(recurrTrans);
                        }
                    }
                }

                DataTable dt = new DataTable();
                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    da.Fill(dt);
            }
            catch (Exception e)
            {
                string msg = e.Message;
            }
            finally
            {
                cmd.Connection.Close();
            }

            return recurringTransList;
        }



        /// <summary>
        /// Insert Recurring Transactions
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="recurringTrans"></param>
        /// <returns>recurringTransID</returns>
        public static int InsertRecurringTrans(string userName, RecurringTransaction recurringTrans)
        {
            //RecurringTransID to return
            int recurringTransID = -1;

            SqlCommand cmd = DbUtil.GetProcedureCommand("AddRecurringTrans");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;
            cmd.Parameters.Add("categoryID", SqlDbType.Int);
            cmd.Parameters["categoryID"].Value = recurringTrans.CategoryID;
            cmd.Parameters.Add("subCategoryID", SqlDbType.Int);

            if (recurringTrans.SubCategoryID > 0)
            {
                cmd.Parameters["subCategoryID"].Value = recurringTrans.SubCategoryID;
            }
            else
            {
                cmd.Parameters["subCategoryID"].Value = DBNull.Value;
            }

            cmd.Parameters.Add("amount", SqlDbType.Money);
            cmd.Parameters["amount"].Precision = 2;
            cmd.Parameters["amount"].Value = recurringTrans.Amount;
            cmd.Parameters.Add("startDate", SqlDbType.SmallDateTime);
            cmd.Parameters["startDate"].Value = recurringTrans.StartDate;
            cmd.Parameters.Add("endDate", SqlDbType.SmallDateTime);
            cmd.Parameters["endDate"].Value = recurringTrans.EndDate;
           
            cmd.Parameters.Add("recurringType", SqlDbType.Char);
            cmd.Parameters["recurringType"].Value = recurringTrans.RecurringType;

            cmd.Parameters.Add("day", SqlDbType.Int);
            cmd.Parameters["day"].Value = recurringTrans.Day;

            cmd.Parameters.Add("description", SqlDbType.NVarChar);
            cmd.Parameters["description"].Value = recurringTrans.Description;

            //Define Output Parameter
            cmd.Parameters.Add("recurringTransID", SqlDbType.Int).Direction = ParameterDirection.Output;
            cmd.Parameters["recurringTransID"].Direction = ParameterDirection.Output;

            try
            {
                cmd.Connection.Open();
                cmd.ExecuteNonQuery();
                recurringTransID = Convert.ToInt32(cmd.Parameters["recurringTransID"].Value);
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                cmd.Connection.Close();
            }

            return recurringTransID;
        }

        /// <summary>
        /// Delete recurring transations
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="recurringTransId"></param>
        /// <returns>Successful delete returns 1 otherwise -1</returns>
        public static int DeleteRecurringTrans(string userName, int recurringTransId)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("DeleteRecurringTrans");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;
            cmd.Parameters.Add("recurringTransID", SqlDbType.Int);
            cmd.Parameters["recurringTransID"].Value = recurringTransId;

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

        
        /// <summary>
        /// Update Recurring Transactions
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="trans"></param>
        /// <returns></returns>
        public static int UpdateRecurringTrans(string userName, RecurringTransaction recurringTrans)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("EditRecurringTrans");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;
            cmd.Parameters.Add("recurringTransID", SqlDbType.Int);
            cmd.Parameters["recurringTransID"].Value = recurringTrans.RecurringTransID;
            cmd.Parameters.Add("categoryID", SqlDbType.Int);
            cmd.Parameters["categoryID"].Value = recurringTrans.CategoryID;

            cmd.Parameters.Add("subCategoryID", SqlDbType.Int);
            if (recurringTrans.SubCategoryID > 0)
            {
                cmd.Parameters["subCategoryID"].Value = recurringTrans.SubCategoryID;
            }
            else
            {
                cmd.Parameters["subCategoryID"].Value = DBNull.Value;
            }

            cmd.Parameters.Add("amount", SqlDbType.Money);
            cmd.Parameters["amount"].Precision = 2;
            cmd.Parameters["amount"].Value = recurringTrans.Amount;

            cmd.Parameters.Add("startDate", SqlDbType.SmallDateTime);
            cmd.Parameters["startDate"].Value = recurringTrans.StartDate;
            cmd.Parameters.Add("endDate", SqlDbType.SmallDateTime);
            cmd.Parameters["endDate"].Value = recurringTrans.EndDate;
 
            cmd.Parameters.Add("recurringType", SqlDbType.Char);
            cmd.Parameters["recurringType"].Value = recurringTrans.RecurringType;

            cmd.Parameters.Add("day", SqlDbType.Int);
            cmd.Parameters["day"].Value = recurringTrans.Day;

            cmd.Parameters.Add("description", SqlDbType.NVarChar);

            if (recurringTrans.Description != null)
            {
                cmd.Parameters["description"].Value = recurringTrans.Description;
            }
            else
            {
                cmd.Parameters["description"].Value = DBNull.Value;
            }


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