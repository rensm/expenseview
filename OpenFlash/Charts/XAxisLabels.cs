using System.Collections.Generic;
using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class XAxisLabels
    {
        private IList<AxisLabel> labels;
        private string rotate;
        private int? steps = 1;

        [JsonProperty("steps")]
        public int? Steps
        {
            get
            {
                if (steps == null)
                    return null;
                return steps.Value;
            }
            set { steps = value; }
        }

        [JsonProperty("labels")]
        public IList<AxisLabel> AxisLabelValues
        {
            get { return labels; }
            set { labels = value; }
        }

        [JsonIgnore]
        public IList<string> Values
        {
            set
            {
                if (labels == null)
                    labels = new List<AxisLabel>();
                foreach (string s in value)
                {
                    labels.Add(new AxisLabel(s));
                }
                //this.labels = value;
            }
        }

        [JsonProperty("colour")]
        public string Color { set; get; }

        [JsonProperty("rotate")]
        public string Rotate
        {
            set { rotate = value; }
            get { return rotate; }
        }

        [JsonIgnore]
        public bool Vertical
        {
            set
            {
                if (value)
                    rotate = "vertical";
            }
        }
    }
}