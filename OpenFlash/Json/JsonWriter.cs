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
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Text;
using System.Xml;

namespace OpenFlash.Json
{
    /// <summary>
    /// Writer for producing JSON data.
    /// </summary>
    public class JsonWriter : IDisposable
    {
        #region Constants

        private const string ErrorGenericIDictionary =
            "Types which implement Generic IDictionary<TKey, TValue> also need to implement IDictionary to be serialized.";

        private const string TypeBoolean = "System.Boolean";
        private const string TypeByte = "System.Byte";
        private const string TypeChar = "System.Char";
        private const string TypeDecimal = "System.Decimal";
        private const string TypeDouble = "System.Double";
        internal const string TypeGenericIDictionary = "System.Collections.Generic.IDictionary`2";
        private const string TypeInt16 = "System.Int16";
        private const string TypeInt32 = "System.Int32";
        private const string TypeInt64 = "System.Int64";
        private const string TypeSByte = "System.SByte";
        private const string TypeSingle = "System.Single";
        private const string TypeUInt16 = "System.UInt16";
        private const string TypeUInt32 = "System.UInt32";
        private const string TypeUInt64 = "System.UInt64";

        #endregion Constants

        #region Fields

        private readonly TextWriter writer;

        private int depth;
        private bool prettyPrint;
        private bool strictConformance = true;
        private string tab = "\t";

        #endregion Fields

        #region Init

        /// <summary>
        /// Ctor.
        /// </summary>
        /// <param name="output">TextWriter for writing</param>
        public JsonWriter(TextWriter output)
        {
            writer = output;
        }

        /// <summary>
        /// Ctor.
        /// </summary>
        /// <param name="output">Stream for writing</param>
        public JsonWriter(Stream output)
        {
            writer = new StreamWriter(output, Encoding.UTF8);
        }

        /// <summary>
        /// Ctor.
        /// </summary>
        /// <param name="outputFileName">File name for writing</param>
        public JsonWriter(string outputFileName)
        {
            Stream stream = new FileStream(outputFileName, FileMode.Create, FileAccess.Write, FileShare.Read);
            writer = new StreamWriter(stream, Encoding.UTF8);
        }

        /// <summary>
        /// Ctor.
        /// </summary>
        /// <param name="output">StringBuilder for appending</param>
        public JsonWriter(StringBuilder output)
        {
            writer = new StringWriter(output, CultureInfo.InvariantCulture);
        }

        #endregion Init

        #region Properties

        /// <summary>
        /// Gets and sets the property name used for type hinting.
        /// </summary>
        public string TypeHintName { get; set; }

        /// <summary>
        /// Gets and sets if JSON will be formatted for human reading.
        /// </summary>
        public bool PrettyPrint
        {
            get { return prettyPrint; }
            set { prettyPrint = value; }
        }

        /// <summary>
        /// Gets and sets the string to use for indentation
        /// </summary>
        public string Tab
        {
            get { return tab; }
            set { tab = value; }
        }

        /// <summary>
        /// Gets and sets the lien terminator string
        /// </summary>
        public string NewLine
        {
            get { return writer.NewLine; }
            set { writer.NewLine = value; }
        }

        /// <summary>
        /// Gets and sets if should use XmlSerialization Attributes.
        /// </summary>
        /// <remarks>
        /// Respects XmlIgnoreAttribute, ...
        /// </remarks>
        public bool UseXmlSerializationAttributes { get; set; }

        /// <summary>
        /// Gets and sets if should conform strictly to JSON spec.
        /// </summary>
        /// <remarks>
        /// Setting to true causes NaN, Infinity, -Infinity to serialize as null.
        /// </remarks>
        public bool StrictConformance
        {
            get { return strictConformance; }
            set { strictConformance = value; }
        }

        public bool SkipNullValue { get; set; }

        #endregion Properties

        #region Public Methods

        public virtual void Write(object value)
        {
            Write(value, false);
        }

