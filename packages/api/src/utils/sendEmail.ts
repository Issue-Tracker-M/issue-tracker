import nodemailer, { SendMailOptions } from "nodemailer";
import { SENDER_EMAIL, EMAIL_PASSWORD } from "../config/index";
const { stubTransport } = require("nodemailer-stub");

/** A sendEmail util accepting an options object with the following properties:
 * `subject` as subject of the email to be sent
 * `to` as email Address of recipent,
 * `html` as the html to be sent to the recipent and an optional callback function that returns the
 * information obtained from nodemailer on success. `bcc` as the
 * bcc (blind-copy), used only for user feedback endpoint (sends feedback
 * to user and Quckdecks Team). If no need for this copy,
 * pass last param as `null`.
 */
export const sendMail = async ({
  subject,
  to,
  html,
  bcc,
}: SendMailOptions): Promise<void> => {
  /**
   * Details of  email to be sent. This is common for both the transport stub
   * used for testing and the actual transporter to be used in production.
   */
  const mailOptions: SendMailOptions = {
    from: `"Issue Tracker" <${SENDER_EMAIL}>`,
    to,
    subject,
    bcc,
    html,
  };

  /** If environment is not the testing environment, then create a nodemailer
   * transporter, as opposed to the transport stub.
   */
  if (process.env.NODE_ENV !== "test") {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SENDER_EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });

    /**
     * Send Email using the options created earlier. If no errors and the
     * `next` callbackis not null, then invoke the callback.
     */
    transporter.sendMail(mailOptions, (error, info) => {
      if (!error) {
        console.log(info);
      }
    });
  } else {
    /**
     * Node environment is the testing environment and so
     * a stub is created and the same mailOptions are used to
     * mock the sending of an actual email.
     */
    const transporter = nodemailer.createTransport(stubTransport);
    await transporter.sendMail(mailOptions);
  }
};

export default sendMail;
