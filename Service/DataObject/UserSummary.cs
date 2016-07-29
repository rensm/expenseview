using System.Runtime.Serialization;

namespace ExpenseView.Service.DataObject
{
    using System;

    [DataContract]
    public class UserSummary
    {
        [DataMember]
        public string Email { get; set; }


        public int PreferredDateFormat { get; set; }

        public int AmountDisplayDecimals { get; set; }

        public int UserWeekStart { get; set; }

        public string UserStartDate { get; set; }

        public string UserEndDate { get; set; }

        [DataMember]
        public Category[] ExpenseCategories { get; set; }

        [DataMember]
        public Category[] IncomeCategories { get; set; }

        [DataMember]
        public Transaction[] RecentExpenses { get; set; }

        [DataMember]
        public Transaction[] RecentIncome { get; set; }
    }
}