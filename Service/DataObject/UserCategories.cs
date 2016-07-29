using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace ExpenseView.Service.DataObject
{
    [DataContract]
    public class UserCategories
    {
        [DataMember]
        public Category[] ExpenseCategories { get; set; }

        [DataMember]
        public Category[] IncomeCategories { get; set; }

    }
}