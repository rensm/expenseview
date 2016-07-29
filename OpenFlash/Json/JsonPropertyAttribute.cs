using System;

namespace OpenFlash.Json
{
    [AttributeUsage(AttributeTargets.All, AllowMultiple = false)]
    public class JsonPropertyAttribute : JsonNameAttribute
    {
        public JsonPropertyAttribute()
        {
        }

        public JsonPropertyAttribute(string jsonname)
            : base(jsonname)
        {
        }
    }
}