        private void Write(object value, bool isProperty)
        {
            if (isProperty && prettyPrint)
            {
                writer.Write(' ');
            }

            if (value == null)
            {
                writer.Write(JsonReader.LiteralNull);
                return;
            }


            if (value is Enum)
            {
                Write((Enum) value);
                return;
            }

            if (value is String)
            {
                Write((String) value);
                return;
            }

            // IDictionary test must happen BEFORE IEnumerable test
            // since IDictionary implements IEnumerable
            if (value is IDictionary)
            {
                try
                {
                    if (isProperty)
                    {
                        depth++;
                        WriteLine();
                    }
                    WriteObject((IDictionary) value);
                }
                finally
                {
                    if (isProperty)
                    {
                        depth--;
                    }
                }
                return;
            }

            Type type = value.GetType();
            if (type.GetInterface(TypeGenericIDictionary) != null)
            {
                throw new JsonSerializationException(ErrorGenericIDictionary);
            }

            if (value is IEnumerable)
            {
                if (value is XmlNode)
                {
                    Write((XmlNode) value);
                    return;
                }

                try
                {
                    if (isProperty)
                    {
                        depth++;
                        WriteLine();
                    }
                    WriteArray((IEnumerable) value);
                }
                finally
                {
                    if (isProperty)
                    {
                        depth--;
                    }
                }
                return;
            }

            if (value is DateTime)
            {
                Write((DateTime) value);
                return;
            }

            if (value is Guid)
            {
                Write((Guid) value);
                return;
            }

            if (value is Uri)
            {
                Write((Uri) value);
                return;
            }

            if (value is TimeSpan)
            {
                Write((TimeSpan) value);
                return;
            }

            if (value is Version)
            {
                Write((Version) value);
                return;
            }

            // cannot use 'is' for ValueTypes, using string comparison
            // these are ordered based on an intuitive sense of their
            // frequency of use for nominally better switch performance
            switch (type.FullName)
            {
                case TypeDouble:
                    {
                        Write((Double) value);
                        return;
                    }
                case TypeInt32:
                    {
                        Write((Int32) value);
                        return;
                    }
                case TypeBoolean:
                    {
                        Write((Boolean) value);
                        return;
                    }
                case TypeDecimal:
                    {
                        // From MSDN:
                        // Conversions from Char, SByte, Int16, Int32, Int64, Byte, UInt16, UInt32, and UInt64
                        // to Decimal are widening conversions that never lose information or throw exceptions.
                        // Conversions from Single or Double to Decimal throw an OverflowException
                        // if the result of the conversion is not representable as a Decimal.
                        Write((Decimal) value);
                        return;
                    }
                case TypeByte:
                    {
                        Write((Byte) value);
                        return;
                    }
                case TypeInt16:
                    {
                        Write((Int16) value);
                        return;
                    }
                case TypeInt64:
                    {
                        Write((Int64) value);
                        return;
                    }
                case TypeChar:
                    {
                        Write((Char) value);
                        return;
                    }
                case TypeSingle:
                    {
                        Write((Single) value);
                        return;
                    }
                case TypeUInt16:
                    {
                        Write((UInt16) value);
                        return;
                    }
                case TypeUInt32:
                    {
                        Write((UInt32) value);
                        return;
                    }
                case TypeUInt64:
                    {
                        Write((UInt64) value);
                        return;
                    }
                case TypeSByte:
                    {
                        Write((SByte) value);
                        return;
                    }
                default:
                    {
                        // structs and classes
                        try
                        {
                            if (isProperty)
                            {
                                depth++;
                                WriteLine();
                            }
                            WriteObject(value);
                        }
                        finally
                        {
                            if (isProperty)
                            {
                                depth--;
                            }
                        }
                        return;
                    }
            }
        }

        public virtual void WriteBase64(byte[] value)
        {
            Write(Convert.ToBase64String(value));
        }

        public virtual void Write(DateTime value)
        {
            // UTC DateTime in ISO-8601
            value = value.ToUniversalTime();
            Write(String.Format("{0:s}Z", value));
        }

        public virtual void Write(Guid value)
        {
            Write(value.ToString("D"));
        }

