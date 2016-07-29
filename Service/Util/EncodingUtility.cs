using System.Text;

namespace ExpenseView.Service.Util
{
    /// <summary>
    /// Class Used to convert between unicode and utf-8 encoding
    /// </summary>
    public class EncodingUtility
    {
        public static string ConvertFromUtf8ToUnicode(string utf8String)
        {
            Encoding unicode = Encoding.Unicode;
            Encoding utf8 = Encoding.UTF8;
            byte[] utf8Bytes = utf8.GetBytes(utf8String);

            byte[] unicodeBytes = Encoding.Convert(Encoding.UTF8, Encoding.Unicode, utf8Bytes);

            // Convert the new byte[] into a char[] and then into a string.
            // This is a slightly different approach to converting to illustrate
            // the use of GetCharCount/GetChars.
            var unicodeChars = new char[unicode.GetCharCount(unicodeBytes, 0, unicodeBytes.Length)];
            unicode.GetChars(unicodeBytes, 0, unicodeBytes.Length, unicodeChars, 0);
            var unicodeString = new string(unicodeChars);

            return unicodeString;
        }

        public static string ConvertFromUnicodeToUtf8(string unicodeString)
        {
            Encoding unicode = Encoding.Unicode;
            Encoding utf8 = Encoding.UTF8;

            byte[] unicodeBytes = unicode.GetBytes(unicodeString);
            byte[] utf8Bytes = Encoding.Convert(Encoding.Unicode, Encoding.UTF8, unicodeBytes);

            // Convert the new byte[] into a char[] and then into a string.
            // This is a slightly different approach to converting to illustrate
            // the use of GetCharCount/GetChars.
            var utf8Chars = new char[utf8.GetCharCount(utf8Bytes, 0, utf8Bytes.Length)];
            utf8.GetChars(utf8Bytes, 0, utf8Bytes.Length, utf8Chars, 0);
            var utf8String = new string(utf8Chars);

            return utf8String;
        }
    }
}