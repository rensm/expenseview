using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using ExpenseView.Service.DataAccessor;
using System.Web.Security;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using ExpenseView.Service.DataObject;

namespace ExpenseView.Service
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "ExpMobileService" in code, svc and config file together.
    public class ExpMobileService : IExpMobileService
    {

        public UserInfo LoginUser(string username, string password)
        {
            string hashedPwd = FormsAuthentication.HashPasswordForStoringInConfigFile(password, "SHA1");
            AccessorResult result = UserInfoAccessor.LoginUser(username, hashedPwd);
            
            if (result.IsSuccess())
            {
                var returnObject = UserInfoAccessor.GetUserInfo(username);
 
                return returnObject;
            }
            return null;
        }

        public UserInfo IsLoggedIn(string username, string password)
        {
            string hashedPwd = FormsAuthentication.HashPasswordForStoringInConfigFile(password, "SHA1");
            AccessorResult result = UserInfoAccessor.LoginUser(username, hashedPwd);

            if (result.IsSuccess())
            {
                var returnObject = UserInfoAccessor.GetUserInfo(username);

                return returnObject;
            }
            return null;
        }

    }
}
