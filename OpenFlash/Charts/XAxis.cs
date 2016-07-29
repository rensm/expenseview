using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class XAxis : Axis
    {
        private XAxisLabels labels;

        [JsonProperty("offset")]
        public bool Offset { set; get; }

        [JsonProperty("labels")]
        public XAxisLabels Labels
        {
            get
            {
                if (labels == null)
                    labels = new XAxisLabels();
                return labels;
            }
            set { labels = value; }
        }

        [JsonProperty("tick-height")]
        public string TickHeight { get; set; }

        public void SetRange(double min, double max)
        {
            Max = max;
            Min = min;
        }
    }
}