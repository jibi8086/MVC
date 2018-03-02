public static string SendMail(string mail,string subject,string body)
        {
            System.Net.Mail.SmtpClient smtp;
            string NotifyMessage="Mail not Send";
            MailAddress fromAddress = new MailAddress("devd9216@gmail.com");
            string fromPassword = "devd@9216";
            MailAddress toAddress = new MailAddress(mail);



            smtp = new System.Net.Mail.SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)

            };
            try
            {
         

                using (MailMessage message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    Body = body
                })
                    smtp.Send(message);
                 NotifyMessage = "Mail has been send";
            }
            catch (Exception e)
            {
                ExceptionLog.Log(e, "no ip : login model error email ");
            }

            finally
            {
                smtp.Dispose();
            }

            return NotifyMessage;
        }
