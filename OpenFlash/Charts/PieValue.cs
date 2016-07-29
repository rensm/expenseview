using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class PieValue
    {
        public PieValue(double val)
        {
            Value = val;
        }

        public PieValue(double val, string text)
        {
            Value = val;
            Text = text;
        }

        [JsonProperty("value")]
        public double Value { get; set; }

        [JsonProperty("label")]
        public string Text { get; set; }

        public static implicit operator PieValue(double val)
        {
            return new PieValue(val, "");
        }
    }
}