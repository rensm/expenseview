using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Sql;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Text;

using am.Charts;
using OpenFlash;
using OpenFlash.Charts;

using ExpenseView.Service.Util;

namespace ExpenseView.Service.DataAccessor
{
    public class GraphAccessor
    {

        public static string GetSomeChart()
        {
            // We will generate random values everyt time this page is requested
            Random rnd = new Random();

            
            PieChart pc = new PieChart();
            pc.Items.Add(new PieChartDataItem("Men", rnd.Next(30, 70)));
            pc.Items.Add(new PieChartDataItem("Women", rnd.Next(30, 70)));
            

            return pc.GetDataXml().OuterXml;
        }

        public static OpenFlashChart GetPieChartForDateRange(string userName, string categoryType, DateTime startDate, DateTime endDate)
        {
            OpenFlashChart chart = null;

            SqlCommand cmd = DbUtil.GetProcedureCommand("GetTransSummaryForDateRange");
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters[0].Value = userName;
            cmd.Parameters.Add("categoryType", SqlDbType.Char);
            cmd.Parameters[1].Value = categoryType;
            cmd.Parameters.Add("startDate", SqlDbType.DateTime);
            cmd.Parameters[2].Value = startDate;
            cmd.Parameters.Add("endDate", SqlDbType.DateTime);
            cmd.Parameters[3].Value = endDate;

            try
            {
                cmd.Connection.Open();

                //StoredProcedure returns the following ResultSets:
                //Category Summary --> CategoryID, Name, Color, YearAmount, YearPercentage
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    chart = GetChartFromDataReader(reader);
                }
            }
            catch (Exception e)
            {
                string msg = e.Message;
            }
            finally
            {
                cmd.Connection.Close();
            }

            return chart;
        }

        public static OpenFlashChart GetPieChartForAllTime(string userName, string categoryType)
        {
            OpenFlashChart chart = null;

            SqlCommand cmd = DbUtil.GetProcedureCommand("GetTransSummaryForAllTime");
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters[0].Value = userName;
            cmd.Parameters.Add("categoryType", SqlDbType.Char);
            cmd.Parameters[1].Value = categoryType;

            try
            {
                cmd.Connection.Open();

                //StoredProcedure returns the following ResultSets:
                //Category Summary --> CategoryID, Name, Color, YearAmount, YearPercentage
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    chart = GetChartFromDataReader(reader);
                }
            }
            catch (Exception e)
            {
                string msg = e.Message;
            }
            finally
            {
                cmd.Connection.Close();
            }

