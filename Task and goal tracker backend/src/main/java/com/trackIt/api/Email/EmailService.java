package com.trackIt.api.Email;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendEmail(String to, String subject, String text) {
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("karuppusamyaksv@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);

            // HTML email content
            String htmlContent = "<!doctype html>\n"
                    + "<html lang=\"en-US\">\n"
                    + "<head>\n"
                    + "    <meta content=\"text/html; charset=utf-8\" http-equiv=\"Content-Type\" />\n"
                    + "    <title>Reset Password Email Template</title>\n"
                    + "    <meta name=\"description\" content=\"Reset Password Email Template.\">\n"
                    + "    <style type=\"text/css\">\n"
                    + "        a:hover {text-decoration: underline !important;}\n"
                    + "    </style>\n"
                    + "</head>\n"
                    + "<body marginheight=\"0\" topmargin=\"0\" marginwidth=\"0\" style=\"margin: 0px; background-color: #f2f3f8;\" leftmargin=\"0\">\n"
                    + "    <!--100% body table-->\n"
                    + "    <table cellspacing=\"0\" border=\"0\" cellpadding=\"0\" width=\"100%\" bgcolor=\"#f2f3f8\"\n"
                    + "        style=\"@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;\">\n"
                    + "        <tr>\n"
                    + "            <td>\n"
                    + "                <table style=\"background-color: #f2f3f8; max-width:670px;  margin:0 auto;\" width=\"100%\" border=\"0\"\n"
                    + "                    align=\"center\" cellpadding=\"0\" cellspacing=\"0\">\n"
                    + "                    <tr>\n"
                    + "                        <td style=\"height:80px;\">&nbsp;</td>\n"
                    + "                    </tr>\n"
                    + "                    <tr>\n"
                    + "                        <td style=\"text-align:center;\">\n"
                    + "                          <a href=\"https://rakeshmandal.com\" title=\"logo\" target=\"_blank\">\n"
                    + "                            <img width=\"60\" src=\"https://i.ibb.co/hL4XZp2/android-chrome-192x192.png\" title=\"logo\" alt=\"logo\">\n"
                    + "                          </a>\n"
                    + "                        </td>\n"
                    + "                    </tr>\n"
                    + "                    <tr>\n"
                    + "                        <td style=\"height:20px;\">&nbsp;</td>\n"
                    + "                    </tr>\n"
                    + "                    <tr>\n"
                    + "                        <td>\n"
                    + "                            <table width=\"95%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\"\n"
                    + "                                style=\"max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);\">\n"
                    + "                                <tr>\n"
                    + "                                    <td style=\"height:40px;\">&nbsp;</td>\n"
                    + "                                </tr>\n"
                    + "                                <tr>\n"
                    + "                                    <td style=\"padding:0 35px;\">\n"
                    + "                                        <h1 style=\"color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;\">You have\n"
                    + "                                            requested to reset your password</h1>\n"
                    + "                                        <span\n"
                    + "                                            style=\"display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;\"></span>\n"
                    + "                                        <p style=\"color:#455056; font-size:15px;line-height:24px; margin:0;\">\n"
                    + "                                            We cannot simply send you your old password. A unique link to reset your\n"
                    + "                                            password has been generated for you. To reset your password, Use this OTP.\n"
                    + "                                        </p>\n"
                    + "                                       <h1>" + text + "</h1>\n" // Add the OTP here
                    + "                                    </td>\n"
                    + "                                </tr>\n"
                    + "                                <tr>\n"
                    + "                                    <td style=\"height:40px;\">&nbsp;</td>\n"
                    + "                                </tr>\n"
                    + "                            </table>\n"
                    + "                        </td>\n"
                    + "                    <tr>\n"
                    + "                        <td style=\"height:20px;\">&nbsp;</td>\n"
                    + "                    </tr>\n"
                    + "                    <tr>\n"
                    + "                        <td style=\"text-align:center;\">\n"
                    + "                            <p style=\"font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;\">&copy; <strong>www.rakeshmandal.com</strong></p>\n"
                    + "                        </td>\n"
                    + "                    </tr>\n"
                    + "                    <tr>\n"
                    + "                        <td style=\"height:80px;\">&nbsp;</td>\n"
                    + "                    </tr>\n"
                    + "                </table>\n"
                    + "            </td>\n"
                    + "        </tr>\n"
                    + "    </table>\n"
                    + "    <!--/100% body table-->\n"
                    + "</body>\n"
                    + "</html>";

            helper.setText(htmlContent, true);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}