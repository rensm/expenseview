using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Globalization;

namespace ExpenseView.Service.DataMapper
{
    public class UserDataMapper
    {
        private const string DEFAULT_DATE_FORMAT = "yyyy-MM-dd";

        /// <summary>
        /// Gets the preferred date format in string form
        /// </summary>
        /// <param name="userDateFormat"></param>
        /// <returns></returns>
        private static string GetUserDateFormatString(int userDateFormat)
        {
            string dateFormat = String.Empty;
            switch (userDateFormat)
            {
                case 1:
                    dateFormat = "yyyy-MM-dd";
                    break;
                case 2:
                    dateFormat = "MM/dd/yyyy";
                    break;
                case 3:
                    dateFormat = "dd/MM/yyyy";
                    break;
            }

            return dateFormat;
        }

        /// <summary>
        /// Converts the date value from the user preferred format to the default (yyyy-MM-dd) format
        /// </summary>
        /// <param name="dateValue"></param>
        /// <param name="userPreferredFormat"></param>
        /// <returns></returns>
        public static string GetDefaultDateFromUserPreferredFormat(string dateValue, int userPreferredFormat)
        {
            //Parse Date based on user preferred format
            string userDateFormat = GetUserDateFormatString(userPreferredFormat);
            CultureInfo provider = CultureInfo.InvariantCulture;
            DateTime date = DateTime.ParseExact(dateValue, userDateFormat, provider);

            //then convert to Default Format
            return date.ToString(DEFAULT_DATE_FORMAT);
        }

        /// <summary>
        /// Converts the date value from the default (yyyy-MM-dd) format to user preferred format
        /// </summary>
        /// <param name="dateValue"></param>
        /// <param name="userPreferredFormat"></param>
        /// <returns></returns>
        public static string GetUserPreferredDateFromDefaultDate(string dateValue, int userPreferredFormat)
        {
            //Parse Date based on Default date format
            CultureInfo provider = CultureInfo.InvariantCulture;
            DateTime date = DateTime.ParseExact(dateValue, DEFAULT_DATE_FORMAT, provider);


            //then convert to user preferred format
            string userDateFormat = GetUserDateFormatString(userPreferredFormat);
            return date.ToString(userDateFormat);
        }

    }
}