            return chart;
        }

        public static OpenFlashChart GetTransPieChartForDefaultDateRange(string userName, string categoryType, DateTime userDate, string dateRange)
        {
            
            if(dateRange == "All Time")
            {
                return GetPieChartForAllTime(userName, categoryType);
            }

            OpenFlashChart chart = null;

            string procedureName = "";
            switch(dateRange)
            {
                case "This Year":
                    procedureName = "GetTransSummaryForYear";
                    break;
                case "This Month":
                    procedureName = "GetTransSummaryForMonth";
                    break;
                case "Last Month":
                    procedureName = "GetTransSummaryForPriorMonth";
                    break;
                case "This Week":
                    procedureName = "GetTransSummaryForWeek";
                    break;
                case "Last Week":
                    procedureName = "GetTransSummaryForPriorWeek";
                    break;
                default: 
                    throw new Exception("Invalid range specified for GetTransPieChart");
            }

            SqlCommand cmd = DbUtil.GetProcedureCommand(procedureName);
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters[0].Value = userName;
            cmd.Parameters.Add("categoryType", SqlDbType.Char);
            cmd.Parameters[1].Value = categoryType;
            cmd.Parameters.Add("userDate", SqlDbType.DateTime);
            cmd.Parameters[2].Value = userDate;

            try
            {
                cmd.Connection.Open();

                //StoredProcedure returns the following ResultSets:
                //Category Summary --> CategoryID, Name, Color, YearAmount, YearPercentage
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    chart = GetChartFromDataReader(reader);
                }
            }
            catch (Exception e)
            {
                string msg = e.Message;
            }
            finally
            {
                cmd.Connection.Close();
            }

            return chart;
        }


        private static OpenFlashChart GetChartFromDataReader(SqlDataReader reader)
        {
            bool dataFound = false;

            OpenFlashChart chart = new OpenFlashChart();
            chart.Bgcolor = "#FFFFFF";
            chart.Title = new Title("");

            Pie pieChart = new Pie();
            pieChart.Values = new List<PieValue>();
            List<string> sliceColors = new List<string>();
            pieChart.Colours = sliceColors;
            pieChart.Tip = "#label#<br> (#percent#)";
            pieChart.Animate = true;
            pieChart.Fillalpha = 0.4;
            pieChart.Fontsize = 10;

            chart.AddElement(pieChart);

            //Create UserInfo
            while (reader.Read())
            {
                //Only add to Graph if there is a value for year
                if (reader["Amount"] != DBNull.Value)
                {
                    dataFound = true;

                    double categoryAmount = Convert.ToDouble(reader["Amount"]);

                    string categoryName = reader["Name"] as string;
                    string label = string.Format("{0} : {1}", categoryName, categoryAmount);
                    pieChart.Values.Add(new PieValue(categoryAmount, label));
                    sliceColors.Add(reader["Color"] as string);
                }
            }

            if (dataFound)
            {
                return chart;
            }
            else
            {
                return null;
            }

        }

        /// <summary>
        /// Returns date and amount for either all expenses or income transactions in CSV format
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="categoryType">'E' to return Expense or 'I' to return Income</param>
        /// <returns></returns>
        public static string GetTrendChartResponse(string userName, string categoryType)
        {
            string xmlFileResponse;

            if (categoryType.Equals("E"))
            {
                xmlFileResponse = AppData.ExpenseTrendChartSettings;
            }
            else if(categoryType.Equals("I"))
            {
                xmlFileResponse = AppData.IncomeTrendChartSettings;
            }
            else
            {
                throw new Exception("Invalid categoryType specified for method parameter. See method comments for valid values.'");
            }
            

            StringBuilder sb = new StringBuilder();
            string newLine = Environment.NewLine;

            SqlCommand cmd = DbUtil.GetProcedureCommand("GetAllTransDateAndAmount");

            //Define Input Parameters
            cmd.Parameters.Add("userName", SqlDbType.NVarChar);
            cmd.Parameters["userName"].Value = userName;
            cmd.Parameters.Add("categoryType", SqlDbType.Char);
            cmd.Parameters["categoryType"].Value = categoryType;

            try
            {
                cmd.Connection.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader != null)
                    {
                        if (reader.Read())
                        {
                            int userWeekStart = DbUtil.GetIntFromReader(reader, "WeekStartDay");
                            int amountDisplayDecimals = DbUtil.GetIntFromReader(reader, "AmountDisplayDecimals");

                            xmlFileResponse = xmlFileResponse.Replace("###!Digits_After_Decimal###!", amountDisplayDecimals.ToString());
                            xmlFileResponse = xmlFileResponse.Replace("###!First_Week_Day###!", userWeekStart.ToString());
                        }

                        if (reader.NextResult())
                        {
                            while (reader.Read())
                            {
                                string transDate = DbUtil.GetDateTimeFromReader(reader, "TransDate").ToString("yyyy-MM-dd");
                                decimal transAmount = DbUtil.GetDecimalFromReader(reader, "Amount");
                                sb.Append(transDate);
                                sb.Append(",");
                                sb.Append(transAmount);
                                sb.Append(newLine);
                            }

                            xmlFileResponse = xmlFileResponse.Replace("###!CSV_Data###!", sb.ToString());
                        }
                    }
                }
            }
            catch
            {
                ///TODO:  log exception 
                return null;
            }
            finally
            {
                cmd.Connection.Close();
            }

            return xmlFileResponse;
        }


    
    }
}
