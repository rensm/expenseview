using System.Collections.Generic;
using System.Globalization;
using System.IO;
using OpenFlash.Charts;
using OpenFlash.Json;

namespace OpenFlash
{
    public class OpenFlashChart
    {
        private IList<ChartBase> elements;
        private XAxis x_axis;
        private YAxis y_axis;

        public OpenFlashChart()
        {
            Title = new Title("Many data lines");
            Elements = new List<ChartBase>();
        }

        [JsonProperty("title")]
        public Title Title { set; get; }

        [JsonProperty("x_axis")]
        public XAxis X_Axis
        {
            get
            {
                if (x_axis == null)
                    x_axis = new XAxis();
                return x_axis;
            }
            set { x_axis = value; }
        }

        [JsonProperty("y_axis")]
        public YAxis Y_Axis
        {
            get
            {
                if (y_axis == null)
                    y_axis = new YAxis();
                return y_axis;
            }
            set { y_axis = value; }
        }

        [JsonProperty("y_axis_right")]
        public YAxis Y_Axis_Right { get; set; }

        [JsonProperty("elements")]
        public IList<ChartBase> Elements
        {
            get { return elements; }
            set { elements = value; }
        }

        [JsonProperty("x_legend")]
        public Legend X_Legend { get; set; }

        [JsonProperty("y_legend")]
        public Legend Y_Legend { get; set; }

        [JsonProperty("bg_colour")]
        public string Bgcolor { get; set; }

        [JsonProperty("tooltip")]
        public ToolTip Tooltip { get; set; }

        public void AddElement(ChartBase chart)
        {
            elements.Add(chart);
            Y_Axis.SetRange(chart.GetMinValue(), chart.GetMaxValue());
            X_Axis.Steps = 1;
        }

        public override string ToString()
        {
            var sw = new StringWriter(CultureInfo.InvariantCulture);
            using (var writer = new JsonWriter(sw))
            {
                writer.SkipNullValue = true;
                writer.Write(this);
            }
            return sw.ToString();
        }

        public string ToPrettyString()
        {
            var sw = new StringWriter(CultureInfo.InvariantCulture);
            using (var writer = new JsonWriter(sw))
            {
                writer.SkipNullValue = true;
                writer.PrettyPrint = true;
                writer.Write(this);
            }
            return sw.ToString();
        }
    }
}