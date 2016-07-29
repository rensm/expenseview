using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class AxisLabel
    {
        public AxisLabel()
        {
            Visible = true;
            Size = 12;
        }

        public AxisLabel(string text)
        {
            Text = text;
            Visible = true;
            Size = 12;
        }

        public AxisLabel(string text, string colour, int size, string rotate)
        {
            Text = text;
            Color = colour;
            Size = size;
            Rotate = rotate;

            Visible = true;
        }

        [JsonProperty("colour")]
        public string Color { set; get; }

        [JsonProperty("text")]
        public string Text { set; get; }

        [JsonProperty("size")]
        public int Size { set; get; }

        [JsonProperty("rotate")]
        public string Rotate { get; set; }

        [JsonIgnore]
        public bool Vertical
        {
            set
            {
                if (value)
                    Rotate = "vertical";
            }
        }

        [JsonProperty("visible")]
        public bool Visible { get; set; }
    }
}