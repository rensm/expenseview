#region BuildTools License

/*---------------------------------------------------------------------------------*\

	BuildTools distributed under the terms of an MIT-style license:

	The MIT License

	Copyright (c) 2006-2008 Stephen M. McKamey

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

\*---------------------------------------------------------------------------------*/

#endregion BuildTools License

using System;
using System.Reflection;

namespace OpenFlash.Json
{
    /// <summary>
    /// Specifies the naming to use for a property or field when serializing
    /// </summary>
    [AttributeUsage(AttributeTargets.All, AllowMultiple = false)]
    public class JsonNameAttribute : Attribute
    {
        #region Fields

        #endregion Fields

        #region Init

        /// <summary>
        /// Ctor
        /// </summary>
        public JsonNameAttribute()
        {
        }

        /// <summary>
        /// Ctor
        /// </summary>
        /// <param name="jsonName"></param>
        public JsonNameAttribute(string jsonName)
        {
            Name = jsonName;
        }

        #endregion Init

        #region Properties

        /// <summary>
        /// Gets and sets the name to be used in JSON
        /// </summary>
        public string Name { get; set; }

        #endregion Properties

        #region Methods

        /// <summary>
        /// Gets the name specified for use in Json serialization.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string GetJsonName(object value)
        {
            if (value == null)
            {
                return null;
            }

            Type type = value.GetType();
            MemberInfo memberInfo;

            if (type.IsEnum)
            {
                string name = Enum.GetName(type, value);
                if (String.IsNullOrEmpty(name))
                {
                    return null;
                }
                memberInfo = type.GetField(name);
            }
            else
            {
                memberInfo = value as MemberInfo;
            }

            if (memberInfo == null)
            {
                throw new ArgumentException();
            }

            if (!IsDefined(memberInfo, typeof (JsonNameAttribute)))
            {
                return null;
            }
            var attribute = (JsonNameAttribute) GetCustomAttribute(memberInfo, typeof (JsonNameAttribute));

            return attribute.Name;
        }

        ///// <summary>
        ///// Gets the name specified for use in Json serialization.
        ///// </summary>
        ///// <param name="value"></param>
        ///// <returns></returns>
        //public static string GetXmlName(object value)
        //{
        //    if (value == null)
        //    {
        //        return null;
        //    }

        //    Type type = value.GetType();
        //    ICustomAttributeProvider memberInfo = null;

        //    if (type.IsEnum)
        //    {
        //        string name = Enum.GetName(type, value);
        //        if (String.IsNullOrEmpty(name))
        //        {
        //            return null;
        //        }
        //        memberInfo = type.GetField(name);
        //    }
        //    else
        //    {
        //        memberInfo = value as ICustomAttributeProvider;
        //    }

        //    if (memberInfo == null)
        //    {
        //        throw new ArgumentException();
        //    }

        //    XmlAttributes xmlAttributes = new XmlAttributes(memberInfo);
        //    if (xmlAttributes.XmlElements.Count == 1 &&
        //        !String.IsNullOrEmpty(xmlAttributes.XmlElements[0].ElementName))
        //    {
        //        return xmlAttributes.XmlElements[0].ElementName;
        //    }
        //    if (xmlAttributes.XmlAttribute != null &&
        //        !String.IsNullOrEmpty(xmlAttributes.XmlAttribute.AttributeName))
        //    {
        //        return xmlAttributes.XmlAttribute.AttributeName;
        //    }

        //    return null;
        //}

        #endregion Methods
    }
}