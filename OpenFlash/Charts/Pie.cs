using System.Collections.Generic;
using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class Pie : Chart<PieValue>
    {
        public Pie()
        {
            ChartType = "pie";
            Border = 2;
            Colours = new[] {"#d01f3c", "#356aa0", "#C79810"};
            Alpha = 0.6;
            Animate = true;
        }

        [JsonProperty("colours")]
        public IEnumerable<string> Colours { get; set; }

        [JsonProperty("border")]
        public int Border { get; set; }

        [JsonProperty("alpha")]
        public double Alpha { get; set; }

        [JsonProperty("animate")]
        public bool Animate { get; set; }

        [JsonProperty("start-angle")]
        public double StartAngle { get; set; }
    }
}