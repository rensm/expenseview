namespace ExpenseView.Service.DataObject
{
    using System;

    public class UserInfo
    {
        public string Email { get; set; }

        /// <summary>
        /// 1 = YYYY-MM-dd
        /// 2 = MM/dd/YYYY
        /// 3 = dd/MM/YYYY
        /// </summary>
        public int PreferredDateFormat { get; set; }

        public int AmountDisplayDecimals { get; set; }

        /// <summary>
        /// 0 = Sunday
        /// 1 = Monday
        /// </summary>
        public int WeekStartDay { get; set; }

        public DateTime UserStartDate { get; set; }

        public DateTime UserEndDate { get; set; }
    }
}