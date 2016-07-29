using System;
using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class LineBase : Chart<Double>
    {
        public LineBase()
        {
            ChartType = "line_dot";
        }

        [JsonProperty("width")]
        public virtual int Width { set; get; }

        [JsonProperty("dot-size")]
        public virtual int DotSize { get; set; }

        [JsonProperty("halo-size")]
        public virtual int HaloSize { get; set; }
    }
}