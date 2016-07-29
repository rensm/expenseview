namespace ExpenseView.Service.DataObject
{
    /// <summary>
    /// SubCategory represents a further breakdown of cateogories
    /// </summary>
    public class SubCategory
    {
        public int SubCategoryID { get; set; }

        public int CategoryID { get; set; }

        public string Name { get; set; }

        public decimal CustomDateAmount { get; set; }

        public decimal UserDateAmount { get; set; }

        public decimal YearAmount { get; set; }

        public decimal PriorMonthAmount { get; set; }

        public decimal MonthAmount { get; set; }

        public decimal PriorWeekAmount { get; set; }

        public decimal WeekAmount { get; set; }

        public decimal TotalAmount { get; set; }

        public string Color { get; set; }
    }
}