using System;
using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class ToolTip
    {
        public ToolTip(string text)
        {
            Text = text;
        }

        [JsonProperty("text")]
        public String Text { get; set; }
    }
}