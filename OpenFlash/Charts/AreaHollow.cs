using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class AreaHollow : Chart<double>
    {
        public AreaHollow()
        {
            ChartType = "area_hollow";
        }

        [JsonProperty("width")]
        public virtual int Width { set; get; }

        [JsonProperty("dot-size")]
        public virtual double DotSize { get; set; }
    }
}