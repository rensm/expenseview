using System;
using System.Xml;
using System.Collections.Generic;

using ExpenseView.Service.DataObject;

namespace ExpenseView.Service.TransImport
{
    public static class OFXFileImporter
    {
        public enum AccountType { CreditCard, BankAccount, Unknown }

        //public void Split(string ofxFileString)
        //          ofxFileString.Split("</OFX>", StringSplitOptions.RemoveEmptyEntries);
        //}

        public static List<Transaction> GetTransactionsFromFile(string ofxFileString)
        {
            //1. Convert ofxFile input to XmlDocument
            XmlDocument doc = GetXmlDocFromOfx(ofxFileString);

            //1. Get XPath to retrieve Transactions
            AccountType accountType = GetAccountType(ofxFileString);
            string xPath = "";

            if(accountType == AccountType.BankAccount)
            {
                xPath = "root/OFX/BANKMSGSRSV1/STMTTRNRS/STMTRS/BANKTRANLIST/STMTTRN";
            }
            else if(accountType == AccountType.CreditCard)
            {
                xPath = "root/OFX/CREDITCARDMSGSRSV1/CCSTMTTRNRS/CCSTMTRS/BANKTRANLIST/STMTTRN";
            }
            else 
            {
                //If unknown accountType just return null
                return null;
            }

            //3. Create Transactions from returned Transaction nodes
            var transactionNodes = doc.SelectNodes(xPath);

            List<Transaction> transactions = new List<Transaction>();
            foreach (XmlNode node in transactionNodes)
            {
                Transaction trans = new Transaction();

                string date = node.GetValue("DTPOSTED");
                string dd = date.Substring(6, 2);
                string mm = date.Substring(4, 2);
                string yyyy = date.Substring(0, 4);

                trans.Date = String.Format("{0}-{1}-{2}", yyyy, mm, dd);
                trans.Amount = Convert.ToDecimal(node.GetValue("TRNAMT"));

                trans.Description = node.GetValue("NAME").Trim();                

                string transMemo = node.GetValue("MEMO");
                if (transMemo != null && transMemo.Trim() != String.Empty)
                {
                    trans.Description += " - " + transMemo;
                }

                transactions.Add(trans);
            }

            return transactions;;
        }

        /// <summary>
        /// Returns value of specified node
        /// </summary>
        /// <param name="node">Node to look for specified node</param>
        /// <param name="xpath">XPath for node you want</param>
        /// <returns></returns>
        private static string GetValue(this XmlNode node, string xpath)
        {
            var tempNode = node.SelectSingleNode(xpath);
            return tempNode != null ? tempNode.FirstChild.Value : "";
        }


        /// <summary>
        /// Converts from OFX to standard XML Format and returns and XMLDcoument object.
        /// </summary>
        /// <param name="ofxString"></param>
        /// <returns></returns>
        private static XmlDocument GetXmlDocFromOfx(string ofxString)
        {
            XmlDocument doc = new XmlDocument();
            
            //1. Separate out and remove the header
            ofxString = ofxString.ToUpper();
            int ofxStartPosition = ofxString.IndexOf("<OFX>");
            if (ofxStartPosition >= 0)
            {
                string ofxBody = ofxString.Substring(ofxStartPosition);

                ofxBody = ofxBody.Replace("\n", "");
                ofxBody = ofxBody.Replace("\t", "");
                ofxBody = ofxBody.Replace("\r", "");
                ofxBody = ofxBody.Replace("&AMP;", "");
                ofxBody = ofxBody.Replace("&amp;", "");
                ofxBody = ofxBody.Replace("&", ";");

                // 2. Find tags that are not closed correctly and close them
                int startTagLTIndex = 0;
                while (startTagLTIndex > -1 && startTagLTIndex < ofxBody.Length)
                {
                    startTagLTIndex = ofxBody.IndexOf('<', startTagLTIndex);
                    int startTagGTIndex = ofxBody.IndexOf('>', startTagLTIndex);

                    //Break out of loop if we've reached last element
                    if (startTagGTIndex == ofxBody.Length - 1 || startTagLTIndex < 0)
                    {
                        break;
                    }

                    //If this is an end tag, then continue on to the next element
                    if (ofxBody.Substring(startTagLTIndex, 2).Equals("</"))
                    {
                        startTagLTIndex = ofxBody.IndexOf('<', startTagGTIndex);
                    }
                    else
                    {
                        string elementName = ofxBody.Substring(startTagLTIndex + 1, startTagGTIndex - startTagLTIndex - 1);

                        //Determine if this is a text Element.  Is TextElement if the first character after the startTagGT character
                        //is not a '<' character.
                        bool isTextElement = true;
                        if (ofxBody.Substring(startTagGTIndex + 1, 1).Equals("<"))
                        {
                            isTextElement = false;
                        }

                        int nextTagLTIndex = ofxBody.IndexOf('<', startTagGTIndex);
                        int nextTagGTIndex = ofxBody.IndexOf('>', nextTagLTIndex);

                        if (isTextElement)
                        {
                            string expectedEndingTag = "</" + elementName + ">";
                            string charAfterNextLT = ofxBody.Substring(nextTagLTIndex, expectedEndingTag.Length);


                            //if not a closed text element
                            if (!charAfterNextLT.Equals(expectedEndingTag))
                            {
                                ofxBody = ofxBody.Substring(0, nextTagLTIndex) + "</" + elementName + ">" + ofxBody.Substring(nextTagLTIndex);

                                //Move to next element, this would be the next tag found because the current start tag was not closed
                                startTagLTIndex = nextTagLTIndex - 1 + elementName.Length + 2;
                            }
                            else
                            {
                                //Move to next element, which would be after the next tag because this was the close of the start tag
                                startTagLTIndex = startTagGTIndex;
                            }
                        }
                        else
                        {
                            //Move to next element, which would be after the next tag because this was the close of the start tag
                            startTagLTIndex = startTagGTIndex;
                        }
                    }
                }

                //Wrap ofxBody in root element to support ofx docs with multiple roots
                ofxBody = "<root>" + ofxBody + "</root>";

                doc.LoadXml(ofxBody);
            }

            return doc;

        }

        /// <summary>
        /// Returns the account type that this ofx statement is for.
        /// </summary>
        /// <param name="ofxString"></param>
        /// <returns></returns>
        private static AccountType GetAccountType(string ofxString)
        {
            if (ofxString.IndexOf("<CREDITCARDMSGSRSV1>") != -1)
            {
                return AccountType.CreditCard;
            }
            else if (ofxString.IndexOf("<BANKMSGSRSV1>") != -1)
            {
                return AccountType.BankAccount;
            }
            else
            {
                return AccountType.Unknown;
            }
        }


   }
}