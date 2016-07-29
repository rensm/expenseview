<%@ Application Language="C#" %>

<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="ExpenseView.Service.Util" %>
<%@ Import Namespace="ExpenseView" %>
<%@ Import Namespace="Quartz" %>
<%@ Import Namespace="Quartz.Impl" %>
<script runat="server">


        private void Application_Start(object sender, EventArgs e)
        {
            try
            {
                //Load Expense Trend chart settings
                string expTrendsSettingsPath = Server.MapPath("~/Charts/expTrends_settings.xml");
                if (File.Exists(expTrendsSettingsPath))
                {
                    using (StreamReader sr = new StreamReader(expTrendsSettingsPath))
                    {
                        AppData.ExpenseTrendChartSettings = sr.ReadToEnd();
                    }
                }

                //Load Income Trend chart Settings
                string incomeTrendsSettingsPath = Server.MapPath("~/Charts/incomeTrends_settings.xml");
                if (File.Exists(incomeTrendsSettingsPath))
                {
                    using (StreamReader sr = new StreamReader(incomeTrendsSettingsPath))
                    {
                        AppData.IncomeTrendChartSettings = sr.ReadToEnd();
                    }
                }

            }
            catch (Exception)
            {
                ///TODO: Log exception in loading AppData Properties
                Console.WriteLine("The process failed: {0}", e.ToString());
            }

            //Schedule the Quart.Net Job to run every night at 2:15am GMT
            //It will get all recurring trans and make the appropriate inserts each day as needed
            ISchedulerFactory schedFact = new StdSchedulerFactory();

            // get a scheduler
            IScheduler sched = schedFact.GetScheduler();
            sched.Start();
            
            // construct job info
            IJobDetail jobDetail = JobBuilder.Create<RecurrTransJob>().WithIdentity("recurrTransJob", "group1").Build();
            
            ITrigger trigger = (ICronTrigger)TriggerBuilder.Create()
                                         .WithIdentity("recurTransTrigger", "group1")
                                         .WithCronSchedule("0 15 2 * * ?") // Run every day at 2:15 AM GMT
                                      //   .WithCronSchedule("0 0/2 * * * ?") // Runs every 2 mins (Testing purposes)
                                         .Build();

            // schedule the job for execution
            sched.ScheduleJob(jobDetail, trigger);
        }

        private void Application_End(object sender, EventArgs e)
        {
            //  Code that runs on application shutdown
        }

        private void Application_Error(object sender, EventArgs e)
        {
            // Code that runs when an unhandled error occurs
        }

        private void Session_Start(object sender, EventArgs e)
        {
            // Code that runs when a new session is started
        }

        private void Session_End(object sender, EventArgs e)
        {
            // Code that runs when a session ends. 
            // Note: The Session_End event is raised only when the sessionstate mode
            // is set to InProc in the Web.config file. If session mode is set to StateServer 
            // or SQLServer, the event is not raised.
        }

</script>
