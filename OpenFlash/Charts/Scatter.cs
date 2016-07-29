using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class Scatter : Chart<ScatterValue>
    {
        private int? dotsize;

        public Scatter(string color, int? dotsize)
        {
            ChartType = "scatter";
            Colour = color;
            this.dotsize = dotsize;
        }

        [JsonProperty("dot-size")]
        public int? DotSize
        {
            get { return dotsize.Value; }
            set { dotsize = value; }
        }
    }
}