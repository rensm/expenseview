using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class HBarValue
    {
        public HBarValue(double left, double right)
        {
            Left = left;
            Right = right;
        }

        [JsonProperty("left")]
        public double Left { get; set; }

        [JsonProperty("right")]
        public double Right { get; set; }
    }
}