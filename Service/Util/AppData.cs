using System;

namespace ExpenseView.Service.Util
{
    /// <summary>
    /// A class that holds data that is initialized as part of the Global.asax Application load.  This class is meant to hold data that will 
    /// not change and is needed by various modules in the application.  
    /// </summary>
    public class AppData
    {
        //Holds the settings for the Trend Charts found within the application
        //Settings fils are located in the Charts folder
        public static string ExpenseTrendChartSettings;
        public static string IncomeTrendChartSettings;
    }
}