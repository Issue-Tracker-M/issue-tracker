import MailGen from "mailgen";
import { CLIENT_URL } from "../config";

export const inviteTemplate = function (
  inviter_name: string,
  workspace_name: string,
  token: string,
  userIsNotRegistered: boolean
): string {
  const mailGenerator = new MailGen({
    theme: "salted",
    product: {
      name: "Issue-Tracker",
      link: CLIENT_URL,
    },
  });

  const email = {
    body: {
      name: "Issue tracker",
      intro: `You have been invited to Issue tracker by '${inviter_name}'`,
      action: {
        instructions: "Please click the button below to join  your email",
        button: {
          color: "teal",
          text: `Join '${workspace_name}'`,
          link: `${CLIENT_URL}/${
            userIsNotRegistered ? "register" : "invite"
          }/${token}}`,
        },
      },
    },
  };

  return mailGenerator.generate(email) as string;
};
