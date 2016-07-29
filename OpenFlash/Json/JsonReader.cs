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

namespace OpenFlash.Json
{
    /// <summary>
    /// Reader for consuming JSON data
    /// </summary>
    public class JsonReader
    {
        #region Constants

        private const string CommentEnd = "*/";
        private const string CommentLine = "//";
        private const string CommentStart = "/*";
        private const string ErrorDefaultCtor = "Only objects with default constructors can be deserialized.";
        private const string ErrorExpectedArray = "Expected JSON array.";
        private const string ErrorExpectedObject = "Expected JSON object.";
        private const string ErrorExpectedPropertyName = "Expected JSON object property name.";
        private const string ErrorExpectedPropertyNameDelim = "Expected JSON object property name delimiter.";
        private const string ErrorExpectedString = "Expected JSON string.";

        private const string ErrorGenericIDictionary =
            "Types which implement Generic IDictionary<TKey, TValue> also need to implement IDictionary to be deserialized.";

        private const string ErrorIllegalNumber = "Illegal JSON number.";
        private const string ErrorNullValueType = "{0} does not accept null as a value";
        private const string ErrorUnrecognizedToken = "Illegal JSON sequence.";
        private const string ErrorUnterminatedArray = "Unterminated JSON array.";
        private const string ErrorUnterminatedComment = "Unterminated comment block.";
        private const string ErrorUnterminatedObject = "Unterminated JSON object.";
        private const string ErrorUnterminatedString = "Unterminated JSON string.";
        private const string LineEndings = "\r\n";

        internal const string LiteralFalse = "false";
        internal const string LiteralNegativeInfinity = "-Infinity";
        internal const string LiteralNotANumber = "NaN";
        internal const string LiteralNull = "null";
        internal const string LiteralPositiveInfinity = "Infinity";
        internal const string LiteralTrue = "true";
        internal const char OperatorArrayEnd = ']';
        internal const char OperatorArrayStart = '[';
        internal const char OperatorCharEscape = '\\';
        internal const char OperatorNameDelim = ':';
        internal const char OperatorNegate = '-';
        internal const char OperatorObjectEnd = '}';
        internal const char OperatorObjectStart = '{';
        internal const char OperatorStringDelim = '"';
        internal const char OperatorStringDelimAlt = '\'';
        internal const char OperatorUnaryPlus = '+';
        internal const char OperatorValueDelim = ',';

        #endregion Constants

        #region Fields

        private readonly string Source;
        private readonly int SourceLength;
        private int index;
        private Dictionary<Type, Dictionary<string, MemberInfo>> MemberMapCache;
        private string typeHintName;

        #endregion Fields

        #region Init

        /// <summary>
        /// Ctor.
        /// </summary>
        /// <param name="input">TextReader containing source</param>
        public JsonReader(TextReader input)
        {
            Source = input.ReadToEnd();
            SourceLength = Source.Length;
        }

        /// <summary>
        /// Ctor.
        /// </summary>
        /// <param name="input">Stream containing source</param>
        public JsonReader(Stream input)
        {
            using (var reader = new StreamReader(input, true))
            {
                Source = reader.ReadToEnd();
            }
            SourceLength = Source.Length;
        }

        /// <summary>
        /// Ctor.
        /// </summary>
        /// <param name="input">string containing source</param>
        public JsonReader(string input)
        {
            Source = input;
            SourceLength = Source.Length;
        }

        /// <summary>
        /// Ctor.
        /// </summary>
        /// <param name="input">StringBuilder containing source</param>
        public JsonReader(StringBuilder input)
        {
            Source = input.ToString();
            SourceLength = Source.Length;
        }

        #endregion Init

        #region Properties

        /// <summary>
        /// Gets and sets if ValueTypes can accept values of null
        /// </summary>
        /// <remarks>
        /// Only affects deserialization: if a ValueType is assigned the
        /// value of null, it will receive the value default(TheType).
        /// Setting this to false, throws an exception if null is
        /// specified for a ValueType member.
        /// </remarks>
        public bool AllowNullValueTypes { get; set; }

        /// <summary>
        /// Gets and sets the property name used for type hinting.
        /// </summary>
        public string TypeHintName
        {
            get { return typeHintName; }
            set { typeHintName = value; }
        }

