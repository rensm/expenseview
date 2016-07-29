using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using ExpenseView.Service.DataAccessor;
using ExpenseView.Service.DataObject;

namespace ExpenseView.Service
{
    /// <summary>
    /// Summary description for ExpViewService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class ExpViewService : System.Web.Services.WebService
    {
        /// <summary>
        /// Get all the expense and income categories for the provided username
        /// </summary>
        /// <param name="userName"></param>
        /// <returns>UserCategories</returns>
        [WebMethod]
        public List<CategoryDisplay> GetUserCategories(string categoryType)
        {
            UserCategories categories = null;
            categories = UserInfoAccessor.GetUserCategories(User.Identity.Name);

            if (categoryType == "E")
            {
                return GetCategories(categories.ExpenseCategories);
            }
            else
            {
                return GetCategories(categories.IncomeCategories);
            }
        }

        private List<CategoryDisplay> GetCategories(Category[] categories)
        {
            List<CategoryDisplay> displayCategories = new List<CategoryDisplay>();
            foreach (Category category in categories)
            {
                if (category.SubCategories != null && category.SubCategories.Length > 0)
                {
                    foreach (SubCategory subcategory in category.SubCategories)
                    {
                        string key = category.CategoryID + ":" + subcategory.SubCategoryID;
                        string value = category.Name + " - " + subcategory.Name;

                        displayCategories.Add(new CategoryDisplay { Key = key, Value = value });
                    }
                }
                else
                {
                    CategoryDisplay catDisplay = displayCategories.FirstOrDefault<CategoryDisplay>(x => x.Key == category.CategoryID.ToString());
                    if (catDisplay == null)
                    {
                        displayCategories.Add(new CategoryDisplay { Key = category.CategoryID.ToString(), Value = category.Name });
                    }
                }
            }

            return displayCategories;
        }



    }

    public class CategoryDisplay
    {
        public string Key { get; set; }
        public string Value { get; set; }

    }
}
