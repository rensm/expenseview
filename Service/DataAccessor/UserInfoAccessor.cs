using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Security;
using ExpenseView.Service.DataObject;
using ExpenseView.Service.Util;

namespace ExpenseView.Service.DataAccessor
{
    /// <summary>
    /// Retrieves and updates data associated with a speciic user
    /// </summary>
    public class UserInfoAccessor
    {
        #region UserSummary Methods

        public static UserSummary GetUserSummary(string userName, DateTime userDate)
        {
            var userSummary = new UserSummary();

            SqlCommand cmd = DbUtil.GetProcedureCommand("GetUserSummary");
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters[0].Value = userName;
            cmd.Parameters.Add("userDate", SqlDbType.DateTime);
            cmd.Parameters[1].Value = userDate;

            try
            {
                cmd.Connection.Open();

                //StoredProcedure returns the following ResultSets:
                //Transaction Category Summary --> CategoryID, Name, UserDateAmount YearAmount, PriorMonthAmount, MonthAmount, PriorWeekAmount, WeekAmount
                //Transaction Transactions --> TransID, CategoryName, Amount, Date, Description                 
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader != null)
                    {
                        //Create UserInfo
                        if (reader.Read())
                        {
                            userSummary.Email = reader["EmailAddress"] as string;
                            userSummary.PreferredDateFormat = DbUtil.GetIntFromReader(reader, "PreferredDateFormat");
                            userSummary.AmountDisplayDecimals = DbUtil.GetIntFromReader(reader, "AmountDisplayDecimals");
                            userSummary.UserWeekStart = DbUtil.GetIntFromReader(reader, "WeekStartDay");
                            userSummary.UserStartDate = DbUtil.GetDateTimeFromReader(reader, "UserStartDate").ToString("yyyy-MM-dd"); ;
                            userSummary.UserEndDate = DbUtil.GetDateTimeFromReader(reader, "UserEndDate").ToString("yyyy-MM-dd"); ;
                        }

                        //Create Expense Category Data
                        userSummary.ExpenseCategories = CreateCategories(reader);

                        //Create Income Category Data
                        userSummary.IncomeCategories = CreateCategories(reader);

                        //Load Recent Expenses Data
                        userSummary.RecentExpenses = CreateTransactions(reader);

                        //Load Recent Income Data
                        userSummary.RecentIncome = CreateTransactions(reader);
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

            return userSummary;
        }

        /// <summary>
        /// Retireves the user categories and subcategories
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="userDate"></param>
        /// <returns></returns>
        public static UserCategories GetUserCategories(string userName)
        {
            var userCategories = new UserCategories();

            SqlCommand cmd = DbUtil.GetProcedureCommand("GetUserCategories");
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters[0].Value = userName;

            try
            {
                cmd.Connection.Open();

                //StoredProcedure returns the following ResultSets:
                //Transaction Category Summary --> CategoryID, Name, UserDateAmount YearAmount, PriorMonthAmount, MonthAmount, PriorWeekAmount, WeekAmount
                //Transaction Transactions --> TransID, CategoryName, Amount, Date, Description                 
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader != null)
                    {

                        //Create Expense Category Data
                        userCategories.ExpenseCategories = CreateLimitedCategories(reader);

                        if (reader.NextResult())
                        {
                            //Create Income Category Data
                            userCategories.IncomeCategories = CreateLimitedCategories(reader);
                        }
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

            return userCategories;
        }


        private static Transaction[] CreateTransactions(IDataReader reader)
        {
            var transList = new List<Transaction>();

            if (reader.NextResult())
            {
                while (reader.Read())
                {
                    //TransID, Name, Amount, Date, Description
                    Transaction trans = Transaction.GetTransactionFromReader(reader);
                    transList.Add(trans);
                }
            }

            return transList.ToArray();
        }

        private static Category[] CreateLimitedCategories(IDataReader reader)
        {
            Category[] categories = null;

            //Create Categories
            var categoryDictionary = new Dictionary<int, Category>();

            while (reader.Read())
            {
                //TransID, Name, Amount, Date, Description
                Category category = CreateCategory(reader, true);
                categoryDictionary.Add(category.CategoryID, category);
            }

            //Associate SubCategories
            if (reader.NextResult())
            {
                while (reader.Read())
                {
                    if (reader["SubCategoryID"] != DBNull.Value)
                    {
                        SubCategory subCategory = CreateSubCategory(reader, true);
                        categoryDictionary[subCategory.CategoryID].AddSubCategory(subCategory);
                    }
                }
            }

            //Copy CategoryGroup Values in categoryGroups Array
            if (categoryDictionary.Count > 0)
            {
                categories = new Category[categoryDictionary.Count];
                categoryDictionary.Values.CopyTo(categories, 0);
            }

            return categories;
        }

        private static Category[] CreateCategories(IDataReader reader)
        {
            Category[] categories = null;

            //Create Categories
            if (reader.NextResult())
            {
                var categoryDictionary = new Dictionary<int, Category>();

                while (reader.Read())
                {
                    //TransID, Name, Amount, Date, Description
                    Category category = CreateCategory(reader, false);
                    categoryDictionary.Add(category.CategoryID, category);
                }

                //Associate SubCategories
                if (reader.NextResult())
                {
                    while (reader.Read())
                    {
                        if (reader["SubCategoryID"] != DBNull.Value)
                        {
                            SubCategory subCategory = CreateSubCategory(reader, false);
                            categoryDictionary[subCategory.CategoryID].AddSubCategory(subCategory);
                        }
                    }
                }

                //Copy CategoryGroup Values in categoryGroups Array
                if (categoryDictionary.Count > 0)
                {
                    categories = new Category[categoryDictionary.Count];
                    categoryDictionary.Values.CopyTo(categories, 0);
                }
            }

            return categories;
        }

        private static Category CreateCategory(IDataReader reader, bool isLimited)
        {
            var cat = new Category();


            cat.CategoryID = DbUtil.GetIntFromReader(reader, "CategoryID");
            cat.Name = DbUtil.GetStringFromReader(reader, "Name");
            cat.Description = DbUtil.GetStringFromReader(reader, "Description");
            cat.Color = DbUtil.GetStringFromReader(reader, "Color");
            if (!isLimited)
            {
                cat.UserDateBudget = DbUtil.GetDecimalFromReader(reader, "UserDateBudget");
                cat.YearBudget = DbUtil.GetDecimalFromReader(reader, "YearBudget");
                cat.MonthBudget = DbUtil.GetDecimalFromReader(reader, "MonthBudget");
                cat.WeekBudget = DbUtil.GetDecimalFromReader(reader, "WeekBudget");

                cat.UserDateAmount = DbUtil.GetDecimalFromReader(reader, "UserDateAmount");
                cat.YearAmount = DbUtil.GetDecimalFromReader(reader, "YearAmount");
                cat.MonthAmount = DbUtil.GetDecimalFromReader(reader, "MonthAmount");
                cat.PriorMonthAmount = DbUtil.GetDecimalFromReader(reader, "PriorMonthAmount");
                cat.WeekAmount = DbUtil.GetDecimalFromReader(reader, "WeekAmount");
                cat.PriorWeekAmount = DbUtil.GetDecimalFromReader(reader, "PriorWeekAmount");
                cat.TotalAmount = DbUtil.GetDecimalFromReader(reader, "TotalAmount");
            }

            return cat;
        }


        private static SubCategory CreateSubCategory(IDataReader reader, bool isLimited)
        {
            var subCategory = new SubCategory();

            subCategory.SubCategoryID = DbUtil.GetIntFromReader(reader, "SubCategoryID");
            subCategory.CategoryID = DbUtil.GetIntFromReader(reader, "CategoryID");
            subCategory.Name = DbUtil.GetStringFromReader(reader, "Name");
            subCategory.Color = DbUtil.GetStringFromReader(reader, "Color");

            if (!isLimited)
            {
                subCategory.YearAmount = DbUtil.GetDecimalFromReader(reader, "YearAmount");
                subCategory.MonthAmount = DbUtil.GetDecimalFromReader(reader, "MonthAmount");
                subCategory.PriorMonthAmount = DbUtil.GetDecimalFromReader(reader, "PriorMonthAmount");
                subCategory.WeekAmount = DbUtil.GetDecimalFromReader(reader, "WeekAmount");
                subCategory.PriorWeekAmount = DbUtil.GetDecimalFromReader(reader, "PriorWeekAmount");
                subCategory.TotalAmount = DbUtil.GetDecimalFromReader(reader, "TotalAmount");
                subCategory.UserDateAmount = DbUtil.GetDecimalFromReader(reader, "UserDateAmount");
            }
            return subCategory;
        }

        #endregion

        public static UserInfo GetUserInfo(string userName)
        {
            UserInfo userInfo = null;

            SqlCommand cmd = DbUtil.GetProcedureCommand("GetUserInfo");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;

            try
            {
                cmd.Connection.Open();

                //Creates UserInfo Object
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        userInfo = new UserInfo();
                        userInfo.Email = reader["EmailAddress"] as string;
                        userInfo.AmountDisplayDecimals = (int) reader["AmountDisplayDecimals"];
                        userInfo.PreferredDateFormat = (int) reader["PreferredDateFormat"];
                        userInfo.WeekStartDay = DbUtil.GetIntFromReader(reader, "WeekStartDay");
                        userInfo.UserStartDate = DbUtil.GetDateTimeFromReader(reader, "UserStartDate"); ;
                        userInfo.UserEndDate = DbUtil.GetDateTimeFromReader(reader, "UserEndDate"); ;
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


            return userInfo;
        }

        public static bool UpdateUserInfo(string userName, string emailAddress, bool passwordChanged, string password,
                                          int preferredDateFormat, int amountDisplayDecimals, DateTime userStartDate, DateTime userEndDate, int firstDayOfWeek)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("UpdateUserInfo2");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;

            cmd.Parameters.Add("emailAddress", SqlDbType.NVarChar);
            cmd.Parameters["emailAddress"].Value = emailAddress;

            cmd.Parameters.Add("passwordChanged", SqlDbType.Bit);
            cmd.Parameters["passwordChanged"].Value = passwordChanged;

            cmd.Parameters.Add("newPassword", SqlDbType.NVarChar);
            if (passwordChanged)
            {
                cmd.Parameters["newPassword"].Value = GetHashedPassword(password);
            }
            else
            {
                cmd.Parameters["newPassword"].Value = DBNull.Value;
            }

            cmd.Parameters.Add("preferredDateFormat", SqlDbType.Int);
            cmd.Parameters["preferredDateFormat"].Value = preferredDateFormat;

            cmd.Parameters.Add("amountDisplayDecimals", SqlDbType.Int);
            cmd.Parameters["amountDisplayDecimals"].Value = amountDisplayDecimals;

            cmd.Parameters.Add("userStartDate", SqlDbType.SmallDateTime);
            cmd.Parameters["userStartDate"].Value = userStartDate;

            cmd.Parameters.Add("userEndDate", SqlDbType.SmallDateTime);
            cmd.Parameters["userEndDate"].Value = userEndDate;

            cmd.Parameters.Add("weekStartDay", SqlDbType.Int);
            cmd.Parameters["weekStartDay"].Value = firstDayOfWeek;


            try
            {
                cmd.Connection.Open();

                int numRowsUpdated = cmd.ExecuteNonQuery();
                if (numRowsUpdated == 1)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            finally
            {
                cmd.Connection.Close();
            }
        }

        public static bool ResetUserPassword(string userName, string emailAddress)
        {
            string newPassword = Membership.GeneratePassword(10, 0);
            string hashedPwd = GetHashedPassword(newPassword);

            SqlCommand cmd = DbUtil.GetProcedureCommand("ResetUserPassword");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;
            cmd.Parameters.Add("emailAddress", SqlDbType.NVarChar);
            cmd.Parameters["emailAddress"].Value = emailAddress;
            cmd.Parameters.Add("newPassword", SqlDbType.NVarChar);
            cmd.Parameters["newPassword"].Value = hashedPwd;

            try
            {
                cmd.Connection.Open();

                int numRowsUpdated = cmd.ExecuteNonQuery();
                if (numRowsUpdated == 1)
                {
                    //Send Email to User
                    var sb = new StringBuilder();
                    sb.Append("Your ExpenseView.com password has been reset to: ");
                    sb.Append(newPassword);
                    sb.Append("<br /><br />");
                    sb.Append(
                        "Once you login, you can change your password by selecting the 'Edit User Info' link on the page header.<br /><br />");
                    sb.Append(
                        "Go to <a href='http://www.expenseview.com/userLogin.aspx'>http://www.expenseview.com/userLogin.aspx</a> to login.");
                    sb.Append("<br /><br />Regards,<br />ExpenseView Admin");

                    MailSender.SendEmail(emailAddress, "ExpenseView.com Password Reset", sb.ToString());

                    return true;
                }
                else
                {
                    return false;
                }
            }
            finally
            {
                cmd.Connection.Close();
            }
        }

        public static bool EmailUsername(string emailAddress)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("GetUserNameFromEmail");

            //Define Input Parameters
            cmd.Parameters.Add("emailAddress", SqlDbType.NVarChar);
            cmd.Parameters["emailAddress"].Value = emailAddress;

            try
            {
                cmd.Connection.Open();
                object result = cmd.ExecuteScalar();

                if (result != null)
                {
                    string userName = Convert.ToString(result);

                    var sb = new StringBuilder();
                    sb.Append("Your ExpenseView.com username is: ");
                    sb.Append(userName);
                    sb.Append("<br /><br />");
                    sb.Append(
                        "Go to <a href='http://www.expenseview.com/userLogin.aspx'>http://www.expenseview.com/userLogin.aspx</a> to login.");
                    sb.Append("<br /><br />Regards,<br />ExpenseView Admin");

                    MailSender.SendEmail(emailAddress, "ExpenseView.com Username Assitance", sb.ToString());

                    return true;
                }
                else
                {
                    return false;
                }
            }
            finally
            {
                cmd.Connection.Close();
            }
        }

        public static AccessorResult LoginUser(string userName, string hashedPwd)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("LoginUser");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;
            cmd.Parameters.Add("pwd", SqlDbType.NVarChar);
            cmd.Parameters["pwd"].Value = hashedPwd;

            try
            {
                cmd.Connection.Open();
                int updateCount = cmd.ExecuteNonQuery();

                if (updateCount == 1)
                {
                    return new AccessorResult(1);
                }
                else
                {
                    return new AccessorResult(-1);
                }
            }
            catch (SqlException se)
            {
                return new AccessorResult(se.Number);
            }
            finally
            {
                cmd.Connection.Close();
            }
        }

        public static AccessorResult CreateUser(string userName, string password, string emailAddress,
                                                int preferredDateFormat, int amountDisplayDecimals, DateTime userStartDate, DateTime userEndDate, int firstDayOfWeek)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("InsertUser2");

            string hashedPwd = GetHashedPassword(password);

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;
            cmd.Parameters.Add("password", SqlDbType.NVarChar);
            cmd.Parameters["password"].Value = hashedPwd;
            cmd.Parameters.Add("emailAddress", SqlDbType.NVarChar);
            cmd.Parameters["emailAddress"].Value = emailAddress;
            cmd.Parameters.Add("preferredDateFormat", SqlDbType.Int);
            cmd.Parameters["preferredDateFormat"].Value = preferredDateFormat;
            cmd.Parameters.Add("amountDiplayDecimals", SqlDbType.Int);
            cmd.Parameters["amountDiplayDecimals"].Value = amountDisplayDecimals;

            cmd.Parameters.Add("userStartDate", SqlDbType.SmallDateTime);
            cmd.Parameters["userStartDate"].Value = userStartDate;

            cmd.Parameters.Add("userEndDate", SqlDbType.SmallDateTime);
            cmd.Parameters["userEndDate"].Value = userEndDate;

            cmd.Parameters.Add("weekStartDay", SqlDbType.Int);
            cmd.Parameters["weekStartDay"].Value = firstDayOfWeek;

            cmd.Parameters.Add("userID", SqlDbType.Int).Direction = ParameterDirection.Output;
            cmd.Parameters["userID"].Direction = ParameterDirection.Output;

            try
            {
                cmd.Connection.Open();
                cmd.ExecuteNonQuery();
                return new AccessorResult(1);
            }
            catch (SqlException se)
            {
                return new AccessorResult(se.Number);
            }
            finally
            {
                cmd.Connection.Close();
            }
        }

        private static string GetHashedPassword(string password)
        {
            return FormsAuthentication.HashPasswordForStoringInConfigFile(password, "SHA1");
        }

        public static bool IsValidEmailAddress(string sEmail)
        {
            if ((sEmail == null) || (sEmail.Trim().Length ==0))
            {
                return false;
            }
            else
            {
                string strRegex = @"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}" + @"\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\" + @".)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$";
                return Regex.IsMatch(sEmail,strRegex,RegexOptions.IgnorePatternWhitespace);
            }
        }

        public static bool IsValidUserName(string userName)
        {
            var objAlphaNumericPattern = new Regex(@"[^a-zA-Z0-9\\P{_}\\P{.}]");
            return objAlphaNumericPattern.IsMatch(userName);
        }
    }
}