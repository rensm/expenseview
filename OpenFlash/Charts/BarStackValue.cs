using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class BarStackValue
    {
        public BarStackValue(double val, string color)
        {
            Colour = color;
            Val = val;
        }

        [JsonProperty("colour")]
        public string Colour { get; set; }

        [JsonProperty("val")]
        public double Val { get; set; }
    }
}