        #endregion Properties

        #region Parsing Methods

        /// <summary>
        /// Convert from JSON string to Object graph
        /// </summary>
        /// <returns></returns>
        public object Deserialize()
        {
            return Deserialize(null);
        }

        /// <summary>
        /// Convert from JSON string to Object graph of specific Type
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public object Deserialize(Type type)
        {
            // should this run through a preliminary test here?
            return Read(type, false);
        }

        private object Read(Type expectedType, bool typeIsHint)
        {
            if (expectedType == typeof (Object))
            {
                expectedType = null;
            }

            JsonToken token = Tokenize();

            switch (token)
            {
                case JsonToken.ObjectStart:
                    {
                        return ReadObject(typeIsHint ? null : expectedType);
                    }
                case JsonToken.ArrayStart:
                    {
                        return ReadArray(typeIsHint ? null : expectedType);
                    }
                case JsonToken.String:
                    {
                        return ReadString(typeIsHint ? null : expectedType);
                    }
                case JsonToken.Number:
                    {
                        return ReadNumber(typeIsHint ? null : expectedType);
                    }
                case JsonToken.False:
                    {
                        index += LiteralFalse.Length;
                        return false;
                    }
                case JsonToken.True:
                    {
                        index += LiteralTrue.Length;
                        return true;
                    }
                case JsonToken.Null:
                    {
                        index += LiteralNull.Length;
                        return null;
                    }
                case JsonToken.NaN:
                    {
                        index += LiteralNotANumber.Length;
                        return Double.NaN;
                    }
                case JsonToken.PositiveInfinity:
                    {
                        index += LiteralPositiveInfinity.Length;
                        return Double.PositiveInfinity;
                    }
                case JsonToken.NegativeInfinity:
                    {
                        index += LiteralNegativeInfinity.Length;
                        return Double.NegativeInfinity;
                    }
                case JsonToken.End:
                default:
                    {
                        return null;
                    }
            }
        }

        private object ReadObject(Type objectType)
        {
            if (Source[index] != OperatorObjectStart)
            {
                throw new JsonDeserializationException(ErrorExpectedObject, index);
            }

            Dictionary<string, MemberInfo> memberMap = null;
            Object result;
            if (objectType != null)
            {
                result = InstantiateObject(objectType, ref memberMap);
            }
            else
            {
                result = new Dictionary<String, Object>();
            }

            JsonToken token;
            do
            {
                Type memberType;
                MemberInfo memberInfo;

                // consume opening brace or delim
                index++;
                if (index >= SourceLength)
                {
                    throw new JsonDeserializationException(ErrorUnterminatedObject, index);
                }

                // get next token
                token = Tokenize();
                if (token == JsonToken.ObjectEnd)
                {
                    break;
                }

                if (token != JsonToken.String)
                {
                    throw new JsonDeserializationException(ErrorExpectedPropertyName, index);
                }

                // parse object member value
                var memberName = (String) ReadString(null);

                // determine the type of the property/field
                GetMemberInfo(memberMap, memberName, out memberType, out memberInfo);

                // get next token
                token = Tokenize();
                if (token != JsonToken.NameDelim)
                {
                    throw new JsonDeserializationException(ErrorExpectedPropertyNameDelim, index);
                }

                // consume delim
                index++;
                if (index >= SourceLength)
                {
                    throw new JsonDeserializationException(ErrorUnterminatedObject, index);
                }

                // parse object member value
                object value = Read(memberType, false);

                if (result is IDictionary)
                {
                    if (objectType == null &&
                        !String.IsNullOrEmpty(typeHintName) &&
                        typeHintName.Equals(memberName, StringComparison.InvariantCulture))
                    {
                        result = ProcessTypeHint(ref objectType, ref memberMap, (IDictionary) result, value as string);
                    }
                    else
                    {
                        ((IDictionary) result)[memberName] = value;
                    }
                }
                else if (objectType.GetInterface(JsonWriter.TypeGenericIDictionary) != null)
                {
                    throw new JsonDeserializationException(ErrorGenericIDictionary, index);
                }
                else
                {
                    SetMemberValue(result, memberType, memberInfo, value);
                }

                // get next token
                token = Tokenize();
            } while (token == JsonToken.ValueDelim);

