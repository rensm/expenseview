using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using ExpenseView.Service.DataObject;
using ExpenseView.Service.Util;

/// <summary>
/// Summary description for TransactionUtility
/// </summary>
namespace ExpenseView.Service.DataAccessor
{
    public class TransactionAccessor
    {
        public static int InsertTrans(string userName, Transaction trans)
        {
            //TransID to return
            int transID = -1;

            SqlCommand cmd = DbUtil.GetProcedureCommand("AddTrans");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;
            cmd.Parameters.Add("categoryID", SqlDbType.Int);
            cmd.Parameters["categoryID"].Value = trans.CategoryID;
            cmd.Parameters.Add("subCategoryID", SqlDbType.Int);

            if (trans.SubCategoryID > 0)
            {
                cmd.Parameters["subCategoryID"].Value = trans.SubCategoryID;
            }
            else
            {
                cmd.Parameters["subCategoryID"].Value = DBNull.Value;
            }

            cmd.Parameters.Add("amount", SqlDbType.Money);
            cmd.Parameters["amount"].Precision = 2;
            cmd.Parameters["amount"].Value = trans.Amount;
            cmd.Parameters.Add("date", SqlDbType.SmallDateTime);
            cmd.Parameters["date"].Value = trans.Date;
            cmd.Parameters.Add("description", SqlDbType.NVarChar);
            cmd.Parameters["description"].Value = trans.Description;

            //Define Output Parameter
            cmd.Parameters.Add("transID", SqlDbType.Int).Direction = ParameterDirection.Output;
            cmd.Parameters["transID"].Direction = ParameterDirection.Output;

            try
            {
                cmd.Connection.Open();
                cmd.ExecuteNonQuery();
                transID = Convert.ToInt32(cmd.Parameters["transID"].Value);
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                cmd.Connection.Close();
            }

            return transID;
        }


        public static int InsertTransList(string userName, List<Transaction> transList)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("AddTrans");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters.Add("categoryID", SqlDbType.Int);
            cmd.Parameters.Add("subCategoryID", SqlDbType.Int);

            cmd.Parameters.Add("amount", SqlDbType.Money);
            cmd.Parameters["amount"].Precision = 2;
            cmd.Parameters.Add("date", SqlDbType.SmallDateTime);
            cmd.Parameters.Add("description", SqlDbType.NVarChar);

            //Define Output Parameter
            cmd.Parameters.Add("transID", SqlDbType.Int).Direction = ParameterDirection.Output;
            cmd.Parameters["transID"].Direction = ParameterDirection.Output;


            try
            {
                cmd.Connection.Open();
                cmd.Transaction = cmd.Connection.BeginTransaction();

                foreach (Transaction trans in transList)
                {
                    //Define Input Parameters
                    cmd.Parameters["userName"].Value = userName;
                    cmd.Parameters["categoryID"].Value = trans.CategoryID;

                    if (trans.SubCategoryID > 0)
                    {
                        cmd.Parameters["subCategoryID"].Value = trans.SubCategoryID;
                    }
                    else
                    {
                        cmd.Parameters["subCategoryID"].Value = DBNull.Value;
                    }
                    
                    cmd.Parameters["amount"].Value = trans.Amount;
                    cmd.Parameters["date"].Value = trans.Date;
                    cmd.Parameters["description"].Value = trans.Description;

                    cmd.ExecuteNonQuery();
                }

                cmd.Transaction.Commit();

            }
            catch (Exception)
            {
                cmd.Transaction.Rollback();
                return -1;
            }
            finally
            {
                cmd.Connection.Close();
            }

            return 1;
        }



        public static int UpdateTrans(string userName, Transaction trans)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("EditTrans");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;
            cmd.Parameters.Add("transID", SqlDbType.Int);
            cmd.Parameters["transID"].Value = trans.TransID;
            cmd.Parameters.Add("categoryID", SqlDbType.Int);
            cmd.Parameters["categoryID"].Value = trans.CategoryID;

            cmd.Parameters.Add("subCategoryID", SqlDbType.Int);
            if (trans.SubCategoryID > 0)
            {
                cmd.Parameters["subCategoryID"].Value = trans.SubCategoryID;
            }
            else
            {
                cmd.Parameters["subCategoryID"].Value = DBNull.Value;
            }

            cmd.Parameters.Add("amount", SqlDbType.Money);
            cmd.Parameters["amount"].Precision = 2;
            cmd.Parameters["amount"].Value = trans.Amount;
            cmd.Parameters.Add("date", SqlDbType.SmallDateTime);
            cmd.Parameters["date"].Value = trans.Date;
            cmd.Parameters.Add("description", SqlDbType.NVarChar);
            cmd.Parameters["description"].Value = trans.Description;

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

        public static int DeleteTrans(string userName, int transId)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("DeleteTrans");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;
            cmd.Parameters.Add("transID", SqlDbType.Int);
            cmd.Parameters["transID"].Value = transId;

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


