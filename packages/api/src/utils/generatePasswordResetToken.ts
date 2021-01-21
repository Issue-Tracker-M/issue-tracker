import crypto from "crypto";

export default function (): string {
  return crypto.randomBytes(20).toString("hex");
}
