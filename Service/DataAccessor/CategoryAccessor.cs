using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using ExpenseView.Service.DataObject;
using ExpenseView.Service.Util;

/// <summary>
/// Summary description for ExpenseCategoryUtility
/// </summary>
namespace ExpenseView.Service.DataAccessor
{
    public class CategoryAccessor
    {
        private static void SetDecimalParam(SqlParameter param, string fieldValue)
        {
            if (fieldValue != null && fieldValue.Length > 0)
            {
                param.Value = Convert.ToDouble(fieldValue);
            }
            else
            {
                param.Value = DBNull.Value;
            }
        }

        private static CategoryMonthAmountHolder[] CreatePastTwelveCategoryMonths(string userDate)
        {
            DateTime startDate = DateTime.Parse(userDate);
            var catMonthHolderArray = new CategoryMonthAmountHolder[12];

            //Creates the Array of CategoryMonths from 11 months ago to the present month
            for (int i = 0; i < 12; i++)
            {
                var catMonth = new CategoryMonthAmount();

                //Get the prior month starting from 11 months ago
                DateTime newDate = startDate.AddMonths(-11 + i);

                catMonth.Month = newDate.Month;
                catMonth.Year = newDate.Year;

                //Creates Month Like "Jan, Feb, etc."
                catMonth.MonthName = newDate.ToString("MMM");

                catMonthHolderArray[i].SetCategoryMonthAmount(catMonth);
            }

            return catMonthHolderArray;
        }

        public static CategoryMonthAmount[] GetCategoryTransTrend(string userName, string catType, string userDate)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("GetTransTrend");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;

            cmd.Parameters.Add("categoryType", SqlDbType.Char);
            cmd.Parameters["categoryType"].Value = catType;

            cmd.Parameters.Add("userDate", SqlDbType.DateTime);
            cmd.Parameters["userDate"].Value = userDate;


            CategoryMonthAmountHolder[] catMonthHolderArray = CreatePastTwelveCategoryMonths(userDate);

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
                            var categoryId = (int) reader["CategoryID"];

