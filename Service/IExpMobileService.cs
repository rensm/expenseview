using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Web;
using ExpenseView.Service.DataObject;

namespace ExpenseView.Service
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IExpMobileService" in both code and config file together.
    [ServiceContract]
    public interface IExpMobileService
    {
        /// <summary>
        /// Login user with username and password
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat=WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        UserInfo LoginUser(string username, string password);
    }

    [DataContract]
    public class UserDetails
    {
        [DataMember]
        public string Username { get; set; }
        [DataMember]
        public string Password { get; set; }

        public string ConfirmPassword { get; set; }

        [DataMember]
        public int DateFormat { private get; set; }

        [DataMember]
        public int CurrencyFormat { get; set; }
    }
}
