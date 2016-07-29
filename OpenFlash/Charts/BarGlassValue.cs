using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class BarGlassValue
    {
        public BarGlassValue(string top)
        {
            Top = top;
        }

        [JsonProperty("top")]
        public string Top { get; set; }

        [JsonProperty("colour")]
        public string Colour { get; set; }

        [JsonProperty("tip")]
        public string Tooltip { get; set; }
    }
}