            if (token != JsonToken.ObjectEnd)
            {
                throw new JsonDeserializationException(ErrorUnterminatedObject, index);
            }

            // consume closing brace
            index++;

            return result;
        }

        private Array ReadArray(Type arrayType)
        {
            if (Source[index] != OperatorArrayStart)
            {
                throw new JsonDeserializationException(ErrorExpectedArray, index);
            }

            bool isArrayTypeSet = (arrayType != null);
            bool isArrayTypeAHint = !isArrayTypeSet;

            if (isArrayTypeSet)
            {
                if (arrayType.HasElementType)
                {
                    arrayType = arrayType.GetElementType();
                }
                else if (arrayType.IsGenericType)
                {
                    Type[] generics = arrayType.GetGenericArguments();
                    if (generics.Length != 1)
                    {
                        // could use the first or last, but this more correct
                        arrayType = null;
                    }
                    else
                    {
                        arrayType = generics[0];
                    }
                }
                else
                {
                    arrayType = null;
                }
            }

            var jsArray = new ArrayList();

            JsonToken token;
            do
            {
                // consume opening bracket or delim
                index++;
                if (index >= SourceLength)
                {
                    throw new JsonDeserializationException(ErrorUnterminatedArray, index);
                }

                // get next token
                token = Tokenize();
                if (token == JsonToken.ArrayEnd)
                {
                    break;
                }

                // parse array item
                object value = Read(arrayType, isArrayTypeAHint);
                jsArray.Add(value);

                // establish if array is of common type
                if (value == null)
                {
                    if (arrayType != null && arrayType.IsValueType)
                    {
                        // use plain object to hold null
                        arrayType = null;
                    }
                    isArrayTypeSet = true;
                }
                else if (arrayType != null && !arrayType.IsAssignableFrom(value.GetType()))
                {
                    // use plain object to hold value
                    arrayType = null;
                    isArrayTypeSet = true;
                }
                else if (!isArrayTypeSet)
                {
                    // try out special type
                    // if hasn't been set before
                    arrayType = value.GetType();
                    isArrayTypeSet = true;
                }

                // get next token
                token = Tokenize();
            } while (token == JsonToken.ValueDelim);

            if (token != JsonToken.ArrayEnd)
            {
                throw new JsonDeserializationException(ErrorUnterminatedArray, index);
            }

            // consume closing bracket
            index++;

            // check to see if all the same type and convert to that
            if (arrayType != null && arrayType != typeof (object))
            {
                return jsArray.ToArray(arrayType);
            }

            return jsArray.ToArray();
        }

        private object ReadString(Type expectedType)
        {
            if (Source[index] != OperatorStringDelim &&
                Source[index] != OperatorStringDelimAlt)
            {
                throw new JsonDeserializationException(ErrorExpectedString, index);
            }

            char startStringDelim = Source[index];

            // consume opening quote
            index++;
            if (index >= SourceLength)
            {
                throw new JsonDeserializationException(ErrorUnterminatedString, index);
            }

            int start = index;
            var builder = new StringBuilder();