        public virtual void Write(Enum value)
        {
            string enumName;

            Type type = value.GetType();

            if (type.IsDefined(typeof (FlagsAttribute), true) && !Enum.IsDefined(type, value))
            {
                Enum[] flags = GetFlagList(type, value);
                var flagNames = new string[flags.Length];
                for (int i = 0; i < flags.Length; i++)
                {
                    flagNames[i] = JsonNameAttribute.GetJsonName(flags[i]);
                    if (String.IsNullOrEmpty(flagNames[i]))
                        flagNames[i] = flags[i].ToString("f");
                }
                enumName = String.Join(", ", flagNames);
            }
            else
            {
                enumName = JsonNameAttribute.GetJsonName(value);
                if (String.IsNullOrEmpty(enumName))
                    enumName = value.ToString("f");
            }

            Write(enumName);
        }

        public virtual void Write(string value)
        {
            if (value == null)
            {
                writer.Write(JsonReader.LiteralNull);
                return;
            }

            int length = value.Length;
            int start = 0;

            writer.Write(JsonReader.OperatorStringDelim);

            for (int i = start; i < length; i++)
            {
                if (value[i] <= '\u001F' ||
                    value[i] >= '\u007F' ||
                    value[i] == '<' ||
                    value[i] == '\t' ||
                    value[i] == JsonReader.OperatorStringDelim ||
                    value[i] == JsonReader.OperatorCharEscape)
                {
                    writer.Write(value.Substring(start, i - start));
                    start = i + 1;

                    switch (value[i])
                    {
                        case JsonReader.OperatorStringDelim:
                        case JsonReader.OperatorCharEscape:
                            {
                                writer.Write(JsonReader.OperatorCharEscape);
                                writer.Write(value[i]);
                                continue;
                            }
                        case '\b':
                            {
                                writer.Write("\\b");
                                continue;
                            }
                        case '\f':
                            {
                                writer.Write("\\f");
                                continue;
                            }
                        case '\n':
                            {
                                writer.Write("\\n");
                                continue;
                            }
                        case '\r':
                            {
                                writer.Write("\\r");
                                continue;
                            }
                        case '\t':
                            {
                                writer.Write("\\t");
                                continue;
                            }
                        default:
                            {
                                writer.Write("\\u{0:X4}", Char.ConvertToUtf32(value, i));
                                continue;
                            }
                    }
                }
            }

            writer.Write(value.Substring(start, length - start));

            writer.Write(JsonReader.OperatorStringDelim);
        }

        #endregion Public Methods

        #region Primative Writer Methods

        public virtual void Write(bool value)
        {
            writer.Write(value ? JsonReader.LiteralTrue : JsonReader.LiteralFalse);
        }

        public virtual void Write(byte value)
        {
            writer.Write("{0:g}", value);
        }

        public virtual void Write(sbyte value)
        {
            writer.Write("{0:g}", value);
        }

        public virtual void Write(short value)
        {
            writer.Write("{0:g}", value);
        }

        public virtual void Write(ushort value)
        {
            writer.Write("{0:g}", value);
        }

        public virtual void Write(int value)
        {
            writer.Write("{0:g}", value);
        }

        public virtual void Write(uint value)
        {
            writer.Write("{0:g}", value);
        }

        public virtual void Write(long value)
        {
            writer.Write("{0:g}", value);
        }

        public virtual void Write(ulong value)
        {
            writer.Write("{0:g}", value);
        }

        public virtual void Write(float value)
        {
            if (StrictConformance && (Single.IsNaN(value) || Single.IsInfinity(value)))
            {
                writer.Write(JsonReader.LiteralNull);
            }
            else
            {
                writer.Write("{0:r}", value);
            }
        }

        public virtual void Write(double value)
        {
            if (StrictConformance && (Double.IsNaN(value) || Double.IsInfinity(value)))
            {
                writer.Write(JsonReader.LiteralNull);
            }
            else
            {
                writer.Write("{0:r}", value);
            }
        }

        public virtual void Write(decimal value)
        {
            writer.Write("{0:g}", value);
        }

        public virtual void Write(char value)
        {
            Write(new String(value, 1));
        }

        public virtual void Write(TimeSpan value)
        {
            Write(value.Ticks);
        }

