using System;
using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class BarSketch : Chart<Double>
    {
        private int? offset;

        public BarSketch(string colour, string outlinecolor, int? offset)
        {
            ChartType = "bar_sketch";
            Colour = colour;
            OutlineColour = outlinecolor;
            this.offset = offset;
        }

        [JsonProperty("offset")]
        public int? Offset
        {
            get { return offset.Value; }
            set { offset = value; }
        }

        [JsonProperty("outline-colour")]
        public string OutlineColour { get; set; }
    }
}