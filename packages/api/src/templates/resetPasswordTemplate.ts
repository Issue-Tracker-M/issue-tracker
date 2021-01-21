import Mailgen from "mailgen";
import { CLIENT_URL } from "../config";

export default function (userEmail: string, token: string): string {
  const mailGenerator = new Mailgen({
    theme: "salted",
    product: {
      name: "Issue Tracker",
      link: CLIENT_URL,
    },
  });

  const email = {
    body: {
      name: userEmail,
      intro: "Forgot your password?",
      action: {
        instructions: "No problem! Just click the link to reset your password.",
        button: {
          color: "#D21F3C",
          text: "Reset password",
          link: `${CLIENT_URL}/reset/${token}`,
        },
      },
    },
  };

  return mailGenerator.generate(email);
}
// require('fs').writeFileSync('preview.html', emailTemplate, 'utf8');