        public virtual void Write(Uri value)
        {
            Write(value.ToString());
        }

        public virtual void Write(Version value)
        {
            Write(value.ToString());
        }

        public virtual void Write(XmlNode value)
        {
            // TODO: translate XML to JSON
            Write(value.OuterXml);
        }

        #endregion Primative Writer Methods

        #region Writer Methods

        protected internal virtual void WriteArray(IEnumerable value)
        {
            bool appendDelim = false;

            writer.Write(JsonReader.OperatorArrayStart);

            depth++;
            try
            {
                foreach (object item in value)
                {
                    if (appendDelim)
                    {
                        writer.Write(JsonReader.OperatorValueDelim);
                    }
                    else
                    {
                        appendDelim = true;
                    }

                    WriteLine();
                    Write(item, false);
                }
            }
            finally
            {
                depth--;
            }

            if (appendDelim)
            {
                WriteLine();
            }
            writer.Write(JsonReader.OperatorArrayEnd);
        }

        protected virtual void WriteObject(IDictionary value)
        {
            bool appendDelim = false;

            writer.Write(JsonReader.OperatorObjectStart);

            depth++;
            try
            {
                foreach (object name in value.Keys)
                {
                    if (appendDelim)
                    {
                        writer.Write(JsonReader.OperatorValueDelim);
                    }
                    else
                    {
                        appendDelim = true;
                    }

                    WriteLine();
                    Write((String) name);
                    writer.Write(JsonReader.OperatorNameDelim);
                    Write(value[name], true);
                }
            }
            finally
            {
                depth--;
            }

            if (appendDelim)
            {
                WriteLine();
            }
            writer.Write(JsonReader.OperatorObjectEnd);
        }

        protected virtual void WriteObject(object value)
        {
            bool appendDelim = false;

            writer.Write(JsonReader.OperatorObjectStart);

            depth++;
            try
            {
                Type objType = value.GetType();

                if (!String.IsNullOrEmpty(TypeHintName))
                {
                    if (appendDelim)
                    {
                        writer.Write(JsonReader.OperatorValueDelim);
                    }
                    else
                    {
                        appendDelim = true;
                    }

                    WriteLine();
                    Write(TypeHintName);
                    writer.Write(JsonReader.OperatorNameDelim);
                    Write(objType.FullName, true);
                }

                // serialize public properties
                PropertyInfo[] properties = objType.GetProperties();
                foreach (PropertyInfo property in properties)
                {
                    if (!property.CanWrite || !property.CanRead)
                    {
                        continue;
                    }

                    if (IsIgnored(objType, property, value))
                    {
                        continue;
                    }

                    object propertyValue = property.GetValue(value, null);

                    if ((propertyValue == null) && SkipNullValue)
                    {
                        continue;
                    }

                    if (IsDefaultValue(property, propertyValue))
                    {
                        continue;
                    }

                    if (appendDelim)
                    {
                        writer.Write(JsonReader.OperatorValueDelim);
                    }
                    else
                    {
                        appendDelim = true;
                    }

                    string propertyName = JsonNameAttribute.GetJsonName(property);
                    if (String.IsNullOrEmpty(propertyName))
                    {
                        propertyName = property.Name;
                    }

                    WriteLine();
                    Write(propertyName);
                    writer.Write(JsonReader.OperatorNameDelim);
                    Write(propertyValue, true);
                }

                // serialize public fields
                FieldInfo[] fields = objType.GetFields();
                foreach (FieldInfo field in fields)
                {
                    if (!field.IsPublic || field.IsStatic)
                    {
                        continue;
                    }

                    if (IsIgnored(objType, field, value))
                    {
                        continue;
                    }

                    object fieldValue = field.GetValue(value);

                    if (IsDefaultValue(field, fieldValue))
                    {
                        continue;
                    }

                    if (appendDelim)
                    {
                        writer.Write(JsonReader.OperatorValueDelim);
                        WriteLine();
                    }
                    else
                    {
                        appendDelim = true;
                    }

                    string fieldName = JsonNameAttribute.GetJsonName(field);
                    if (String.IsNullOrEmpty(fieldName))
                    {
                        fieldName = field.Name;
                    }

                    // use Attributes here to control naming
                    Write(fieldName);
                    writer.Write(JsonReader.OperatorNameDelim);
                    Write(fieldValue, true);
                }
            }
            finally
            {
                depth--;
            }

            if (appendDelim)
            {
                WriteLine();
            }
            writer.Write(JsonReader.OperatorObjectEnd);
        }

