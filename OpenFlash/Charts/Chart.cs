using System;
using System.Collections.Generic;
using System.ComponentModel;
using OpenFlash.Json;

namespace OpenFlash.Charts
{
    public class Chart<T> : ChartBase
    {
        private IList<T> values;

        public Chart()
        {
            values = new List<T>();
            Fillalpha = 0.35;
        }

        [JsonProperty("colour")]
        public virtual string Colour { set; get; }

        [JsonProperty("values")]
        public virtual IList<T> Values
        {
            set { values = value; }
            get { return values; }
        }

        [JsonProperty("font-size")]
        [DefaultValue(12.0)]
        public double Fontsize { get; set; }

        [JsonProperty("text")]
        public string Text { get; set; }

        [JsonProperty("fillalpha")]
        public double Fillalpha { get; set; }

        [JsonProperty("type")]
        public string ChartType { get; set; }

        [JsonProperty("tip")]
        public string Tip { get; set; }

        public override double GetMaxValue()
        {
            if (values.Count == 0)
                return 0;
            double max = double.MinValue;
            Type valuetype = typeof (T);
            if (!valuetype.IsValueType)
                return 0;
            foreach (T d in values)
            {
                double temp = double.Parse(d.ToString());
                if (temp > max)
                    max = temp;
            }
            return max;
        }

        public override int GetValueCount()
        {
            return values.Count;
        }

        public override double GetMinValue()
        {
            if (values.Count == 0)
                return 0;
            double min = double.MaxValue;
            Type valuetype = typeof (T);
            if (!valuetype.IsValueType)
                return 0;
            foreach (T d in values)
            {
                double temp = double.Parse(d.ToString());
                if (temp < min)
                    min = temp;
            }
            return min;
        }

        public void AppendValue(T v)
        {
            values.Add(v);
        }

        public virtual void Set_Key(string text, double font_size)
        {
            Text = text;
            Fontsize = font_size;
        }
    }
}