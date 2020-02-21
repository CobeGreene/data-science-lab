using data_science_lab_site.Options;
using Microsoft.AspNetCore.Identity.UI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace data_science_lab_site.Services
{
    public class EmailService : IEmailSender
    {
        private readonly GmailOptions _options;

        public EmailService(GmailOptions options)
        {
            _options = options; 
        }

        public Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var smtp = new SmtpClient()
            { 
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                Credentials = new NetworkCredential()
                {
                    UserName = _options.Email,
                    Password = _options.Password
                }
            };

            var addressFrom = new MailAddress(_options.Email);
            var addressTo = new MailAddress(email);
            var msg = new MailMessage(addressFrom, addressTo)
            {
                IsBodyHtml = true,
                Body = htmlMessage,
                Subject = subject,
            };

            smtp.Send(msg);
            return Task.CompletedTask;
        }
    }
}
