using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class Axis
    {
        public Axis()
        {
            Steps = 1;
        }

        [JsonProperty("stroke")]
        public string Stroke { set; get; }

        [JsonProperty("colour")]
        public string Colour { get; set; }

        [JsonProperty("grid-colour")]
        public string GridColour { get; set; }

        [JsonProperty("steps")]
        public int Steps { get; set; }

        [JsonProperty("min")]
        public double? Min { get; set; }

        [JsonProperty("max")]
        public double? Max { get; set; }

        [JsonProperty("3d")]
        public int Axis3D { get; set; }

        public void SetColors(string color, string gridcolor)
        {
            Colour = color;
            GridColour = gridcolor;
        }

        public void Set3D(int width)
        {
            Axis3D = width;
        }
    }
}