                            catMonthHolderArray[0].AddAmount(categoryId, GetMonthValue(reader, "ElevenMonthBefore"));
                            catMonthHolderArray[1].AddAmount(categoryId, GetMonthValue(reader, "TenMonthBefore"));
                            catMonthHolderArray[2].AddAmount(categoryId, GetMonthValue(reader, "NineMonthBefore"));
                            catMonthHolderArray[3].AddAmount(categoryId, GetMonthValue(reader, "EightMonthBefore"));
                            catMonthHolderArray[4].AddAmount(categoryId, GetMonthValue(reader, "SevenMonthBefore"));
                            catMonthHolderArray[5].AddAmount(categoryId, GetMonthValue(reader, "SixMonthBefore"));
                            catMonthHolderArray[6].AddAmount(categoryId, GetMonthValue(reader, "FiveMonthBefore"));
                            catMonthHolderArray[7].AddAmount(categoryId, GetMonthValue(reader, "FourMonthBefore"));
                            catMonthHolderArray[8].AddAmount(categoryId, GetMonthValue(reader, "ThreeMonthBefore"));
                            catMonthHolderArray[9].AddAmount(categoryId, GetMonthValue(reader, "TwoMonthBefore"));
                            catMonthHolderArray[10].AddAmount(categoryId, GetMonthValue(reader, "OneMonthBefore"));
                            catMonthHolderArray[11].AddAmount(categoryId, GetMonthValue(reader, "ZeroMonthBefore"));
                        }
                    }
                }

                //Convert From Holder to Regular CategoryMonthAmount Array
                var catMonthAmountArray = new CategoryMonthAmount[12];
                for (int i = 0; i < 12; i++)
                {
                    catMonthAmountArray[i] = catMonthHolderArray[i].GetCategoryMonthAmount();
                }

                return catMonthAmountArray;
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

        private static int GetMonthValue(IDataReader reader, string columnName)
        {
            return (reader[columnName] == DBNull.Value) ? 0 : (int) reader[columnName];
        }


        public static Category[] GetCustomDateCategoryArray(string userName, string catType, string startDate,
                                                            string endDate)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("GetCustomDateCategorySummary");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;

            cmd.Parameters.Add("categoryType", SqlDbType.Char);
            cmd.Parameters["categoryType"].Value = catType;

            cmd.Parameters.Add("startDate", SqlDbType.DateTime);
            cmd.Parameters["startDate"].Value = startDate;

            cmd.Parameters.Add("endDate", SqlDbType.DateTime);
            cmd.Parameters["endDate"].Value = endDate;

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
                                cat.CustomDateAmount = reader.GetDecimal(2);
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


        public static int InsertCategory(string userName, Category cat)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("InsertCategory2");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;
            cmd.Parameters.Add("categoryType", SqlDbType.Char);
            cmd.Parameters["categoryType"].Value = cat.CategoryType;
            cmd.Parameters.Add("catName", SqlDbType.NVarChar, 50);
            cmd.Parameters["catName"].Value = cat.Name;

            cmd.Parameters.Add("userDateBudget", SqlDbType.Money);
            cmd.Parameters["userDateBudget"].Precision = 2;
            cmd.Parameters["userDateBudget"].Value = cat.UserDateBudget;

            cmd.Parameters.Add("yearBudget", SqlDbType.Money);
            cmd.Parameters["yearBudget"].Precision = 2;
            cmd.Parameters["yearBudget"].Value = cat.YearBudget;

            cmd.Parameters.Add("monthBudget", SqlDbType.Money);
            cmd.Parameters["monthBudget"].Precision = 2;
            cmd.Parameters["monthBudget"].Value = cat.MonthBudget;

            cmd.Parameters.Add("weekBudget", SqlDbType.Money);
            cmd.Parameters["weekBudget"].Precision = 2;
            cmd.Parameters["weekBudget"].Value = cat.WeekBudget;

            cmd.Parameters.Add("description", SqlDbType.NVarChar);
            cmd.Parameters["description"].Value = cat.Description;

            cmd.Parameters.Add("color", SqlDbType.Char);
            cmd.Parameters["color"].Value = cat.Color;

            //Define Output Parameter
            cmd.Parameters.Add("categoryID", SqlDbType.Int).Direction = ParameterDirection.Output;
            cmd.Parameters["categoryID"].Direction = ParameterDirection.Output;

            try
            {
                cmd.Connection.Open();
                cmd.ExecuteNonQuery();
            }
            catch
            {
                throw;
            }
            finally
            {
                cmd.Connection.Close();
            }

            int categoryID = Convert.ToInt32(cmd.Parameters["categoryID"].Value);

            return categoryID;
        }

        public static int InsertSubCategory(string userName, SubCategory subCategory)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("InsertSubCategory");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;
            cmd.Parameters.Add("categoryID", SqlDbType.Int);
            cmd.Parameters["categoryID"].Value = subCategory.CategoryID;
            cmd.Parameters.Add("subCategoryName", SqlDbType.NVarChar, 50);
            cmd.Parameters["subCategoryName"].Value = subCategory.Name;
            cmd.Parameters.Add("subCategoryColor", SqlDbType.Char);
            cmd.Parameters["subCategoryColor"].Value = subCategory.Color;

            //Define Output Parameter
            cmd.Parameters.Add("subCategoryID", SqlDbType.Int).Direction = ParameterDirection.Output;
            cmd.Parameters["subCategoryID"].Direction = ParameterDirection.Output;

            try
            {
                cmd.Connection.Open();
                cmd.ExecuteNonQuery();
            }
            catch
            {
                throw;
            }
            finally
            {
                cmd.Connection.Close();
            }

            int subCategoryID = Convert.ToInt32(cmd.Parameters["subCategoryID"].Value);

            return subCategoryID;
        }

        public static int UpdateSubCategory(string userName, SubCategory subCategory)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("UpdateSubCategory2");

            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;
            cmd.Parameters.Add("subCategoryID", SqlDbType.Int);
            cmd.Parameters["subCategoryID"].Value = subCategory.SubCategoryID;
            cmd.Parameters.Add("subCategoryName", SqlDbType.NVarChar);
            cmd.Parameters["subCategoryName"].Value = subCategory.Name;
            cmd.Parameters.Add("color", SqlDbType.Char);
            cmd.Parameters["color"].Value = subCategory.Color;

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

        public static int UpdateCategory(string userName, Category cat)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("UpdateCategory2");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;
            cmd.Parameters.Add("categoryID", SqlDbType.Int);
            cmd.Parameters["categoryID"].Value = cat.CategoryID;
            cmd.Parameters.Add("categoryType", SqlDbType.Char);
            cmd.Parameters["categoryType"].Value = cat.CategoryType;
            cmd.Parameters.Add("catName", SqlDbType.NVarChar);
            cmd.Parameters["catName"].Value = EncodingUtility.ConvertFromUtf8ToUnicode(cat.Name);
            cmd.Parameters.Add("color", SqlDbType.Char);
            cmd.Parameters["color"].Value = cat.Color;


            cmd.Parameters.Add("userDateBudget", SqlDbType.Money);
            cmd.Parameters["userDateBudget"].Precision = 2;
            cmd.Parameters["userDateBudget"].Value = cat.UserDateBudget;

            cmd.Parameters.Add("yearBudget", SqlDbType.Money);
            cmd.Parameters["yearBudget"].Precision = 2;
            cmd.Parameters["yearBudget"].Value = cat.YearBudget;

            cmd.Parameters.Add("monthBudget", SqlDbType.Money);
            cmd.Parameters["monthBudget"].Precision = 2;
            cmd.Parameters["monthBudget"].Value = cat.MonthBudget;

            cmd.Parameters.Add("weekBudget", SqlDbType.Money);
            cmd.Parameters["weekBudget"].Precision = 2;
            cmd.Parameters["weekBudget"].Value = cat.WeekBudget;

            cmd.Parameters.Add("description", SqlDbType.NVarChar);
            cmd.Parameters["description"].Value = EncodingUtility.ConvertFromUtf8ToUnicode(cat.Description);

            try
            {
                cmd.Connection.Open();
                cmd.ExecuteNonQuery();
                return 1;
            }
            catch (Exception)
            {
                //TODO: Log Exception
                return -1;
            }
            finally
            {
                cmd.Connection.Close();
            }
        }

        public static int DeleteCategory(string userName, int catID)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("DeleteCategory");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;
            cmd.Parameters.Add("categoryID", SqlDbType.Int);
            cmd.Parameters["categoryID"].Value = catID;

            try
            {
                cmd.Connection.Open();
                cmd.ExecuteNonQuery();
                return AccessorResult.SUCCESS_TRANSACTION;
            }
            catch
            {
                return AccessorResult.FAILED_TRANSACTION;
            }
            finally
            {
                cmd.Connection.Close();
            }
        }

        public static int DeleteSubCategory(string userName, int subCategoryID)
        {
            SqlCommand cmd = DbUtil.GetProcedureCommand("DeleteSubCategory");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;
            cmd.Parameters.Add("subCategoryID", SqlDbType.Int);
            cmd.Parameters["subCategoryID"].Value = subCategoryID;

            try
            {
                cmd.Connection.Open();
                cmd.ExecuteNonQuery();
                return AccessorResult.SUCCESS_TRANSACTION;
            }
            catch
            {
                //TODO: Log Exception
                return AccessorResult.FAILED_TRANSACTION;
            }
            finally
            {
                cmd.Connection.Close();
            }
        }

        #region Nested type: CategoryMonthAmountHolder

        /// <summary>
        /// Summary description for CategoryMonthAmountHolder
        /// </summary>
        private class CategoryMonthAmountHolder
        {
            private readonly List<CategoryAmount> catAmountList = new List<CategoryAmount>();
            private CategoryMonthAmount catMonthAmount;

            public void AddAmount(int catId, int amount)
            {
                var catAmount = new CategoryAmount();
                catAmount.CategoryID = catId;
                catAmount.Amount = amount;

                catAmountList.Add(catAmount);
            }

            public void SetCategoryMonthAmount(CategoryMonthAmount categoryMonthAmount)
            {
                catMonthAmount = categoryMonthAmount;
            }

            public CategoryMonthAmount GetCategoryMonthAmount()
            {
                if (catMonthAmount != null)
                {
                    catMonthAmount.CategoryAmountArray = catAmountList.ToArray();
                }

                return catMonthAmount;
            }
        }

        #endregion
    }
}