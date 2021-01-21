import MailGen from "mailgen";
import { CLIENT_URL } from "../config";

export default function (full_name: string, token: string): string {
  const mailGenerator = new MailGen({
    theme: "salted",
    product: {
      name: "Issue-Tracker",
      link: CLIENT_URL,
    },
  });

  const email = {
    body: {
      name: full_name,
      intro: "Are you ready to track those issues?",
      action: {
        instructions: "Please click the button below to verify your email",
        button: {
          color: "#D21F3C",
          text: "Verify email",
          link: `${CLIENT_URL}/confirm/${token}`,
        },
      },
    },
  };

  return mailGenerator.generate(email);
}