            while (Source[index] != startStringDelim)
            {
                if (Source[index] == OperatorCharEscape)
                {
                    // copy chunk before decoding
                    builder.Append(Source, start, index - start);

                    // consume escape char
                    index++;
                    if (index >= SourceLength)
                    {
                        throw new JsonDeserializationException(ErrorUnterminatedString, index);
                    }

                    // decode
                    switch (Source[index])
                    {
                        case '0':
                            {
                                // don't allow NULL char '\0'
                                // causes CStrings to terminate
                                break;
                            }
                        case 'b':
                            {
                                // backspace
                                builder.Append('\b');
                                break;
                            }
                        case 'f':
                            {
                                // formfeed
                                builder.Append('\f');
                                break;
                            }
                        case 'n':
                            {
                                // newline
                                builder.Append('\n');
                                break;
                            }
                        case 'r':
                            {
                                // carriage return
                                builder.Append('\r');
                                break;
                            }
                        case 't':
                            {
                                // tab
                                builder.Append('\t');
                                break;
                            }
                        case 'u':
                            {
                                // Unicode escape sequence
                                // e.g. Copyright: "\u00A9"

                                // unicode ordinal
                                int utf16;
                                if (index + 4 < SourceLength &&
                                    Int32.TryParse(
                                        Source.Substring(index + 1, 4),
                                        NumberStyles.AllowHexSpecifier,
                                        NumberFormatInfo.InvariantInfo,
                                        out utf16))
                                {
                                    builder.Append(Char.ConvertFromUtf32(utf16));
                                    index += 4;
                                }
                                else
                                {
                                    // using FireFox style recovery, if not a valid hex
                                    // escape sequence then treat as single escaped 'u'
                                    // followed by rest of string
                                    builder.Append(Source[index]);
                                }
                                break;
                            }
                        default:
                            {
                                builder.Append(Source[index]);
                                break;
                            }
                    }

                    index++;
                    if (index >= SourceLength)
                    {
                        throw new JsonDeserializationException(ErrorUnterminatedString, index);
                    }

                    start = index;
                }
                else
                {
                    // next char
                    index++;
                    if (index >= SourceLength)
                    {
                        throw new JsonDeserializationException(ErrorUnterminatedString, index);
                    }
                }
            }

            // copy rest of string
            builder.Append(Source, start, index - start);

            // consume closing quote
            index++;

            if (expectedType != null && expectedType != typeof (String))
            {
                return CoerceType(expectedType, builder.ToString(), index, AllowNullValueTypes);
            }

            return builder.ToString();
        }

        private object ReadNumber(Type expectedType)
        {
            bool hasDecimal = false;
            bool hasExponent = false;
            int start = index;
            int precision;
            int exponent;

            // optional minus part
            if (Source[index] == OperatorNegate)
            {
                // consume sign
                index++;
                if (index >= SourceLength || !Char.IsDigit(Source[index]))
                    throw new JsonDeserializationException(ErrorIllegalNumber, index);
            }

            // integer part
            while ((index < SourceLength) && Char.IsDigit(Source[index]))
            {
                // consume digit
                index++;
            }

            // optional decimal part
            if ((index < SourceLength) && (Source[index] == '.'))
            {
                hasDecimal = true;

                // consume decimal
                index++;
                if (index >= SourceLength || !Char.IsDigit(Source[index]))
                {
                    throw new JsonDeserializationException(ErrorIllegalNumber, index);
                }

                // fraction part
                while (index < SourceLength && Char.IsDigit(Source[index]))
                {
                    // consume digit
                    index++;
                }
            }

            // note the number of significant digits
            precision = index - start - (hasDecimal ? 1 : 0);

            // optional exponent part
            if (index < SourceLength && (Source[index] == 'e' || Source[index] == 'E'))
            {
                hasExponent = true;

                // consume 'e'
                index++;
                if (index >= SourceLength)
                {
                    throw new JsonDeserializationException(ErrorIllegalNumber, index);
                }

                int expStart = index;

                // optional minus/plus part
                if (Source[index] == OperatorNegate || Source[index] == OperatorUnaryPlus)
                {
                    // consume sign
                    index++;
                    if (index >= SourceLength || !Char.IsDigit(Source[index]))
                    {
                        throw new JsonDeserializationException(ErrorIllegalNumber, index);
                    }
                }
                else
                {
                    if (!Char.IsDigit(Source[index]))
                    {
                        throw new JsonDeserializationException(ErrorIllegalNumber, index);
                    }
                }

                // exp part
                while (index < SourceLength && Char.IsDigit(Source[index]))
                {
                    // consume digit
                    index++;
                }

                Int32.TryParse(Source.Substring(expStart, index - expStart), NumberStyles.Integer,
                               NumberFormatInfo.InvariantInfo, out exponent);
            }

            // at this point, we have the full number string and know its characteristics
            string numberString = Source.Substring(start, index - start);