        public static Transaction GetTransByCategoryDateAndAmount(int userID, int categoryID, int subCategoryID, DateTime date, decimal amount)
        {
           Transaction trans = null;

            SqlCommand cmd = DbUtil.GetProcedureCommand("GetTransByDateCategoryAmount");
            cmd.Parameters.Add("userID", SqlDbType.Int);
            cmd.Parameters["userID"].Value = userID;
            cmd.Parameters.Add("categoryID", SqlDbType.Int);
            cmd.Parameters["categoryID"].Value = categoryID;
            cmd.Parameters.Add("subCategoryID", SqlDbType.Int);
            cmd.Parameters["subCategoryID"].Value = subCategoryID;
            cmd.Parameters.Add("date", SqlDbType.SmallDateTime);
            cmd.Parameters["date"].Value = date;
            cmd.Parameters.Add("amount", SqlDbType.Decimal);
            cmd.Parameters["amount"].Value = amount;
            
            try
            {
                cmd.Connection.Open();

                //StoredProcedure returns the following ResultSets:
                //Trans Category Subcategory Summary --> TransID, CategoryID, Name, SubcategoryID, Name, Amount StartDate, EndDate, RecurringType, Day, Description
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader != null && reader.Read())
                    {
                        trans = Transaction.GetTransactionFromReader(reader);
                    }
                }
            }
            catch (Exception e)
            {
                string msg = e.Message;
            }
            finally
            {
                cmd.Connection.Close();
            }

            return trans;
        }




        public static Transaction[] SearchTrans(string userName, string catTypeString, string startDateString,
                                                string endDateString, string categoryId, string amountOperator,
                                                string amount, out string dateFormat)
        {
            //Default Format
            dateFormat = "yyyy-MM-dd";

            var sb = new StringBuilder();

            sb.Append(
                "SELECT Trans.TransID, [User].PreferredDateFormat, Category.CategoryType, Category.[Name] as CategoryName, SubCategory.[Name] as SubCategoryName, Trans.Amount, Trans.Date, Trans.Description, Trans.CategoryID, Trans.SubCategoryID");
            sb.Append(" FROM Trans");
            sb.Append(" JOIN [User] on Trans.UserID = [User].UserID");
            sb.Append(" JOIN Category ON Trans.CategoryID = Category.CategoryID");
            sb.Append(" LEFT OUTER JOIN SubCategory on Trans.SubCategoryID = SubCategory.SubCategoryID");
            sb.Append(" WHERE [User].UserName = '" + userName + "'");

            if (catTypeString != null && catTypeString.Length > 0)
            {
                string catType = "";
                if (catTypeString.Equals("Expense"))
                {
                    catType = "E";
                }
                else if (catTypeString.Equals("Income"))
                {
                    catType = "I";
                }

                sb.Append(" and Category.CategoryType = '" + catType + "'");
            }

            if (!string.IsNullOrEmpty(startDateString))
            {
                DateTime startDate = DateTime.Parse(startDateString);
                sb.Append(" and Trans.Date >= '" + startDate.Year + "-" + startDate.Month + "-" + startDate.Day + "'");
            }

            if (!string.IsNullOrEmpty(endDateString))
            {
                DateTime endDate = DateTime.Parse(endDateString);
                sb.Append(" and Trans.Date <= '" + endDate.Year + "-" + endDate.Month + "-" + endDate.Day + "'");
            }

            if (categoryId != null && !categoryId.Equals("Any"))
            {
                sb.Append(" and trans.CategoryID = " + categoryId);
            }

            if (amountOperator != null && !amountOperator.Equals("Any"))
            {
                if (amountOperator.Equals("Greater"))
                {
                    sb.Append(" and trans.Amount > " + amount);
                }
                else if (amountOperator.Equals("Less"))
                {
                    sb.Append(" and trans.Amount < " + amount);
                }
                else if (amountOperator.Equals("Equal"))
                {
                    sb.Append(" and trans.Amount = " + amount);
                }
            }

            SqlCommand cmd = DbUtil.GetTextCommand(sb.ToString());

            var transList = new List<Transaction>();

            bool dataPreferenceSpecified = false;

            try
            {
                cmd.Connection.Open();

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader != null)
                    {
                        while (reader.Read())
                        {
                            transList.Add(Transaction.GetTransactionFromReader(reader));

                            if (!dataPreferenceSpecified)
                            {
                                int preferredDateFormat = DbUtil.GetIntFromReader(reader, "PreferredDateFormat");
                                switch (preferredDateFormat)
                                {
                                    case 1:
                                        dateFormat = "yyyy-MM-dd";
                                        break;
                                    case 2:
                                        dateFormat = "MM/dd/yyyy";
                                        break;
                                    case 3:
                                        dateFormat = "dd/MM/yyyy";
                                        break;
                                }

                                dataPreferenceSpecified = true;
                            }

                        }
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                cmd.Connection.Close();
            }

            if (transList.Count > 0)
            {
                return transList.ToArray();
            }
            else
            {
                return null;
            }
        }
    }
}