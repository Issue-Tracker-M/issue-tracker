import crypto = require("crypto");

export default function (): string {
  return crypto.randomBytes(20).toString("hex");
}
