using System.Web;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Yahoo.Yui.Compressor;


namespace ExpenseView
{
    /// <summary>
    /// Summary description for JSMinifier1
    /// </summary>
    public class JSMinifier : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string compressedOutput;
            string fileSet = context.Request.QueryString["jsFileSet"];
            bool useCachedJS = false;

            if (fileSet == "Gadget")
            {
                if (useCachedJS && HttpContext.Current.Cache["GadgetJSFiles"] != null)
                {
                    compressedOutput = HttpContext.Current.Cache["GadgetJSFiles"] as string;
                }
                else
                {
                    List<string> jsFiles = GetGadgetJavascriptFiles();

                    StringBuilder stringBuilder = new StringBuilder();
                    foreach (String file in jsFiles)
                    {
                        TextReader reader = new StreamReader(context.Request.MapPath(file));
                        stringBuilder.Append(reader.ReadToEnd());
                    }

                    compressedOutput = JavaScriptCompressor.Compress(stringBuilder.ToString(), true, true, true, false, -1, Encoding.UTF8, System.Globalization.CultureInfo.InvariantCulture);

                    if (useCachedJS)
                    {
                        //Add output to application cache to ensure that it does not need to read in more than once
                        HttpContext.Current.Cache["GadgetJSFiles"] = compressedOutput;
                    }
                }
            }
            else
            {
                if (useCachedJS && HttpContext.Current.Cache["AppJSFiles"] != null)
                {
                    compressedOutput = HttpContext.Current.Cache["AppJSFiles"] as string;
                }
                else
                {

                    List<string> jsFiles = GetAppJavascriptFiles();

                    StringBuilder stringBuilder = new StringBuilder();
                    foreach (String file in jsFiles)
                    {
                        TextReader reader = new StreamReader(context.Request.MapPath(file));
                        stringBuilder.Append(reader.ReadToEnd());
                    }

                    //compressedOutput = JavaScriptCompressor.Compress(stringBuilder.ToString(), true, true, true, false, -1, Encoding.UTF8, System.Globalization.CultureInfo.InvariantCulture);
                    compressedOutput = stringBuilder.ToString();

                    //Add output to application cache to ensure that it does not need to read in more than once
                    if (useCachedJS)
                    {
                        HttpContext.Current.Cache["AppJSFiles"] = compressedOutput;
                    }
                }
            }



            //context.Response.Cache.SetExpires(DateTime.Now.AddDays(30));
            //context.Response.Cache.SetMaxAge(new TimeSpan(30, 0, 0, 0));
            context.Response.Write(compressedOutput);
            context.Response.ContentType = "text/Javascript";
        }


        private List<string> GetGadgetJavascriptFiles()
        {
            List<string> jsFiles = new List<string>();
            jsFiles.Add(@"Client\Lib\JsonServiceProxy.js");
            jsFiles.Add(@"Client\Lib\Json.js");
            jsFiles.Add(@"Client\Lib\date.js");
            jsFiles.Add(@"Client\Utilities\DateUtil.js");
            jsFiles.Add(@"Client\Utilities\FormatFunctions.js");
            jsFiles.Add(@"Client\Utilities\FieldFunctions.js");
            jsFiles.Add(@"Client\Utilities\ValidationFunctions.js");
            jsFiles.Add(@"Client\Utilities\StringBuffer.js");
            jsFiles.Add(@"Client\Data\CategoryData.js");
            jsFiles.Add(@"Client\Data\TransData.js");
            jsFiles.Add(@"Client\Modules\CalendarModule.js");
            jsFiles.Add(@"Client\Gadget.js");

            return jsFiles;
        }


        private List<string> GetAppJavascriptFiles()
        {
            //TODO: Move to config file
            List<string> jsFiles = new List<string>();
            jsFiles.Add(@"Client\Lib\JsonServiceProxy.js");
            jsFiles.Add(@"Client\Lib\Json.js");
            jsFiles.Add(@"Client\Lib\DhtmlWindow.js");
            jsFiles.Add(@"Client\Lib\swfobject.js");
            jsFiles.Add(@"Client\Lib\jquery-1.4.2.min.js");
            jsFiles.Add(@"Client\Lib\jquery-ui-1.8.4.custom.min.js");
            jsFiles.Add(@"Client\Lib\mColorPicker.js");
            jsFiles.Add(@"Client\Lib\date.js");
            jsFiles.Add(@"Client\Utilities\DateUtil.js");
            jsFiles.Add(@"Client\Utilities\Guid.js");
            jsFiles.Add(@"Client\Data\CategoryData.js");
            jsFiles.Add(@"Client\Data\TransData.js");
            jsFiles.Add(@"Client\Data\GraphData.js");
            jsFiles.Add(@"Client\App.js");
            jsFiles.Add(@"Client\Modules\CalendarModule.js");
            jsFiles.Add(@"Client\Modules\AddCategoryModule.js");
            jsFiles.Add(@"Client\Modules\AddTransModule.js");
            jsFiles.Add(@"Client\Modules\BalanceChangeTableModule.js");
            jsFiles.Add(@"Client\Modules\CategoryTableModule.js");
            jsFiles.Add(@"Client\Modules\ExpectedBalanceTableModule.js");
            jsFiles.Add(@"Client\Modules\SearchTransModule.js");
            jsFiles.Add(@"Client\Modules\TransSummaryTableModule.js");
            jsFiles.Add(@"Client\Modules\SearchTransModule.js");
            jsFiles.Add(@"Client\Modules\TransSummaryTableModule.js");
            jsFiles.Add(@"Client\Modules\TransTableModule.js");
            jsFiles.Add(@"Client\Panel\BreakdownPieGraphPanel.js");
            jsFiles.Add(@"Client\Panel\AddTransPanel.js");
            jsFiles.Add(@"Client\Panel\EditCategoryPanel.js");
            jsFiles.Add(@"Client\Panel\SearchTransPanel.js");
            jsFiles.Add(@"Client\Panel\ViewTrendsPanel.js");
            jsFiles.Add(@"Client\Utilities\ContentLoader.js");
            jsFiles.Add(@"Client\Pages\ExpensePage.js");
            jsFiles.Add(@"Client\Pages\IncomePage.js");
            jsFiles.Add(@"Client\Pages\BalancePage.js");
            jsFiles.Add(@"Client\Utilities\FieldFunctions.js");
            jsFiles.Add(@"Client\Utilities\FormatFunctions.js");
            jsFiles.Add(@"Client\Utilities\StringBuffer.js");
            jsFiles.Add(@"Client\Utilities\Tooltip.js");
            jsFiles.Add(@"Client\Panel\EditCategoryPanel.js");
            jsFiles.Add(@"Client\Utilities\ValidationFunctions.js");

            return jsFiles;
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}