            if (!hasDecimal && !hasExponent && precision < 19)
            {
                // is Integer value

                // parse as most flexible
                decimal number = Decimal.Parse(
                    numberString,
                    NumberStyles.Integer,
                    NumberFormatInfo.InvariantInfo);

                if (expectedType != null)
                {
                    return CoerceType(expectedType, number, index, AllowNullValueTypes);
                }

                if (number >= Int32.MinValue && number <= Int32.MaxValue)
                {
                    // use most common
                    return (int) number;
                }
                if (number >= Int64.MinValue && number <= Int64.MaxValue)
                {
                    // use more flexible
                    return (long) number;
                }

                // use most flexible
                return number;
            }
            else
            {
                // is Floating Point value

                if (expectedType == typeof (Decimal))
                {
                    // special case since Double does not convert to Decimal
                    return Decimal.Parse(
                        numberString,
                        NumberStyles.Float,
                        NumberFormatInfo.InvariantInfo);
                }

                // use native EcmaScript number (IEEE 754)
                double number = Double.Parse(
                    numberString,
                    NumberStyles.Float,
                    NumberFormatInfo.InvariantInfo);

                if (expectedType != null)
                {
                    return CoerceType(expectedType, number, index, AllowNullValueTypes);
                }

                return number;
            }
        }

        #endregion Parsing Methods

        #region Object Methods

        /// <summary>
        /// If a Type Hint is present then this method attempts to
        /// use it and move any previously parsed data over.
        /// </summary>
        /// <param name="objectType">reference to the objectType</param>
        /// <param name="memberMap">reference to the memberMap</param>
        /// <param name="result">the previous result</param>
        /// <param name="typeInfo">the type info string to use</param>
        /// <returns></returns>
        private Object ProcessTypeHint(
            ref Type objectType,
            ref Dictionary<string, MemberInfo> memberMap,
            IDictionary result,
            string typeInfo)
        {
            if (String.IsNullOrEmpty(typeInfo))
            {
                return result;
            }

            Type hintedType = Type.GetType(typeInfo, false);
            if (hintedType == null)
            {
                return result;
            }
            objectType = hintedType;

            object newResult = InstantiateObject(hintedType, ref memberMap);
            if (memberMap != null)
            {
                Type memberType;
                MemberInfo memberInfo;

                // copy any values into new object
                foreach (object key in result.Keys)
                {
                    GetMemberInfo(memberMap, key as String, out memberType, out memberInfo);
                    SetMemberValue(newResult, memberType, memberInfo, result[key]);
                }
            }

            return newResult;
        }

        private Object InstantiateObject(Type objectType, ref Dictionary<string, MemberInfo> memberMap)
        {
            Object result;
            ConstructorInfo ctor = objectType.GetConstructor(Type.EmptyTypes);
            if (ctor == null)
            {
                throw new JsonDeserializationException(ErrorDefaultCtor, index);
            }
            result = ctor.Invoke(null);

            // don't incurr the cost of member map if a dictionary
            if (!typeof (IDictionary).IsAssignableFrom(objectType))
            {
                memberMap = CreateMemberMap(objectType);
            }
            return result;
        }

        private Dictionary<string, MemberInfo> CreateMemberMap(Type objectType)
        {
            if (MemberMapCache == null)
            {
                // instantiate space for cache
                MemberMapCache = new Dictionary<Type, Dictionary<string, MemberInfo>>();
            }
            else if (MemberMapCache.ContainsKey(objectType))
            {
                // map was stored in cache
                return MemberMapCache[objectType];
            }

            // create a new map
            var memberMap = new Dictionary<string, MemberInfo>();

            // load properties into property map
            PropertyInfo[] properties = objectType.GetProperties();
            foreach (PropertyInfo info in properties)
            {
                if (!info.CanRead || !info.CanWrite)
                {
                    continue;
                }

                if (JsonIgnoreAttribute.IsJsonIgnore(info))
                {
                    continue;
                }

                string jsonName = JsonNameAttribute.GetJsonName(info);
                if (String.IsNullOrEmpty(jsonName))
                {
                    memberMap[info.Name] = info;
                }
                else
                {
                    memberMap[jsonName] = info;
                }
            }

            // load public fields into property map
            FieldInfo[] fields = objectType.GetFields();
            foreach (FieldInfo info in fields)
            {
                if (!info.IsPublic)
                {
                    continue;
                }

                if (JsonIgnoreAttribute.IsJsonIgnore(info))
                {
                    continue;
                }

                string jsonName = JsonNameAttribute.GetJsonName(info);
                if (String.IsNullOrEmpty(jsonName))
                {
                    memberMap[info.Name] = info;
                }
                else
                {
                    memberMap[jsonName] = info;
                }
            }

            // store in cache for repeated usage
            MemberMapCache[objectType] = memberMap;

            return memberMap;
        }

