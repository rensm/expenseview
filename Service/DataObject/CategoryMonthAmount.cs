using System.Runtime.Serialization;

namespace ExpenseView.Service.DataObject
{
    /// <summary>
    /// Summary description for CategoryMonthAmount
    /// </summary>
    [DataContract]
    public class CategoryMonthAmount
    {
        [DataMember]
        public int Month { get; set; }

        [DataMember]
        public int Year { get; set; }

        [DataMember]
        public string MonthName { get; set; }

        [DataMember]
        public CategoryAmount[] CategoryAmountArray { get; set; }
    }

    [DataContract(Namespace = "http://expenseview.com/")]
    public class CategoryAmount
    {
        [DataMember]
        public int CategoryID { get; set; }

        [DataMember]
        public int Amount { get; set; }
    }
}