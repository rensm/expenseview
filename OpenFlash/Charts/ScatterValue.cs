using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class ScatterValue
    {
        private int? dotsize;

        public ScatterValue(double x, double y, int dotsize)
        {
            X = x;
            Y = y;
            if (dotsize > 0)
                this.dotsize = dotsize;
        }

        [JsonProperty("x")]
        public double X { get; set; }

        [JsonProperty("y")]
        public double Y { get; set; }

        [JsonProperty("dot-size")]
        public int DotSize
        {
            get
            {
                if (dotsize == null)
                    return -1;

                return dotsize.Value;
            }
            set { dotsize = value; }
        }
    }
}