        private static void GetMemberInfo(
            Dictionary<string, MemberInfo> memberMap,
            string memberName,
            out Type memberType,
            out MemberInfo memberInfo)
        {
            memberType = null;
            memberInfo = null;

            if (memberMap != null &&
                memberMap.ContainsKey(memberName))
            {
                // Check properties for object member
                memberInfo = memberMap[memberName];

                if (memberInfo is PropertyInfo)
                {
                    // maps to public property
                    memberType = ((PropertyInfo) memberInfo).PropertyType;
                }
                else if (memberInfo is FieldInfo)
                {
                    // maps to public field
                    memberType = ((FieldInfo) memberInfo).FieldType;
                }
                else
                {
                    // none found
                    memberType = null;
                }
            }
            else
            {
                // none found
                memberType = null;
            }
        }

        /// <summary>
        /// Helper method to set value of either property or field
        /// </summary>
        /// <param name="result"></param>
        /// <param name="memberType"></param>
        /// <param name="memberInfo"></param>
        /// <param name="value"></param>
        private void SetMemberValue(Object result, Type memberType, MemberInfo memberInfo, object value)
        {
            if (memberInfo is PropertyInfo)
            {
                // set value of public property
                ((PropertyInfo) memberInfo).SetValue(
                    result,
                    CoerceType(memberType, value, index, AllowNullValueTypes),
                    null);
            }
            else if (memberInfo is FieldInfo)
            {
                // set value of public field
                ((FieldInfo) memberInfo).SetValue(
                    result,
                    CoerceType(memberType, value, index, AllowNullValueTypes));
            }

            // all other values are ignored
        }

        #endregion Object Methods

        #region Type Methods

        public static object CoerceType(Type targetType, object value)
        {
            return CoerceType(targetType, value, -1, false);
        }

        private static object CoerceType(Type targetType, object value, int index, bool allowNullValueTypes)
        {
            bool isNullable = IsNullable(targetType);
            if (value == null)
            {
                if (allowNullValueTypes &&
                    targetType.IsValueType &&
                    !isNullable)
                {
                    throw new JsonDeserializationException(String.Format(ErrorNullValueType, targetType.FullName), index);
                }
                return value;
            }

            if (isNullable)
            {
                // nullable types have a real underlying struct
                Type[] genericArgs = targetType.GetGenericArguments();
                if (genericArgs.Length == 1)
                {
                    targetType = genericArgs[0];
                }
            }

            Type actualType = value.GetType();
            if (targetType.IsAssignableFrom(actualType))
            {
                return value;
            }

            if (targetType.IsEnum)
            {
                if (!Enum.IsDefined(targetType, value))
                {
                    // if isn't a defined value perhaps it is the JsonName
                    foreach (FieldInfo field in targetType.GetFields())
                    {
                        string jsonName = JsonNameAttribute.GetJsonName(field);
                        if (((string) value).Equals(jsonName))
                        {
                            value = field.Name;
                            break;
                        }
                    }
                }

                if (value is String)
                {
                    return Enum.Parse(targetType, (string) value);
                }
                else
                {
                    return Convert.ChangeType(value, targetType);
                }
            }

            if (actualType.IsArray && !targetType.IsArray)
            {
                return CoerceArray(targetType, actualType, value, index, allowNullValueTypes);
            }

            if (value is String)
            {
                if (targetType == typeof (DateTime))
                {
                    DateTime date;
                    if (DateTime.TryParse(
                        (string) value,
                        DateTimeFormatInfo.InvariantInfo,
                        DateTimeStyles.RoundtripKind | DateTimeStyles.AllowWhiteSpaces |
                        DateTimeStyles.NoCurrentDateDefault,
                        out date))
                    {
                        return date;
                    }
                }
                else if (targetType == typeof (Guid))
                {
                    // try-catch is pointless since will throw upon generic conversion
                    return new Guid((string) value);
                }
                else if (targetType == typeof (Uri))
                {
                    Uri uri;
                    if (Uri.TryCreate((string) value, UriKind.RelativeOrAbsolute, out uri))
                    {
                        return uri;
                    }
                }
                else if (targetType == typeof (Version))
                {
                    // try-catch is pointless since will throw upon generic conversion
                    return new Version((string) value);
                }
            }

