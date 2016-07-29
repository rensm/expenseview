using System.Net;
using System.Net.Mail;

namespace ExpenseView.Service.Util
{
    /// <summary>
    /// Summary description for MailSender
    /// </summary>
    public class MailSender
    {
        public static void SendEmail(string recipientAddress, string subject, string body)
        {
            var toAddress = new MailAddress(recipientAddress);
            var fromAddress = new MailAddress("contactus@expenseview.com", "ExpenseView-Admin");

            var mail = new MailMessage(fromAddress, toAddress);
            mail.Subject = subject;

            mail.Body = body;
            mail.IsBodyHtml = true;

            var client = new SmtpClient();
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.Host = "smtp.expenseview.com";
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential("contactus@expenseview.com", "ishark80");
            client.Send(mail);
        }
    }
}