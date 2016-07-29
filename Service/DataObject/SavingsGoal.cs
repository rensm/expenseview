using System.Runtime.Serialization;

namespace ExpenseView.Service.DataObject
{
    [DataContract]
    public class SavingsGoal
    {
        [DataMember]
        public string YearGoal { get; set; }

        [DataMember]
        public string MonthGoal { get; set; }

        [DataMember]
        public string WeekGoal { get; set; }
    }
}