        protected virtual void WriteLine()
        {
            if (!prettyPrint)
            {
                return;
            }

            writer.WriteLine();
            for (int i = 0; i < depth; i++)
            {
                writer.Write(tab);
            }
        }

        #endregion Writer Methods

        #region Private Methods

        /// <summary>
        /// Determines if the property or field should not be serialized.
        /// </summary>
        /// <param name="objType"></param>
        /// <param name="member"></param>
        /// <param name="obj"></param>
        /// <returns></returns>
        /// <remarks>
        /// Checks these in order, if any returns true then this is true:
        /// - is flagged with the JsonIgnoreAttribute property
        /// - has a JsonSpecifiedProperty which returns false
        /// </remarks>
        private bool IsIgnored(Type objType, MemberInfo member, object obj)
        {
            if (JsonIgnoreAttribute.IsJsonIgnore(member))
            {
                return true;
            }


            if (UseXmlSerializationAttributes)
            {
                if (JsonIgnoreAttribute.IsXmlIgnore(member))
                {
                    return true;
                }

                PropertyInfo specProp = objType.GetProperty(member.Name + "Specified");
                if (specProp != null)
                {
                    object isSpecified = specProp.GetValue(obj, null);
                    if (isSpecified is Boolean && !Convert.ToBoolean(isSpecified))
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        /// <summary>
        /// Determines if the member value matches the DefaultValue attribute
        /// </summary>
        /// <returns>if has a value equivalent to the DefaultValueAttribute</returns>
        private bool IsDefaultValue(MemberInfo member, object value)
        {
            var attribute =
                Attribute.GetCustomAttribute(member, typeof (DefaultValueAttribute)) as DefaultValueAttribute;
            if (attribute == null)
            {
                return false;
            }

            if (attribute.Value == null)
            {
                return (value == null);
            }

            return (attribute.Value.Equals(value));
        }

        #region GetFlagList

        /// <summary>
        /// Splits a bitwise-OR'd set of enums into a list.
        /// </summary>
        /// <param name="enumType">the enum type</param>
        /// <param name="value">the combined value</param>
        /// <returns>list of flag enums</returns>
        /// <remarks>
        /// from PseudoCode.EnumHelper
        /// </remarks>
        private static Enum[] GetFlagList(Type enumType, object value)
        {
            ulong longVal = Convert.ToUInt64(value);
            //string[] enumNames = Enum.GetNames(enumType);
            Array enumValues = Enum.GetValues(enumType);

            var enums = new List<Enum>(enumValues.Length);

            // check for empty
            if (longVal == 0L)
            {
                // Return the value of empty, or zero if none exists
                if (Convert.ToUInt64(enumValues.GetValue(0)) == 0L)
                    enums.Add(enumValues.GetValue(0) as Enum);
                else
                    enums.Add(null);
                return enums.ToArray();
            }

            for (int i = enumValues.Length - 1; i >= 0; i--)
            {
                ulong enumValue = Convert.ToUInt64(enumValues.GetValue(i));

                if ((i == 0) && (enumValue == 0L))
                    continue;

                // matches a value in enumeration
                if ((longVal & enumValue) == enumValue)
                {
                    // remove from val
                    longVal -= enumValue;

                    // add enum to list
                    enums.Add(enumValues.GetValue(i) as Enum);
                }
            }

            if (longVal != 0x0L)
                enums.Add(Enum.ToObject(enumType, longVal) as Enum);

            return enums.ToArray();
        }

        #endregion GetFlagList

        #endregion Private Methods

        #region IDisposable Members

        void IDisposable.Dispose()
        {
            if (writer != null)
                writer.Dispose();
        }

        #endregion
    }
}