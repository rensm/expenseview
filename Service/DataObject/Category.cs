using System.Collections.Generic;

namespace ExpenseView.Service.DataObject
{
    /// <summary>
    /// A Category groups together a set of Transactions.  
    /// A Category can be either an Income Category or Expense Category.
    /// </summary>
    public class Category
    {
        private readonly List<SubCategory> _subCategoryList;

        public Category()
        {
            _subCategoryList = new List<SubCategory>();
        }

        public int CategoryID { get; set; }

        public string CategoryType { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public SubCategory[] SubCategories
        {
            get
            {
                if (_subCategoryList.Count > 0)
                {
                    return _subCategoryList.ToArray();
                }
                else
                {
                    return null;
                }
            }
            set { }
        }

        public decimal YearBudget { get; set; }

        public decimal MonthBudget { get; set; }

        public decimal WeekBudget { get; set; }

        public decimal UserDateBudget { get; set; }

        public decimal CustomDateAmount { get; set; }

        public decimal UserDateAmount { get; set; }

        public decimal YearAmount { get; set; }

        public decimal PriorMonthAmount { get; set; }

        public decimal MonthAmount { get; set; }

        public decimal PriorWeekAmount { get; set; }

        public decimal WeekAmount { get; set; }

        public decimal TotalAmount { get; set; }

        public string Color { get; set; }

        public void AddSubCategory(SubCategory subCategory)
        {
            _subCategoryList.Add(subCategory);
        }
    }
}