using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class YAxis : Axis
    {
        private int offset;

        [JsonProperty("tick-length")]
        public int TickLength { get; set; }

        [JsonProperty("offset")]
        public int Offset
        {
            get { return offset; }
            set { offset = value > 0 ? 1 : 0; }
        }

        public void SetRange(double min, double max)
        {
            Max = max;
            Min = min;
        }

        public void SetRange(double min, double max, int step)
        {
            Max = max;
            Min = min;
            Steps = step;
        }
    }
}