            else if (targetType == typeof (TimeSpan))
            {
                return new TimeSpan((long) CoerceType(typeof (Int64), value, index, allowNullValueTypes));
            }

            TypeConverter converter = TypeDescriptor.GetConverter(targetType);
            if (converter.CanConvertFrom(actualType))
            {
                return converter.ConvertFrom(value);
            }

            converter = TypeDescriptor.GetConverter(actualType);
            if (converter.CanConvertTo(targetType))
            {
                return converter.ConvertTo(value, targetType);
            }

            return Convert.ChangeType(value, targetType);
        }

        private static object CoerceArray(Type targetType, Type arrayType, object value, int index,
                                          bool allowNullValueTypes)
        {
            // targetType serializes as a JSON array but is not an array
            // assume is an ICollection / IEnumerable with AddRange, Add,
            // or custom Constructor with which we can populate it

            ConstructorInfo ctor = targetType.GetConstructor(Type.EmptyTypes);
            if (ctor == null)
            {
                throw new JsonDeserializationException(ErrorDefaultCtor, index);
            }
            object collection = ctor.Invoke(null);

            var arrayValue = (Array) value;

            // many ICollection types have an AddRange method
            // which adds all items at once
            MethodInfo method = targetType.GetMethod("AddRange");
            ParameterInfo[] parameters = (method == null)
                                             ?
                                                 null
                                             : method.GetParameters();
            Type paramType = (parameters == null || parameters.Length != 1)
                                 ?
                                     null
                                 : parameters[0].ParameterType;
            if (paramType != null &&
                paramType.IsAssignableFrom(arrayType))
            {
                // add all members in one method
                method.Invoke(
                    collection,
                    new object[] {arrayValue});
                return collection;
            }
            else
            {
                // many ICollection types have an Add method
                // which adds items one at a time
                method = targetType.GetMethod("Add");
                parameters = (method == null)
                                 ?
                                     null
                                 : method.GetParameters();
                paramType = (parameters == null || parameters.Length != 1)
                                ?
                                    null
                                : parameters[0].ParameterType;
                if (paramType != null)
                {
                    // loop through adding items to collection
                    foreach (object item in arrayValue)
                    {
                        method.Invoke(
                            collection,
                            new[]
                                {
                                    CoerceType(paramType, item, index, allowNullValueTypes)
                                });
                    }
                    return collection;
                }
            }

            // many ICollection types take an IEnumerable or ICollection
            // as a constructor argument.  look through constructors for
            // a compatible match.
            ConstructorInfo[] ctors = targetType.GetConstructors();
            foreach (ConstructorInfo ctor2 in ctors)
            {
                ParameterInfo[] paramList = ctor2.GetParameters();
                if (paramList.Length == 1 &&
                    paramList[0].ParameterType.IsAssignableFrom(arrayType))
                {
                    try
                    {
                        // invoke first constructor that can take this value as an argument
                        return ctor2.Invoke(
                            new[] {value}
                            );
                    }
                    catch
                    {
                        // there might exist a better match
                        continue;
                    }
                }
            }

            return Convert.ChangeType(value, targetType);
        }

        private static bool IsNullable(Type type)
        {
            return type.IsGenericType && (typeof (Nullable<>) == type.GetGenericTypeDefinition());
        }

        #endregion Type Methods

        #region Tokenizing Methods

