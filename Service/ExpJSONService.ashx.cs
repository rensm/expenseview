using System;
using System.Web;
using Jayrock.Json;
using Jayrock.JsonRpc;
using Jayrock.JsonRpc.Web;
using Newtonsoft.Json;

using ExpenseView.Service.DataAccessor;
using ExpenseView.Service.DataObject;
using OpenFlash;

namespace ExpenseView.Service
{
    public class ExpJSONService : JsonRpcHandler
    {
        private int NOT_AUTHENTICATED_RESULTCODE = -21;

        [JsonRpcMethod("GetUserSummary", Idempotent = true)]
        public string GetUserSummary(DateTime userDate)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return NOT_AUTHENTICATED_RESULTCODE.ToString();
            }

            //DateTime userDate = new DateTime(int.Parse(yearString), int.Parse(monthString), int.Parse(dateString));
            UserSummary userSummary = UserInfoAccessor.GetUserSummary(User.Identity.Name, userDate);

            return JavaScriptConvert.SerializeObject(userSummary);
        }

        [JsonRpcMethod("DeleteCategory", Idempotent = false)]
        public int DeleteCategory(int categoryID)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return NOT_AUTHENTICATED_RESULTCODE;
            }

            return CategoryAccessor.DeleteCategory(User.Identity.Name, categoryID);
        }

        [JsonRpcMethod("InsertCategory", Idempotent = false)]
        public int InsertCategory(Category category)
        {
            return CategoryAccessor.InsertCategory(User.Identity.Name, category);
        }

        [JsonRpcMethod("UpdateCategory", Idempotent = false)]
        public int UpdateCategory(Category category)
        {
            return CategoryAccessor.UpdateCategory(User.Identity.Name, category);
        }


        [JsonRpcMethod("InsertSubCategory", Idempotent = false)]
        public int InsertSubCategory(SubCategory subCategory)
        {
            return CategoryAccessor.InsertSubCategory(User.Identity.Name, subCategory);
        }

        [JsonRpcMethod("UpdateSubCategory", Idempotent = false)]
        public int UpdateSubCategory(SubCategory subCategory)
        {
            return CategoryAccessor.UpdateSubCategory(User.Identity.Name, subCategory);
        }

        [JsonRpcMethod("DeleteSubCategory", Idempotent = false)]
        public int DeleteSubCategory(int subCategoryID)
        {
            return CategoryAccessor.DeleteSubCategory(User.Identity.Name, subCategoryID);
        }

        [JsonRpcMethod("InsertTrans", Idempotent = false)]
        public int InsertTrans(Transaction trans)
        {
            return TransactionAccessor.InsertTrans(User.Identity.Name, trans);
        }

        [JsonRpcMethod("DeleteTrans", Idempotent = false)]
        public int DeleteTrans(int transID)
        {
            return TransactionAccessor.DeleteTrans(User.Identity.Name, transID);
        }

        [JsonRpcMethod("UpdateTrans", Idempotent = false)]
        public int UpdateTrans(Transaction trans)
        {
            return TransactionAccessor.UpdateTrans(User.Identity.Name, trans);
        }

        [JsonRpcMethod("SearchTrans", Idempotent = false)]
        public string SearchTrans(string startDate, string endDate, string categoryType, string catIDString, string amountOperator, string amount)
        {
            try
            {
                string dateFormat;
                Transaction[] transArray = TransactionAccessor.SearchTrans(User.Identity.Name, categoryType, startDate, endDate, catIDString, amountOperator, amount, out dateFormat);

                if (transArray != null)
                {
                    return JavaScriptConvert.SerializeObject(transArray);
                }
                else
                {
                    return "0";
                }
            }
            catch
            {
                return "-1";
            }
        }

        [JsonRpcMethod("GetTransPieGraphForDefaultDateRange", Idempotent = false)]
        public string GetTransPieGraphForDefaultDateRange(string defaultDateRange, string categoryType, DateTime currentUserDate)
        {
            try
            {
                OpenFlashChart ofc = GraphAccessor.GetTransPieChartForDefaultDateRange(User.Identity.Name, categoryType, currentUserDate, defaultDateRange);

                if (ofc != null)
                {
                    return ofc.ToString();
                }
                else
                {
                    //No Data Found
                    return "0";
                }
            }
            catch
            {
                return "-1";
            }
        }

        [JsonRpcMethod("GetTransPieGraphForCustomDateRange", Idempotent = false)]
        public string GetTransPieGraphForCustomDateRange(string categoryType, DateTime startDate, DateTime endDate)
        {
            try
            {
                OpenFlashChart ofc = GraphAccessor.GetPieChartForDateRange(User.Identity.Name, categoryType, startDate, endDate);

                if (ofc != null)
                {
                    return ofc.ToString();
                }
                else
                {
                    //No Data Found
                    return "0";
                }
            }
            catch
            {
                return "-1";
            }
        }

    }
}
