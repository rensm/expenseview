using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class ChartElement
    {
        private string style;

        [JsonProperty("text")]
        public virtual string Text { set; get; }

        [JsonProperty("style")]
        public string Style
        {
            set { style = value; }
            get
            {
                if (style == null)
                    style = "{font-size: 20px; color:#0000ff; font-family: Verdana; text-align: center;}";
                return style;
            }
            //"{font-size: 20px; color:#0000ff; font-family: Verdana; text-align: center;}";		
        }
    }
}