        private JsonToken Tokenize()
        {
            if (index >= SourceLength)
            {
                return JsonToken.End;
            }

            // skip whitespace
            while (Char.IsWhiteSpace(Source[index]))
            {
                index++;
                if (index >= SourceLength)
                {
                    return JsonToken.End;
                }
            }

            #region Skip Comments

            // skip block and line comments
            if (Source[index] == CommentStart[0])
            {
                if (index + 1 >= SourceLength)
                {
                    throw new JsonDeserializationException(ErrorUnrecognizedToken, index);
                }

                // skip over first char of comment start
                index++;

                bool isBlockComment = false;
                if (Source[index] == CommentStart[1])
                {
                    isBlockComment = true;
                }
                else if (Source[index] != CommentLine[1])
                {
                    throw new JsonDeserializationException(ErrorUnrecognizedToken, index);
                }
                // skip over second char of comment start
                index++;

                if (isBlockComment)
                {
                    // store index for unterminated case
                    int commentStart = index - 2;

                    if (index + 1 >= SourceLength)
                    {
                        throw new JsonDeserializationException(ErrorUnterminatedComment, commentStart);
                    }

                    // skip over everything until reach block comment ending
                    while (Source[index] != CommentEnd[0] ||
                           Source[index + 1] != CommentEnd[1])
                    {
                        index++;
                        if (index + 1 >= SourceLength)
                        {
                            throw new JsonDeserializationException(ErrorUnterminatedComment, commentStart);
                        }
                    }

                    // skip block comment end token
                    index += 2;
                    if (index >= SourceLength)
                    {
                        return JsonToken.End;
                    }
                }
                else
                {
                    // skip over everything until reach line ending
                    while (LineEndings.IndexOf(Source[index]) < 0)
                    {
                        index++;
                        if (index >= SourceLength)
                        {
                            return JsonToken.End;
                        }
                    }
                }

                // skip whitespace again
                while (Char.IsWhiteSpace(Source[index]))
                {
                    index++;
                    if (index >= SourceLength)
                    {
                        return JsonToken.End;
                    }
                }
            }

            #endregion Skip Comments

            // consume positive signing (as is extraneous)
            if (Source[index] == OperatorUnaryPlus)
            {
                index++;
                if (index >= SourceLength)
                {
                    return JsonToken.End;
                }
            }

            switch (Source[index])
            {
                case OperatorArrayStart:
                    {
                        return JsonToken.ArrayStart;
                    }
                case OperatorArrayEnd:
                    {
                        return JsonToken.ArrayEnd;
                    }
                case OperatorObjectStart:
                    {
                        return JsonToken.ObjectStart;
                    }
                case OperatorObjectEnd:
                    {
                        return JsonToken.ObjectEnd;
                    }
                case OperatorStringDelim:
                case OperatorStringDelimAlt:
                    {
                        return JsonToken.String;
                    }
                case OperatorValueDelim:
                    {
                        return JsonToken.ValueDelim;
                    }
                case OperatorNameDelim:
                    {
                        return JsonToken.NameDelim;
                    }
                default:
                    {
                        break;
                    }
            }

            // number
            if (Char.IsDigit(Source[index]) ||
                ((Source[index] == OperatorNegate) && (index + 1 < SourceLength) && Char.IsDigit(Source[index + 1])))
            {
                return JsonToken.Number;
            }

            // "false" literal
            if (MatchLiteral(LiteralFalse))
            {
                return JsonToken.False;
            }

            // "true" literal
            if (MatchLiteral(LiteralTrue))
            {
                return JsonToken.True;
            }

            // "null" literal
            if (MatchLiteral(LiteralNull))
            {
                return JsonToken.Null;
            }

            // "NaN" literal
            if (MatchLiteral(LiteralNotANumber))
            {
                return JsonToken.NaN;
            }

            // "Infinity" literal
            if (MatchLiteral(LiteralPositiveInfinity))
            {
                return JsonToken.PositiveInfinity;
            }

            // "-Infinity" literal
            if (MatchLiteral(LiteralNegativeInfinity))
            {
                return JsonToken.NegativeInfinity;
            }

            throw new JsonDeserializationException(ErrorUnrecognizedToken, index);
        }

        /// <summary>
        /// Determines if the next token is the given literal
        /// </summary>
        /// <param name="literal"></param>
        /// <returns></returns>
        private bool MatchLiteral(string literal)
        {
            int literalLength = literal.Length;
            for (int i = 0, j = index; i < literalLength && j < SourceLength; i++, j++)
            {
                if (literal[i] != Source[j])
                {
                    return false;
                }
            }

            return true;
        }

        #endregion Tokenizing Methods
    }
}